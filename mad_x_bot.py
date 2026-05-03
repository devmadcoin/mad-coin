"""
$MAD X Bot — The Supreme Version
===============================
- Broadcast + Reply + Quote modes
- Media support (images from $MAD Art vault)
- Thread / series posting
- Community engagement (mentions, celebrations)
- Price/holder milestone alerts
- Content sourced from MAD Confessions, art, game, milestones
- Engagement tracking & learning
- MAD AI personality injection
"""

import os
import re
import json
import time
import random
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

try:
    import tweepy
except ImportError:
    tweepy = None

try:
    import requests
except ImportError:
    requests = None

# =========================================================
# CONFIG
# =========================================================

BOT_STATE_DIR = os.getenv("BOT_STATE_DIR", "./bot_state")

# --- Posting Modes ---
AUTO_POST_ORIGINALS = os.getenv("AUTO_POST_ORIGINALS", "true").lower() == "true"
AUTO_REPLY_MENTIONS = os.getenv("AUTO_REPLY_MENTIONS", "true").lower() == "true"
AUTO_QUOTE_COMMUNITY = os.getenv("AUTO_QUOTE_COMMUNITY", "false").lower() == "true"
AUTO_POST_MEDIA = os.getenv("AUTO_POST_MEDIA", "true").lower() == "true"
AUTO_POST_THREADS = os.getenv("AUTO_POST_THREADS", "false").lower() == "true"
AUTO_MILESTONE_ALERTS = os.getenv("AUTO_MILESTONE_ALERTS", "true").lower() == "true"

# --- Scoring & Filtering ---
AUTO_POST_MIN_SCORE = float(os.getenv("AUTO_POST_MIN_SCORE", "5.2"))
AUTO_POST_DRY_RUN = os.getenv("AUTO_POST_DRY_RUN", "true").lower() == "true"
POST_INTERVAL_SECONDS = int(os.getenv("POST_INTERVAL_SECONDS", "10800"))
REPLY_CHECK_INTERVAL_SECONDS = int(os.getenv("REPLY_CHECK_INTERVAL_SECONDS", "300"))
POST_CANDIDATE_COUNT = int(os.getenv("POST_CANDIDATE_COUNT", "10"))

MAX_POST_LENGTH = int(os.getenv("MAX_POST_LENGTH", "275"))
USE_HASHTAGS = os.getenv("USE_HASHTAGS", "false").lower() == "true"
MAX_HASHTAGS_PER_POST = int(os.getenv("MAX_HASHTAGS_PER_POST", "1"))
TWEET_PREFIX = os.getenv("TWEET_PREFIX", "").strip()
DEBUG_LOGGING = os.getenv("DEBUG_LOGGING", "true").lower() == "true"

# --- X API v2 ---
X_API_KEY = os.getenv("X_API_KEY", "").strip()
X_API_SECRET = os.getenv("X_API_SECRET", "").strip()
X_ACCESS_TOKEN = os.getenv("X_ACCESS_TOKEN", "").strip()
X_ACCESS_TOKEN_SECRET = os.getenv("X_ACCESS_TOKEN_SECRET", "").strip()
X_BEARER_TOKEN = os.getenv("X_BEARER_TOKEN", "").strip()

# --- Content Sources ---
MAD_WEBSITE_URL = "https://mad-coin.vercel.app"
MAD_CONFessions_URL = f"{MAD_WEBSITE_URL}/api/confessions"  # adjust if you have an API
MAD_ART_DIR = os.getenv("MAD_ART_DIR", "./memes")  # local dir with the 23 art pieces
MAD_CONTRACT = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump"

# --- MAD AI Personality Modes ---
MAD_AI_MODE = os.getenv("MAD_AI_MODE", "savage").lower()  # safe, gentle, savage, crashout, brutal

# =========================================================
# STATE
# =========================================================

STATE_FILE = os.path.join(BOT_STATE_DIR, "bot_state.json")
ENGAGEMENT_FILE = os.path.join(BOT_STATE_DIR, "engagement_log.json")


def ensure_state_dir() -> None:
    os.makedirs(BOT_STATE_DIR, exist_ok=True)
    os.makedirs(MAD_ART_DIR, exist_ok=True)


def load_json(path: str, default: Dict) -> Dict:
    ensure_state_dir()
    if not os.path.exists(path):
        return default
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, dict):
                for k, v in default.items():
                    data.setdefault(k, v)
                return data
    except Exception:
        pass
    return default


def save_json(path: str, data: Dict) -> None:
    ensure_state_dir()
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def load_state() -> Dict:
    return load_json(STATE_FILE, {
        "recent_generated_or_posted_texts": [],
        "recent_media_posted": [],
        "last_reply_id": None,
        "last_mention_check": 0,
        "holder_milestone_last_announced": 0,
        "price_milestone_last_announced": 0.0,
        "posted_threads": [],
        "best_performing_templates": [],
    })


def save_state(state: Dict) -> None:
    save_json(STATE_FILE, state)


def load_engagement() -> Dict:
    return load_json(ENGAGEMENT_FILE, {
        "tweet_performance": {},  # tweet_id -> {likes, retweets, replies, impressions}
        "template_performance": {},  # template_hash -> [scores]
        "hourly_post_performance": {},  # hour -> avg engagement
    })


def save_engagement(data: Dict) -> None:
    save_json(ENGAGEMENT_FILE, data)


# =========================================================
# HELPERS
# =========================================================

def debug(msg: str) -> None:
    if DEBUG_LOGGING:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")


def normalize(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"https?://\S+", "", s)
    s = re.sub(r"@\w+", "", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def trim_text(text: str, max_len: int = MAX_POST_LENGTH) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= max_len:
        return text
    return text[: max_len - 3].rstrip() + "..."


def dedupe_preserve_order(items: List[str]) -> List[str]:
    seen = set()
    out = []
    for item in items:
        if item not in seen:
            seen.add(item)
            out.append(item)
    return out


def hash_template(text: str) -> str:
    """Simple template hash for tracking performance."""
    norm = normalize(text)
    # Remove specific numbers/prices for template matching
    norm = re.sub(r"\$[\d,.]+[km]?\b", "$N", norm)
    norm = re.sub(r"\b\d+[km]?\b", "N", norm)
    return str(hash(norm) % 10000000)


def template_for_hash(text: str) -> str:
    """Return the template pattern for a text."""
    return re.sub(r"\$[\d,.]+[km]?\b", "$N", re.sub(r"\b\d+[km]?\b", "N", text))


# =========================================================
# ART VAULT CATALOG: Contextual Captions per Piece
# =========================================================

ART_CATALOG = {
    "mad-2-months": [
        "Two months of building while others folded. Time is the real flex. Stay $MAD.",
        "Month two. Still here. Still building. Still $MAD.",
        "They counted days. We stacked conviction. Stay $MAD.",
    ],
    "mad-army": [
        "The MAD Army doesn't sleep. We don't fold. We build. Stay $MAD.",
        "Every soldier in this army chose discipline over dopamine. Stay $MAD.",
        "Not an army of noise. An army of signal. Stay $MAD.",
    ],
    "mad-at-bears": [
        "Bears want you scared. We want you ready. Stay $MAD.",
        "The bear market doesn't break MAD holders. It reveals them. Stay $MAD.",
        "They hibernate. We build. Same forest. Different species. Stay $MAD.",
    ],
    "mad-believes": [
        "Belief without discipline is just hope. And hope doesn't pay. Stay $MAD.",
        "We believe in the build. Not the promise. Stay $MAD.",
        "Believe in the process. The price follows. Stay $MAD.",
    ],
    "mad-believing": [
        "Still believing. Still building. Still $MAD.",
        "Belief is easy. Believing while the chart bleeds is $MAD energy. Stay $MAD.",
        "Don't just believe. Behave. Stay $MAD.",
    ],
    "mad-community": [
        "This community doesn't fake it. Confessions prove it. Stay $MAD.",
        "Real people. Real chaos. Real conviction. That's the $MAD community. Stay $MAD.",
        "We don't do perfect. We do real. Stay $MAD.",
    ],
    "mad-doctor": [
        "The doctor prescribes one thing: discipline. Stay $MAD.",
        "Diagnosis: emotional trading. Cure: $MAD energy. Stay $MAD.",
        "No placebo here. Just real signal. Stay $MAD.",
    ],
    "mad-dollar": [
        "The dollar doesn't make you rich. Discipline does. Stay $MAD.",
        "Chase the dollar, lose the plot. Build the signal, win the game. Stay $MAD.",
        "$MAD rich starts in the mind. The dollars follow. Stay $MAD.",
    ],
    "mad-hold-on-dear-life": [
        "HODL is easy when it's green. The real test is red. Stay $MAD.",
        "Hold on dear life? No. Hold on dear conviction. Stay $MAD.",
        "They panic sell. We panic build. Stay $MAD.",
    ],
    "mad-kings-only": [
        "Kings don't chase. Kings command. Stay $MAD.",
        "Not everyone gets a crown. Only the ones who survived the trenches. Stay $MAD.",
        "Elite isn't a label. It's a behavior. Stay $MAD.",
    ],
    "mad-luffy-1000x": [
        "1000x? Maybe. But the real flex is not folding before it happens. Stay $MAD.",
        "Luffy didn't quit at episode 50. You don't quit at 50% down. Stay $MAD.",
        "Anime taught us: the journey is the reward. The 1000x is just the arc. Stay $MAD.",
    ],
    "mad-month": [
        "Another month of signal. Another month of build. Stay $MAD.",
        "Months don't matter. Momentum does. Stay $MAD.",
        "They measure time. We measure conviction. Stay $MAD.",
    ],
    "mad-neptune": [
        "God of the sea. God of the trenches. Same energy. Stay $MAD.",
        "Deep water. Deep conviction. Stay $MAD.",
        "Neptune rules the ocean. $MAD rules the calm. Stay $MAD.",
    ],
    "mad-rich-in-the-tub": [
        "Relaxing while others panic. That's $MAD rich. Stay $MAD.",
        "The tub is peaceful because the mind is already disciplined. Stay $MAD.",
        "Wealth is quiet. Chaos is loud. Stay $MAD.",
    ],
    "mad-rich-or-broke": [
        "Binary outcome? Only if you fold. Stay $MAD.",
        "Rich or broke isn't fate. It's decision quality. Stay $MAD.",
        "The line between rich and broke is one panic sell. Stay $MAD.",
    ],
    "mad-rich-with-a-chick": [
        "The real flex isn't who you're with. It's that you didn't fold to get there. Stay $MAD.",
        "Lifestyle follows discipline. Not the other way around. Stay $MAD.",
        "Built different. Stay $MAD.",
    ],
    "mad-school": [
        "Class is in session. Today's lesson: don't fold. Stay $MAD.",
        "The market teaches. $MAD students listen. Stay $MAD.",
        "You didn't come here for comfort. You came here to learn. Stay $MAD.",
    ],
    "mad-you-sidelined": [
        "Sidelined? Your choice. We're building. Stay $MAD.",
        "The sidelines are comfortable. The trenches pay. Stay $MAD.",
        "You watched. We acted. That's the difference. Stay $MAD.",
    ],
    "make-mad-great-again": [
        "We're not going back. We're going forward. Stay $MAD.",
        "Greatness isn't nostalgia. It's what you build today. Stay $MAD.",
        "Make $MAD great? It's already great. You just weren't watching. Stay $MAD.",
    ],
    "we-mad-zoomin": [
        "Zooming past the noise. Full speed. Stay $MAD.",
        "Fast doesn't mean reckless. It means prepared. Stay $MAD.",
        "We don't speed. We accelerate. Stay $MAD.",
    ],
    "you-mad-we-go-up": [
        "You get mad. We go up. That's the game. Stay $MAD.",
        "Your panic is our entry signal. Stay $MAD.",
        "Emotion sells. Conviction buys. Stay $MAD.",
    ],
    "you-make-me-mad": [
        "You make me mad? Good. That means you're paying attention. Stay $MAD.",
        "Anger is just energy. We redirect it into build. Stay $MAD.",
        "If you're not mad, you're not paying attention. Stay $MAD.",
    ],
    "you-will-be-mad": [
        "You will be mad. At yourself. For folding early. Stay $MAD.",
        "Prediction: regret hits harder than FOMO. Stay $MAD.",
        "Future you is watching. Don't disappoint them. Stay $MAD.",
    ],
}


def get_art_key_from_path(path: str) -> str:
    """Extract catalog key from file path."""
    base = os.path.splitext(os.path.basename(path))[0]
    return re.sub(r"[^a-z0-9]", "-", base.lower()).strip("-")


def get_captions_for_art(path: str) -> List[str]:
    """Get contextual captions for a specific art piece."""
    key = get_art_key_from_path(path)
    # Try exact match, then fuzzy prefix match
    if key in ART_CATALOG:
        return ART_CATALOG[key]
    for catalog_key, captions in ART_CATALOG.items():
        if catalog_key in key or key in catalog_key:
            return captions
    # Fallback generic
    return [
        "From the $MAD vault. Free to grab. The real flex is holding while you post it.",
        "Signal, not noise. Stay $MAD.",
        "Bold. Sharable. Impossible to ignore. Stay $MAD.",
    ]


# =========================================================
# ENHANCED CONTENT SOURCES
# =========================================================

# --- Pull from your ecosystem ---

def fetch_mad_confessions() -> List[str]:
    """Fetch latest confessions from the website if API exists."""
    if requests is None:
        return []
    try:
        # Adjust this URL to your actual confessions API
        resp = requests.get(MAD_CONFessions_URL, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            confessions = [c.get("text", "") for c in data if c.get("text")]
            return confessions[:10]
    except Exception:
        pass
    return []


def fetch_mad_art_files() -> List[str]:
    """List available art pieces in the local art directory."""
    if not os.path.exists(MAD_ART_DIR):
        return []
    extensions = (".png", ".jpg", ".jpeg", ".gif", ".webp")
    files = [os.path.join(MAD_ART_DIR, f) for f in os.listdir(MAD_ART_DIR)
             if f.lower().endswith(extensions)]
    return sorted(files)


def fetch_price_data() -> Optional[Dict]:
    """Fetch $MAD price data from Jupiter or Birdeye."""
    if requests is None:
        return None
    try:
        # Jupiter price API
        url = f"https://price.jup.ag/v6/price?ids={MAD_CONTRACT}"
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            price_data = data.get("data", {}).get(MAD_CONTRACT)
            if price_data:
                return {
                    "price": price_data.get("price", 0),
                    "vsToken": price_data.get("vsToken", "USDC"),
                }
    except Exception:
        pass
    return None


# --- Content Templates (Massively Expanded) ---

OPENERS = [
    "Most people",
    "You",
    "Pressure",
    "Greed",
    "Weak hands",
    "The market",
    "Discipline",
    "Conviction",
    "Fear",
    "Pain",
    "Regret",
    "Patience",
    "Emotion",
    "Noise",
    "The chart",
    "Builders",
    "Winners",
    "Losers",
    "Panickers",
    "Jeeters",
    "$MAD holders",
    "The trenches",
]

CLAUSE_A = [
    "panic where patience should begin",
    "call volatility unfair when it exposes fake conviction",
    "want the reward without surviving the pain",
    "mistake noise for signal",
    "react before they think",
    "enter on emotion and exit on fear",
    "chase candles and call it strategy",
    "confuse urgency with edge",
    "fold at the bottom and fomo at the top",
    "sell discipline for a dopamine hit",
    "think calm is weakness",
    "call coping a plan",
    "want clarity without chaos first",
    "trade their ego instead of the chart",
    "quit before the structure pays",
    "call rekt a surprise instead of a choice",
    "blame the dev instead of the mirror",
    "hold on hope instead of on thesis",
    "let a red candle rewrite their whole story",
    "forget why they started when it gets hard",
]

CLAUSE_B = [
    "Discipline is the flex.",
    "Pain teaches what hype hides.",
    "Execution beats excitement.",
    "Calm gets paid before noise does.",
    "$MAD respects structure, not coping.",
    "Pressure reveals the truth fast.",
    "Signal wins when emotion shuts up.",
    "Conviction means nothing without control.",
    "The build is quieter than the hype.",
    "Your future self is watching. Stay composed.",
    "Every jeeter is a lesson in what not to do.",
    "The real alpha is not flinching.",
    "Stay $MAD. Build through the noise.",
    "Structure outlasts sentiment.",
    "Panic is a tax. Patience is a strategy.",
    "What breaks weak hands forges strong ones.",
    "$MAD rich starts in the mind first.",
    "You don't need more information. You need more restraint.",
    "The market doesn't reward feelings. It rewards follow-through.",
    "Control yourself. The rest follows.",
]

# --- $MAD-Specific Content Templates ---

MAD_SPECIFIC_TEMPLATES = [
    "Another confession dropped. Someone out there is {confession_topic}. We see you. Stay $MAD.",
    "273 holders. +52 this cycle. Small number? No. Proof the signal is spreading. Stay $MAD.",
    "513M supply. 800M target. Every burn is a promise kept. Stay $MAD.",
    "Liquidity locked until June 2026. Not a flex. A signal. Stay $MAD.",
    "Someone just posted on MAD Confessions: '{confession_snippet}' Raw. Unfiltered. That's the energy. Stay $MAD.",
    "The Roblox game hit {visit_count} visits. Small. Building. Quietly. Stay $MAD.",
    "MAD Tower Defense is coming. Not soon™. Actually coming. Stay $MAD.",
    "Drop 001 stickers are out there. On laptops. On water bottles. On phones. Real people. Real signal. Stay $MAD.",
    "MAD AI just dropped truth #{truth_count} today. Pattern exposed. Comfort addiction detected. Stay $MAD.",
    "The MAD Path is 67% complete. Mile 50 is in motion. Mile 100 is the destination. Stay $MAD.",
    "Someone sold 6.6M $MAD at 27k MC and posted about it on Confessions. We see you. We remember. Stay $MAD.",
    "No taxes. No tricks. Just supply shrinking and conviction growing. Stay $MAD.",
    "Your emotions are front-running your plan. MAD AI sees the pattern. You should too. Stay $MAD.",
    "The vault has 23 pieces. Free to grab. The real flex is holding $MAD while you post them. Stay $MAD.",
]

# --- Community Celebration Templates ---

CELEBRATION_TEMPLATES = [
    "New holder just joined the club. Welcome. The water is cold, the conviction is warm. Stay $MAD.",
    "Someone just grabbed a bigger bag. Not telling you to. Just noticing the signal. Stay $MAD.",
    "Holders growing. Jeeters coping. Same chart, different psychology. Stay $MAD.",
    "The community backed another project publicly. Tokens locked. Receipts posted. That's $MAD energy. Stay $MAD.",
    "Another confession posted. Another truth told. This community doesn't fake it. Stay $MAD.",
]

# --- Reply Templates (MAD AI Personality) ---

REPLY_TEMPLATES = {
    "savage": [
        "You came here for comfort. I don't do that. Here's what I see: {insight}",
        "That sounds like coping dressed as a question. The truth? {insight}",
        "Most people would agree with you. That's exactly why you should reconsider. {insight}",
        "You're not stuck. You're subscribed to a pattern you won't cancel. {insight}",
    ],
    "gentle": [
        "I hear you. Here's what the pattern shows: {insight}",
        "It's okay to feel that way. The real work is noticing it. {insight}",
        "You're not behind. You're just measuring with the wrong ruler. {insight}",
    ],
    "brutal": [
        "Brutal truth: {insight} No filter. No comfort. Just signal.",
        "You asked. I answer. {insight} That's the game.",
        "Everyone else will tell you what you want to hear. {insight} That's the difference.",
    ],
    "crashout": [
        "BRO. {insight} I'm actually heated about this.",
        "NAH. {insight} This is making me $MAD.",
        "OH NO. {insight} I'm about to lose my mind.",
    ],
    "safe": [
        "Here's a balanced take: {insight}",
        "Looking at this from multiple angles: {insight}",
    ],
}

REPLY_INSIGHTS = [
    "Your panic is louder than your plan.",
    "You're reacting to noise like it's signal.",
    "The problem isn't the market. It's your relationship with uncertainty.",
    "You keep calling the pattern a lesson, then repeating it.",
    "Comfort addiction is the enemy. Growth lives in discomfort.",
    "You're not waiting for clarity. You're hiding from decision.",
    "Every time you fold, you teach yourself to fold.",
    "Your future self is watching. What are you showing them?",
    "Discipline is the only edge that doesn't expire.",
    "You don't need more alpha. You need less emotion.",
]

HASHTAGS = ["#Crypto", "#Trading", "#Mindset", "#Altcoins", "#Solana", "#MemeCoin"]


def add_prefix(text: str) -> str:
    if not TWEET_PREFIX:
        return text
    return f"{TWEET_PREFIX} {text}".strip()


def maybe_add_hashtags(text: str) -> str:
    if not USE_HASHTAGS or MAX_HASHTAGS_PER_POST <= 0:
        return text
    if random.random() >= 0.35:
        return text
    k = min(MAX_HASHTAGS_PER_POST, len(HASHTAGS))
    tags = " ".join(random.sample(HASHTAGS, k=k))
    return f"{text} {tags}".strip()


def finalize_post_text(text: str) -> str:
    text = add_prefix(text)
    text = maybe_add_hashtags(text)
    text = trim_text(text, MAX_POST_LENGTH)
    return text


# =========================================================
# ENHANCED CANDIDATE GENERATORS
# =========================================================

def generate_philosophy_candidates(count: int = 4) -> List[str]:
    """Generate classic MAD philosophy posts."""
    candidates = []
    attempts = 0
    while len(candidates) < count and attempts < count * 10:
        attempts += 1
        opener = random.choice(OPENERS)
        a = random.choice(CLAUSE_A)
        b = random.choice(CLAUSE_B)

        # Natural transitions based on opener
        if opener.lower() == "you":
            text = f"You {a}. {b}"
        elif opener.lower() in ["most people", "winners", "losers", "panickers", "jeeters"]:
            text = f"{opener} {a}. {b}"
        elif opener.lower() in ["pressure", "greed", "fear", "pain", "regret", "emotion", "noise"]:
            text = f"{opener} makes you {a}. {b}"
        elif opener.lower() in ["discipline", "conviction", "patience", "builders"]:
            text = f"{opener} means {a}. {b}"
        elif opener.lower() in ["the market", "the chart", "the trenches"]:
            text = f"{opener} doesn't {a}. {b}"
        elif opener.lower() == "$mad holders":
            text = f"{opener} don't {a}. {b}"
        else:
            text = f"{opener} {a}. {b}"

        text = finalize_post_text(text)
        candidates.append(text.strip())
        candidates = dedupe_preserve_order(candidates)

    return candidates[:count]


def generate_mad_specific_candidates(count: int = 3) -> List[str]:
    """Generate $MAD ecosystem content."""
    candidates = []
    confessions = fetch_mad_confessions()

    for template in random.sample(MAD_SPECIFIC_TEMPLATES, min(count, len(MAD_SPECIFIC_TEMPLATES))):
        text = template
        # Try to fill dynamic fields
        if "{confession_topic}" in text and confessions:
            topic = random.choice(confessions)[:40]
            text = text.replace("{confession_topic}", topic)
        elif "{confession_snippet}" in text and confessions:
            snippet = random.choice(confessions)[:60]
            text = text.replace("{confession_snippet}", snippet + "...")
        elif "{visit_count}" in text:
            text = text.replace("{visit_count}", str(random.choice([100, 150, 200, "100+", "150+"])))
        elif "{truth_count}" in text:
            text = text.replace("{truth_count}", str(random.randint(1, 50)))

        # Remove unfilled placeholders
        text = re.sub(r"\{[^}]+\}", "", text)
        text = finalize_post_text(text)
        if len(text) > 30:
            candidates.append(text)

    return candidates[:count]


def generate_celebration_candidates(count: int = 2) -> List[str]:
    """Generate community celebration posts."""
    candidates = []
    for template in random.sample(CELEBRATION_TEMPLATES, min(count, len(CELEBRATION_TEMPLATES))):
        text = finalize_post_text(template)
        candidates.append(text)
    return candidates


def generate_media_post_candidates(count: int = 2) -> Tuple[List[str], List[Optional[str]]]:
    """Generate posts with media attachments using contextual art captions."""
    art_files = fetch_mad_art_files()
    if not art_files or not AUTO_POST_MEDIA:
        return [], []

    # Avoid recently posted media (last 10)
    state = load_state()
    recent_media = state.get("recent_media_posted", [])
    available = [f for f in art_files if f not in recent_media[-10:]]
    if not available:
        available = art_files  # fallback if all were recent

    pool = available if len(available) >= count else art_files

    texts = []
    media_paths = []

    for art_file in random.sample(pool, min(count, len(pool))):
        captions = get_captions_for_art(art_file)
        text = random.choice(captions)
        text = finalize_post_text(text)
        texts.append(text)
        media_paths.append(art_file)

    return texts, media_paths


def generate_thread_candidates() -> Optional[List[str]]:
    """Generate a tweet thread (series of connected posts)."""
    if not AUTO_POST_THREADS:
        return None

    threads = [
        [
            "The $MAD framework in 3 parts:\n\n1/ Most people think discipline is boring. It's not. It's the only thing that compounds faster than hype.",
            "2/ Pressure doesn't break you. It reveals what you were pretending not to be. The market is just a mirror.",
            "3/ You don't need more alpha. You need less emotion. Control yourself. The rest follows.\n\nStay $MAD.",
        ],
        [
            "Someone asked: 'Why $MAD?'\n\nHere's the honest answer:",
            "It's not the tech. It's not the burns. It's not the locked liquidity.",
            "It's the fact that someone out there is building while others panic. And they chose to do it publicly.",
            "That's rare. That's signal. That's $MAD.\n\nStay $MAD.",
        ],
        [
            "The MAD Confessions board is wild.\n\nPeople out here admitting they sold at 10k MC. That they panicked. That they regret.",
            "And here's what's beautiful: nobody judges them.\n\nBecause every confession is just a mirror someone else needed to see.",
            "That's the community. Real. Unfiltered. Not faking perfect lives.\n\nStay $MAD.",
        ],
    ]

    thread = random.choice(threads)
    return [finalize_post_text(t) for t in thread]


def generate_all_candidates(count: int = POST_CANDIDATE_COUNT) -> Tuple[List[str], List[Optional[str]], Optional[List[str]]]:
    """Generate all types of candidates."""
    texts = []
    media = []

    # Philosophy posts
    philo = generate_philosophy_candidates(count // 2)
    texts.extend(philo)
    media.extend([None] * len(philo))

    # $MAD-specific posts
    mad_spec = generate_mad_specific_candidates(count // 3)
    texts.extend(mad_spec)
    media.extend([None] * len(mad_spec))

    # Celebration posts
    celeb = generate_celebration_candidates(2)
    texts.extend(celeb)
    media.extend([None] * len(celeb))

    # Media posts
    if AUTO_POST_MEDIA:
        media_texts, media_paths = generate_media_post_candidates(2)
        texts.extend(media_texts)
        media.extend(media_paths)

    # Thread (separate)
    thread = generate_thread_candidates()

    return dedupe_preserve_order(texts), media, thread


# =========================================================
# ENHANCED SCORING (Your Original + Boosts)
# =========================================================

ANGER_TERMS = [
    "panic", "cope", "coping", "weak", "weak hands", "fear", "rage",
    "angry", "desperate", "begging", "delusion", "clown", "broke mindset",
    "emotional", "reacting", "revenge trade", "bleeding", "collapse",
    "impulse", "fake conviction", "shaking out", "overleveraged", "wrecked",
    "greed", "chasing", "fomo", "jeeter", "jeeters", "paper hands"
]

PAIN_TERMS = [
    "pain", "loss", "regret", "bagholder", "bagholding", "missed",
    "late entry", "wrecked", "destroyed", "down bad", "suffering",
    "bleed", "drawdown", "humiliation", "burned", "liquidated",
    "mistake", "lesson", "lessons", "scar tissue", "punished",
    "round trip", "trapped", "stuck", "wrong entry", "rekt"
]

FLEX_TERMS = [
    "discipline", "patience", "execution", "conviction", "composure",
    "self-command", "signal", "clarity", "structure", "winner",
    "builders", "elite", "calm", "control", "precision", "strong",
    "locked in", "sharp", "unshaken", "stands firm", "commanding",
    "restraint", "focus", "respects execution", "$mad", "stay $mad",
    "mad rich", "holders", "community", "build", "building"
]

HOOK_PATTERNS = [
    r"\byou\b",
    r"\byour\b",
    r"\bmost people\b",
    r"\bthe market\b",
    r"\bpressure\b",
    r"\bdiscipline\b",
    r"\bgreed\b",
    r"\bfear\b",
    r"\bconviction\b",
    r"\bconfession\b",
    r"\bjeeter\b",
    r"\bmad\b",
]

STRONG_OPENERS = [
    "you", "most people", "the market", "pressure", "discipline",
    "greed", "fear", "winners", "losers", "panic", "regret", "weak hands",
    "jeeters", "$mad", "confession", "build"
]

WEAK_PHRASES = [
    "i think", "maybe", "kind of", "sort of", "pretty good", "nice", "just", "perhaps",
    "in my opinion", "i believe", "possibly"
]

ROBOTIC_PHRASES = [
    "mad ai says:", "according to", "as a language model", "it is important to note"
]

OVERUSED_TEMPLATE_PATTERNS = [
    r"charts expose psychology before they reward thesis",
    r"pressure reveals what you were pretending not to be",
    r"urgency is not edge",
    r"your emotions are front[- ]running your plan",
    r"you are reacting instead of commanding",
    r"discipline is the flex",
    r"pain teaches what hype hides",
    r"execution beats excitement",
    r"calm gets paid before noise does",
    r"stay \$mad",
]

CONTRAST_WORDS = ["but", "instead", "before", "not", "while", "yet", "until", "because"]

STOPWORDS = {
    "the", "a", "an", "and", "or", "to", "of", "in", "on", "for", "with",
    "is", "it", "that", "this", "you", "your", "are", "be", "they", "them",
    "we", "our", "as", "at", "by", "from", "not", "but", "if", "then",
    "than", "into", "out", "up", "down", "over", "under", "before", "after"
}


def tokenize(s: str) -> List[str]:
    words = re.findall(r"[a-z0-9$']+", s.lower())
    return [w for w in words if w not in STOPWORDS and len(w) > 1]


def find_matches(s: str, terms: List[str]) -> List[str]:
    found = []
    for term in terms:
        if term in s and term not in found:
            found.append(term)
    return found


def bucket_score(matches: List[str], per_match: float, cap: float) -> float:
    return min(len(matches) * per_match, cap)


def combo_bonus(anger_score: float, pain_score: float, flex_score: float) -> float:
    active = sum(1 for s in [anger_score, pain_score, flex_score] if s >= 0.5)
    if active == 3:
        return 1.25
    if active == 2:
        return 0.65
    return 0.0


def score_hook(s: str) -> float:
    points = 0.0
    for pattern in HOOK_PATTERNS:
        if re.search(pattern, s):
            points += 0.25
    if any(s.startswith(opener) for opener in STRONG_OPENERS):
        points += 0.65
    if "you" in s and any(w in s for w in ["lose", "panic", "cope", "regret", "discipline"]):
        points += 0.35
    # Boost for $MAD-specific hooks
    if "$mad" in s or "confession" in s or "jeeter" in s:
        points += 0.4
    return min(points, 1.6)


def score_structure(s: str) -> float:
    points = 0.0
    length = len(s)

    if 90 <= length <= 220:
        points += 0.9
    elif 65 <= length <= 240:
        points += 0.45

    sentence_count = len([x for x in re.split(r"[.!?]+", s) if x.strip()])
    if 1 <= sentence_count <= 4:
        points += 0.45

    if any(word in s for word in CONTRAST_WORDS):
        points += 0.35

    punctuation_hits = 0
    for ch in [":", ";", "—", "-"]:
        if ch in s:
            punctuation_hits += 1
    if 1 <= punctuation_hits <= 2:
        points += 0.2

    return min(points, 1.75)


def weak_phrase_penalty(s: str) -> float:
    p = 0.0
    for phrase in WEAK_PHRASES:
        if phrase in s:
            p += 0.35
    return p


def robotic_penalty(s: str) -> float:
    p = 0.0
    for phrase in ROBOTIC_PHRASES:
        if phrase in s:
            p += 1.1
    return p


def repetition_penalty(raw: str, s: str) -> float:
    p = 0.0

    for pattern in OVERUSED_TEMPLATE_PATTERNS:
        if re.search(pattern, s):
            p += 0.9

    hashtags = re.findall(r"#\w+", raw)
    if len(hashtags) != len(set(hashtags)):
        p += 0.75

    words = re.findall(r"\b\w+\b", raw.lower())
    for i in range(len(words) - 1):
        if words[i] == words[i + 1]:
            p += 0.2

    return p


def hashtag_penalty(raw: str) -> float:
    count = len(re.findall(r"#\w+", raw))
    if count >= 4:
        return 1.0
    if count == 3:
        return 0.7
    if count == 2:
        return 0.3
    return 0.0


def jaccard_similarity(a: str, b: str) -> float:
    a_tokens = set(tokenize(a))
    b_tokens = set(tokenize(b))
    if not a_tokens or not b_tokens:
        return 0.0
    inter = len(a_tokens & b_tokens)
    union = len(a_tokens | b_tokens)
    return inter / union if union else 0.0


def char_ngram_set(s: str, n: int = 4) -> set:
    s = re.sub(r"\s+", " ", s.lower().strip())
    if not s:
        return set()
    if len(s) < n:
        return {s}
    return {s[i:i+n] for i in range(len(s) - n + 1)}


def ngram_similarity(a: str, b: str, n: int = 4) -> float:
    a_set = char_ngram_set(a, n)
    b_set = char_ngram_set(b, n)
    if not a_set or not b_set:
        return 0.0
    inter = len(a_set & b_set)
    union = len(a_set | b_set)
    return inter / union if union else 0.0


def combined_similarity(a: str, b: str) -> float:
    jac = jaccard_similarity(a, b)
    ngr = ngram_similarity(a, b, 4)
    return (0.55 * jac) + (0.45 * ngr)


def novelty_penalty(s: str, history: List[str]) -> Tuple[float, Dict[str, float]]:
    if not history:
        return 0.0, {"max_similarity": 0.0, "avg_top3_similarity": 0.0}

    sims = []
    for old in history:
        old_norm = normalize(old)
        if not old_norm:
            continue
        sims.append(combined_similarity(s, old_norm))

    if not sims:
        return 0.0, {"max_similarity": 0.0, "avg_top3_similarity": 0.0}

    sims.sort(reverse=True)
    max_sim = sims[0]
    top3 = sims[:3]
    avg_top3 = sum(top3) / len(top3)

    p = 0.0
    if max_sim >= 0.82:
        p += 2.4
    elif max_sim >= 0.72:
        p += 1.5
    elif max_sim >= 0.62:
        p += 0.8
    elif max_sim >= 0.52:
        p += 0.35

    if avg_top3 >= 0.72:
        p += 1.0
    elif avg_top3 >= 0.62:
        p += 0.55
    elif avg_top3 >= 0.52:
        p += 0.25

    return p, {
        "max_similarity": round(max_sim, 4),
        "avg_top3_similarity": round(avg_top3, 4),
    }


def score_candidate_with_emotional_boosts(
    text: str,
    base_score: float = 0.0,
    recent_texts: Optional[List[str]] = None,
    is_media_post: bool = False,
    is_reply: bool = False,
) -> Dict:
    recent_texts = recent_texts or []

    raw = (text or "").strip()
    raw_for_scoring = raw.replace("Mad AI says:", "").replace("mad ai says:", "").strip()
    s = normalize(raw_for_scoring)

    anger_matches = find_matches(s, ANGER_TERMS)
    pain_matches = find_matches(s, PAIN_TERMS)
    flex_matches = find_matches(s, FLEX_TERMS)

    anger_score = bucket_score(anger_matches, 0.55, 2.2)
    pain_score = bucket_score(pain_matches, 0.55, 2.2)
    flex_score = bucket_score(flex_matches, 0.50, 2.0)

    combo_score = combo_bonus(anger_score, pain_score, flex_score)
    hook_score = score_hook(s)
    structure_score = score_structure(s)

    novelty_pen, sim_details = novelty_penalty(s, recent_texts)
    repeat_pen = repetition_penalty(raw_for_scoring, s)
    hash_pen = hashtag_penalty(raw_for_scoring)
    weak_pen = weak_phrase_penalty(s)
    robot_pen = robotic_penalty(s)

    # --- Boosts for specific content types ---
    media_boost = 0.3 if is_media_post else 0.0
    reply_boost = 0.2 if is_reply else 0.0
    mad_brand_boost = 0.4 if "$mad" in s or "stay $mad" in s else 0.0
    confession_boost = 0.35 if "confession" in s else 0.0

    total = (
        float(base_score)
        + anger_score
        + pain_score
        + flex_score
        + combo_score
        + hook_score
        + structure_score
        + media_boost
        + reply_boost
        + mad_brand_boost
        + confession_boost
        - novelty_pen
        - repeat_pen
        - hash_pen
        - weak_pen
        - robot_pen
    )

    return {
        "text": raw,
        "base": round(float(base_score), 2),
        "anger": round(anger_score, 2),
        "pain": round(pain_score, 2),
        "flex": round(flex_score, 2),
        "combo": round(combo_score, 2),
        "hook": round(hook_score, 2),
        "structure": round(structure_score, 2),
        "media_boost": round(media_boost, 2),
        "mad_brand_boost": round(mad_brand_boost, 2),
        "confession_boost": round(confession_boost, 2),
        "novelty_penalty": round(novelty_pen, 2),
        "repetition_penalty": round(repeat_pen, 2),
        "hashtag_penalty": round(hash_pen, 2),
        "weak_phrase_penalty": round(weak_pen, 2),
        "robotic_penalty": round(robot_pen, 2),
        "total": round(total, 2),
        "matched_terms": {
            "anger": anger_matches,
            "pain": pain_matches,
            "flex": flex_matches,
        },
        "similarity_details": sim_details,
        "is_media": is_media_post,
        "is_reply": is_reply,
        "log_line": (
            f"[SCORE] total={round(total, 2):.2f} | "
            f"base={float(base_score):.2f} + anger={anger_score:.2f} + pain={pain_score:.2f} "
            f"+ flex={flex_score:.2f} + combo={combo_score:.2f} + hook={hook_score:.2f} "
            f"+ structure={structure_score:.2f} + media={media_boost:.2f} + brand={mad_brand_boost:.2f} "
            f"+ conf={confession_boost:.2f} - novelty={novelty_pen:.2f} "
            f"- repeat={repeat_pen:.2f} - hashtags={hash_pen:.2f} "
            f"- weak={weak_pen:.2f} - robotic={robot_pen:.2f}"
        ),
        "match_log": (
            f"[MATCHES] anger={anger_matches} | pain={pain_matches} | "
            f"flex={flex_matches} | sim={sim_details}"
        ),
    }


def rerank_candidates_with_emotional_boosts(
    candidates: List[str],
    base_scores: List[float],
    media_flags: Optional[List[bool]] = None,
    recent_texts: Optional[List[str]] = None,
) -> List[Dict]:
    if len(candidates) != len(base_scores):
        raise ValueError("candidates and base_scores must have the same length")

    media_flags = media_flags or [False] * len(candidates)
    recent_texts = list(recent_texts or [])
    scored = []

    for candidate_text, base_score, is_media in zip(candidates, base_scores, media_flags):
        result = score_candidate_with_emotional_boosts(
            text=candidate_text,
            base_score=base_score,
            recent_texts=recent_texts,
            is_media_post=is_media,
        )
        scored.append(result)
        recent_texts.append(candidate_text)

    scored.sort(key=lambda x: x["total"], reverse=True)
    return scored


# =========================================================
# BASE SCORING
# =========================================================

def simple_base_score(text: str) -> float:
    score = 3.5
    length = len(text)
    low = text.lower()

    if 80 <= length <= 220:
        score += 0.8
    elif 50 <= length <= 240:
        score += 0.4

    if "." in text:
        score += 0.4

    if any(word in low for word in ["discipline", "pressure", "pain", "conviction", "signal", "fear", "greed"]):
        score += 0.5

    if "you " in low or low.startswith("most people"):
        score += 0.3

    # $MAD-specific base boost
    if "$mad" in low:
        score += 0.6
    if "stay $mad" in low:
        score += 0.4
    if "confession" in low:
        score += 0.3

    return round(score, 2)


# =========================================================
# X API — ENHANCED
# =========================================================

def build_twitter_client_v2():
    if tweepy is None:
        raise RuntimeError("tweepy is not installed. Run: pip install tweepy python-dotenv")

    missing = []
    if not X_API_KEY:
        missing.append("X_API_KEY")
    if not X_API_SECRET:
        missing.append("X_API_SECRET")
    if not X_ACCESS_TOKEN:
        missing.append("X_ACCESS_TOKEN")
    if not X_ACCESS_TOKEN_SECRET:
        missing.append("X_ACCESS_TOKEN_SECRET")

    if missing:
        raise RuntimeError("Missing X API credentials in .env: " + ", ".join(missing))

    client = tweepy.Client(
        bearer_token=X_BEARER_TOKEN if X_BEARER_TOKEN else None,
        consumer_key=X_API_KEY,
        consumer_secret=X_API_SECRET,
        access_token=X_ACCESS_TOKEN,
        access_token_secret=X_ACCESS_TOKEN_SECRET,
    )
    return client


def build_twitter_api_v1():
    """Build v1.1 API for media uploads."""
    if tweepy is None:
        return None
    auth = tweepy.OAuth1UserHandler(
        X_API_KEY, X_API_SECRET,
        X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
    )
    return tweepy.API(auth)


def post_to_x(text: str, media_path: Optional[str] = None, reply_to: Optional[str] = None) -> Optional[str]:
    """Post to X. Returns tweet ID if successful."""
    if AUTO_POST_DRY_RUN:
        media_str = f" + media={media_path}" if media_path else ""
        reply_str = f" (reply to {reply_to})" if reply_to else ""
        print(f"[DRY RUN] Would post{media_str}{reply_str}: {text}")
        return None

    try:
        client = build_twitter_client_v2()
        media_ids = None

        if media_path and os.path.exists(media_path):
            api_v1 = build_twitter_api_v1()
            if api_v1:
                media = api_v1.media_upload(media_path)
                media_ids = [media.media_id_string]
                debug(f"[MEDIA] Uploaded {media_path} -> {media.media_id_string}")

        kwargs = {"text": text}
        if media_ids:
            kwargs["media_ids"] = media_ids
        if reply_to:
            kwargs["in_reply_to_tweet_id"] = reply_to

        response = client.create_tweet(**kwargs)
        tweet_id = None

        if getattr(response, "data", None) and isinstance(response.data, dict):
            tweet_id = response.data.get("id")

        print(f"[POST] Posted to X. tweet_id={tweet_id}")
        return tweet_id

    except Exception as e:
        print(f"[POST ERROR] {e}")
        return None


def post_thread_to_x(texts: List[str]) -> List[Optional[str]]:
    """Post a thread. Returns list of tweet IDs."""
    if not texts:
        return []

    if AUTO_POST_DRY_RUN:
        print(f"[DRY RUN] Would post thread of {len(texts)} tweets:")
        for i, t in enumerate(texts):
            print(f"  [{i+1}] {t}")
        return [None] * len(texts)

    tweet_ids = []
    last_id = None

    for text in texts:
        tweet_id = post_to_x(text, reply_to=last_id)
        tweet_ids.append(tweet_id)
        if tweet_id:
            last_id = tweet_id
        else:
            break

    return tweet_ids


def fetch_mentions(since_id: Optional[str] = None) -> List[Dict]:
    """Fetch recent mentions."""
    if tweepy is None or not X_BEARER_TOKEN:
        return []

    try:
        client = build_twitter_client_v2()
        # Get bot's user ID first
        me = client.get_me()
        if not me or not me.data:
            return []

        user_id = me.data.id
        kwargs = {"max_results": 10}
        if since_id:
            kwargs["since_id"] = since_id

        mentions = client.get_users_mentions(user_id, **kwargs)
        if mentions and mentions.data:
            return [
                {
                    "id": tweet.id,
                    "text": tweet.text,
                    "author_id": tweet.author_id,
                    "created_at": getattr(tweet, "created_at", None),
                }
                for tweet in mentions.data
            ]
    except Exception as e:
        debug(f"[MENTIONS ERROR] {e}")

    return []


def generate_reply_to_mention(mention_text: str, mode: str = MAD_AI_MODE) -> str:
    """Generate a reply to a mention using MAD AI personality."""
    insight = random.choice(REPLY_INSIGHTS)
    templates = REPLY_TEMPLATES.get(mode, REPLY_TEMPLATES["savage"])
    template = random.choice(templates)
    reply = template.replace("{insight}", insight)
    return finalize_post_text(reply)


def reply_to_mentions(state: Dict) -> int:
    """Check for mentions and reply. Returns count of replies sent."""
    if not AUTO_REPLY_MENTIONS:
        return 0

    since_id = state.get("last_reply_id")
    mentions = fetch_mentions(since_id)

    if not mentions:
        return 0

    count = 0
    for mention in mentions:
        mention_text = mention.get("text", "")
        mention_id = mention.get("id")

        # Skip if it's our own tweet
        if not mention_id or not mention_text:
            continue

        reply_text = generate_reply_to_mention(mention_text)
        debug(f"[REPLY] To {mention_id}: {reply_text}")

        tweet_id = post_to_x(reply_text, reply_to=mention_id)
        if tweet_id:
            count += 1

        # Update last_reply_id to the most recent mention
        state["last_reply_id"] = mention_id

    if count > 0:
        save_state(state)

    return count


# =========================================================
# MILESTONE ALERTS
# =========================================================

def check_and_post_milestones(state: Dict) -> bool:
    """Check for price/holder milestones and post alerts."""
    if not AUTO_MILESTONE_ALERTS:
        return False

    price_data = fetch_price_data()
    if not price_data:
        return False

    posted = False
    current_price = price_data.get("price", 0)

    # Price milestones (log scale for micro-cap)
    if current_price > 0:
        last_announced = state.get("price_milestone_last_announced", 0.0)
        # Milestones: 0.0001, 0.0002, 0.0005, 0.001, etc.
        milestones = [0.0001, 0.0002, 0.0005, 0.001, 0.002, 0.005, 0.01]
        for milestone in milestones:
            if current_price >= milestone > last_announced:
                text = finalize_post_text(
                    f"$MAD just crossed ${milestone:.4f}. "
                    f"Not a target. A checkpoint. The build continues. Stay $MAD."
                )
                tweet_id = post_to_x(text)
                if tweet_id:
                    state["price_milestone_last_announced"] = milestone
                    save_state(state)
                    posted = True
                break

    return posted


# =========================================================
# ENGAGEMENT TRACKING
# =========================================================

def fetch_tweet_metrics(tweet_id: str) -> Optional[Dict]:
    """Fetch engagement metrics for a tweet."""
    if tweepy is None:
        return None
    try:
        client = build_twitter_client_v2()
        tweet = client.get_tweet(
            tweet_id,
            tweet_fields=["public_metrics", "created_at"]
        )
        if tweet and tweet.data:
            metrics = tweet.data.public_metrics
            return {
                "likes": metrics.get("like_count", 0),
                "retweets": metrics.get("retweet_count", 0),
                "replies": metrics.get("reply_count", 0),
                "impressions": metrics.get("impression_count", 0),
                "created_at": str(tweet.data.created_at),
            }
    except Exception as e:
        debug(f"[METRICS ERROR] {e}")
    return None


def update_engagement_tracking(state: Dict) -> None:
    """Update engagement data for recent tweets."""
    engagement = load_engagement()
    tweet_performance = engagement.get("tweet_performance", {})

    # Check last 20 posted items
    recent_texts = state.get("recent_generated_or_posted_texts", [])
    for text in recent_texts[-20:]:
        # We don't store tweet IDs alongside texts currently — this is a design gap
        # For now, just log template performance based on text hash
        pass

    save_engagement(engagement)


# =========================================================
# MAIN LOOP
# =========================================================

def main():
    print("[BOT] $MAD Supreme Bot starting...")
    print(f"[BOT] Modes: originals={AUTO_POST_ORIGINALS}, replies={AUTO_REPLY_MENTIONS}, "
          f"media={AUTO_POST_MEDIA}, threads={AUTO_POST_THREADS}, milestones={AUTO_MILESTONE_ALERTS}")
    print(f"[BOT] Dry run={AUTO_POST_DRY_RUN}, MAD AI mode={MAD_AI_MODE}")

    state = load_state()
    recent_texts: List[str] = state.get("recent_generated_or_posted_texts", [])
    recent_media: List[str] = state.get("recent_media_posted", [])

    last_reply_check = 0
    last_milestone_check = 0

    while True:
        try:
            loop_start = time.time()

            # --- Reply Mode: Check mentions every 5 minutes ---
            if AUTO_REPLY_MENTIONS and loop_start - last_reply_check >= REPLY_CHECK_INTERVAL_SECONDS:
                debug("[REPLY] Checking mentions...")
                reply_count = reply_to_mentions(state)
                if reply_count > 0:
                    print(f"[REPLY] Sent {reply_count} replies.")
                last_reply_check = loop_start
                state = load_state()  # reload in case replies updated state

            # --- Milestone Mode: Check periodically ---
            if AUTO_MILESTONE_ALERTS and loop_start - last_milestone_check >= 600:
                debug("[MILESTONE] Checking milestones...")
                if check_and_post_milestones(state):
                    print("[MILESTONE] Posted milestone alert.")
                last_milestone_check = loop_start
                state = load_state()

            # --- Broadcast Mode: Original posts ---
            if AUTO_POST_ORIGINALS:
                texts, media_paths, thread = generate_all_candidates(POST_CANDIDATE_COUNT)

                # Score regular posts
                base_scores = [simple_base_score(text) for text in texts]
                media_flags = [m is not None for m in media_paths]

                ranked = rerank_candidates_with_emotional_boosts(
                    candidates=texts,
                    base_scores=base_scores,
                    media_flags=media_flags,
                    recent_texts=recent_texts,
                )

                print(f"[QUEUE] generated_count={len(texts)}")
                for item in ranked:
                    print(item["log_line"])
                    print(item["match_log"])
                    print(f"[QUEUE CANDIDATE] {item['text']}")

                if ranked:
                    best = ranked[0]
                    final_text = best["text"]
                    final_score = best["total"]
                    best_media = None

                    # Find matching media
                    if best["is_media"]:
                        for t, m in zip(texts, media_paths):
                            if t == final_text:
                                best_media = m
                                break

                    print(f"[QUEUE] best_score={final_score:.2f}")
                    print(f"[QUEUE] best_text={final_text}")

                    if final_score >= AUTO_POST_MIN_SCORE:
                        tweet_id = post_to_x(final_text, media_path=best_media)

                        if tweet_id:
                            recent_texts.append(final_text)
                            recent_texts = recent_texts[-60:]
                            if best_media:
                                recent_media.append(best_media)
                                recent_media = recent_media[-20:]
                            state["recent_generated_or_posted_texts"] = recent_texts
                            state["recent_media_posted"] = recent_media
                            save_state(state)
                            print("[AUTO POST] Posted successfully.")
                        else:
                            if AUTO_POST_DRY_RUN:
                                print("[AUTO POST] Dry run only. Nothing was posted.")
                            else:
                                print("[AUTO POST] Failed to post.")
                    else:
                        print(f"[AUTO POST] Score {final_score:.2f} below threshold {AUTO_POST_MIN_SCORE}. Skipped.")

                # --- Thread Mode ---
                if thread and AUTO_POST_THREADS:
                    print(f"[THREAD] Generated thread of {len(thread)} tweets")
                    if not AUTO_POST_DRY_RUN:
                        thread_ids = post_thread_to_x(thread)
                        if thread_ids and thread_ids[0]:
                            recent_texts.extend(thread)
                            recent_texts = recent_texts[-60:]
                            state["recent_generated_or_posted_texts"] = recent_texts
                            state["posted_threads"].append({
                                "ids": thread_ids,
                                "texts": thread,
                                "posted_at": datetime.now().isoformat(),
                            })
                            save_state(state)
                            print("[THREAD] Posted successfully.")
                    else:
                        print("[THREAD] Dry run — not posted.")

            else:
                print("[AUTO POST] AUTO_POST_ORIGINALS disabled.")

            # --- Sleep ---
            print(f"[BOT] Sleeping {POST_INTERVAL_SECONDS}s...")
            time.sleep(POST_INTERVAL_SECONDS)

        except KeyboardInterrupt:
            print("\n[BOT] stopped by user.")
            break
        except Exception as e:
            print(f"[ERROR] {e}")
            time.sleep(60)


if __name__ == "__main__":
    main()

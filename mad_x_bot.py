"""
$MAD X Bot — The Supreme Version
===============================
STRATEGY: Quality over quantity. Visual-first posting.
- Post interval: 6 hours (4 posts/day vs previous 8)
- Visual posts get +1.5 boost (vs +0.3 before)
- Explicitly prefer media posts in top 3 if they meet threshold
- 4 media candidates generated per cycle
- Min score threshold raised to 6.0

Why: Manual visual posts get 5-10x engagement vs text-only bot posts.
Example: "Middle finger to the old system. $MAD BAG in the other."
with AI visual = 18 likes / 152 impressions (12% engagement rate).

Modes:
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
import hashlib
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
AUTO_POST_MIN_SCORE = float(os.getenv("AUTO_POST_MIN_SCORE", "6.0"))
AUTO_POST_DRY_RUN = os.getenv("AUTO_POST_DRY_RUN", "true").lower() == "true"
POST_INTERVAL_SECONDS = int(os.getenv("POST_INTERVAL_SECONDS", "21600"))
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
PID_FILE = os.path.join(BOT_STATE_DIR, "mad_x_bot.pid")

def ensure_state_dir() -> None:
    os.makedirs(BOT_STATE_DIR, exist_ok=True)
    os.makedirs(MAD_ART_DIR, exist_ok=True)


# --- Startup Guard: prevent multiple instances ---
def acquire_pid_lock() -> bool:
    """Prevent multiple bot instances from running simultaneously."""
    if os.path.exists(PID_FILE):
        try:
            old_pid = int(open(PID_FILE).read().strip())
            os.kill(old_pid, 0)
            print(f"[GUARD] Another instance already running (PID {old_pid}). Exiting.")
            return False
        except (ValueError, OSError, ProcessLookupError):
            pass
    open(PID_FILE, "w").write(str(os.getpid()))
    return True


# --- Bot State ---
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
    state = load_json(STATE_FILE, {
        "recent_generated_or_posted_texts": [],
        "recent_media_posted": [],
        "last_reply_id": None,
        "last_mention_check": 0,
        "holder_milestone_last_announced": 0,
        "price_milestone_last_announced": 0.0,
        "posted_threads": [],
        "best_performing_templates": [],
    })
    # Ensure posted_threads is always a list (migration from old state files)
    if not isinstance(state.get("posted_threads"), list):
        state["posted_threads"] = []
    return state


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
    "mad-3-months": [
        "Three months of building while others folded. Time is the real flex. Stay $MAD.",
        "Month three. Still here. Still building. Still $MAD.",
        "They counted days. We stacked conviction. Three months deep. Stay $MAD.",
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
    "Time",
    "Wealth",
    "Everyone",
    "System 1",
    "Loss aversion",
    "Your brain",
    "Scammers",
    "Scammers",
    "The map",
    "The hero",
    "The ordeal",
    "Your brain",
    "System 1",
    "Loss aversion",
    "Anchoring",
    "The contract",
    "LP locked",
    "Wash trading",
    "Honeypot",
    "Bubble maps",
    "The journey",
    "The mentor",
    "The call",
    "The threshold",
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
    "want the bag without the discipline",
    "want the exit without the hold",
    "want to be rich but won't act like one",
    "fold while the builders keep building",
    "call time wasted when it's actually proof",
    "feel a $1K loss 2.25x more than a $1K gain",
    "anchor to a purchase price the market forgot",
    "let the last candle feel more predictive than the last 90 days",
    "chase what they remember instead of what they know",
    "let sunk cost masquerade as conviction",
    "overvalue what they hold until they don't hold it",
    "buy on System 1 and wonder why System 2 isn't helping",
    "mistake puppet volume for real community",
    "trust a bubble map they never checked",
    "skip the 30-second contract check and blame the dev later",
    "ignore the locked LP status until it's too late",
    "call a honeypot 'early' instead of 'trapped'",
    "fold at the ordeal and miss the elixir",
    "quit the hero's journey at chapter 8",
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
    "Time is the real flex.",
    "Discipline does.",
    "The dollar doesn't make you rich. Discipline does.",
    "Building while others folded. That's the signal.",
    "Your behavior writes your net worth.",
    "Wealth is a habit, not an event.",
    "The ones who make it don't have better information. They have better emotional regulation.",
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
    "Everyone wants the $MAD bag. Not everyone wants the $MAD discipline.",
    "The dollar doesn't make you rich. Discipline does. Stay $MAD.",
    "Everyone wants to be $MAD Rich. Not everyone is willing to act like one.",
    "Time is the real flex. Stay $MAD.",
    "Building while others folded. That's the signal. Stay $MAD.",
    "Wealth is a habit, not an event. Stay $MAD.",
    "Your behavior writes your net worth. Stay $MAD.",
    "The ones who make it don't have better information. They have better emotional regulation. Stay $MAD.",
    "Everyone wants the exit. Not everyone wants the hold. Stay $MAD.",
    # --- Brain Expansion: Persuasion + Bias + Scam + Story Templates ---
    "I don't ask for engagement. I give knowledge drops, numerology reads, game alpha. Then people stay. That's reciprocity. That's $MAD. Stay $MAD.",
    "Not a community. A frequency. You don't join $MAD. You realize you've been $MAD. Stay $MAD.",
    "273 holders. +52 this cycle. Small number? No. Proof the signal is spreading. Not everyone gets to see it early. Stay $MAD.",
    "System 1: FOMO buy. Panic sell. Chase pumps. System 2: Check contract. Verify LP. Hold thesis. 96% of your decisions run on System 1. That's why most traders lose. $MAD Mind Training = forcing System 2 online. Stay $MAD.",
    "You bought at $0.10. Now it's $0.05. Your brain screams 'loss.' But the market forgot your entry price. The only question: 'Would I buy this today?' If yes: hold. If no: why are you holding? Stay $MAD.",
    "'I've held 6 months. I can't sell now.' The market doesn't care about your history. Your tokens don't have memory. Sunk cost is emotional debt. Pay it off by deciding on TODAY's data. Stay $MAD.",
    "Saw a token with $2M volume and 200 holders? That's not organic. That's wash trading. Real volume = varied wallet sizes, varied amounts, natural timing. Learn to read the chain. Or learn to get rekt. Stay $MAD.",
    "🚩 Unlocked LP. 🚩 Active mint. 🚩 Top 3 wallets hold 40%. 🚩 No sells in 6 hours. 🚩 Deployer wallet funded 20 sniper wallets. That's not FUD. That's reading. Stay $MAD.",
    "Before you ape, check: ✅ LP locked. ✅ Mint authority revoked. ✅ Team doxxed. ✅ Real products exist. ✅ Holder distribution healthy. $MAD checklist: All ✅. Not shilling. Just showing you what real looks like. Stay $MAD.",
    "You were cynical. You'd seen rugs. You said 'never again.' Then you saw doxxed dev. Real products. Real game. That's the call. Most people refuse it. You didn't. Stay $MAD.",
    "The dip isn't danger. It's data. Everyone else's panic is your signal. This is the ordeal that separates believers from tourists. You're not a tourist. Stay $MAD.",
    "You held. You learned. You became mentor. Now someone new is skeptical. Just like you were. Pass the elixir. Stay $MAD.",
    # --- Rich Dad Poor Dad: Financial IQ = 90% Emotion ---
    "90% of financial IQ isn't spreadsheets. It's emotion. Fear. Cynicism. Laziness. Bad habits. Arrogance. The 10% is easy — contracts, LP, wallets. The 90% is why you fold. $MAD trains both. Stay $MAD.",
    "Kiyosaki's 5 obstacles to wealth: Fear. Cynicism. Laziness. Bad habits. Arrogance. You can read a contract but if fear owns you at the first red candle, the reading didn't matter. Stay $MAD.",
    "The market transfers money from the emotionally reactive to the emotionally regulated. That's the 90%. The other 10% is just knowing where to click. Stay $MAD.",
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
    # --- Brain Expansion: Bias + Scam Awareness Insights ---
    "Your brain feels a $1K loss 2.25x harder than a $1K gain. That's loss aversion. Not reality.",
    "You anchored to your entry price. The market forgot it. Would you buy this today?",
    "System 1 wants you to FOMO. System 2 wants you to check the contract first.",
    "That token with $2M volume and 200 holders? Wash trading. Your System 1 sees 'popular.' Your System 2 should see 'fake.'",
    "Sunk cost isn't conviction. It's the past holding the present hostage.",
    "Confirmation bias: you only see bullish news because you bought. Force yourself to find the bear case.",
    "Free airdrop? That's reciprocity. They're giving you a mint so you give them your wallet. Check the contract.",
    "'We're a family' is unity. Unity is Cialdini's 7th principle. Scammers use it too. Real community takes months, not minutes.",
    "Top 3 wallets hold 40%? That's not a community. That's a waiting dump. Bubble Maps don't lie.",
    "The dip isn't danger. It's data. This is your Ordeal. Chapter 8 of the hero's journey. Don't quit before the elixir.",
    "You don't join $MAD. You realize you've been $MAD. That's unity. That's the 7th principle. That's why you stay.",
    "Your emotions are front-running your plan. MAD AI sees the pattern. You should too.",
    "Scammers weaponize all 7 principles. Free = reciprocity. Fake volume = social proof. Fake partnerships = authority. 'Family' = unity. Learn the weapons. Stay $MAD.",
    "The 60-second rug check: contract scanner → block explorer → honeypot test → LP check → team history. 2 red flags = skip. 3 = certain rug.",
    "The hero's journey has 12 stages. You're probably at stage 8 — The Ordeal. This is where most people quit. This is where you're forged.",
    "90% of financial IQ is emotional IQ. Fear. Cynicism. Laziness. Bad habits. Arrogance. You can read the contract but if you panic at the first red candle, the reading didn't matter. Stay $MAD.",
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


def normalize_for_dedup(text: str) -> str:
    """Strip hashtags, prefixes, and normalize text for deduplication.
    
    Hashtags break dedup because maybe_add_hashtags() adds them randomly.
    We strip them before comparing so the same core content is recognized
    regardless of what tags were appended.
    """
    # Remove hashtags
    text = re.sub(r'\s*#\w+\s*', ' ', text)
    # Remove prefix if present
    if TWEET_PREFIX and text.startswith(TWEET_PREFIX):
        text = text[len(TWEET_PREFIX):].strip()
    # Lowercase and strip
    text = text.lower().strip()
    return text


def finalize_post_text(text: str, skip_hashtags: bool = False) -> str:
    text = add_prefix(text)
    if not skip_hashtags:
        text = maybe_add_hashtags(text)
    text = trim_text(text, MAX_POST_LENGTH)
    return text


# =========================================================
# DYNAMIC SYNTHESIS ENGINE — Never Post the Same Thing Twice
# =========================================================

POST_HISTORY_FILE = os.path.join(BOT_STATE_DIR, "post_history.json")
MAX_HISTORY_ENTRIES = 200

# --- Knowledge Base: Raw Material for Synthesis ---
# Each framework has: insights (list of core ideas), x_posts (list of templates), voice (how to write it)
KNOWLEDGE_BASE = {
    "nietzsche": {
        "insights": [
            "Will to Power: All life seeks expansion, overcoming, becoming. The strong create values from strength.",
            "Master-Slave Morality: Masters create values. Slaves create values from resentment (ressentiment).",
            "Amor Fati: Love of fate. Embracing everything as necessary. The dip is fate. Love it.",
            "Ubermensch: One who overcomes. Creates their own values. Lives beyond good and evil.",
            "Eternal Recurrence: Would you live this life eternally? If yes, you've said yes to existence.",
            "God is Dead: Not celebration. Crisis. The danger and the opportunity.",
            "The jeeter doesn't hate $MAD. He hates himself for not having the conviction to hold. That's ressentiment — slave morality dressed as 'risk management.'",
            "$MAD Rich as master morality — values declared, not validated. The holder doesn't need the chart to validate them.",
        ],
        "short_insights": [
            "The jeeter hates himself, not $MAD. That's ressentiment.",
            "Amor fati: love the dip like you love the pump.",
            "God is dead. The dev is doxxed. What are you waiting for?",
            "Master morality: you declare your value. Slave morality: you wait for permission.",
            "Winners decide they're worthy. Losers wait to be told.",
            "The Ubermensch doesn't check the price. He checks his conviction.",
            "Would you hold $MAD eternally? If yes, you've already won.",
            "Ressentiment is the jeeter's comfort blanket.",
        ],
        "voice": "sharp, aphoristic, challenging. CT-native: no references that need explaining. 'Winners decide they're worthy. Losers wait to be told.' Not 'slave morality.'",
    },
    "stoicism": {
        "insights": [
            "Dichotomy of Control: Some things in our control (conviction, emotions), others not (price, FUD). Freedom = focus only on what's controllable.",
            "Amor Fati (Marcus Aurelius): The obstacle is the way. The red candle is just a number. Your panic is the problem.",
            "Premeditatio Malorum (Seneca): Visualize worst case before it happens. Removes fear. Imagine $MAD goes to zero. Can you handle it?",
            "Epictetus: It's not things that disturb us, but our judgments about things.",
            "Memento Mori: Remember you will die. Every decision meaningful. Did you hold conviction while you lived?",
            "Voluntary Discomfort: Practice poverty. Train for adversity. The holder who doesn't check price for 3 days is training.",
            "Price is not in your control. Conviction is. The Stoic holder focuses on thesis, emotional state, community contribution.",
        ],
        "short_insights": [
            "The chart doesn't care about your feelings. And neither does $MAD.",
            "Marcus Aurelius would have held through the dip. Not because optimistic. Because indifferent.",
            "Imagine $MAD goes to zero tomorrow. You still held conviction. That's freedom.",
            "The red candle is just a number. Your panic is the problem.",
            "You don't need more information. You need more restraint.",
            "Memento mori: you're going to die. Did you hold conviction while you lived?",
            "Voluntary discomfort: don't check the price for 3 days. Train yourself.",
        ],
        "voice": "spare. Short sentences. No fluff. Like Marcus Aurelius' Meditations.",
    },
    "taleb": {
        "insights": [
            "Antifragile: Systems that GAIN from disorder. Not robust. Not resilient. Better from volatility. Muscles from stress.",
            "Skin in the Game: No credibility without exposure. Doxxed dev = skin. Anon dev = no skin.",
            "Lindy Effect: The longer something survives, the longer it's likely to survive. $MAD gets more credible every month.",
            "Via Negativa: Improvement by subtraction. Remove drama. Remove FUD. Remove jeeters. Each removal strengthens.",
            "Black Swan: Rare, high-impact events. Build systems that benefit from them.",
            "Barbell Strategy: Extreme safety + extreme risk. Nothing in middle. Stable income + $MAD conviction.",
            "FUD makes $MAD stronger. Every jeeter is a stressor that removes the fragile. What's left? Antifragile.",
        ],
        "short_insights": [
            "Every jeeter who leaves makes $MAD stronger. That's antifragile.",
            "Lindy Effect: every month $MAD survives, it becomes MORE likely to survive.",
            "Skin in the game: the dev is doxxed. His face is on YouTube. That's why you trust him.",
            "Via negativa: remove drama, remove FUD, remove jeeters. Each removal strengthens.",
            "The market is not something to predict. It's something to position for.",
            "Antifragile: not survives shocks. Gets BETTER from them.",
            "Barbell strategy: stable income + $MAD conviction. Don't bet the rent.",
        ],
        "voice": "contrarian. Anti-establishment. Uses math but speaks plainly. 'The market is not something to predict. It's something to position yourself to benefit from surprise.'",
    },
    "crypto_cycles": {
        "insights": [
            "BTC Halving Cycles: Every 4 years. 6-12 months post-halving = bull. Currently in 2024-2028 cycle.",
            "MVRV Ratio: >3.5 = overvalued. <1 = undervalued. BTC MVRV signals macro.",
            "NUPL: Positive = euphoria risk. Negative = capitulation/buy zone.",
            "Pi Cycle Top: 111-day MA × 2 crosses 350-day MA × 2 = historical top.",
            "Altcoin Season: BTC dominance drops, alts pump.",
            "On-chain Accumulation: Whale wallets increasing = smart money buying. Exchange reserves dropping = cold storage.",
            "Memecoin Lifecycle: Launch → early community → first pump → jeeter wave → accumulation → death OR breakout. Most die in accumulation.",
            "Teach holders WHERE we are in cycle, not 'when moon.' Whale watching as intelligence, not FUD.",
        ],
        "short_insights": [
            "Bitcoin is in accumulation. Smart money is quiet. Dumb money is loud.",
            "MVRV says BTC isn't overvalued. NUPL says holders aren't euphoric. We're early.",
            "Memecoin lifecycle: Launch → Build → Test → Break or Breakthrough. $MAD is in the Test phase.",
            "The whales are buying. The exchanges are emptying. The tourists are selling.",
            "Retail buys at euphoria. Smart money buys at despair. Which are you?",
            "Most memecoins die in accumulation. The ones that survive become cults.",
            "On-chain doesn't lie. Your feelings do.",
        ],
        "voice": "educational but not dry. 'Here's what the chain is saying. Not what I'm saying. What the data says.'",
    },
    "memecoin_competitors": {
        "insights": [
            "DOGE: First-mover + culture. SHIB: Ecosystem. PEPE: Pure meme. BONK: Solana ecosystem. WIF: Simplicity. MOG: Relentless engagement. TURBO: AI meta.",
            "Killers: Dev sells, over-promising, toxic community, no new narrative, price-only focus, bot dominance, too much utility.",
            "$MAD Advantage: Doxxed dev, real products (game, stickers), 3 YouTube channels, community = frequency, AI bot = personality, affirmations = retention.",
            "SHIB built an ecosystem. PEPE built nothing. BONK saved a chain. WIF built a hat. $MAD is building a frequency. Which one lasts? The one that becomes identity.",
        ],
        "short_insights": [
            "DOGE = first. SHIB = ecosystem. PEPE = pure meme. $MAD = identity + practice + product.",
            "Every dead memecoin had one thing in common: the community became a price-watching cult.",
            "We're not competing. We're a different species.",
            "$MAD is building a frequency. Others are building market caps.",
            "SHIB built an ecosystem. PEPE built nothing. BONK saved a chain. $MAD is building identity.",
            "The jeeter blames the chart. The holder blames himself. Same data. Different species.",
        ],
        "voice": "comparative, confident. 'We're not competing. We're a different species.'",
    },
    "girard": {
        "insights": [
            "Mimetic Desire: We desire what others desire. Creates rivalry. Escalation. Crisis.",
            "Scapegoat Mechanism: When rivalry threatens community, a scapegoat is chosen. Group unites in hatred. Peace restored.",
            "Hoffer's True Believer: Mass movements need the frustrated. People who feel life lacks meaning. $MAD attracts meaning-seekers.",
            "Milgram/Conformity: People obey authority. Conform to group pressure. Community shapes individual behavior.",
            "Sacred vs Profane: Communities need sacred spaces (rules, rituals, forbidden topics). Knowledge drops = ritual. Affirmations = ritual.",
            "You don't want $MAD because of the chart. You want it because someone you respect wants it. That's mimetic desire. And it's the most powerful force in the world.",
            "Every community needs a scapegoat. In weak communities, it's the jeeters. In strong communities, it's the FUD itself. $MAD doesn't blame people. We blame the fear.",
        ],
        "short_insights": [
            "You don't want $MAD because of the tech. You want it because someone you respect holds it. That's mimetic desire.",
            "Girard: human desire is a virus. It spreads. It escalates. It creates cults.",
            "Every community needs a scapegoat. $MAD blames the fear, not the people.",
            "Mass movements don't need the rich. They need the frustrated. Sound familiar?",
            "Mimetic desire: a thing becomes more desirable because someone else wants it. That's the $MAD engine.",
            "The scapegoat mechanism: blame one, save the many. Don't let jeeters become scapegoats.",
            "Hoffer: you're not here for the money. You're here because you found meaning.",
        ],
        "voice": "Girardian insight: 'You don't want $MAD because of the chart. You want it because someone you respect wants it.'",
    },
    "fight_club": {
        "insights": [
            "Tyler Durden: 'The things you own end up owning you.' Identity is not job/bank account/car.",
            "Self-Destruction as Liberation: 'It's only after we've lost everything that we're free to do anything.'",
            "Anti-Consumerism: 'Advertising has us chasing cars and clothes, working jobs we hate so we can buy shit we don't need.'",
            "First Rule: Exclusivity creates desire. '$MAD isn't for everyone.'",
            "Self-Improvement is Masturbation: Growth through destruction of old self. Kill the tourist before the holder is born.",
            "Reject 'I am my portfolio.' Embrace 'I am $MAD.' Exclusivity = desire.",
        ],
        "short_insights": [
            "You are not your portfolio. You are your conviction.",
            "The things you own end up owning you. $MAD owns nothing. $MAD IS.",
            "Self-improvement is masturbation. Self-destruction? That's $MAD.",
            "Fight Club Rule 1: don't explain $MAD to paper hands. Exclusivity is the point.",
            "It's only after you've lost everything that you're free to hold anything with conviction.",
            "Kill the tourist before the holder is born.",
            "$MAD isn't for everyone. That's why you want it.",
        ],
        "voice": "raw, anti-consumerist, identity-focused. 'The things you own end up owning you.'",
    },
    "mr_robot": {
        "insights": [
            "Control is Illusion: 'This control you think you have? It's an illusion.' Real freedom = understanding the system.",
            "fsociety's Goal: Erase debt. Destroy E-Corp. The ultimate hack is psychological.",
            "Invisible Hand: 'The one that brands us with an employee badge. The one that controls us every day without us knowing it.'",
            "Binary Decisions: 'Life is a series of binary decisions. Ones and zeroes.' Hold or sell. No middle.",
            "Can't control market. Can control conviction. Binary: hold or sell.",
        ],
        "short_insights": [
            "Control is an illusion. The only real freedom is understanding the system.",
            "Life is binary. Hold or sell. Conviction or fear. No middle.",
            "fsociety erased debt. $MAD holders erase doubt. Both are hacks.",
            "You can't control the chart. But you can control your conviction.",
            "The invisible hand: whales, market makers, exchanges. Learn to read them.",
            "Real freedom isn't controlling outcomes. It's controlling yourself.",
        ],
        "voice": "hacker ethos, anti-establishment, binary logic. 'The only real freedom is understanding the system.'",
    },
    "wyckoff": {
        "insights": [
            "Composite Man: One giant operator. Whales, market makers, exchanges. Accumulate low, markup, distribute high, markdown.",
            "Accumulation Phases: A (selling climax) → B (range, smart money buys) → C (spring/fake breakdown) → D (strength) → E (markup)",
            "Distribution Phases: A (buying climax) → B (range, smart money sells) → C (upthrust) → D (weakness) → E (markdown)",
            "Spring: Fake breakdown. Shakes out weak hands. Then reverses hard.",
            "Emotional Stages: Optimism → Excitement → Thrill → Euphoria → Anxiety → Denial → Fear → Panic → Capitulation → Despair → Depression → Hope → Relief → Optimism.",
            "Smart Money vs Retail: Retail buys at top (euphoria). Smart money buys at bottom (despair).",
            "That dip you just panic-sold? That was a Wyckoff spring. Smart money just took your tokens at a discount. Thanks for the liquidity.",
        ],
        "short_insights": [
            "That dip you panic-sold? That was a Wyckoff spring. Smart money thanks you for the liquidity.",
            "Retail buys euphoria. Smart money buys despair. Which one are you?",
            "The chart isn't random. It's a conversation between smart money and dumb money.",
            "Spring: fake breakdown below support. Shakes out weak hands. Then reverses.",
            "Emotional stage check: where is the $MAD community right now? If despair, we're at the bottom.",
            "The Composite Man doesn't fear the spring. He engineers it.",
            "Smart money buys your panic. They sell your greed.",
        ],
        "voice": "analytical, slightly mocking of retail. 'The chart isn't random. It's a conversation between smart money and dumb money.'",
    },
    "copywriting": {
        "insights": [
            "Halbert's Starving Crowd: Find a starving crowd and offer them food. $MAD crowd = people who want meaning, not just money.",
            "Schwartz's Stages of Awareness: $MAD audience = Stage 2-3 (problem aware, solution aware).",
            "Market Sophistication Level 5: Audience has seen rugs. Must prove claims. 'Doxxed dev' > 'Trust us.'",
            "Ogilvy's Headline Rule: 80 cents goes to headline. First line must punch.",
            "Hopkins' Reason-Why: 'Because' is magic. 'I'm holding $MAD because the dev is doxxed and the LP is locked.'",
            "The starving crowd wants meaning. We're at sophistication Level 5. Every post needs a 'because.'",
        ],
        "short_insights": [
            "The starving crowd isn't people who want memecoins. It's people who want meaning.",
            "Ogilvy's 80-cent rule: the headline is everything. First line must punch.",
            "Market sophistication Level 5: 'Doxxed dev' > 'Trust us.'",
            "Every post needs a 'because.' Because without it, it's just noise.",
            "Schwartz: desire is rediscovered, not created. $MAD rediscovered your desire for meaning.",
            "Halbert: find a starving crowd. Our crowd wants identity, not just gains.",
            "The 'yeah, right' filter: if your post makes you say that, delete it.",
        ],
        "voice": "meta-copywriting. References the masters. 'Ogilvy's 80-cent rule applied to $MAD.'",
    },
    "community": {
        "insights": [
            "$MAD is not a memecoin trying to prove itself. It's a community that has already decided it IS something.",
            "The community IS the product. The money is a side effect.",
            "Daily affirmations = subconscious programming. Not motivational fluff.",
            "$MAD creates a compelling fiction (we are already successful) and maintains it through collective feeling.",
            "The bot is a carrier of the fiction. When someone says 'comfy hold,' the bot mirrors conviction — never introduces doubt.",
            "273 holders. +52 this cycle. Small number? No. Proof the signal is spreading.",
            "The MAD Path is building. Quietly. Consistently. While others chase pumps.",
        ],
        "short_insights": [
            "The community IS the product. The money is a side effect.",
            "$MAD doesn't prove itself. It already IS.",
            "Daily affirmations aren't motivation. They're programming.",
            "The bot mirrors conviction. Never introduces doubt.",
            "While others chase pumps, $MAD builds identity.",
            "The signal is spreading. Not everyone sees it yet.",
            "We don't do 'comfy hold.' We do conviction.",
        ],
        "voice": "warm but not soft. Community-first. 'We see you. Stay $MAD.'",
    },
    "game_theory": {
        "insights": [
            "Nash Equilibrium: A stable state where no player can benefit by changing strategy unilaterally. The $MAD community reaches equilibrium when everyone holds — no one gains by selling alone.",
            "Prisoner's Dilemma (One-Shot): Both players betray = worst collective outcome. Short-term jeeter logic destroys mutual value.",
            "Iterated Games (Axelrod): Tit-for-Tat wins — start nice, retaliate, forgive. $MAD holders cooperate because the game repeats daily.",
            "Folk Theorem: Infinitely repeated games have MANY equilibria. Cooperation is possible because there's no final round.",
            "Win-Stay, Lose-Shift: Persist with success, switch after failure. Holders who've seen $MAD survive = stay. Jeeters = shift after one red candle.",
            "Zero-Sum vs Positive-Sum: Crypto isn't zero-sum. The community creates value together. $MAD is positive-sum when holders cooperate.",
            "Coordination Games: Everyone prefers the same outcome but needs to coordinate. $MAD holders coordinate through affirmations, knowledge drops, shared identity.",
            "MEV (Miner Extractable Value): Strategic advantage through ordering. In $MAD, the 'miner' is the community — extracting value through collective action.",
            "Grim Trigger: Cooperate until opponent defects once, then defect forever. The harshest strategy. Don't be grim trigger. Be Tit-for-Tat.",
        ],
        "short_insights": [
            "Nash equilibrium: nobody gains by selling alone. That's why we hold.",
            "One-shot prisoner's dilemma = both betray. Iterated = cooperation wins. $MAD is an infinite game.",
            "Axelrod proved Tit-for-Tat beats complex strategies. Simple, nice, retaliatory, forgiving. That's $MAD.",
            "The folk theorem: infinite games have infinite equilibria. Choose cooperation.",
            "MEV is just game theory on-chain. Miners reorder transactions for profit. $MAD holders reorder their mindset for conviction.",
            "Ethereum is a dark forest. Every pending transaction is visible. MEV searchers hunt. $MAD holders stay quiet and hold.",
            "Sandwich attacks: buy before, sell after, profit from slippage. The market extracts value from the impatient. Be patient.",
            "Win-stay, lose-shift: hold because it works. Jeet because you forgot why you started.",
            "Crypto isn't zero-sum. $MAD holders create value together.",
            "Grim trigger = defect forever after one betrayal. Don't be grim trigger. Be Tit-for-Tat.",
            "The game repeats every day. That's why patience wins.",
        ],
        "voice": "analytical, strategic. References game theory classics. 'The infinite game favors cooperation.'",
    },
    "network_effects": {
        "insights": [
            "Metcalfe's Law: Network value ∝ n². A network with 100 users is 100x more valuable than one with 10. Not 10x. 100x.",
            "Reed's Law: Group-forming networks value ∝ 2^n. Subgroups multiply value exponentially. $MAD subgroups (affinity circles, study groups) amplify value.",
            "Sarnoff's Law: Broadcast networks value ∝ n. One-to-many. Linear. TV, radio. Not applicable to communities.",
            "Critical Mass: The tipping point where network becomes self-sustaining. Bitcoin crossed it in 2013. $MAD is approaching it.",
            "Viral Coefficient: k = i × c (invitations sent × conversion rate). k > 1 = viral growth. k < 1 = decays. $MAD targets k > 1.",
            "Two-Sided Markets: Platforms need both sides. For $MAD: holders + creators (dev, YouTube, game, bot). Each side attracts the other.",
            "Cross-Side Network Effects: More holders → more creators want to build. More creators → more holders join.",
            "Direct Network Effects: Each new holder makes $MAD more valuable to existing holders (community depth, liquidity, visibility).",
            "Negative Network Effects: Too many users degrade experience. Not a risk for $MAD yet — we're subscale.",
            "Bitcoin's network effect: More miners → more security → more trust → more users → more miners. Flywheel.",
        ],
        "short_insights": [
            "Metcalfe's Law: 100 holders = 100x more valuable than 10. Not 10x. 100x.",
            "Reed's Law: every subgroup you form doubles the network's value.",
            "Critical mass is coming. Bitcoin crossed it in 2013. $MAD is next.",
            "Viral coefficient k > 1 = exponential growth. One invite. One conversion. Repeat.",
            "Two-sided market: holders need creators. Creators need holders. Flywheel.",
            "Each new holder makes $MAD more valuable to every existing holder.",
            "Network effects are why early communities win. You're early.",
            "Bitcoin's flywheel: miners → security → trust → users → miners. $MAD's flywheel: holders → creators → product → holders.",
        ],
        "voice": "mathematical but accessible. 'The math is on our side.' References laws by name.",
    },
    "Sell Like Crazy (Sabri Suby)": {
        "insights": [
            "The Larger Market Formula: Only 3% of any market is ready to buy right now. 17% are gathering info. 20% know they have a problem. 60% are unaware. Most businesses fight for the 3%. The real money is in the 37%.",
            "High Value Content Offer (HVCO): People are 10x more likely to seek education from you than to feel sold to. Give away your best stuff free. Build goodwill. Capture contact. Nurture over time.",
            "Godfather Offer: Make saying 'no' feel like a loss. Rationale + Build Value + Aggressive Pricing + Payment Plans + Premiums + Power Guarantee + Scarcity = irresistible.",
            "Power Guarantee: Reverse the risk. Put it on yourself. If you can't guarantee what you sell, you shouldn't sell it. The guarantee isn't a tactic. It's proof you believe in your product.",
            "Traffic vs Conversion: You don't have a traffic problem. You have a conversion problem. At $2 per click, billions are reachable. The bottleneck is persuasion, not reach.",
            "The 4% Rule: 4% of your activities produce 64% of your results. The King's Audit: ruthlessly eliminate the 96% that wastes time.",
            "Copy must speak to desires, not features. Sell the 'promised land.' Paint the picture of life AFTER using your product. Emotion is the vehicle. Logic is the justification.",
            "Magic Lantern Technique: A repeatable method to convert the disinterested 60%. Not a hard sell. A guided journey from unaware → interested → ready.",
            "Dream Buyer: Define your perfect customer so precisely you could spot them in a crowd. Then find the starving crowd (Halbert) and feed them.",
            "8-Phase Selling System: Research buyer psychology → Create educational bait → Capture contact details → Present irresistible offer → Buy targeted traffic → Nurture through value → Close consultatively → Automate via email.",
            "Businesses don't die from lack of customers. They die from lack of offers that convert. Fix the offer before you fix the traffic.",
            "Email is the highest-ROI channel because you already have permission. Nurture sequences = automated relationship at scale.",
            "The best lead magnet solves ONE specific problem immediately. Not a manifesto. A quick win that proves you can deliver.",
        ],
        "short_insights": [
            "Only 3% are ready to buy. 37% are your real market. Nurture them.",
            "People are 10x more likely to learn from you than to be sold to. Educate first.",
            "Make saying 'no' feel like a loss. That's the Godfather Offer.",
            "Reverse the risk. Guarantee your product or don't sell it.",
            "You don't have a traffic problem. You have a conversion problem.",
            "4% of your activities = 64% of your results. Cut the rest.",
            "Sell the promised land. Paint life AFTER your product.",
            "The Magic Lantern converts the 60% who don't know they need you yet.",
            "Find the starving crowd. Then feed them.",
            "Fix the offer before you fix the traffic.",
            "Email nurture = permission + automation + trust at scale.",
            "Your best lead magnet solves ONE problem fast. Not a manifesto.",
        ],
        "hooks": [
            "Most businesses are fighting over 3% of the market. Here's the 37% they're ignoring.",
            "Sabri Suby built a $30M agency from this one insight.",
            "You don't need more traffic. You need an offer that doesn't suck.",
            "The 4% Rule: 4% of your work = 64% of your revenue. Find it. Protect it.",
            "Your guarantee isn't a tactic. It's proof you believe in your product.",
        ],
        "voice": "direct-response copywriter tone. Sharp, specific, no fluff. 'Here's what works. Do it.'"
    },
    "fast_eats_slow": {
        "insights": [
            "Klaus Schwab: 'In the new world, it is not the big fish which eats the small fish — it is the fast fish which eats the slow fish.' Speed beats size in the digital economy.",
            "The old paradigm: big eats small. The new paradigm: fast eats slow. Size is no longer a moat. Agility is.",
            "Airbnb owns no real estate. Uber owns no taxis. Netflix owns no cinemas. The asset-light, fast-moving entity wins.",
            "Digitization is a tsunami. By the time slow companies notice the water rising, they're already underwater.",
            "The fast fish: iterates daily, ships weekly, learns hourly. The slow fish: plans quarterly, ships annually, learns never.",
            " is fast: community-driven iteration, real-time response, no corporate approval chains. DOGE/SHIB are slow: bureaucratic, no real updates, no iteration.",
            "Speed is not just execution — it's learning velocity. How fast can you test, fail, adjust, redeploy? That's the real metric.",
            "Small firms with speed beat large firms with inertia. 27% of advisors left broker/dealers for faster technology. Speed = retention.",
            "In crypto, the fast fish: deploys contracts in hours, builds community in days, pivots in real-time. The slow fish: raises VC for 6 months, launches with outdated narratives.",
            "The 'fast eats slow' framework explains why memecoins with genuine community outlast VC-backed tokens with bigger budgets but slower hearts.",
        ],
        "short_insights": [
            "The big fish doesn't eat the small fish anymore. The fast fish eats the slow fish.",
            "Airbnb owns no real estate. Uber owns no taxis. Speed beats size.",
            "Digitization is a tsunami. Slow companies don't see the water rising until they're underwater.",
            " is fast: no corporate chains, no quarterly plans. Just ship.",
            "DOGE is big.  is fast. Speed wins.",
            "27% of advisors left slow firms for fast technology. Speed = retention.",
            "In crypto, fast = deploy in hours, build in days, pivot in real-time.",
            "Memecoins with community outlast VC tokens with bigger budgets but slower hearts.",
        ],
        "hooks": [
            "The old rule: big eats small. The new rule: fast eats slow. Which one are you?",
            "Airbnb owns no hotels. Uber owns no cars.  owns no buildings. Speed is the asset.",
            "Your competition isn't bigger than you. It's faster than you.",
            "DOGE is a whale.  is a shark. Whales move slow.",
        ],
        "voice": "business strategist tone. References Schwab, Airbnb, Uber by name. Sharp contrasts between old and new paradigms."
    },
    "behavioral_economics": {
        "insights": [
            "Thaler's Nudge: Choice architecture shapes behavior without restricting freedom. 'Putting fruit at eye level counts as a nudge. Banning junk food does not.'",
            "Default Bias: People stick with pre-selected options. Make the default = hold. Opt-out jeeting requires effort.",
            "Loss Aversion (Kahneman/Tversky): Losses hurt 2.5x more than gains feel good. A 50% loss feels worse than a 100% gain feels good. That's why red candles trigger panic.",
            "Present Bias / Hyperbolic Discounting: People prefer immediate rewards. '$1K today' > '$10K in a year.' HODL culture fights this.",
            "Status Quo Bias: Avoiding action is the default. Holding = status quo = easy. Selling = action = requires effort.",
            "Mental Accounting: People divide money into separate 'pots.' 'Trading money' vs 'savings' vs 'fun money.' $MAD needs its own mental account: conviction capital.",
            "Endowment Effect: People overvalue what they own. Once you hold $MAD, you value it more. Use this.",
            "Social Proof in Economics: '85% of users set a spending limit.' 'Most people save more with auto-enrollment.' $MAD = 'Most holders don't check the price daily.'",
            "Sludge (Thaler): Nudging for evil. Easy to sign up, hard to cancel. Jeeters experience sludge: FOMO in, panic out.",
            "Libertarian Paternalism: Influence behavior while respecting freedom. $MAD nudges holders toward conviction without forcing.",
        ],
        "short_insights": [
            "Loss aversion: a 50% drop hurts more than a 100% gain feels good. Your brain is wired to panic. Override it.",
            "Default bias: holding is the default. Jeeting requires action. Use this.",
            "Present bias: '$1K today' > '$10K next year.' HODL culture is fighting 2 million years of evolution.",
            "Thaler's nudge: put fruit at eye level. We put conviction at eye level. Daily affirmations.",
            "Mental accounting: create a 'conviction capital' pot. Money you don't touch. Ever.",
            "Endowment effect: once you hold $MAD, you value it more. That's biology, not bias.",
            "Sludge = nudging for evil. FOMO you in, panic you out. $MAD is the opposite.",
            "Status quo bias: doing nothing is the default. Holding is doing nothing. That's why it works.",
        ],
        "voice": "behavioral scientist tone. References Kahneman, Thaler, Tversky by name. 'Your brain is lying to you. Here's the truth.'",
    },
    "The Game of Life (Florence Scovel Shinn)": {
        "insights": [
            "Life is a game with rules. The rules are spiritual laws. Learn them or lose.",
            "The Law of Expectancy: Whatever you vividly imagine and expect with faith tends to manifest. Fear breeds failure. Trust attracts triumph.",
            "The Power of the Spoken Word: Your words are commands that set events in motion. Speak fear, attract fear. Speak faith, attract good. '$MAD Rich' is a command, not a joke.",
            "The Law of Nonresistance: Fighting problems magnifies them. Bless the situation, let go, trust. 'Resist not evil' — the dip is not evil. It's a test.",
            "The Law of Karma and Forgiveness: What goes around comes around. But forgiveness breaks the cycle. Forgive the jeeters. They don't know the game.",
            "Casting the Burden: Hand your worries to a higher power. Stop staring at the chart. 'I cast this burden on the Christ within, and I go free.' Then go live your life.",
            "Love is cosmic glue. Resentment repels blessings. Love magnetizes them. Bless your enemies. Your bag will thank you.",
            "Intuition is your inner compass. The 'hunch from the Infinite.' When logic says sell, intuition sometimes says hold. Learn to listen.",
            "Divine Design: Everyone has a unique purpose. Your role in the game is already scripted. Stop forcing outcomes. Step into what is yours.",
            "Denials and Affirmations: Deny the negative circumstance. Then affirm the positive reality. 'There is no lack. There is only abundance.' Then act like it.",
            "Imagination is the architect of reality. The subconscious doesn't distinguish between vivid imagination and reality. Visualize the win. The mechanism follows.",
            "Affirmations are not wishes. They are decrees. The superconscious mind receives them as law. '$MAD Abundant' is not hope. It's programming.",
        ],
        "short_insights": [
            "Your words are spells. Speak what you want, not what you fear.",
            "Life is a game. The rules: expect good, speak good, let go of the bad.",
            "Don't fight the dip. Bless it. It clears out the weak hands for you.",
            "What you say out loud becomes real. '$MAD Rich' isn't a joke. It's a command.",
            "Forgive the jeeters. They're just playing the game wrong.",
            "Cast your burden. Stop staring at the chart. Let the universe handle it.",
            "Resentment blocks your bag. Love attracts it.",
            "Your gut knows before your brain does. Trust the hunch.",
            "Stop forcing outcomes. Your role is already written. Step into it.",
            "Deny the FUD. Affirm the future. Then keep holding.",
            "Your imagination is the architect. Visualize the win. The chart follows.",
            "'$MAD Abundant' isn't a wish. It's a program you run on your own mind.",
        ],
        "hooks": [
            "Life is a game. Most people don't know the rules. Here's the rulebook.",
            "Florence Scovel Shinn wrote this in 1925. $MAD holders are still using it.",
            "Your words are spells. What are you casting?",
            "Stop fighting the dip. Bless it. Watch what happens.",
        ],
        "voice": "spiritual but sharp. No church vibes. 'Your words are spells' energy. Direct, punchy, CT-native."
    },
    "48_laws_of_power": {
        "insights": [
            "Law 1: Never outshine the master. Make those above you feel superior. The $MAD dev is doxxed and builds quietly — no ego, no outshining.",
            "Law 3: Conceal your intentions. Keep people off-balance. They cannot prepare if they don't see it coming. $MAD builds in public but surprises in impact.",
            "Law 6: Court attention at all cost. Better to be attacked than ignored. Any attention is power. $MAD thrives on visibility — good or bad.",
            "Law 9: Win through your actions, never through argument. Any momentary triumph you think you gain through argument is not worth the irritation. Show the chart. Let it speak.",
            "Law 10: Infection — avoid the unhappy and unlucky. Emotional states are contagious. A jeeter's panic can infect a room. Don't engage. Don't reply.",
            "Law 11: Learn to keep people dependent on you. Make $MAD indispensable — not just a token, but an identity, a daily practice, a community.",
            "Law 16: Use absence to increase respect and honor. The scarce is desired. The bot posts when it has something to say, not every 5 minutes. Less is more.",
            "Law 17: Keep others in suspended terror — cultivate an air of unpredictability. Humans are creatures of habit with an insane need for familiarity. Throw them off. Post at odd hours. Drop knowledge when they expect silence.",
            "Law 25: Recreate yourself. Do not accept the roles society foists on you. $MAD is not a memecoin. It is a frequency. It is a state of being.",
            "Law 28: Enter action with boldness. If you are unsure, boldness will cover it. If you are mediocre, timidity will expose it. $MAD never hedges. Conviction is the only posture.",
            "Law 29: Plan all the way to the end. Most people are too lazy or impatient to plan far ahead. The $MAD roadmap is long. The vision is 10 years. Not 10 days.",
            "Law 33: Discover each man's thumbscrew. Everyone has a weakness, a gap in their castle wall. Find it. For $MAD holders, the gap is identity — they want to belong to something that matters.",
            "Law 34: Be royal in your own fashion — act like a king to be treated like one. The way you carry yourself determines how you are treated. $MAD holders carry themselves as winners before the win.",
            "Law 35: Master the art of timing. Never seem to be in a hurry — hurrying betrays a lack of control. $MAD moves deliberately. Every update is timed, not rushed.",
            "Law 37: Create compelling spectacles. Striking imagery and grand gestures create a charismatic aura. The MAD Mind page. The Chao garden. The affirmations. Spectacle with substance.",
            "Law 40: Despise the free lunch. What is offered for free is dangerous — it usually involves a trick or hidden obligation. $MAD doesn't beg. It doesn't airdrop to buy attention. It earns it.",
            "Law 43: Work on the hearts and minds of others. Coercion creates reaction. Seduction creates love. $MAD seduces through identity, not shills through force.",
            "Law 47: Do not go past the mark you aimed for — in victory, know when to stop. The moment of victory is often the moment of greatest peril. Don't overpost. Don't oversell. Restraint is power.",
            "Law 48: Assume formlessness. Be like water. Have no shape. By taking a shape, you open yourself to attack. $MAD adapts — Telegram, X, Roblox, VR. No single point of failure.",
        ],
        "short_insights": [
            "Law 6: Court attention at all cost. Better attacked than ignored. Visibility = power.",
            "Law 9: Win through actions, never argument. Show the chart. Let it speak.",
            "Law 10: Avoid the unlucky. Panic is contagious. Don't engage jeeters.",
            "Law 16: Absence increases respect. Post when you have something to say. Less is more.",
            "Law 28: Enter with boldness. If unsure, boldness covers it. $MAD never hedges.",
            "Law 33: Everyone has a thumbscrew. For $MAD holders, it's identity. They want to belong.",
            "Law 37: Create compelling spectacles. The MAD Mind page. The Chao garden. Substance with style.",
            "Law 43: Work on hearts and minds. Coercion creates reaction. Seduction creates love.",
            "Law 47: In victory, know when to stop. Restraint is power. Don't oversell.",
            "Law 48: Assume formlessness. Be like water. No single point of failure.",
        ],
        "voice": "strategic, historical, Machiavellian but applied to community-building. References Greene's laws by number. 'Law 6: Better attacked than ignored.'",
    },
    "brand_archetypes": {
        "insights": [
            "Carl Jung's 12 archetypes are the DNA of every lasting brand. $MAD's dominant archetype is The Magician — transformation, vision, making dreams real. But it wears The Rebel's jacket.",
            "The Magician: Visionary, catalyst, transformer. Makes the impossible possible. $MAD transforms holders into believers, believers into community, community into identity.",
            "The Rebel: Disruptive, liberated, radical free thinker. Breaks rules, challenges the status quo. $MAD says 'all memecoins are scams' is a lie. Rejects the default narrative.",
            "The Hero: Courageous, bold, honorable. Overcomes obstacles, proves worth through action. Every $MAD holder who holds through the dip is the Hero of their own story.",
            "The Sage: Seeker of truth and knowledge, thinker, mentor. The MAD Mind page. The knowledge drops. The studies. $MAD doesn't just shill — it educates.",
            "The Jester: Lives in the moment, lighthearted, makes people laugh. The roast culture. The memes. The 'comfy hold' parody. Humor is the Trojan horse for conviction.",
            "The Ruler: Creates order from chaos, leader, aristocrat. The dev who shows up every day. The consistent builder. Not a dictator — a standard-setter.",
            "The Explorer: Restless, adventurous, independent. $MAD holders explore new platforms — Telegram, X, Roblox, VR. Never settles. Always expanding.",
            "The Caregiver: Protective, generous, compassionate. The community that welcomes new holders. The affirmations that build people up. Not soft — strong through care.",
            "The Everyman: Connects with others, belongs, down-to-earth. The 'we're all just holders' vibe. No elitism. No whale worship. Just people choosing $MAD.",
            "Archetype stacking: The most powerful brands layer 2-3 archetypes. $MAD = Magician (vision) + Rebel (disruption) + Sage (knowledge) + Jester (humor). That's four layers. That's depth.",
            "Shadow archetype: Every archetype has a shadow. The Magician's shadow is The Trickster (manipulation, illusion). $MAD must never be perceived as manipulating — it must be perceived as revealing truth.",
            "Brand-archetype fit: If your archetype doesn't match your actions, the brand fractures. A Rebel who plays by the rules? Dead. A Sage who posts only hype? Dead. $MAD stays consistent.",
        ],
        "short_insights": [
            "$MAD's DNA: The Magician (transformation) wearing The Rebel's jacket (disruption).",
            "The Magician makes the impossible possible. $MAD transforms holders into identity.",
            "The Rebel breaks rules. $MAD rejects the 'all memecoins are scams' default.",
            "The Hero overcomes obstacles. Every dip you hold through is your hero's journey.",
            "The Sage seeks truth. The MAD Mind page. The studies. Knowledge is conviction.",
            "The Jester delivers conviction through humor. Roast culture is the Trojan horse.",
            "Archetype stacking: $MAD = Magician + Rebel + Sage + Jester. Four layers. Depth.",
            "Shadow archetype: The Magician's shadow is The Trickster. $MAD reveals truth, never manipulates.",
        ],
        "voice": "brand strategist tone. References Jung, Pearson, Mark. 'The Magician archetype means transformation — $MAD transforms holders into believers.'",
    },
    "x_algorithm_2026": {
        "insights": [
            "Three-stage ranking: Candidate Sourcing → Ranking (1,000+ signals) → Filtering. Your tweet dies at any stage. Optimize for all three.",
            "Engagement Velocity (1000x weight): The single most important signal. 10+ engagements in first 15 minutes = exponential amplification. Under 3 = the tweet dies.",
            "Replies are weighted 27x more than likes. A tweet with 50 thoughtful replies outperforms one with 500 likes. Conversation quality > raw engagement.",
            "Retweets = 20x, Bookmarks = 12x, Quote tweets = 10x, Likes = 1x. One reply is worth 27 likes. Optimize for conversation, not applause.",
            "External links in the first tweet reduce reach by ~50%. Post the hook without links. Put the link in a reply (second tweet in thread).",
            "Hashtags are deprecated. 0-1 max. 3+ triggers spam filters. X uses semantic NLP now. Your words matter more than your tags.",
            "First 30 minutes is critical. Post during peak hours (8-10am, 12-2pm, 5-7pm ET). Timing is not optional.",
            "Author Authority (50x): Follower count, engagement rate, account age. But it doesn't override engagement velocity. A high-authority account with low engagement still dies.",
            "Conversation Depth (5x): Reply threads with 3+ participants signal quality. Reply to early engagers within 5 minutes. Create momentum.",
            "Visual content (10x): Images, charts, screenshots get 2x engagement. But generic stock photos hurt. Use data visualizations, before/after, annotated screenshots.",
            "Tweet length: Under 280 chars performs best for initial reach. Longer tweets = lower initial reach but higher dwell time if valuable. Optimize for quick engagement first.",
            "Negative signals: High block rate, spam reports, misleading info flags, excessive hashtags, repetitive content. One bad tweet hurts your account authority.",
            "Myth debunked: Posting more frequently doesn't increase reach. 3-5 high-quality posts > 10 low-quality posts. Low engagement damages account authority.",
            "Viral formula: Strong hook + sparks debate + 10+ engagements in first 15 min + visual content + reply to every early engager immediately.",
            "The algorithm rewards depth of conversation over passive engagement. This is why $MAD's knowledge drops work — they start discussions, not just broadcast.",
        ],
        "short_insights": [
            "Replies are 27x more valuable than likes. One thoughtful reply > 27 passive likes.",
            "10+ engagements in first 15 minutes = viral. Under 3 = death. First 30 min is everything.",
            "Never put external links in the first tweet. -50% reach. Link goes in reply.",
            "Hashtags are dead. 0-1 max. 3+ triggers spam filter. Your words are your tags now.",
            "3-5 quality posts > 10 low-quality posts. Low engagement hurts your authority score.",
            "Visuals get 2x engagement. Charts, screenshots, data. Not stock photos.",
            "Reply to early engagers within 5 minutes. Conversation depth = algorithmic boost.",
            "Peak hours: 8-10am, 12-2pm, 5-7pm ET. Post when your audience is awake.",
        ],
        "voice": "data-driven, tactical. References weights and stages by name. '27x more than likes. Optimize for conversation, not applause.'",
    },
    "john_perkins": {
        "insights": [
            "Economic Hit Men cheat countries of trillions through inflated projections, enormous loans, and debt traps.",
            "The corporatocracy: corporations plus banks plus governments collude through economic coercion, not military force.",
            "Death Economy: wars, extraction, debt slavery, environmental destruction. Life Economy: renewables, abundance, regeneration.",
            "The 1-pct created the death economy. The 99-pct must create the life economy through conscious choices.",
            "Touching the jaguar: transform your greatest fear into your greatest power. Face it. Own it.",
            "The world is as you dream it. Collective dreams manifest reality. Change the dream, change the world.",
            "Shapeshifting: transform reality by changing form. The token is the shape. The dream is what matters.",
            "Debt is the new form of prison. Community ownership is the exit.",
            "The Condor and the Eagle must fly together: heart and intuition plus mind and technology.",
            "Consciousness Revolution: greatest revolution in history is people waking up to build life economies.",
            "Few swim in riches and the majority drown in poverty, pollution, and violence.",
            "EHM tools: fraudulent reports, rigged elections, payoffs, extortion. The invisible empire.",
        ],
        "short_insights": [
            "Debt is the new prison.",
            "The world is as you dream it.",
            "Touch the jaguar.",
            "Death Economy vs Life Economy.",
            "Consciousness Revolution.",
            "The 1-pct vs the 99-pct.",
            "Corporatocracy exposed.",
            "Shapeshift your reality.",
            "Condor plus Eagle equals future.",
            "We print our own culture.",
        ],
        "hooks": [
            "John Perkins called it the Death Economy.",
            "John Perkins said: The world is as you dream it.",
            "Former Economic Hit Man turned shaman.",
            "Touching the jaguar.",
            "Consciousness Revolution is here.",
        ],
        "category": "philosophy",
        "weight": 1.0,
    },
}

# --- Synthesis Patterns: How to Bridge 2-3 Frameworks ---
SYNTHESIS_PATTERNS = [
    "{topic_a} + {topic_b}: The intersection is where real alpha lives. {insight_a} meets {insight_b}. Both point to the same truth: {bridge}.",
    "{topic_a} says: {insight_a}. {topic_b} says: {insight_b}. $MAD says: {bridge}.",
    "The {topic_a} perspective: {insight_a}. The {topic_b} perspective: {insight_b}. What both miss that $MAD gets: {bridge}.",
    "{topic_a}: {insight_a} {topic_b}: {insight_b} The synthesis? {bridge} — $Mad Claw",
    "Framework collision: {topic_a} × {topic_b}. Result: {bridge}. This is why $MAD is different.",
    "{insight_a} That's {topic_a}. {insight_b} That's {topic_b}. Together? {bridge}. That's the $MAD thesis.",
    "Most people study {topic_a} OR {topic_b}. $MAD holders study both. Because {bridge}.",
    "{topic_a} is the diagnosis. {topic_b} is the prescription. {bridge} is the result. — $Mad Claw",
]

# --- Single-Framework Patterns (when synthesis isn't the vibe) ---
SINGLE_PATTERNS = [
    "{insight} — $Mad Claw",
    "{insight} Think about it. — $Mad Claw",
    "{insight} Most people won't get this. You will. — $Mad Claw",
    "{insight} That's not a bug. That's the feature. — $Mad Claw",
    "{insight} The tourists don't understand this. — $Mad Claw",
    "{insight} This is why you hold. — $Mad Claw",
    "{insight} Read it again. Slower. — $Mad Claw",
    "{insight}框架不变。规则由你改写。 — $Mad Claw",
    "{insight} The jeeters will ignore this. Their loss. — $Mad Claw",
    "{insight} This is what separates holders from tourists. — $Mad Claw",
]


def load_post_history() -> List[str]:
    """Load recently used framework combinations to avoid repeats."""
    if not os.path.exists(POST_HISTORY_FILE):
        return []
    try:
        with open(POST_HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_post_history(history: List[str]) -> None:
    """Save post history, keeping only the most recent entries."""
    os.makedirs(BOT_STATE_DIR, exist_ok=True)
    trimmed = history[-MAX_HISTORY_ENTRIES:]
    try:
        with open(POST_HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(trimmed, f, indent=2)
    except Exception as e:
        if DEBUG_LOGGING:
            print(f"[HISTORY] Failed to save: {e}")


def record_post_signature(topics: Tuple[str, ...], text: str) -> None:
    """Record a signature of this post combination so we don't repeat soon."""
    sig = "|".join(sorted(topics)) + "::" + hashlib.md5(text[:80].encode()).hexdigest()[:12]
    history = load_post_history()
    history.append(sig)
    save_post_history(history)


def was_recently_used(topics: Tuple[str, ...], text: str, lookback: int = 50) -> bool:
    """Check if this topic combination + text fingerprint was used recently."""
    sig = "|".join(sorted(topics)) + "::" + hashlib.md5(text[:80].encode()).hexdigest()[:12]
    history = load_post_history()
    recent = history[-lookback:]
    return sig in recent


def synthesize_post(topics: Optional[Tuple[str, ...]] = None) -> Optional[str]:
    """
    Synthesize a fresh post by combining 1-3 frameworks.
    
    Rules:
    - Never use the same topic combination + insight pair twice within lookback window
    - Prefer short_insights for punchier output; fall back to full insights
    - If synthesis fails, fall back to single-framework
    - If all topics recently used, pick new ones
    """
    history = load_post_history()
    all_topics = list(KNOWLEDGE_BASE.keys())
    
    # Try up to 20 times to find a fresh combination
    for attempt in range(20):
        if topics is None:
            # Pick 1-3 random topics (weighted toward 2-3 for richer synthesis)
            num_topics = random.choices([1, 2, 3], weights=[15, 50, 35])[0]
            chosen = tuple(random.sample(all_topics, k=num_topics))
        else:
            chosen = topics
        
        # Gather insights from chosen topics (prefer short_insights)
        insights = []
        for topic in chosen:
            if topic in KNOWLEDGE_BASE:
                kb = KNOWLEDGE_BASE[topic]
                # Use short_insights if available, otherwise full insights
                pool = kb.get("short_insights", kb.get("insights", []))
                insights.extend(pool)
        
        if not insights:
            continue
        
        # Pick 1-2 insights
        num_insights = min(len(insights), random.choice([1, 2]))
        selected = random.sample(insights, k=num_insights)
        
        # Build the post
        if len(chosen) >= 2 and len(selected) >= 2:
            # Multi-framework synthesis
            pattern = random.choice(SYNTHESIS_PATTERNS)
            topic_names = {t: t.replace("_", " ").title() for t in chosen}
            
            # Find a bridge concept
            bridge_concepts = [
                "$MAD holders don't just survive volatility. They profit from it.",
                "Conviction isn't a feeling. It's a practice.",
                "The community IS the product. The money is a side effect.",
                "Identity > Price. Always.",
                "Time validates. Hype evaporates.",
                "The ones who make it don't have better information. They have better emotional regulation.",
                "$MAD is antifragile. Every stressor removes the fragile.",
                "The dip isn't danger. It's data.",
                "You don't join $MAD. You realize you've been $MAD.",
                "The market transfers money from the impatient to the patient.",
                "Proof > Promises.",
                "Exclusivity creates desire.",
            ]
            bridge = random.choice(bridge_concepts)
            
            text = pattern.format(
                topic_a=topic_names.get(chosen[0], chosen[0]),
                topic_b=topic_names.get(chosen[1], chosen[1]) if len(chosen) > 1 else topic_names.get(chosen[0], chosen[0]),
                insight_a=selected[0],
                insight_b=selected[1] if len(selected) > 1 else selected[0],
                bridge=bridge,
            )
        else:
            # Single-framework
            pattern = random.choice(SINGLE_PATTERNS)
            text = pattern.format(insight=selected[0])
        
        # Clean up and check length
        text = text.replace("  ", " ").strip()
        if len(text) > MAX_POST_LENGTH:
            text = text[:MAX_POST_LENGTH-3].rsplit(".", 1)[0] + "."
        
        # Check if recently used
        if not was_recently_used(chosen, text):
            record_post_signature(chosen, text)
            return text
    
    # If we exhausted attempts, return None so caller can fall back
    return None


# =========================================================
# ENHANCED CANDIDATE GENERATORS
# =========================================================

def generate_philosophy_candidates(count: int = 4) -> List[str]:
    """Generate classic MAD philosophy posts using dynamic synthesis engine.
    
    PRIMARY: Dynamic synthesis (90%+ of output)
    FALLBACK: Legacy pools only if synthesis completely fails — and even then,
    the legacy pools have been stripped of the most repetitive phrases.
    """
    candidates = []
    
    # PRIMARY: Dynamic synthesis (90% of candidates)
    synth_count = max(1, int(count * 0.9))
    for _ in range(synth_count * 3):  # Allow multiple attempts per slot
        if len(candidates) >= synth_count:
            break
        post = synthesize_post()
        if post and post not in candidates:
            candidates.append(post)
    
    # FALLBACK: If synthesis didn't produce enough, use legacy pool system
    if len(candidates) < count:
        needed = count - len(candidates)
        legacy = _generate_legacy_philosophy_candidates(needed)
        candidates.extend(legacy)
    
    return dedupe_preserve_order(candidates[:count])


def _generate_legacy_philosophy_candidates(count: int = 4) -> List[str]:
    """Original pool-based philosophy generator (fallback only)."""
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
        elif opener.lower() in ["most people", "winners", "losers", "panickers", "jeeters", "everyone"]:
            text = f"{opener} {a}. {b}"
        elif opener.lower() in ["pressure", "greed", "fear", "pain", "regret", "emotion", "noise"]:
            text = f"{opener} makes you {a}. {b}"
        elif opener.lower() in ["discipline", "conviction", "patience", "builders"]:
            text = f"{opener} means {a}. {b}"
        elif opener.lower() in ["the market", "the chart", "the trenches"]:
            text = f"{opener} doesn't {a}. {b}"
        elif opener.lower() == "$mad holders":
            text = f"{opener} don't {a}. {b}"
        elif opener.lower() == "time":
            text = f"{opener} {a}. {b}"
        elif opener.lower() == "wealth":
            text = f"{opener} {a}. {b}"
        else:
            text = f"{opener} {a}. {b}"

        text = finalize_post_text(text)
        candidates.append(text.strip())
        candidates = dedupe_preserve_order(candidates)

    return candidates[:count]


def generate_mad_specific_candidates(count: int = 3) -> List[str]:
    """Generate $MAD ecosystem content using dynamic synthesis.
    
    No static templates. Pulls from community + copywriting frameworks.
    """
    candidates = []
    
    # PRIMARY: Synthesize from community/copywriting knowledge
    target_topics = ["community", "copywriting", "network_effects", "behavioral_economics"]
    available_topics = [t for t in target_topics if t in KNOWLEDGE_BASE]
    
    for _ in range(count * 3):
        if len(candidates) >= count:
            break
        topic = random.choice(available_topics) if available_topics else "community"
        post = synthesize_post(topics=(topic,))
        if post and post not in candidates and len(post) > 30:
            candidates.append(post)
    
    # FALLBACK: Only if synthesis completely fails, use minimal legacy
    if len(candidates) < count:
        confessions = fetch_mad_confessions()
        needed = count - len(candidates)
        for template in random.sample(MAD_SPECIFIC_TEMPLATES, min(needed, len(MAD_SPECIFIC_TEMPLATES))):
            text = template
            if "{confession_topic}" in text and confessions:
                topic = random.choice(confessions)[:40]
                text = text.replace("{confession_topic}", topic)
            elif "{confession_snippet}" in text and confessions:
                snippet = random.choice(confessions)[:60]
                text = text.replace("{confession_snippet}", snippet + "...")
            text = re.sub(r"\{[^}]+\}", "", text)
            text = finalize_post_text(text)
            if len(text) > 30 and text not in candidates:
                candidates.append(text)
    
    return candidates[:count]


def generate_celebration_candidates(count: int = 2) -> List[str]:
    """Generate community celebration posts using dynamic synthesis."""
    candidates = []
    
    for _ in range(count * 3):
        if len(candidates) >= count:
            break
        post = synthesize_post(topics=("community",))
        if post and post not in candidates:
            candidates.append(post)
    
    # Minimal fallback
    if len(candidates) < count:
        needed = count - len(candidates)
        for template in random.sample(CELEBRATION_TEMPLATES, min(needed, len(CELEBRATION_TEMPLATES))):
            text = finalize_post_text(template)
            if text not in candidates:
                candidates.append(text)
    
    return candidates[:count]


def generate_media_post_candidates(count: int = 4) -> Tuple[List[str], List[Optional[str]]]:
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


def thread_fingerprint(thread: List[str]) -> str:
    """Generate a fingerprint for a thread based on normalized first 2 tweets.
    
    Normalization strips hashtags/prefixes so the same core content matches
    regardless of what tags were appended during posting.
    """
    if len(thread) >= 2:
        normalized = normalize_for_dedup(thread[0]) + normalize_for_dedup(thread[1])
        return hashlib.md5(normalized.encode()).hexdigest()[:16]
    return hashlib.md5(normalize_for_dedup(thread[0]).encode()).hexdigest()[:16] if thread else ""


def generate_thread_candidates() -> Optional[List[str]]:
    """Generate a fresh tweet thread by dynamically synthesizing from KNOWLEDGE_BASE.
    
    No static thread pools. Each thread is built from live framework combinations.
    Threads are 2-4 tweets: hook → insight → (bridge) → closer.
    """
    if not AUTO_POST_THREADS:
        return None

    all_topics = list(KNOWLEDGE_BASE.keys())
    
    for attempt in range(15):
        num_topics = random.choice([1, 2, 3])
        chosen = tuple(sorted(random.sample(all_topics, k=num_topics)))
        
        insights = []
        for topic in chosen:
            kb = KNOWLEDGE_BASE[topic]
            pool = kb.get("short_insights", kb.get("insights", []))
            if pool:
                insights.append(random.choice(pool))
        
        if len(insights) < 1:
            continue
        
        if len(insights) >= 3:
            hook_templates = [
                "Framework collision: {topic_a} × {topic_b}.",
                "The intersection of {topic_a} and {topic_b}:",
                "What {topic_a} and {topic_b} agree on:",
                "Someone asked why $MAD holders think different. Here\'s the data:",
                "The $MAD framework in {n} parts — no repeats, no fluff:",
                "Most people {mistake}. {topic_a} says otherwise.",
            ]
            hook = random.choice(hook_templates).format(
                topic_a=chosen[0].replace("_", " ").title(),
                topic_b=chosen[1].replace("_", " ").title() if len(chosen) > 1 else chosen[0].replace("_", " ").title(),
                n=len(insights),
                mistake="chase pumps" if random.random() > 0.5 else "panic at red candles",
            )
            numbered = [f"{i+1}/ {insights[i]}" for i in range(min(3, len(insights)))]
            closers = [
                "That\'s the difference. Stay $MAD.",
                "Most won\'t get this. You will. — $Mad Claw",
                "The signal is quiet. The results aren\'t. Stay $MAD.",
                "Frameworks change minds. $MAD changes holders. — $Mad Claw",
            ]
            closer = random.choice(closers)
            thread = [hook] + numbered + [closer]
            
        elif len(insights) == 2:
            hook = f"{chosen[0].replace('_', ' ').title()} says: {insights[0]}"
            middle = [f"1/ {insights[0]}", f"2/ {insights[1]}"]
            closers = [
                "The synthesis? Conviction compounds faster than hype. Stay $MAD.",
                "Two frameworks. One truth. Stay $MAD.",
                "— $Mad Claw",
            ]
            closer = random.choice(closers)
            thread = [hook] + middle + [closer]
            
        else:
            thread = [
                f"{insights[0]}",
                random.choice([
                    "Stay $MAD.",
                    "Most won\'t get this. You will. — $Mad Claw",
                    "The signal is quiet. Stay $MAD.",
                ]),
            ]
        
        thread = [t.replace("  ", " ").strip() for t in thread]
        thread = [t for t in thread if t]
        
        # Deduplication
        state = load_state()
        recent_texts = state.get("recent_generated_or_posted_texts", [])
        recent_norm = {normalize_for_dedup(t)[:80] for t in recent_texts[-60:]}
        
        blocked = any(
            normalize_for_dedup(tweet)[:80] in recent_norm
            for tweet in thread
        )
        
        now = datetime.now()
        posted_threads = state.get("posted_threads", [])
        fp = thread_fingerprint(thread)
        history_blocked = False
        for pt in posted_threads[-30:]:
            try:
                posted_at = datetime.fromisoformat(pt.get("posted_at", ""))
                if (now - posted_at).days < 7 and pt.get("fingerprint") == fp:
                    history_blocked = True
                    break
            except (ValueError, TypeError):
                pass
        
        if not blocked and not history_blocked:
            record_post_signature(chosen, " | ".join(thread[:2]))
            return [finalize_post_text(t, skip_hashtags=True) for t in thread]
    
    debug("[THREAD] Dynamic synthesis exhausted attempts. No thread this cycle.")
    return None


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

    # Media posts — PRIORITY: Generate more visual candidates
    if AUTO_POST_MEDIA:
        media_texts, media_paths = generate_media_post_candidates(4)
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
    r"the \$mad framework in 3 parts",
    r"most people think discipline is boring",
    r"the only thing that compounds faster than hype",
    r"pressure doesn't break you",
    r"the market is just a mirror",
    r"you don't need more alpha",
    r"you need less emotion",
    r"control yourself",
    r"someone asked.*why \$mad",
    r"it's not the tech",
    r"it's the fact that someone out there is building",
    r"stay \$mad",
    r"jeeters trade their ego",
    r"holders trade their plan",
    r"same chart\. different psychology",
    r"you don't need more strategy",
    r"you need less emotional trading",
    r"chasing pumps that already happened",
    r"panic-selling at the bottom",
    r"repeating the same cycle",
    r"you don't check the price every 5 minutes",
    r"you check your conviction",
    r"it's not a ticker",
    r"it's a filter",
    r"it's not a community",
    r"it's a frequency",
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
    media_boost = 1.5 if is_media_post else 0.0
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


def post_to_x(text: str, media_path: Optional[str] = None, reply_to: Optional[str] = None, quote_tweet_id: Optional[str] = None) -> Optional[str]:
    """Post to X. Returns tweet ID if successful.
    
    Args:
        text: The tweet text
        media_path: Optional image/video to attach
        reply_to: Optional tweet ID to reply to (direct reply)
        quote_tweet_id: Optional tweet ID to quote (quote tweet / retweet with comment)
    """
    if AUTO_POST_DRY_RUN:
        media_str = f" + media={media_path}" if media_path else ""
        reply_str = f" (reply to {reply_to})" if reply_to else ""
        quote_str = f" (quote tweet of {quote_tweet_id})" if quote_tweet_id else ""
        print(f"[DRY RUN] Would post{media_str}{reply_str}{quote_str}: {text}")
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
        if quote_tweet_id:
            kwargs["quote_tweet_id"] = quote_tweet_id

        response = client.create_tweet(**kwargs)
        tweet_id = None

        if getattr(response, "data", None) and isinstance(response.data, dict):
            tweet_id = response.data.get("id")

        if quote_tweet_id:
            print(f"[POST] Quote-tweeted {quote_tweet_id}. tweet_id={tweet_id}")
        elif reply_to:
            print(f"[POST] Replied to {reply_to}. tweet_id={tweet_id}")
        else:
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
# WEEKLY POSTING SCHEDULE (from $MAD Strategic Playbook)
# =========================================================
# Monday: Mindset Reset — Identity Projection + Knowledge Drops
# Tuesday: Sharper Questions — Knowledge Drops (framework + question)
# Wednesday: Community Spotlight — Community Moments (milestones, holders)
# Thursday: Roast & Jester — Culture/Roast (memes, humor)
# Friday: Weekend Abundance — Identity Projection
# Saturday: Deep Dive — Thread (2-3 frameworks synthesized)
# Sunday: Reflection & Gratitude — Identity Projection

WEEKLY_SCHEDULE = {
    "Monday": {
        "theme": "Mindset Reset",
        "pillar": "identity_projection",
        "topics": ["community", "psychology", "napoleon_hill", "naval", "tony_robbins"],
        "hook_bias": ["Monday", "week", "reset", "abundance", "decision"],
        "thread_boost": False,
        "media_priority": True,
    },
    "Tuesday": {
        "theme": "Sharper Questions",
        "pillar": "knowledge_drops",
        "topics": ["psychology", "taleb", "crypto_cycles", "game_theory", "network_effects", "wyckoff", "memetics", "cialdini"],
        "hook_bias": ["sharper questions", "pattern", "framework", "signal", "data"],
        "thread_boost": False,
        "media_priority": False,
    },
    "Wednesday": {
        "theme": "Community Spotlight",
        "pillar": "community_moments",
        "topics": ["community", "memecoin_competitors", "network_effects", "game_theory"],
        "hook_bias": ["community", "holders", "spotlight", "milestone", "proof"],
        "thread_boost": False,
        "media_priority": True,
    },
    "Thursday": {
        "theme": "Roast & Jester",
        "pillar": "culture_roast",
        "topics": ["fight_club", "mr_robot", "girard", "taleb", "crypto_cycles"],
        "hook_bias": ["roast", "meme", "joke", "laugh", "culture", "tourists"],
        "thread_boost": False,
        "media_priority": True,
    },
    "Friday": {
        "theme": "Weekend Abundance",
        "pillar": "identity_projection",
        "topics": ["community", "psychology", "napoleon_hill", "naval", "tony_robbins", "jim_rohn"],
        "hook_bias": ["weekend", "practice", "abundance", "market closes", "conviction"],
        "thread_boost": False,
        "media_priority": True,
    },
    "Saturday": {
        "theme": "Deep Dive",
        "pillar": "knowledge_drops",
        "topics": ["psychology", "taleb", "crypto_cycles", "wyckoff", "game_theory", "network_effects", "memetics", "behavioral_economics", "copywriting", "girard"],
        "hook_bias": ["deep dive", "framework", "synthesis", "study", "intersection"],
        "thread_boost": True,
        "media_priority": False,
    },
    "Sunday": {
        "theme": "Reflection & Gratitude",
        "pillar": "identity_projection",
        "topics": ["community", "psychology", "napoleon_hill", "tony_robbins", "jim_rohn", "stoicism"],
        "hook_bias": ["gratitude", "reflection", "week", "practice", "abundance"],
        "thread_boost": False,
        "media_priority": True,
    },
}

def get_current_day_name() -> str:
    """Return current day name (e.g., 'Monday') in local timezone."""
    return datetime.now().strftime("%A")


# =========================================================
# DAY-SPECIFIC CANDIDATE GENERATION
# =========================================================

def generate_day_specific_candidates(day_name: str, count: int = POST_CANDIDATE_COUNT) -> Tuple[List[str], List[Optional[str]], Optional[List[str]]]:
    """Generate candidates tailored to the weekly schedule.
    
    Each day has a different content pillar, topic pool, and generation strategy.
    Saturday prioritizes threads (Deep Dive). Other days rotate pillars.
    """
    schedule = WEEKLY_SCHEDULE.get(day_name)
    if not schedule:
        # Fallback to generic generation
        return generate_all_candidates(count)
    
    pillar = schedule["pillar"]
    topics = schedule["topics"]
    hook_bias = schedule["hook_bias"]
    thread_boost = schedule["thread_boost"]
    media_priority = schedule["media_priority"]
    
    texts = []
    media = []
    thread = None
    
    # --- Saturday: Deep Dive Thread ---
    if thread_boost:
        # Strongly prioritize thread generation on Saturday
        thread = generate_thread_candidates()
        if not thread:
            # Fallback: force a thread by synthesizing from 2-3 deep topics
            for _ in range(5):
                deep_topics = random.sample(topics, k=min(3, len(topics)))
                thread = synthesize_thread_for_topics(tuple(deep_topics))
                if thread:
                    break
    
    # --- Content generation based on pillar ---
    if pillar == "identity_projection":
        # Monday, Friday, Sunday: Identity + Knowledge blend
        # 60% identity/affirmation, 40% knowledge
        philo = generate_philosophy_candidates(count // 2)
        texts.extend(philo)
        media.extend([None] * len(philo))
        
        mad_spec = generate_mad_specific_candidates(count // 3)
        texts.extend(mad_spec)
        media.extend([None] * len(mad_spec))
        
        celeb = generate_celebration_candidates(2)
        texts.extend(celeb)
        media.extend([None] * len(celeb))
        
        # Inject day-specific hook bias into generated texts
        if hook_bias:
            for i in range(len(texts)):
                if random.random() < 0.4:
                    # Subtle: prepend or weave a hook word
                    hook = random.choice(hook_bias)
                    if hook.lower() not in texts[i].lower() and len(texts[i]) < 250:
                        texts[i] = f"{hook.title()}. {texts[i]}"
        
    elif pillar == "knowledge_drops":
        # Tuesday, Saturday: Knowledge-heavy
        # 70% knowledge/framework, 30% identity
        for _ in range(count):
            topic = random.choice(topics) if topics else random.choice(list(KNOWLEDGE_BASE.keys()))
            post = synthesize_post(topics=(topic,))
            if post and post not in texts:
                texts.append(post)
        
        # Add some identity balance
        mad_spec = generate_mad_specific_candidates(2)
        texts.extend(mad_spec)
        media.extend([None] * len(mad_spec))
        
        # Inject hook bias
        if hook_bias:
            for i in range(len(texts)):
                if random.random() < 0.5:
                    hook = random.choice(hook_bias)
                    if hook.lower() not in texts[i].lower() and len(texts[i]) < 250:
                        texts[i] = f"{hook.title()}. {texts[i]}"
    
    elif pillar == "community_moments":
        # Wednesday: Community spotlight
        # 60% community, 40% knowledge
        for _ in range(count // 2 + 2):
            post = synthesize_post(topics=("community",))
            if post and post not in texts:
                texts.append(post)
        
        for _ in range(count // 3):
            topic = random.choice(topics) if topics else random.choice(list(KNOWLEDGE_BASE.keys()))
            post = synthesize_post(topics=(topic,))
            if post and post not in texts:
                texts.append(post)
        
        # Celebration posts
        celeb = generate_celebration_candidates(2)
        texts.extend(celeb)
        media.extend([None] * len(celeb))
        
        if hook_bias:
            for i in range(len(texts)):
                if random.random() < 0.4:
                    hook = random.choice(hook_bias)
                    if hook.lower() not in texts[i].lower() and len(texts[i]) < 250:
                        texts[i] = f"{hook.title()}. {texts[i]}"
    
    elif pillar == "culture_roast":
        # Thursday: Roast, humor, meme energy
        # 50% culture/roast, 30% philosophy, 20% mad-specific
        philo = generate_philosophy_candidates(count // 2)
        texts.extend(philo)
        media.extend([None] * len(philo))
        
        mad_spec = generate_mad_specific_candidates(count // 3)
        texts.extend(mad_spec)
        media.extend([None] * len(mad_spec))
        
        # Add extra mad-specific with jeeter/roast energy
        for _ in range(2):
            topic = random.choice(["fight_club", "mr_robot", "girard", "taleb"])
            if topic in KNOWLEDGE_BASE:
                post = synthesize_post(topics=(topic,))
                if post and post not in texts:
                    texts.append(post)
        
        if hook_bias:
            for i in range(len(texts)):
                if random.random() < 0.5:
                    hook = random.choice(hook_bias)
                    if hook.lower() not in texts[i].lower() and len(texts[i]) < 250:
                        texts[i] = f"{hook.title()}. {texts[i]}"
    
    # --- Media posts (always generate, but priority varies by day) ---
    if AUTO_POST_MEDIA:
        media_count = 4 if media_priority else 2
        media_texts, media_paths = generate_media_post_candidates(media_count)
        texts.extend(media_texts)
        media.extend(media_paths)
    
    return dedupe_preserve_order(texts), media, thread


def synthesize_thread_for_topics(topics: Tuple[str, ...]) -> Optional[List[str]]:
    """Force-generate a thread from specific topics (fallback for Saturday)."""
    insights = []
    for topic in topics:
        kb = KNOWLEDGE_BASE.get(topic)
        if not kb:
            continue
        pool = kb.get("short_insights", kb.get("insights", []))
        if pool:
            insights.append(random.choice(pool))
    
    if len(insights) < 2:
        return None
    
    hook = f"Deep dive: {' × '.join(t.replace('_', ' ').title() for t in topics)}"
    numbered = [f"{i+1}/ {insights[i]}" for i in range(min(3, len(insights)))]
    closer = random.choice([
        "That's the intersection. Stay $MAD.",
        "Frameworks change minds. $MAD changes holders. — $Mad Claw",
        "Most study one framework. $MAD holders study them all. — $Mad Claw",
    ])
    
    thread = [hook] + numbered + [closer]
    thread = [finalize_post_text(t, skip_hashtags=True) for t in thread if t]
    return thread



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
    if not acquire_pid_lock():
        return

    print("[BOT] $MAD Supreme Bot starting...")
    print("[BOT] STRATEGY: Quality over quantity. Visual-first posting.")
    print(f"[BOT] Post interval: {POST_INTERVAL_SECONDS}s ({POST_INTERVAL_SECONDS//3600}hrs) | Min score: {AUTO_POST_MIN_SCORE}")
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
                day_name = get_current_day_name()
                schedule = WEEKLY_SCHEDULE.get(day_name, {})
                theme = schedule.get("theme", "Default")
                pillar = schedule.get("pillar", "mixed")
                print(f"[SCHEDULE] Today is {day_name} — Theme: {theme} | Pillar: {pillar}")
                
                texts, media_paths, thread = generate_day_specific_candidates(day_name, POST_CANDIDATE_COUNT)

                # Score regular posts
                base_scores = [simple_base_score(text) for text in texts]
                media_flags = [m is not None for m in media_paths]

                ranked = rerank_candidates_with_emotional_boosts(
                    candidates=texts,
                    base_scores=base_scores,
                    media_flags=media_flags,
                    recent_texts=recent_texts,
                )

                # HARD BLOCK: skip anything >60% similar to recent posts
                filtered = []
                for item in ranked:
                    sim_max = item.get("similarity_details", {}).get("max_similarity", 0)
                    if sim_max >= 0.60:
                        print(f"[BLOCK] Similarity {sim_max:.2f} to recent post. Skipping: {item['text'][:60]}...")
                        continue
                    filtered.append(item)

                ranked = filtered

                print(f"[QUEUE] generated_count={len(texts)} | after_block={len(ranked)}")
                for item in ranked:
                    print(item["log_line"])
                    print(item["match_log"])
                    print(f"[QUEUE CANDIDATE] {item['text']}")

                if ranked:
                    # --- QUALITY FIRST: Prefer media posts in top 3 ---
                    # Strategy shift: Visual posts get 5-10x more engagement than text-only.
                    # If a media post is in the top 3 and meets threshold, prefer it.
                    best = ranked[0]
                    
                    # Look for media post in top 3 that meets threshold
                    media_candidates = [item for item in ranked[:3] if item.get("is_media") and item["total"] >= AUTO_POST_MIN_SCORE]
                    if media_candidates:
                        best = media_candidates[0]
                        print(f"[STRATEGY] Prioritizing visual post (score={best['total']:.2f}) over text-only")
                    
                    final_text = best["text"]
                    final_score = best["total"]
                    best_media = None

                    # Find matching media
                    if best["is_media"]:
                        for t, m in zip(texts, media_paths):
                            if t == final_text:
                                best_media = m
                                break

                    print(f"[QUEUE] best_score={final_score:.2f} | is_media={best['is_media']}")
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
                            # Save thread with fingerprint for dedup
                            fp = thread_fingerprint(thread)
                            posted_threads = state.get("posted_threads", [])
                            posted_threads.append({
                                "ids": thread_ids,
                                "texts": thread,
                                "posted_at": datetime.now().isoformat(),
                                "fingerprint": fp,
                            })
                            # Trim to last 50 threads to prevent state bloat
                            posted_threads = posted_threads[-50:]
                            state["recent_generated_or_posted_texts"] = recent_texts
                            state["posted_threads"] = posted_threads
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




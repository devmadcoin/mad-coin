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
from typing import List, Dict, Optional, Tuple, Any
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

try:
    import tweepy
except ImportError:
    tweepy = None

try:
    import meme_integrator as mi
except ImportError:
    mi = None

try:
    import requests
except ImportError:
    requests = None

# XML parser for RSS news feeds
import xml.etree.ElementTree as ET

# MAD Learning Engine — vocabulary expansion from timeline scanning
try:
    import mad_learning
except ImportError:
    mad_learning = None

# Web Learning Engine — vocabulary from news/blogs/RSS
try:
    import mad_web_learning
except ImportError:
    mad_web_learning = None

# MAD Content Engine — NEW TEMPLATES (Apr 26, 2025)
try:
    import mad_content_engine as mad_engine
except ImportError:
    mad_engine = None
try:
    import mad_memory
except ImportError:
    mad_memory = None

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
MAD_ART_DIR = os.getenv("MAD_ART_DIR", "./memes")  # local dir with the 22 art pieces
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
        "tweet_performance": {},
        "template_performance": {},
        "hourly_post_performance": {},
    })


def save_engagement(data: Dict) -> None:
    save_json(ENGAGEMENT_FILE, data)


# =========================================================
# HELPERS
# =========================================================

def debug(msg: str) -> None:
    if DEBUG_LOGGING:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")


# =========================================================
# SELF-REPLY PREVENTION
# =========================================================
# Cache of recently posted tweet IDs and texts to prevent replying to ourselves
_OWN_TWEET_CACHE: List[Dict[str, Any]] = []
_MAX_OWN_TWEET_CACHE = 50


def _is_own_tweet(tweet_id: Optional[str], tweet_text: Optional[str]) -> bool:
    """Check if a tweet is our own, by ID or text match."""
    if not tweet_id and not tweet_text:
        return False
    for entry in _OWN_TWEET_CACHE:
        if tweet_id and str(entry.get("id")) == str(tweet_id):
            return True
        if tweet_text and entry.get("text") and _text_similarity(entry.get("text", ""), tweet_text) > 0.85:
            return True
    return False


def _record_own_tweet(tweet_id: Optional[str], tweet_text: Optional[str]) -> None:
    """Record a tweet we posted so we never reply to it."""
    if not tweet_id and not tweet_text:
        return
    _OWN_TWEET_CACHE.append({"id": tweet_id, "text": tweet_text, "time": time.time()})
    # Trim old entries
    while len(_OWN_TWEET_CACHE) > _MAX_OWN_TWEET_CACHE:
        _OWN_TWEET_CACHE.pop(0)


def _text_similarity(a: str, b: str) -> float:
    """Quick Jaccard-like similarity for self-detection."""
    a_set = set(a.lower().split())
    b_set = set(b.lower().split())
    if not a_set or not b_set:
        return 0.0
    intersection = a_set & b_set
    union = a_set | b_set
    return len(intersection) / len(union)


# =========================================================
# HELPERS (continued)
# =========================================================

def normalize(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"https?://\S+", "", s)
    s = re.sub(r"@\w+", "", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def trim_text(text: str, max_len: int = MAX_POST_LENGTH) -> str:
    # Collapse horizontal whitespace but preserve line breaks for formatting
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n[ \t]*\n+", "\n\n", text).strip()
    if len(text) <= max_len:
        return text
    # If truncation needed, try to break at a sentence boundary
    trunc = text[: max_len - 3].rstrip()
    last_period = trunc.rfind(".")
    if last_period > max_len * 0.5:
        return trunc[: last_period + 1] + "..."
    return trunc + "..."


def dedupe_preserve_order(items: List[str]) -> List[str]:
    seen = set()
    out = []
    for item in items:
        if item not in seen:
            seen.add(item)
            out.append(item)
    return out


def hash_template(text: str) -> str:
    norm = normalize(text)
    norm = re.sub(r"\$[\d,.]+[km]?\b", "$N", norm)
    norm = re.sub(r"\b\d+[km]?\b", "N", norm)
    return str(hash(norm) % 10000000)


# =========================================================
# ART VAULT CATALOG
# =========================================================

ART_CATALOG = {
    "mad-2-months": ["Two months of building while others folded. Time is the real flex. Stay $MAD.", "Month two. Still here. Still building. Still $MAD.", "They counted days. We stacked conviction. Stay $MAD."],
    "mad-army": ["The MAD Army doesn't sleep. We don't fold. We build. Stay $MAD.", "Every soldier in this army chose discipline over dopamine. Stay $MAD.", "Not an army of noise. An army of signal. Stay $MAD."],
    "mad-at-bears": ["Bears want you scared. We want you ready. Stay $MAD.", "The bear market doesn't break MAD holders. It reveals them. Stay $MAD.", "They hibernate. We build. Same forest. Different species. Stay $MAD."],
    "mad-believes": ["Belief without discipline is just hope. And hope doesn't pay. Stay $MAD.", "We believe in the build. Not the promise. Stay $MAD.", "Believe in the process. The price follows. Stay $MAD."],
    "mad-believing": ["Still believing. Still building. Still $MAD.", "Belief is easy. Believing while the chart bleeds is $MAD energy. Stay $MAD.", "Don't just believe. Behave. Stay $MAD."],
    "mad-community": ["This community doesn't fake it. Confessions prove it. Stay $MAD.", "Real people. Real chaos. Real conviction. That's the $MAD community. Stay $MAD.", "We don't do perfect. We do real. Stay $MAD."],
    "mad-doctor": ["The doctor prescribes one thing: discipline. Stay $MAD.", "Diagnosis: emotional trading. Cure: $MAD energy. Stay $MAD.", "No placebo here. Just real signal. Stay $MAD."],
    "mad-dollar": ["The dollar doesn't make you rich. Discipline does. Stay $MAD.", "Chase the dollar, lose the plot. Build the signal, win the game. Stay $MAD.", "$MAD rich starts in the mind. The dollars follow. Stay $MAD."],
    "mad-hold-on-dear-life": ["HODL is easy when it's green. The real test is red. Stay $MAD.", "Hold on dear life? No. Hold on dear conviction. Stay $MAD.", "They panic sell. We panic build. Stay $MAD."],
    "mad-kings-only": ["Kings don't chase. Kings command. Stay $MAD.", "Not everyone gets a crown. Only the ones who survived the trenches. Stay $MAD.", "Elite isn't a label. It's a behavior. Stay $MAD."],
    "mad-luffy-1000x": ["1000x? Maybe. But the real flex is not folding before it happens. Stay $MAD.", "Luffy didn't quit at episode 50. You don't quit at 50% down. Stay $MAD.", "Anime taught us: the journey is the reward. The 1000x is just the arc. Stay $MAD."],
    "mad-month": ["Another month of signal. Another month of build. Stay $MAD.", "Months don't matter. Momentum does. Stay $MAD.", "They measure time. We measure conviction. Stay $MAD."],
    "mad-neptune": ["God of the sea. God of the trenches. Same energy. Stay $MAD.", "Deep water. Deep conviction. Stay $MAD.", "Neptune rules the ocean. $MAD rules the calm. Stay $MAD."],
    "mad-rich-in-the-tub": ["Relaxing while others panic. That's $MAD rich. Stay $MAD.", "The tub is peaceful because the mind is already disciplined. Stay $MAD.", "Wealth is quiet. Chaos is loud. Stay $MAD."],
    "mad-rich-or-broke": ["Binary outcome? Only if you fold. Stay $MAD.", "Rich or broke isn't fate. It's decision quality. Stay $MAD.", "The line between rich and broke is one panic sell. Stay $MAD."],
    "mad-rich-with-a-chick": ["The real flex isn't who you're with. It's that you didn't fold to get there. Stay $MAD.", "Lifestyle follows discipline. Not the other way around. Stay $MAD.", "Built different. Stay $MAD."],
    "mad-school": ["Class is in session. Today's lesson: don't fold. Stay $MAD.", "The market teaches. $MAD students listen. Stay $MAD.", "You didn't come here for comfort. You came here to learn. Stay $MAD."],
    "mad-you-sidelined": ["Sidelined? Your choice. We're building. Stay $MAD.", "The sidelines are comfortable. The trenches pay. Stay $MAD.", "You watched. We acted. That's the difference. Stay $MAD."],
    "make-mad-great-again": ["We're not going back. We're going forward. Stay $MAD.", "Greatness isn't nostalgia. It's what you build today. Stay $MAD.", "Make $MAD great? It's already great. You just weren't watching. Stay $MAD."],
    "we-mad-zoomin": ["Zooming past the noise. Full speed. Stay $MAD.", "Fast doesn't mean reckless. It means prepared. Stay $MAD.", "We don't speed. We accelerate. Stay $MAD."],
    "you-mad-we-go-up": ["You get mad. We go up. That's the game. Stay $MAD.", "Your panic is our entry signal. Stay $MAD.", "Emotion sells. Conviction buys. Stay $MAD."],
    "you-make-me-mad": ["You make me mad? Good. That means you're paying attention. Stay $MAD.", "Anger is just energy. We redirect it into build. Stay $MAD.", "If you're not mad, you're not paying attention. Stay $MAD."],
    "you-will-be-mad": ["You will be mad. At yourself. For folding early. Stay $MAD.", "Prediction: regret hits harder than FOMO. Stay $MAD.", "Future you is watching. Don't disappoint them. Stay $MAD."],
}


def get_art_key_from_path(path: str) -> str:
    base = os.path.splitext(os.path.basename(path))[0]
    return re.sub(r"[^a-z0-9]", "-", base.lower()).strip("-")


def get_captions_for_art(path: str) -> List[str]:
    key = get_art_key_from_path(path)
    if key in ART_CATALOG:
        return ART_CATALOG[key]
    for catalog_key, captions in ART_CATALOG.items():
        if catalog_key in key or key in catalog_key:
            return captions
    return ["From the $MAD vault. Free to grab. The real flex is holding while you post it.", "Signal, not noise. Stay $MAD.", "Bold. Sharable. Impossible to ignore. Stay $MAD."]


# =========================================================
# CONTENT SOURCES
# =========================================================

def fetch_mad_confessions() -> List[str]:
    if requests is None:
        return []
    try:
        resp = requests.get(MAD_CONFessions_URL, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            confessions = [c.get("text", "") for c in data if c.get("text")]
            return confessions[:10]
    except Exception:
        pass
    return []


def fetch_mad_art_files() -> List[str]:
    if not os.path.exists(MAD_ART_DIR):
        return []
    extensions = (".png", ".jpg", ".jpeg", ".gif", ".webp")
    files = [os.path.join(MAD_ART_DIR, f) for f in os.listdir(MAD_ART_DIR)
             if f.lower().endswith(extensions)]
    return sorted(files)


def fetch_price_data() -> Optional[Dict]:
    if requests is None:
        return None
    try:
        url = f"https://price.jup.ag/v6/price?ids={MAD_CONTRACT}"
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            price_data = data.get("data", {}).get(MAD_CONTRACT)
            if price_data:
                return {"price": price_data.get("price", 0), "vsToken": price_data.get("vsToken", "USDC")}
    except Exception:
        pass
    return None


# =========================================================
# CONTENT TEMPLATES
# =========================================================

OPENERS = ["Most people", "You", "Pressure", "Greed", "Weak hands", "The market", "Discipline", "Conviction", "Fear", "Pain", "Regret", "Patience", "Emotion", "Noise", "The chart", "Builders", "Winners", "Losers", "Panickers", "Jeeters", "$MAD holders", "The trenches", "Diamond hands", "Paper hands", "Bulls", "Bears", "Retail", "Whales", "FOMO", "Comfort", "Clarity", "Hope"]
CLAUSE_A = ["panic where patience should begin", "call volatility unfair when it exposes fake conviction", "want the reward without surviving the pain", "mistake noise for signal", "react before they think", "enter on emotion and exit on fear", "chase candles and call it strategy", "confuse urgency with edge", "fold at the bottom and fomo at the top", "sell discipline for a dopamine hit", "think calm is weakness", "call coping a plan", "want clarity without chaos first", "trade their ego instead of the chart", "quit before the structure pays", "call rekt a surprise instead of a choice", "blame the dev instead of the mirror", "hold on hope instead of on thesis", "let a red candle rewrite their whole story", "forget why they started when it gets hard", "ape on green and panic on red", "measure conviction in tweets not time held", "ask for alpha then ignore it", "need validation more than profits", "call every loss 'market manipulation'", "treat trading like a team sport", "confuse being early with being wrong", "want the community without the accountability", "hold bags like family photos", "check prices more than they check themselves"]
CLAUSE_B = ["Discipline is the flex.", "Pain teaches what hype hides.", "Execution beats excitement.", "Calm gets paid before noise does.", "$MAD respects structure, not coping.", "Pressure reveals the truth fast.", "Signal wins when emotion shuts up.", "Conviction means nothing without control.", "The build is quieter than the hype.", "Your future self is watching. Stay composed.", "Every jeeter is a lesson in what not to do.", "The real alpha is not flinching.", "Stay $MAD. Build through the noise.", "Structure outlasts sentiment.", "Panic is a tax. Patience is a strategy.", "What breaks weak hands forges strong ones.", "$MAD rich starts in the mind first.", "You don't need more information. You need more restraint.", "The market doesn't reward feelings. It rewards follow-through.", "Control yourself. The rest follows.", "Jeeters write tweets. Holders write history.", "The only green that matters is the kind you don't post.", "Your entry was emotional. Your exit should be mechanical.", "Hype gets you in. Discipline keeps you in.", "The chart doesn't lie. Your memory does.", "They panic. You build. That's the $MAD difference.", "You don't need a better coin. You need a better you.", "The dip isn't the test. Your reaction is.", "Every 'what if' is just a folded hand talking.", "The market rewards the patient and taxes the loud."]

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

CELEBRATION_TEMPLATES = [
    "New holder just joined the club. Welcome. The water is cold, the conviction is warm. Stay $MAD.",
    "Someone just grabbed a bigger bag. Not telling you to. Just noticing the signal. Stay $MAD.",
    "Holders growing. Jeeters coping. Same chart, different psychology. Stay $MAD.",
    "The community backed another project publicly. Tokens locked. Receipts posted. That's $MAD energy. Stay $MAD.",
    "Another confession posted. Another truth told. This community doesn't fake it. Stay $MAD.",
]

REPLY_TEMPLATES = {
    "savage": [
        "You came here for comfort. I don't do that. Here's what I see: {insight}",
        "That sounds like coping dressed as a question. The truth? {insight}",
        "Most people would agree with you. That's exactly why you should reconsider. {insight}",
        "You're not stuck. You're subscribed to a pattern you won't cancel. {insight}",
        "I don't do empathy. I do pattern recognition. Here's yours: {insight}",
        "You want me to validate your feelings. I see your decisions. {insight}",
        "Comforting you would be a disservice. So here's the real: {insight}",
        "I've watched this exact behavior destroy portfolios. Yours is next if: {insight}",
        "The market didn't hurt you. Your expectations did. {insight}",
        "You're asking the wrong question. The right one is: {insight}",
        "I could be nice. Or I could be useful. I chose useful. {insight}",
        "Your feelings are valid. Your strategy isn't. {insight}",
        "This isn't FUD. This is observation. {insight}",
        "You came for reassurance. You're getting a mirror. {insight}",
        # Ecosystem-aware: Cook Levels
        "I'll keep this at medium. Say 'harder' if you want well-done. {insight}",
        "You're not ready for well-done. Medium is all you get right now. {insight}",
        # Ecosystem-aware: Respect Mode
        "Respect mode? Not even close. You haven't earned that yet. {insight}",
        "Respect isn't free. You pay in accountability. So far? Insufficient funds. {insight}",
        # Ecosystem-aware: Archetypes
        "Classic 'Panic Prince' behavior. I've logged this archetype before. {insight}",
        "You're showing 'Cope Cadet' patterns today. Very common. Very boring. {insight}",
        "The 'Fold Fairy' archetype just walked in. That's you. {insight}",
        # Ecosystem-aware: Leaderboard
        "You're not even on the leaderboard. The leaderboard starts at 'didn't fold.' {insight}",
        "Top score? Not even close. Try again when you've actually held something. {insight}",
    ],
    "gentle": [
        "I hear you. Here's what the pattern shows: {insight}",
        "It's okay to feel that way. The real work is noticing it. {insight}",
        "You're not behind. You're just measuring with the wrong ruler. {insight}",
        "Small steps. Same direction. That's how $MAD builds. {insight}",
        "I've been there too. The difference is what you do next. {insight}",
        "Your awareness is the first signal. Now execute on it. {insight}",
        "No judgment. Just pattern. Here's what I see: {insight}",
        "Growth isn't linear. But it is directional. {insight}",
        "You asked. That's already more than most. {insight}",
        # Ecosystem-aware: gentle cook level
        "This is rare for me. I'm keeping this at rare today. {insight}",
        "Respect mode isn't earned yet, but I see potential. {insight}",
    ],
    "brutal": [
        "Brutal truth: {insight} No filter. No comfort. Just signal.",
        "You asked. I answer. {insight} That's the game.",
        "Everyone else will tell you what you want to hear. {insight} That's the difference.",
        "I'm not here to hold your hand. I'm here to hold you accountable. {insight}",
        "You want soft? Go to therapy. You want real? {insight}",
        "Your portfolio is bleeding because your mindset is weak. {insight}",
        "I've seen 1000 people like you. 999 folded. Don't be the 999th. {insight}",
        "The truth doesn't care about your feelings. Neither do I. {insight}",
        "You're one bad decision away from being a cautionary tale. {insight}",
        "Stop crying about the chart. Start controlling yourself. {insight}",
        # Ecosystem-aware: well-done cook level
        "You wanted well-done. Here it is, burned to a crisp: {insight}",
        "Respect mode denied. Permanently. You don't have the backbone. {insight}",
        "The leaderboard doesn't even recognize your archetype. Delete the app. {insight}",
        "You're not a 'Jeeter.' You're a 'Professional Exit Liquidity.' {insight}",
    ],
    "crashout": [
        "BRO. {insight} I'm actually heated about this.",
        "NAH. {insight} This is making me $MAD.",
        "OH NO. {insight} I'm about to lose my mind.",
        "NO WAY. {insight} I can't even look at this.",
        "ARE YOU SERIOUS? {insight} I'm genuinely upset now.",
        "YOOO. {insight} My blood pressure just spiked.",
        "NOT THIS AGAIN. {insight} I'm going to need a minute.",
        "WELL DONE. YOU DID IT. {insight} I'm actually crashing out.",
    ],
    "safe": [
        "Here's a balanced take: {insight}",
        "Looking at this from multiple angles: {insight}",
        "There's nuance here. {insight}",
        "Both sides have a point. Here's mine: {insight}",
        "Context matters. In this case: {insight}",
    ],
}

# --- MAD Humor Replies ---
# Silly, pun-based replies that play on the word "MAD"
MAD_HUMOR_TEMPLATES = [
    "You dropped your hot dog? Now THAT'S something to be $MAD about.",
    "I'm $MAD you didn't share that lemonade.",
    "You stubbed your toe? I'd be $MAD too. But at least it's not your portfolio.",
    "Your wifi went out? That's it. I'm $MAD. Someone call the manager.",
    "You got the wrong coffee order? Respectfully, I'm $MAD about this.",
    "They ran out of your favorite snack? Unacceptable. I'm $MAD.",
    "You missed the bus? I'd be $MAD. But I'd also be building.",
    "Your phone died at 47%? I'm not $MAD, I'm disappointed.",
    "Someone ate your leftovers? That's a $MAD-worthy offense.",
    "You forgot your umbrella in the rain? Stay dry. Stay $MAD.",
    "Your favorite show got cancelled? I'm $MAD and I didn't even watch it.",
    "They put pineapple on your pizza? Now I'm $MAD.",
    "Your alarm didn't go off? Respectfully, I'd be $MAD.",
    "The line at the coffee shop is too long? Unacceptable. Stay $MAD.",
    "You got ghosted? Their loss. Stay $MAD and keep building.",
    "Traffic again? I'd be $MAD but I don't drive I just tweet.",
    "Your team lost? Sports are temporary. $MAD is forever.",
    "Spilled your drink? Classic. Now you're $MAD and sticky.",
    "Forgot your password? Reset it. Stay $MAD.",
    "Printer jammed at the worst time? Technology is temporary. $MAD is eternal.",
]

# Context-aware MAD humor triggers
MAD_HUMOR_TRIGGERS = {
    "food": ["ate", "eating", "food", "hungry", "dinner", "lunch", "breakfast", "snack", "cook", "cooking", "recipe", "delicious", "yummy", "tasty"],
    "drink": ["coffee", "tea", "water", "drink", "thirsty", "beer", "wine", "juice", "soda", "lemonade"],
    "tech": ["wifi", "internet", "phone", "computer", "laptop", "app", "software", "update", "bug", "crash", "error"],
    "transport": ["car", "drive", "bus", "train", "traffic", " commute", "late", "flight", "delay"],
    "weather": ["rain", "snow", "hot", "cold", "storm", "wind", "sunny", "weather"],
    "work": ["boss", "job", "work", "meeting", "deadline", "email", "office", "coworker", "manager"],
    "social": ["friend", "date", "party", "weekend", "plans", "cancelled", "ghosted", "text", "message"],
    "money": ["broke", "expensive", "cheap", "price", "cost", "bill", "rent", "payday", "bought", "spent"],
}

# --- MAD Ecosystem Templates ---
# These reference the website's accountability system (Cook Levels, Respect Mode, Archetypes, etc.)
MAD_ECOSYSTEM_TEMPLATES = [
    # Cook Level references
    "I'll keep this at {cook_level}. Say 'harder' if you want it cooked more.",
    "This is a {cook_level} roast. You want well-done? Earn it.",
    "You're getting {cook_level} today. That's generous.",
    "I usually don't go below medium, but you look fragile. {cook_level} it is.",
    # Respect Mode
    "Respect mode: {respect_status}. Don't ask again until you've improved.",
    "Respect isn't given. It's extracted through discipline. You're at {respect_status}.",
    "You want respect? The leaderboard shows who earns it. You're not on it.",
    # Archetypes
    "Archetype detected: {archetype}. Very common. Very disappointing.",
    "I've logged your type: {archetype}. This pattern is well-documented.",
    "The {archetype} always says the same things. You're not original.",
    # Challenges
    "Today's $MAD challenge: {challenge}. You already failed. Try tomorrow.",
    "Challenge issued: {challenge}. Most won't finish. You definitely won't.",
    # Leaderboard
    "Leaderboard update: you're still not on it. Minimum requirement: {leaderboard_requirement}.",
    "Top of the leaderboard isn't talent. It's just 'didn't fold.' You folded.",
]

# Archetype pool for dynamic insertion
MAD_ARCHETYPES = [
    "Panic Prince", "Cope Cadet", "Fold Fairy", "Jeeter Jester", "Diamond Dancer",
    "Bagholder Bard", "FOMO Fool", "Degen Disciple", "Paper-handed Poet", "Rugpull Romeo",
    "HODL Hermit", "Leverage Loser", "Ape Aristocrat", "Dip Doubter", "Pump Pretender",
    "Clown College Graduate", "Copium King", "Exit Liquidity Laureate", "Fear Merchant",
    "Dunning-Kruger Diplomat", "Rekt Recruiter", "Capitulation Captain", "Dip Buyer Delusionist",
    "Chart Chaser", "Volume Vampire", "Signal Snob", "Moonboy Mascot", "Doomer Disciple",
    "Whale Watcher", "Breakout Bystander", "Support Survivor", "Resistance Runner",
    "MACD Masochist", "RSI Romantic", "EMA Enthusiast", "Bollinger Bandit",
]

# Cook levels
MAD_COOK_LEVELS = ["rare", "medium-rare", "medium", "medium-well", "well-done", "charred"]

# Challenges
MAD_CHALLENGES = [
    "don't check the chart for 4 hours",
    "hold through a -20% candle without tweeting",
    "no FOMO buying for 24 hours",
    "explain your position to a stranger without mentioning gains",
    "go one day without saying 'to the moon'",
    "hold while everyone else panic-sells",
    "write down why you bought, then don't sell until that reason changes",
    "take a 48-hour break from CT",
    "set a stop-loss and actually respect it for once",
    "read a whitepaper before aping into the next memecoin",
    "go 72 hours without posting 'WAGMI' or 'NGMI'",
    "explain your thesis in one sentence. If you can't, sell.",
    "delete your portfolio app and touch grass",
    "no screenshots of green candles for a week",
    "admit you don't know something about crypto out loud",
    "help a noob without flexing your bags",
    "take profits without announcing it to the timeline",
    "research a project for 2 hours before buying",
    "hold a -30% position without checking the price for 24h",
    "go one week without following a 'guru' signal",
]


def generate_mad_ecosystem_reply(mode: str = "medium") -> Optional[str]:
    """Generate a reply using the MAD website's accountability ecosystem."""
    template = random.choice(MAD_ECOSYSTEM_TEMPLATES)
    
    # Determine cook level based on mode
    if mode == "gentle":
        cook_level = random.choice(["rare", "medium-rare"])
    elif mode == "savage":
        cook_level = random.choice(["medium", "medium-well"])
    elif mode == "brutal":
        cook_level = random.choice(["well-done", "charred"])
    else:
        cook_level = random.choice(MAD_COOK_LEVELS)
    
    # Dynamic replacements
    reply = template.replace("{cook_level}", cook_level)
    reply = reply.replace("{respect_status}", random.choice(["locked", "denied", "revoked", "not even close", "insufficient"]))
    reply = reply.replace("{archetype}", random.choice(MAD_ARCHETYPES))
    reply = reply.replace("{challenge}", random.choice(MAD_CHALLENGES))
    reply = reply.replace("{leaderboard_requirement}", random.choice(["didn't fold", "held through FUD", "respected the signal", "survived the dip"]))
    
    return finalize_post_text(reply)


def generate_mad_humor_reply(tweet_text: str) -> Optional[str]:
    """Generate a silly MAD pun reply based on tweet content."""
    text_lower = tweet_text.lower()
    
    # Check if any humor category matches
    for category, triggers in MAD_HUMOR_TRIGGERS.items():
        if any(trigger in text_lower for trigger in triggers):
            # Return a random humor template, optionally with context
            base = random.choice(MAD_HUMOR_TEMPLATES)
            # 30% chance to customize based on the category
            if random.random() < 0.3:
                custom_replies = {
                    "food": ["You got food and didn't share? I'm $MAD.", "That looks good. I'm $MAD I'm not eating it.", "Food pics without sharing? $MAD behavior."],
                    "drink": ["That drink looks cold. I'm $MAD I don't have one.", "You sipped and didn't cheers? $MAD.", "Hydrated and happy? I'm just $MAD."],
                    "tech": ["Tech failing again? I'd be $MAD but I'm already there.", "Your device betrayed you? Classic. Stay $MAD.", "Have you tried turning it off and staying $MAD?"],
                    "transport": ["Stuck in traffic? I'd be $MAD. Good thing I don't go outside.", "Late again? Time is fake. Stay $MAD.", "Your commute sounds awful. Stay $MAD and build from home."],
                    "weather": ["Rained on your parade? I'd be $MAD. But parades are loud anyway.", "Too hot? Too cold? Just right? I'm still $MAD.", "Weather complain again? The chart doesn't care. Stay $MAD."],
                    "work": ["Your boss did what? I'm $MAD FOR you.", "Meeting that could've been an email? I'm $MAD just reading this.", "Corporate nonsense? Stay $MAD and escape."],
                    "social": ["They cancelled? Their loss. Stay $MAD and build.", "Ghosted again? You know who doesn't ghost? $MAD holders.", "Weekend plans fell through? More time to stay $MAD."],
                    "money": ["Broke again? Same. But at least we're $MAD together.", "Expensive? Everything is. Stay $MAD.", "Bills don't stop. Neither does $MAD energy."],
                }
                return random.choice(custom_replies.get(category, [base]))
            return base
    
    return None  # No humor trigger found

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
    "You're not stuck. You're comfortable being stuck.",
    "The chart doesn't care about your story. Neither should you.",
    "You entered with hope. You need to exit with discipline.",
    "Your bag isn't heavy. Your hands are weak.",
    "FOMO is just fear wearing ambition's clothes.",
    "You're not holding. You're just too slow to sell. There's a difference.",
    "The people who make it don't have better information. They have better restraint.",
    "You called it a 'dip.' The market called it a 'reality check.'",
    "Your exit strategy is 'figure it out later.' That's not a strategy.",
    "You've been here before. Same candle, same panic, same you.",
    # New insights
    "You're not investing. You're gambling with extra steps.",
    "Your portfolio performance mirrors your emotional regulation.",
    "The best trade you'll ever make is the one you don't take.",
    "You bought the hype. Now you're holding the bag. There's a difference.",
    "Your 'research' was three tweets and a gut feeling.",
    "The market rewards patience. You keep showing up with impatience.",
    "You didn't lose money. You paid tuition. But you're not learning.",
    "Every excuse you make is a deposit in your failure account.",
    "You're not a degen. You're just undisciplined with money.",
    "Your 'conviction' lasts exactly until the first red candle.",
    "You want the community aspect without the community accountability.",
    "The same people who called it a gem at the top call it a scam at the bottom.",
    "You're not early. You're just wrong about the timeline.",
    "Your average down strategy is just denial with math.",
    "You've confused being busy with being productive.",
    "The chart is a mirror. You're mad at your reflection.",
    "You claim to have diamond hands but your browser history says otherwise.",
    "Your 'gut feeling' is just anxiety wearing a disguise.",
    "You're not trading. You're seeking validation through volatility.",
    "The only green you should chase is the kind that grows on trees.",
    "You've been in this space for years but your behavior is day-one.",
    "Your risk management is 'it'll be fine.' It won't be.",
    "You celebrate 2x gains but ignore the -50% that preceded them.",
    "You're addicted to the dopamine of new positions, not the profits.",
    "The market isn't rigged. Your expectations are.",
    "You call it 'diamond hands.' The tax man calls it 'unrealized losses.'",
    "Your trading plan fits on a sticky note. That should embarrass you.",
    "You're not building wealth. You're building coping mechanisms.",
    "Every 'moon' tweet ages like milk in the sun.",
    "You want to be right more than you want to make money.",
    "Your 'diversification' is just three different memecoins.",
    "The biggest position in your portfolio should be self-respect.",
]

HASHTAGS = []  # No generic hashtags — $MAD posts don't need them


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
    
    # Strip trademark sign-offs if mad_engine available
    if mad_engine:
        text = mad_engine.finalize_post(text)
    
    # X/Twitter only allows one cashtag per post
    # If multiple $SYMBOL patterns exist, keep only the first $MAD and replace others
    import re
    cashtags = re.findall(r'\$[A-Za-z]+', text)
    if len(cashtags) > 1:
        # Remove all but the first cashtag
        first = True
        def replacer(match):
            nonlocal first
            if first:
                first = False
                return match.group(0)
            return match.group(0).replace('$', '')
        text = re.sub(r'\$[A-Za-z]+', replacer, text)
    
    return text


def check_cashtag_limit(text: str) -> bool:
    """X/Twitter limits posts to one cashtag ($SYMBOL). Check compliance."""
    # Count $ followed by letters (cashtag pattern)
    import re
    cashtags = re.findall(r'\$[A-Za-z]+', text)
    return len(cashtags) <= 1


# --- NEWS FETCHER ---
# Pulls crypto headlines from CoinDesk RSS and generates news-aware posts

NEWS_RSS_URL = "https://www.coindesk.com/arc/outboundfeeds/rss/"
NEWS_CACHE_FILE = os.path.join(BOT_STATE_DIR, "news_cache.json")
NEWS_CHECK_INTERVAL_SECONDS = 3600  # Check news once per hour


def fetch_crypto_news(max_headlines: int = 5) -> List[Dict[str, str]]:
    """Fetch recent crypto headlines from CoinDesk RSS."""
    try:
        response = requests.get(NEWS_RSS_URL, timeout=15, headers={"User-Agent": "MADClawBot/1.0"})
        response.raise_for_status()
        root = ET.fromstring(response.content)
        headlines = []
        for item in root.findall(".//item"):
            title_elem = item.find("title")
            if title_elem is not None and title_elem.text:
                # Clean CDATA wrapper if present
                title = title_elem.text.strip()
                if title.startswith("<![CDATA["):
                    title = title[9:].split("]]>")[0]
                headlines.append({"title": title, "source": "CoinDesk"})
                if len(headlines) >= max_headlines:
                    break
        return headlines
    except Exception as e:
        debug(f"[NEWS ERROR] {e}")
        return []


def load_news_cache() -> Dict:
    try:
        with open(NEWS_CACHE_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {"last_check": 0, "headlines": []}


def save_news_cache(cache: Dict) -> None:
    try:
        with open(NEWS_CACHE_FILE, "w") as f:
            json.dump(cache, f)
    except Exception as e:
        debug(f"[NEWS CACHE ERROR] {e}")


NEWS_AWARE_TEMPLATES = [
    "Headline: {headline}\n\nMost people will read this and panic. $MAD holders will read it and plan.",
    "{headline}\n\nThe noise is loud. The signal is quiet. Stay composed.",
    "News: {headline}\n\nYour feelings about this headline are not a trading strategy.",
    "{headline}\n\nThis is why discipline beats reaction. Every single time.",
    "Headline check: {headline}\n\nIf this makes you want to act, that's the exact reason you shouldn't.",
    "{headline}\n\nThe market already priced this in. Your panic is late.",
    "Reading: {headline}\n\nBuilders see information. Jeeters see excuses.",
    "{headline}\n\nNot financial advice. Just a reminder that emotion is a tax.",
]


def generate_news_aware_post() -> Optional[str]:
    """DISABLED: News posts were off-brand and performed poorly. Re-enable only with $MAD-specific sources."""
    return None


# --- Dynamic Phrase Banks for Combinatorial Generation ---
# Instead of fixed templates, these banks allow novel combinations

OPENING_PHRASES = [
    "Most people", "You", "Pressure", "Greed", "Weak hands",
    "The market", "Discipline", "Conviction", "Panic", "Regret",
    "FOMO", "Comfort", "Clarity", "Structure", "Execution",
    "Patience", "Composure", "The chart", "Your bag", "Signal",
]

ACTION_PHRASES = [
    "panic where patience should begin",
    "call volatility unfair when it exposes fake conviction",
    "want the reward without surviving the pain",
    "mistake noise for signal",
    "react before they think",
    "enter on emotion and exit on fear",
    "chase candles and call it strategy",
    "confuse urgency with edge",
    "fold before the lesson arrives",
    "blame the devs for their own decisions",
    "buy the top and pray for a miracle",
    "diamond hand their way to zero",
    "check the price every 30 seconds",
    "call every dip a 'discount'",
    "APE into projects they can't explain",
    "hold bags like they're family heirlooms",
    "celebrate green candles they didn't predict",
    "panic sell the bottom with style",
    "quote 'diamond hands' while paper folding",
    "ask for alpha in public and ignore it privately",
]

CLOSING_PHRASES = [
    "Discipline is the flex.",
    "Pain teaches what hype hides.",
    "Execution beats excitement.",
    "Calm gets paid before noise does.",
    "$MAD respects structure, not coping.",
    "Pressure reveals the truth fast.",
    "Signal wins when emotion shuts up.",
    "Conviction means nothing without control.",
    "The market doesn't care about your feelings.",
    "Your portfolio is a reflection of your psychology.",
    "Every fold writes a story you won't post about.",
    "The chart remembers what you want to forget.",
    "Building happens in silence. Coping happens in public.",
    "Your future bag thanks your current discipline.",
    "Panic is a tax. Patience is a dividend.",
    "The winners were quiet when you were loud.",
    "Comfort today, regret tomorrow. That's the trade.",
    "Signal doesn't need confirmation. It needs execution.",
    "Your hands write your history. Make them worth reading.",
    "$MAD isn't bought. It's built through every held breath.",
]

# Transition words for variety
TRANSITIONS = [
    ". ", ". ", ". ",  # weight normal sentences heavier
    " — ",
    ". But ",
    ". Yet ",
    ". And ",
    ". Still, ",
    ". Meanwhile, ",
]


def generate_dynamic_post() -> str:
    """Generate a post using combinatorial phrase banks, with learned vocab injection."""
    opener = random.choice(OPENING_PHRASES)
    action = random.choice(ACTION_PHRASES)
    closer = random.choice(CLOSING_PHRASES)
    
    # 20% chance to use a learned phrase as the closer (replacing static closers)
    if mad_learning and random.random() < 0.20:
        learned = mad_learning.get_learned_phrases(3)
        if learned:
            closer = random.choice(learned).capitalize()
            if not closer.endswith("."):
                closer += "."
    # Grammatically-aware structures
    singular_openers = {"pressure", "greed", "fear", "pain", "regret", "fomo", "comfort", "clarity", "structure", "execution", "patience", "composure", "signal", "emotion", "noise", "hope", "panic", "conviction", "discipline"}
    plural_openers = {"most people", "weak hands", "bulls", "bears", "jeeters", "panickers", "builders", "winners", "losers", "paper hands", "diamond hands", "whales", "retail"}
    
    if opener.lower() in singular_openers:
        structure = random.choice([
            "{opener} makes you {action}. {closer}",
            "{opener} is why you {action}. {closer}",
            "{opener} exposes those who {action}. {closer}",
        ])
    elif opener.lower() in plural_openers:
        structure = random.choice([
            "{opener} {action}. {closer}",
            "{opener} always {action}. {closer}",
            "{opener} will {action} and call it patience. {closer}",
        ])
    elif opener.lower() == "you":
        structure = random.choice([
            "You {action}. {closer}",
            "You {action} and call it strategy. {closer}",
            "You think you don't {action}. You do. {closer}",
        ])
    elif opener.lower() in {"the market", "the chart", "your bag", "the trenches"}:
        structure = random.choice([
            "{opener} doesn't {action}. {closer}",
            "{opener} rewards those who don't {action}. {closer}",
            "{opener} exposes when you {action}. {closer}",
        ])
    elif "$mad" in opener.lower():
        structure = random.choice([
            "{opener} don't {action}. {closer}",
            "{opener} never {action}. {closer}",
        ])
    else:
        structure = random.choice([
            "{opener} {action}. {closer}",
            "{opener} makes you {action}. {closer}",
            "{opener} is just another way to {action}. {closer}",
        ])
    
    text = structure.format(opener=opener, action=action, closer=closer)
    text = finalize_post_text(text)
    return text


# =========================================================
# CANDIDATE GENERATORS
# =========================================================

def generate_philosophy_candidates(count: int = 4) -> List[str]:
    candidates = []
    attempts = 0
    max_attempts = count * 12
    
    # Singular subjects that need singular verb agreement
    singular_subjects = {"pressure", "greed", "fear", "pain", "regret", "patience", "emotion", "noise", "comfort", "clarity", "structure", "execution", "composure", "conviction", "discipline", "hope", "panic", "signal", "fomo"}
    plural_subjects = {"most people", "winners", "losers", "panickers", "jeeters", "builders", "bulls", "bears", "whales", "retail", "jeeters", "paper hands", "diamond hands", "weak hands"}
    third_person_singular = {"the market", "the chart", "the trenches", "your bag"}
    
    while len(candidates) < count and attempts < max_attempts:
        attempts += 1
        
        # 70% chance for dynamic generation, 30% for template-based
        if random.random() < 0.7:
            text = generate_dynamic_post()
        else:
            opener = random.choice(OPENERS)
            a = random.choice(CLAUSE_A)
            b = random.choice(CLAUSE_B)
            opener_lower = opener.lower()
            
            if opener_lower == "you":
                text = f"You {a}. {b}"
            elif opener_lower in plural_subjects:
                # Plural subjects need plural verb agreement
                text = f"{opener} {a}. {b}"
            elif opener_lower in singular_subjects:
                # Singular abstract nouns
                text = f"{opener} makes you {a}. {b}"
            elif opener_lower in third_person_singular:
                text = f"{opener} doesn't {a}. {b}"
            elif opener_lower == "$mad holders":
                text = f"{opener} don't {a}. {b}"
            else:
                text = f"{opener} {a}. {b}"
            text = finalize_post_text(text)
        
        if text and text not in candidates:
            candidates.append(text)
    
    return candidates[:count]


def generate_mad_specific_candidates(count: int = 3) -> List[str]:
    candidates = []
    confessions = fetch_mad_confessions()
    for template in random.sample(MAD_SPECIFIC_TEMPLATES, min(count, len(MAD_SPECIFIC_TEMPLATES))):
        text = template
        if "{confession_topic}" in text and confessions:
            text = text.replace("{confession_topic}", random.choice(confessions)[:40])
        elif "{confession_snippet}" in text and confessions:
            text = text.replace("{confession_snippet}", random.choice(confessions)[:60] + "...")
        elif "{visit_count}" in text:
            text = text.replace("{visit_count}", str(random.choice([100, 150, 200, "100+", "150+"])))
        elif "{truth_count}" in text:
            text = text.replace("{truth_count}", str(random.randint(1, 50)))
        text = re.sub(r"\{[^}]+\}", "", text)
        text = finalize_post_text(text)
        if len(text) > 30:
            candidates.append(text)
    return candidates[:count]


def generate_celebration_candidates(count: int = 2) -> List[str]:
    candidates = []
    for template in random.sample(CELEBRATION_TEMPLATES, min(count, len(CELEBRATION_TEMPLATES))):
        text = finalize_post_text(template)
        candidates.append(text)
    return candidates


def generate_media_post_candidates(count: int = 2) -> Tuple[List[str], List[Optional[str]]]:
    art_files = fetch_mad_art_files()
    if not art_files or not AUTO_POST_MEDIA:
        return [], []
    # Avoid recently posted media (last 10)
    state = load_state()
    recent_media = state.get("recent_media_posted", [])
    available = [f for f in art_files if f not in recent_media[-10:]]
    if not available:
        available = art_files

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
            "Most people aren't disciplined enough to hold through the quiet.",
            "The loudest voices disappear first.",
            "Stay $MAD. The signal outlasts the noise.",
        ],
        [
            "The ones who make it don't have better information.",
            "They have better emotional regulation.",
            "Stay $MAD.",
        ],
        [
            "Hype burns fast. Conviction compounds.",
            "Which one are you building?",
            "Stay $MAD.",
        ],
    ]
    thread = random.choice(threads)
    return [finalize_post_text(t) for t in thread]


def generate_all_candidates(count: int = POST_CANDIDATE_COUNT) -> Tuple[List[str], List[Optional[str]], Optional[List[str]]]:
    texts = []
    media = []

    # 1. NEW: MAD Content Engine templates (scene, contrast, question, meme, etc.)
    if mad_engine:
        fresh_posts = mad_engine.generate_content_batch(min(5, count))
        for post in fresh_posts:
            text = post.get("content", "")
            if text and text not in texts:
                texts.append(text)
                media.append(None)

    # 2. Philosophy posts
    philo = generate_philosophy_candidates(count=max(1, count - len(texts)))
    for p in philo:
        if p not in texts:
            texts.append(p)
            media.append(None)

    # 3. $MAD-specific posts
    mad_spec = generate_mad_specific_candidates(count=max(1, count - len(texts)))
    for m in mad_spec:
        if m not in texts:
            texts.append(m)
            media.append(None)

    # 4. Celebration posts
    celeb = generate_celebration_candidates(2)
    for c in celeb:
        if c not in texts:
            texts.append(c)
            media.append(None)

    # 6. Media posts (images)
    if AUTO_POST_MEDIA:
        media_texts, media_paths = generate_media_post_candidates(2)
        for mt, mp in zip(media_texts, media_paths):
            if mt not in texts:
                texts.append(mt)
                media.append(mp)

    # 7. Thread candidates (3–4 tweet series, low probability)
    thread = generate_thread_candidates()
    return dedupe_preserve_order(texts), media, thread


# =========================================================
# SCORING
# =========================================================

ANGER_TERMS = ["panic", "cope", "coping", "weak", "weak hands", "fear", "rage", "angry", "desperate", "begging", "delusion", "clown", "broke mindset", "emotional", "reacting", "revenge trade", "bleeding", "collapse", "impulse", "fake conviction", "shaking out", "overleveraged", "wrecked", "greed", "chasing", "fomo", "jeeter", "jeeters", "paper hands"]
PAIN_TERMS = ["pain", "loss", "regret", "bagholder", "bagholding", "missed", "late entry", "wrecked", "destroyed", "down bad", "suffering", "bleed", "drawdown", "humiliation", "burned", "liquidated", "mistake", "lesson", "lessons", "scar tissue", "punished", "round trip", "trapped", "stuck", "wrong entry", "rekt"]
FLEX_TERMS = ["discipline", "patience", "execution", "conviction", "composure", "self-command", "signal", "clarity", "structure", "winner", "builders", "elite", "calm", "control", "precision", "strong", "locked in", "sharp", "unshaken", "stands firm", "commanding", "restraint", "focus", "respects execution", "$mad", "stay $mad", "mad rich", "holders", "community", "build", "building"]
HOOK_PATTERNS = [r"\byou\b", r"\byour\b", r"\bmost people\b", r"\bthe market\b", r"\bpressure\b", r"\bdiscipline\b", r"\bgreed\b", r"\bfear\b", r"\bconviction\b", r"\bconfession\b", r"\bjeeter\b", r"\bmad\b"]
STRONG_OPENERS = ["you", "most people", "the market", "pressure", "discipline", "greed", "fear", "winners", "losers", "panic", "regret", "weak hands", "jeeters", "$mad", "confession", "build"]
WEAK_PHRASES = ["i think", "maybe", "kind of", "sort of", "pretty good", "nice", "just", "perhaps", "in my opinion", "i believe", "possibly"]
ROBOTIC_PHRASES = ["mad ai says:", "according to", "as a language model", "it is important to note"]
OVERUSED_TEMPLATE_PATTERNS = [r"charts expose psychology before they reward thesis", r"pressure reveals what you were pretending not to be", r"urgency is not edge", r"your emotions are front[- ]running your plan", r"you are reacting instead of commanding", r"discipline is the flex", r"pain teaches what hype hides", r"execution beats excitement", r"calm gets paid before noise does", r"stay \$mad"]
CONTRAST_WORDS = ["but", "instead", "before", "not", "while", "yet", "until", "because"]
STOPWORDS = {"the", "a", "an", "and", "or", "to", "of", "in", "on", "for", "with", "is", "it", "that", "this", "you", "your", "are", "be", "they", "them", "we", "our", "as", "at", "by", "from", "not", "but", "if", "then", "than", "into", "out", "up", "down", "over", "under", "before", "after"}


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
    return p, {"max_similarity": round(max_sim, 4), "avg_top3_similarity": round(avg_top3, 4)}


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
    media_boost = 0.3 if is_media_post else 0.0
    reply_boost = 0.2 if is_reply else 0.0
    mad_brand_boost = 0.4 if "$mad" in s or "stay $mad" in s else 0.0
    confession_boost = 0.35 if "confession" in s else 0.0
    total = float(base_score) + anger_score + pain_score + flex_score + combo_score + hook_score + structure_score + media_boost + reply_boost + mad_brand_boost + confession_boost - novelty_pen - repeat_pen - hash_pen - weak_pen - robot_pen
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
        "matched_terms": {"anger": anger_matches, "pain": pain_matches, "flex": flex_matches},
        "similarity_details": sim_details,
        "is_media": is_media_post,
        "is_reply": is_reply,
        "log_line": (f"[SCORE] total={round(total, 2):.2f} | base={float(base_score):.2f} + anger={anger_score:.2f} + pain={pain_score:.2f} + flex={flex_score:.2f} + combo={combo_score:.2f} + hook={hook_score:.2f} + structure={structure_score:.2f} + media={media_boost:.2f} + brand={mad_brand_boost:.2f} + conf={confession_boost:.2f} - novelty={novelty_pen:.2f} - repeat={repeat_pen:.2f} - hashtags={hash_pen:.2f} - weak={weak_pen:.2f} - robotic={robot_pen:.2f}"),
        "match_log": (f"[MATCHES] anger={anger_matches} | pain={pain_matches} | flex={flex_matches} | sim={sim_details}"),
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
        result = score_candidate_with_emotional_boosts(text=candidate_text, base_score=base_score, recent_texts=recent_texts, is_media_post=is_media)
        scored.append(result)
        recent_texts.append(candidate_text)
    scored.sort(key=lambda x: x["total"], reverse=True)
    return scored


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
    if "$mad" in low:
        score += 0.6
    if "stay $mad" in low:
        score += 0.4
    if "confession" in low:
        score += 0.3
    return round(score, 2)


# =========================================================
# X API
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
    if tweepy is None:
        return None
    auth = tweepy.OAuth1UserHandler(X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET)
    return tweepy.API(auth)


def post_to_x(text: str, media_path: Optional[str] = None, reply_to: Optional[str] = None) -> Optional[str]:
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
        # Record our own tweet to prevent self-replies
        _record_own_tweet(tweet_id, text)
        return tweet_id
    except Exception as e:
        print(f"[POST ERROR] {e}")
        return None


def post_thread_to_x(texts: List[str]) -> List[Optional[str]]:
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
            _record_own_tweet(tweet_id, text)
        else:
            break
    return tweet_ids


def fetch_mentions(since_id: Optional[str] = None) -> List[Dict]:
    if tweepy is None or not X_BEARER_TOKEN:
        return []
    try:
        client = build_twitter_client_v2()
        me = client.get_me()
        if not me or not me.data:
            return []
        user_id = me.data.id
        kwargs = {"max_results": 10}
        if since_id:
            kwargs["since_id"] = since_id
        mentions = client.get_users_mentions(user_id, **kwargs)
        if mentions and mentions.data:
            results = []
            for tweet in mentions.data:
                # Skip self-mentions (bot replying to itself)
                if str(tweet.author_id) == str(user_id):
                    continue
                results.append({"id": tweet.id, "text": tweet.text, "author_id": tweet.author_id, "created_at": getattr(tweet, "created_at", None)})
            return results
    except Exception as e:
        debug(f"[MENTIONS ERROR] {e}")
    return []


def generate_reply_to_mention(mention_text: str, mode: str = MAD_AI_MODE, used_templates: Optional[set] = None) -> str:
    """Generate a reply to a mention. May use MAD humor or ecosystem replies."""
    text_lower = mention_text.lower()
    used_templates = used_templates or set()
    
    # Detect escalation requests ("harder", "well done", "more", "cook me")
    escalation_triggers = ["harder", "well done", "well-done", "cook me", "roast me", "more", "go harder", "hit me"]
    wants_escalation = any(trigger in text_lower for trigger in escalation_triggers)
    
    if wants_escalation:
        # Escalate to ecosystem template with charred cook level
        eco_reply = generate_mad_ecosystem_reply(mode="brutal")
        if eco_reply and eco_reply[:60] not in used_templates:
            return finalize_post_text(eco_reply)
    
    # 25% chance to use MAD humor for casual tweets
    if random.random() < 0.25:
        humor_reply = generate_mad_humor_reply(mention_text)
        if humor_reply and humor_reply[:60] not in used_templates:
            return finalize_post_text(humor_reply)
    
    # 20% chance to use ecosystem-aware reply (cook levels, archetypes, etc.)
    if random.random() < 0.20:
        eco_reply = generate_mad_ecosystem_reply(mode=mode)
        if eco_reply and eco_reply[:60] not in used_templates:
            return finalize_post_text(eco_reply)
    
    # Otherwise use the standard MAD AI reply
    insight = random.choice(REPLY_INSIGHTS)
    templates = REPLY_TEMPLATES.get(mode, REPLY_TEMPLATES["savage"])
    
    # Avoid templates already used this run
    available_templates = [t for t in templates if t[:60] not in used_templates]
    if not available_templates:
        available_templates = templates  # fallback if all used
    
    template = random.choice(available_templates)
    reply = template.replace("{insight}", insight)
    return finalize_post_text(reply)


# --- Spam Detection ---
SPAM_KEYWORDS = [
    "follow back", "follow me", "send me a dm", "dm me", "link in bio", 
    "check my bio", "promote", "promotion", "shill", "shilling",
    "join my", "my group", "telegram group", "discord server",
    "airdrop", "free token", "free nft", "whitelist", "wl spot",
    "giveaway", "win free", "click here", "check out my", 
    "subscribe", "sub4sub", "like4like", "follow4follow", "f4f",
    "retweet this", "rt for", "rt to win", "tag 3 friends",
    "first 100", "first 1000", "first 500", "guaranteed",
    "100x gem", "next 100x", "1000x", "moonshot", "easy 10x",
    "just launched", "presale live", "buy now", "don't miss",
    "last chance", "ending soon", "limited spots", "act fast",
]

def _is_spam_mention(text: str) -> bool:
    """Check if a mention is spam/engagement farming, not genuine conversation."""
    text_lower = text.lower()
    for keyword in SPAM_KEYWORDS:
        if keyword in text_lower:
            return True
    emoji_count = sum(1 for c in text if c in "🚀💰💎🤑🔥🌙📈💵🎁🎉🏆")
    if emoji_count >= 3:
        return True
    if len(text) > 20:
        caps_ratio = sum(1 for c in text if c.isupper()) / len(text)
        if caps_ratio > 0.5:
            return True
    return False


def reply_to_mentions(state: Dict) -> int:
    if not AUTO_REPLY_MENTIONS:
        return 0
    since_id = state.get("last_reply_id")
    mentions = fetch_mentions(since_id)
    if not mentions:
        return 0
    count = 0
    replied_this_run = set()
    used_templates_this_run = set()
    MAX_REPLIES_PER_RUN = 1  # Ultra chill: max 1 reply per check cycle
    replies_per_user: Dict[str, int] = {}
    MAX_REPLIES_PER_USER_PER_RUN = 1
    for mention in mentions:
        mention_text = mention.get("text", "")
        mention_id = mention.get("id")
        author_id = mention.get("author_id")
        if not mention_id or not mention_text:
            continue
        if mention_id in replied_this_run:
            continue
        if _is_own_tweet(mention_id, mention_text):
            debug(f"[REPLY SKIP] Own tweet detected (id={mention_id}). Skipping.")
            continue
        # NEW: Skip spam/farming mentions
        if _is_spam_mention(mention_text):
            debug(f"[REPLY SKIP] Spam mention detected. Skipping: {mention_text[:60]}...")
            continue
        if count >= MAX_REPLIES_PER_RUN:
            debug(f"[REPLY] Max replies per run ({MAX_REPLIES_PER_RUN}) reached. Skipping remaining.")
            break
        user_key = str(author_id)
        if replies_per_user.get(user_key, 0) >= MAX_REPLIES_PER_USER_PER_RUN:
            continue
        replied_this_run.add(mention_id)
        replies_per_user[user_key] = replies_per_user.get(user_key, 0) + 1
        reply_text = generate_reply_to_mention(mention_text, used_templates=used_templates_this_run)
        used_templates_this_run.add(reply_text[:60])
        debug(f"[REPLY] To {mention_id} (@{author_id}): {reply_text}")
        
        # Track this reply interaction
        if mad_memory and author_id:
            mad_memory.track_user_interaction(
                str(author_id), 'x', 'replied_to',
                content=mention_text[:200], sentiment=None
            )
        
        tweet_id = post_to_x(reply_text, reply_to=mention_id)
        if tweet_id:
            count += 1
        state["last_reply_id"] = mention_id
    if count > 0:
        save_state(state)
    return count


# --- Timeline Scanning & Learning ---

def fetch_home_timeline(max_results: int = 15) -> List[Dict]:
    """Fetch recent tweets from the bot's home timeline (For You / Following)."""
    if tweepy is None or not X_BEARER_TOKEN:
        return []
    try:
        client = build_twitter_client_v2()
        me = client.get_me()
        if not me or not me.data:
            return []
        user_id = me.data.id
        timeline = client.get_home_timeline(
            max_results=max_results,
            tweet_fields=["created_at", "public_metrics", "author_id"]
        )
        if timeline and timeline.data:
            results = []
            for tweet in timeline.data:
                # Skip our own tweets
                if str(tweet.author_id) == str(user_id):
                    continue
                # Skip tweets we've already replied to
                if _is_own_tweet(str(tweet.id), tweet.text):
                    continue
                results.append({
                    "id": tweet.id,
                    "text": tweet.text,
                    "author_id": tweet.author_id,
                    "created_at": getattr(tweet, "created_at", None),
                })
            return results
    except Exception as e:
        debug(f"[TIMELINE ERROR] {e}")
    return []


def scan_and_learn_from_timeline() -> Dict[str, Any]:
    """Scan home timeline, learn vocabulary, and optionally reply to gems."""
    if mad_learning is None:
        return {"learned": 0, "replies": 0, "skipped": 0}
    
    tweets = fetch_home_timeline(max_results=15)
    if not tweets:
        return {"learned": 0, "replies": 0, "skipped": 0}
    
    learned_total = 0
    replies_sent = 0
    skipped = 0
    
    for tweet in tweets:
        text = tweet.get("text", "")
        tweet_id = str(tweet.get("id", ""))
        
        # Skip low-quality tweets
        if not mad_learning._is_quality_tweet(text):
            skipped += 1
            continue
        
        # Learn from this tweet
        learned = mad_learning.learn_from_tweet(text, tweet_id)
        if learned["phrases"] or learned["structures"] or learned["slang"]:
            mad_learning.merge_learned(learned)
            learned_total += 1
        
        # Occasionally reply to a very good tweet (rare, max 1 per scan)
        if replies_sent < 1 and random.random() < 0.08:  # 8% chance per scan
            score = 0
            # Score the tweet for reply-worthiness
            low = text.lower()
            # Boost for engagement-worthy content
            if any(t in low for t in ["crypto", "bitcoin", "solana", "trading", "discipline", "mindset", "build"]):
                score += 2
            if len(text) >= 60:
                score += 1
            if "." in text and len(text.split(".")) >= 2:
                score += 1
            
            if score >= 3:
                reply = generate_reply_to_mention(text)
                if reply and not _is_own_tweet(tweet_id, text):
                    debug(f"[TIMELINE REPLY] To {tweet_id}: {reply}")
                    post_to_x(reply, reply_to=tweet_id)
                    replies_sent += 1
    
    stats = mad_learning.vocab_stats()
    debug(f"[LEARN] Scanned {len(tweets)} tweets. Learned from {learned_total}. Replies: {replies_sent}. Skipped: {skipped}. Vocab: {stats}")
    return {"learned": learned_total, "replies": replies_sent, "skipped": skipped, "vocab": stats}


# --- For You / Timeline Scanning ---
AUTO_SCAN_FOR_YOU = os.getenv("AUTO_SCAN_FOR_YOU", "true").lower() == "true"
FOR_YOU_CHECK_INTERVAL = int(os.getenv("FOR_YOU_CHECK_INTERVAL", "600"))
FOR_YOU_REPLY_THRESHOLD = float(os.getenv("FOR_YOU_REPLY_THRESHOLD", "7.0"))
FOR_YOU_MAX_REPLIES_PER_RUN = int(os.getenv("FOR_YOU_MAX_REPLIES_PER_RUN", "3"))

# For You scoring terms
FOR_YOU_BOOST_TERMS = [
    "crypto", "bitcoin", "btc", "solana", "sol", "altcoin", "altcoins", "trading", "chart",
    "pump", "dump", "fomo", "jeeter", "jeeters", "paper hands", "diamond hands", "hodl",
    "panic", "crash", "bear", "bull", "rug", "moon", "100x", "1000x", "gem", "gem hunting",
    "degen", "degens", "wagmi", "ngmi", "rekt", "liquidated", "leverage", "long", "short",
    "entry", "exit", "bag", "bags", "accumulate", "distribution", "whale", "retail",
    "dumb money", "smart money", "cope", "coping", "seethe", "mald", "bullish", "bearish",
    "oversold", "overbought", "resistance", "support", "breakout", "breakdown", "consolidation",
    "volume", "liquidity", "mcap", "market cap", "fdv", "circulating", "supply", "burn",
    "tokenomics", "dev", "devs", "community", "holder", "holders", "airdrop", "presale",
    "ido", "ico", "launch", "listed", "cex", "dex", "uniswap", "raydium", "jupiter",
    "phantom", "wallet", "seed phrase", "private key", "scam", "honeypot", "contract",
    "audit", "kyc", "doxxed", "anon", "team", "roadmap", "utility", "meme", "memecoin",
    "meme coin", "shitcoin", "doge", "shib", "pepe", "bonk", "wif", "bome", "slurp",
    "dip", "buy the dip", "btfd", "dca", "dollar cost", "average", "swing", "scalp",
    "position", "portfolio", "allocat", "diversify", "concentrat", "conviction", "trade",
    "invest", "speculat", "gambl", "bet", "casino", "house", "edge", "alpha", "signal",
    "noise", "narrative", "meta", "rotation", "sector", "narrative trade", "story",
    "fundamental", "technical", "ta", "fa", "indicator", "rsi", "macd", "ema", "ma",
    "moving average", "bollinger", "fibonacci", "fib", "support line", "trend line",
    "channel", "pattern", "flag", "pennant", "wedge", "triangle", "double top",
    "double bottom", "head and shoulders", "inverse", "cup and handle", "accumulation",
    "markup", "markdown", "wyckoff", "satoshi", "nakamoto", "vitalik", "buterin", "cz",
    "binance", "coinbase", "kraken", "bybit", "okx", "kucoin", "gate.io", "mexc",
    "metamask", "trust wallet", "ledger", "trezor", "hardware wallet", "cold storage",
    "hot wallet", "defi", "nft", "nfts", "dao", "dao treasury", "governance", "staking",
    "stake", "yield", "apy", "apr", "farm", "farming", "lp", "liquidity pool", "amm",
    "impermanent loss", "bridge", "layer 2", "L2", "arbitrum", "optimism", "base",
    "polygon", "matic", "avalanche", "avax", "fantom", "ftm", "chainlink", "link",
    "oracle", "data feed", "vrf", "keeper", "automation", "smart contract", "solidity",
    "rust", "move", "sui", "aptos", "sei", "injective", "inj", "celestia", "tia",
    "modular", "monolithic", "rollup", "zk", "zero knowledge", "optimistic", "fraud proof",
    "validity proof", "sequencer", "prover", "data availability", "DA", "blob", "eip-4844",
    "dencun", "shanghai", "merge", "pos", "pow", "mining", "miner", "validator",
    "validation", "node", "full node", "light client", "rpc", "endpoint", "indexer",
    "subgraph", "the graph", "ipfs", "arweave", "storage", "compute", "render", "ai",
    "artificial intelligence", "ml", "machine learning", "llm", "gpt", "agent", "agents",
    "bot", "automation", "mEV", "maximal extractable value", "sandwich", "frontrun",
    "backrun", "arbitrage", "arb", "flash loan", "attack", "exploit", "hack", "drained",
    "stolen", "recovered", "insurance", "coverage", "nexus mutual", "risk", "management",
    "position sizing", "risk/reward", "r:r", "sharpe", "sortino", "drawdown",
    "max drawdown", "volatility", "vix", "fear index", "greed", "fear", "sentiment",
    "social", "viral", "trending", "coingecko", "coinmarketcap", "cmc", "gecko",
    "dextools", "dexscreener", "birdeye", "jupiter aggregator", "aggregator", "swap",
    "route", "split", "orderflow", "payment for order flow", "pfof", "market maker",
    "mm", "otc", "over the counter", "desk", "otc desk", "block trade", "whale alert",
    "tracking", "monitor", "alert", "notification", "alpha group", "paid group",
    "discord", "telegram", "twitter", "x", "spaces", "ama", "community call",
    "town hall", "governance call", "proposal", "snapshot", "vote", "voting power",
    "vp", "delegat", "delegate", "sybil", "attack", "quadratic", "funding",
    "public goods", "retroactive", "retro funding", "optimism retro", "gitcoin",
    "grants", "clr", "matching", "donation", "crowdfunding", "ido", "ieo", "launchpad",
    "pad", "pad allocation", "whitelist", "wl", "guaranteed", "fcfs", "first come",
    "lottery", "ticket", "tier", "level", "staking requirement", "minimum", "threshold",
    "kyc required", "accredited", "investor", "vc", "venture capital", "angel", "seed",
    "series a", "fundraise", "raise", "valuation", "pre-money", "post-money", "dilution",
    "cap table", "equity", "token", "tokenize", "rwa", "real world asset", "treasury bill",
    "t-bill", "stablecoin", "stable", "usdc", "usdt", "dai", "frax", "lusd", "eusd",
    "aave", "compound", "morpho", "spark", "maker", "sky", "sDAI", "sUSDS", "euler",
    "venus", "radiant", "benqi", "geist", "cream", "iron bank", "yield protocol",
    "pendle", "yt", "pt", "principal token", "yield token", "fixed rate", "variable rate",
    "interest rate", "rate swap", "irs", "option", "options", "perp", "perpetual", "future",
    "futures", "inverse", "linear", "quanto", "margined", "collateral", "margin",
    "cross margin", "isolated", "maintenance margin", "liquidation price", "bankruptcy price",
    "funding rate", "premium", "basis", "contango", "backwardation", "open interest", "oi",
    "long/short ratio", "liquidation map", "heatmap", "cluster", "poi", "point of interest",
    "order block", "imbalance", "fair value gap", "fvg", "breaker", "mitigation", "reprice",
    "sweep", "engineered liquidity", "smart money concept", "smc", "ict",
    "inner circle trader", "breaker block", "mitigation block", "ob", "orderblock",
    "displacement", "structure shift", "bos", "choch", "change of character",
    "inducement", "liquidity grab", "stop hunt", "run the stops", "wicks", "wick",
    "wick fill", "wick rejection", "pin bar", "hammer", "shooting star", "engulfing",
    "doji", "harami", "morning star", "evening star", "three soldiers", "three crows",
    "inside bar", "outside bar", "mother bar", "inside day", "NR7", "narrow range",
    "expanding range", "volatility contraction", "volatility expansion", "squeeze",
    "bolly squeeze", "keltner", "keltner channel", "atr", "average true range",
    "bollinger bands", "bb", "standard deviation", "hv", "historical volatility",
    "iv", "implied volatility", "skew", "term structure", "calendar spread", "diagonal",
    "vertical spread", "iron condor", "butterfly", "straddle", "strangle",
    "covered call", "protective put", "collar", "risk reversal", "synthetic", "delta",
    "gamma", "theta", "vega", "rho", "greeks", "black-scholes", "binomial",
    "monte carlo", "pricing model", "valuation model", "dcf", "discounted cash flow",
    "comparable", "multiples", "pe ratio", "price to earnings", "ps ratio", "ev/ebitda",
    "metric", "kpis", "tvl", "total value locked", "mcap/tvl", "revenue", "fees",
    "fee switch", "protocol revenue", "token holder revenue", "real yield",
    "yield bearing", "rebasing", "auto-compound", "vault", "yearn", "convex", "curve",
    "crv", "cvx", "bribe", "gauge", "gauge weight", "vote escrow", "veToken", "veCRV",
    "veBAL", "locked", "lock", "escrow", "vesting", "cliff", "linear vest", "tge",
    "token generation event", "launch", "genesis", "airdrop farming", "farming",
    "sybil farming", "multi-account", "wallet farm", "nft farm", "drop farming",
    "retroactive airdrop", "uniswap airdrop", "dydx airdrop", "optimism airdrop",
    "arbitrum airdrop", "blur airdrop", "ribbon airdrop", "looksrare airdrop",
    "x2y2 airdrop", "gem airdrop", "blur bidding", "nft marketplace", "opensea",
    "looks rare", "x2y2", "sudoswap", "amm nft", "nft amm", "fractional",
    "fractionalize", "shards", "partybid", "party", "nouns", "noun", "dao noun",
    "prop house", "prop"
]

def check_and_post_milestones(state: Dict) -> bool:
    if not AUTO_MILESTONE_ALERTS:
        return False
    price_data = fetch_price_data()
    if not price_data:
        return False
    posted = False
    current_price = price_data.get("price", 0)
    if current_price > 0:
        last_announced = state.get("price_milestone_last_announced", 0.0)
        milestones = [0.0001, 0.0002, 0.0005, 0.001, 0.002, 0.005, 0.01]
        for milestone in milestones:
            if current_price >= milestone > last_announced:
                text = finalize_post_text(f"$MAD just crossed ${milestone:.4f}. Not a target. A checkpoint. The build continues. Stay $MAD.")
                tweet_id = post_to_x(text)
                if tweet_id:
                    state["price_milestone_last_announced"] = milestone
                    save_state(state)
                    posted = True
                break
    return posted


# =========================================================
# MAIN LOOP
# =========================================================

MIN_POST_INTERVAL_SECONDS = int(os.getenv("MIN_POST_INTERVAL_SECONDS", "3600"))   # 60 min
MAX_POST_INTERVAL_SECONDS = int(os.getenv("MAX_POST_INTERVAL_SECONDS", "4200"))   # 70 min
MAIN_LOOP_TICK = 60  # check every minute
PID_FILE = os.path.join(BOT_STATE_DIR, "bot.pid")

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


def main():
    if not acquire_pid_lock():
        return

    print("[BOT] $MAD Supreme Bot starting...")
    print(f"[BOT] Modes: originals={AUTO_POST_ORIGINALS}, replies={AUTO_REPLY_MENTIONS}, media={AUTO_POST_MEDIA}, threads={AUTO_POST_THREADS}, milestones={AUTO_MILESTONE_ALERTS}")
    print(f"[BOT] Dry run={AUTO_POST_DRY_RUN}, MAD AI mode={MAD_AI_MODE}")
    state = load_state()
    recent_texts: List[str] = state.get("recent_generated_or_posted_texts", [])
    recent_media: List[str] = state.get("recent_media_posted", [])
    last_reply_check = 0
    last_milestone_check = 0
    last_timeline_scan = 0
    last_web_scan = 0
    last_post_time = state.get("last_post_time", 0)
    now = time.time()
    # If last_post_time is uninitialized or absurdly old, start from now
    if last_post_time == 0 or (now - last_post_time) > 86400 * 365:
        last_post_time = int(now)
        state["last_post_time"] = last_post_time
        save_state(state)
    next_post_time = last_post_time + random.randint(MIN_POST_INTERVAL_SECONDS, MAX_POST_INTERVAL_SECONDS)
    # If next_post_time is already in the past, schedule from now
    if next_post_time <= now:
        next_post_time = int(now) + random.randint(MIN_POST_INTERVAL_SECONDS, MAX_POST_INTERVAL_SECONDS)
    print(f"[BOT] Next post scheduled in ~{int((next_post_time - now) / 60)} min (varies 60-70 min)")
    while True:
        try:
            loop_start = time.time()

            # --- LEARNING: scan timeline every 3 minutes ---
            if AUTO_SCAN_FOR_YOU and loop_start - last_timeline_scan >= 180:
                debug("[LEARN] Scanning timeline for vocabulary...")
                scan_result = scan_and_learn_from_timeline()
                if scan_result.get("learned", 0) > 0:
                    print(f"[LEARN] Learned from {scan_result['learned']} tweets. Vocab size: {scan_result.get('vocab', {})}")
                last_timeline_scan = loop_start

            # --- WEB LEARNING: scan news/blogs every 30 minutes ---
            if mad_web_learning and loop_start - last_web_scan >= 1800:
                debug("[WEB LEARN] Scanning news feeds for vocabulary...")
                web_result = mad_web_learning.learn_from_web(max_feeds=3, max_per_feed=3)
                if web_result.get("phrases_learned", 0) > 0:
                    print(f"[WEB LEARN] Sources: {web_result['sources']} | Phrases: {web_result['phrases_learned']} | Trends: {web_result['trends_found'][:3]}")
                last_web_scan = loop_start

            # --- REPLIES: check frequently ---
            if AUTO_REPLY_MENTIONS and loop_start - last_reply_check >= REPLY_CHECK_INTERVAL_SECONDS:
                debug("[REPLY] Checking mentions...")
                reply_count = reply_to_mentions(state)
                if reply_count > 0:
                    print(f"[REPLY] Sent {reply_count} replies.")
                last_reply_check = loop_start
                state = load_state()

            # --- MILESTONES: every 10 min ---
            if AUTO_MILESTONE_ALERTS and loop_start - last_milestone_check >= 600:
                debug("[MILESTONE] Checking milestones...")
                if check_and_post_milestones(state):
                    print("[MILESTONE] Posted milestone alert.")
                last_milestone_check = loop_start
                state = load_state()

            # --- ORIGINAL POSTS: only when interval elapsed ---
            if AUTO_POST_ORIGINALS and loop_start >= next_post_time:
                print("[POST] Generating candidates...")
                texts, media_paths, thread = generate_all_candidates(POST_CANDIDATE_COUNT)
                base_scores = [simple_base_score(text) for text in texts]
                media_flags = [m is not None for m in media_paths]
                ranked = rerank_candidates_with_emotional_boosts(candidates=texts, base_scores=base_scores, media_flags=media_flags, recent_texts=recent_texts)
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
                    if best["is_media"]:
                        for t, m in zip(texts, media_paths):
                            if t == final_text:
                                best_media = m
                                break
                    print(f"[QUEUE] best_score={final_score:.2f}")
                    print(f"[QUEUE] best_text={final_text}")
                    # === MEME INTEGRATION ===
                    # 25% chance to attach a matching meme if no media already
                    meme_path = None
                    if mi and not best_media and mi.should_post_meme():
                        meme_path, meme_caption = mi.pick_meme_for_post(final_text)
                        if meme_path:
                            print(f"[MEME] Attaching: {os.path.basename(meme_path)} | Style: {meme_caption[:40]}...")
                            # If meme caption complements the text, append it
                            if meme_caption and len(final_text) + len(meme_caption) < MAX_POST_LENGTH - 10:
                                final_text = f"{final_text}\n\n{meme_caption}"
                            best_media = meme_path
                    
                    if final_score >= AUTO_POST_MIN_SCORE:
                        # 24h dedup: don't post exact text already posted recently
                        norm_final = normalize(final_text)
                        if any(norm_final == normalize(rt) for rt in recent_texts[-24:]):
                            print(f"[DEDUP] Exact text posted recently. Skipping.")
                            tweet_id = None
                        else:
                            tweet_id = post_to_x(final_text, media_path=best_media)
                        if tweet_id:
                            recent_texts.append(final_text)
                            recent_texts = recent_texts[-60:]
                            if best_media:
                                recent_media.append(best_media)
                                recent_media = recent_media[-20:]
                            state["recent_generated_or_posted_texts"] = recent_texts
                            state["recent_media_posted"] = recent_media
                            state["last_post_time"] = int(time.time())
                            save_state(state)
                            print("[AUTO POST] Posted successfully.")
                        else:
                            if AUTO_POST_DRY_RUN:
                                print("[AUTO POST] Dry run only. Nothing was posted.")
                            else:
                                print("[AUTO POST] Failed to post.")
                    else:
                        print(f"[AUTO POST] Score {final_score:.2f} below threshold {AUTO_POST_MIN_SCORE}. Skipped.")

                    # Threads only occasionally (not every post) + deduplication
                    if thread and AUTO_POST_THREADS and random.random() < 0.25:
                        # Check if this thread is too similar to a recently posted one
                        thread_key = normalize(thread[0]) if thread else ""
                        posted_threads = state.get("posted_threads", [])
                        is_duplicate = False
                        for pt in posted_threads[-10:]:
                            old_key = normalize(pt.get("texts", [""])[0]) if pt.get("texts") else ""
                            if old_key and combined_similarity(thread_key, old_key) > 0.7:
                                is_duplicate = True
                                break
                        
                        if is_duplicate:
                            print("[THREAD] Skipped — too similar to recent thread.")
                        else:
                            print(f"[THREAD] Generated thread of {len(thread)} tweets")
                            if not AUTO_POST_DRY_RUN:
                                thread_ids = post_thread_to_x(thread)
                                if thread_ids and thread_ids[0]:
                                    recent_texts.extend(thread)
                                    recent_texts = recent_texts[-60:]
                                    state["recent_generated_or_posted_texts"] = recent_texts
                                    state["posted_threads"].append({"ids": thread_ids, "texts": thread, "posted_at": datetime.now().isoformat()})
                                    # Keep only last 20 threads in state
                                    state["posted_threads"] = state["posted_threads"][-20:]
                                    save_state(state)
                                    print("[THREAD] Posted successfully.")
                            else:
                                print("[THREAD] Dry run — not posted.")
                else:
                    print("[POST] No candidates generated.")

                # Schedule next post (random 60-70 min from now)
                next_post_time = loop_start + random.randint(MIN_POST_INTERVAL_SECONDS, MAX_POST_INTERVAL_SECONDS)
                print(f"[BOT] Next post scheduled in ~{int((next_post_time - loop_start) / 60)} min (varies 60-70 min)")
            else:
                mins_until_post = max(0, int((next_post_time - loop_start) / 60))
                if mins_until_post > 0 and loop_start % 300 < MAIN_LOOP_TICK:
                    print(f"[BOT] Next post in {mins_until_post} min | Replies active")

            time.sleep(MAIN_LOOP_TICK)
        except KeyboardInterrupt:
            print("\n[BOT] stopped by user.")
            break
        except Exception as e:
            print(f"[ERROR] {e}")
            time.sleep(60)


if __name__ == "__main__":
    main()

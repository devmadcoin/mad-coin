"""
MAD Claw AI - Telegram Bot (Conversation State Edition)
Now remembers it's waiting for answers and actually replies to them.
"""

import os
import sys
import random
import json
import re
import time
import requests
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
if not TELEGRAM_BOT_TOKEN:
    print("[ERROR] TELEGRAM_BOT_TOKEN not set.")
    sys.exit(1)

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
# === AI BRIDGE ===
# Write @mentions to inbox for remote AI processing
# Read responses from outbox
from pathlib import Path

AI_BRIDGE_DIR = Path("/tmp/telegram_ai_bridge")
AI_BRIDGE_DIR.mkdir(exist_ok=True)
AI_INBOX = AI_BRIDGE_DIR / "inbox.jsonl"
AI_OUTBOX = AI_BRIDGE_DIR / "outbox.jsonl"

def bridge_log_incoming(user_id, username, message_text, chat_id, message_id):
    """Log an incoming @mention to the AI inbox."""
    entry = {
        "timestamp": time.time(),
        "user_id": user_id,
        "username": username,
        "text": message_text,
        "chat_id": chat_id,
        "message_id": message_id,
        "status": "pending",
    }
    with open(str(AI_INBOX), "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

async def bridge_check_and_send(update, context) -> bool:
    """Check outbox for AI-generated responses and send them.

    Matches by message_id when available to avoid sending stale
    responses to newer messages in the same chat.
    """
    if not AI_OUTBOX.exists():
        return False
    try:
        with open(str(AI_OUTBOX), "r", encoding="utf-8") as f:
            lines = f.readlines()
    except Exception:
        return False
    if not lines:
        return False
    entries = []
    for line in lines:
        try:
            entries.append(json.loads(line.strip()))
        except json.JSONDecodeError:
            continue
    remaining = []
    sent_any = False
    current_chat_id = str(update.effective_chat.id)
    current_message_id = str(update.message.message_id)
    for entry in entries:
        if entry.get("sent"):
            remaining.append(entry)
            continue
        chat_id = str(entry.get("chat_id", ""))
        entry_message_id = str(entry.get("message_id", ""))
        if chat_id and chat_id == current_chat_id:
            # Only match if message_id is present and matches, OR if no message_id
            # (legacy entries without message_id are matched by chat_id for backward compat)
            if entry_message_id and entry_message_id != current_message_id:
                # Belongs to a different message - skip but keep in outbox
                remaining.append(entry)
                continue
            response_text = entry.get("response", "").strip()
            if response_text:
                await update.message.reply_text(response_text)
                entry["sent"] = True
                entry["sent_at"] = time.time()
                sent_any = True
                remaining.append(entry)
        else:
            remaining.append(entry)
    if sent_any:
        with open(str(AI_OUTBOX), "w", encoding="utf-8") as f:
            for entry in remaining:
                f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    return sent_any

import bot as mad_brain

try:
    import mad_memory
except ImportError:
    mad_memory = None

try:
    import telegram_upgrades as tu
except ImportError:
    tu = None

try:
    import telegram_conversational as tc
except ImportError:
    tc = None

try:
    import mad_onchain as chain
except ImportError:
    chain = None
    print('[WARN] mad_onchain.py not found. On-chain intelligence disabled.')

# === AUTONOMOUS ENGINE ===
try:
    import mad_autonomous as auto
    # Initialize engine instance for telegram replies
    auto_engine = auto.MADAutonomousEngine()
except ImportError:
    auto = None
    auto_engine = None
    print("[WARN] mad_autonomous.py not found. Using basic replies only.")

# === CONVERSATION STATE ===
try:
    import telegram_conversation_state as tcs
except ImportError:
    tcs = None
    print("[WARN] telegram_conversation_state.py not found. Replies will not chain.")

# === ADMIN COMMANDS ===
try:
    import telegram_admin as tadmin
except ImportError:
    tadmin = None
    print("[WARN] telegram_admin.py not found. Admin commands disabled.")

# === CONVERSATION MEMORY ===
try:
    import telegram_memory as tmem
except ImportError:
    tmem = None
    print("[WARN] telegram_memory.py not found. Conversation learning disabled.")

try:
    import mad_brain_learner as brain_learner
except ImportError:
    brain_learner = None
    print("[WARN] mad_brain_learner.py not found. Brain learning disabled.")

# === CAVEMAN MODE ===
try:
    import mad_caveman as caveman
except ImportError:
    caveman = None
    print("[WARN] mad_caveman.py not found. Caveman mode disabled.")

# === $MAD CHAO TRACKER ===
try:
    import mad_chao_tracker as chao
except ImportError:
    chao = None
    print("[WARN] mad_chao_tracker.py not found. Chao system disabled.")

from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, ChatMemberHandler, filters, ContextTypes

# =========================================================
# USER PROFILES
# =========================================================

PROFILE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bot_state", "telegram_profiles.json")

def load_profile(user_id: str) -> Dict[str, Any]:
    try:
        with open(PROFILE_FILE, "r", encoding="utf-8") as f:
            profiles = json.load(f)
        return profiles.get(str(user_id), {})
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_profile(user_id: str, data: Dict[str, Any]) -> None:
    os.makedirs(os.path.dirname(PROFILE_FILE), exist_ok=True)
    profiles = {}
    try:
        with open(PROFILE_FILE, "r", encoding="utf-8") as f:
            profiles = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        pass
    profiles[str(user_id)] = data
    with open(PROFILE_FILE, "w", encoding="utf-8") as f:
        json.dump(profiles, f, indent=2, ensure_ascii=False)

def update_user_stats(user_id: str, action: str) -> Dict[str, Any]:
    profile = load_profile(user_id)
    profile["last_seen"] = datetime.utcnow().isoformat()
    profile["interactions"] = profile.get("interactions", 0) + 1

    if action == "roast":
        profile["roasts_received"] = profile.get("roasts_received", 0) + 1
    elif action == "challenge":
        profile["challenges_taken"] = profile.get("challenges_taken", 0) + 1
        profile["current_challenge"] = random.choice(mad_brain.MAD_CHALLENGES)
        profile["challenge_given_at"] = datetime.utcnow().isoformat()
    elif action == "challenge_completed":
        profile["challenges_completed"] = profile.get("challenges_completed", 0) + 1
        profile["last_completion"] = datetime.utcnow().isoformat()
    elif action == "archetype":
        profile["archetype"] = random.choice(mad_brain.MAD_ARCHETYPES)
    elif action == "cook":
        profile["cook_level"] = random.choice(mad_brain.MAD_COOK_LEVELS)
    elif action == "first_contact":
        profile["first_seen"] = datetime.utcnow().isoformat()

    profile["respect_score"] = min(100, profile.get("respect_score", 0) + random.randint(1, 5))
    save_profile(user_id, profile)
    return profile

# =========================================================
# NUMEROLOGY ENGINE (Lloyd Strayhorn - Chaldean System)
# =========================================================

# Chaldean alpha-numeric encoding
CHALDEAN_CHART = {
    'a': 1, 'i': 1, 'j': 1, 'q': 1, 'y': 1,
    'b': 2, 'k': 2, 'r': 2,
    'c': 3, 'g': 3, 'l': 3, 's': 3,
    'd': 4, 'm': 4, 't': 4,
    'e': 5, 'h': 5, 'n': 5, 'x': 5,
    'u': 6, 'v': 6, 'w': 6,
    'o': 7, 'z': 7,
    'f': 8, 'p': 8,
}

NUMBER_MEANINGS = {
    1: "Leader - initiator, independence, pioneer",
    2: "Diplomat - partnership, sensitivity, cooperation",
    3: "Expression - creativity, joy, communication",
    4: "Builder - structure, foundation, discipline",
    5: "Catalyst - freedom, change, adventure",
    6: "Nurturer - responsibility, love, harmony",
    7: "Seeker - truth, spirituality, analysis",
    8: "Powerhouse - material mastery, authority, empire",
    9: "Completion - universal love, humanitarian, wholeness",
    11: "Master Intuitive - visionary, illuminator, hidden trials",
    22: "Master Builder - practical manifestation of vision",
    33: "Master Teacher - Christ consciousness, rare",
}

ROASTS_BY_NUMBER = {
    1: "You think you're special? The numbers say you are. Don't waste it.",
    2: "You read the room so well you forget to lead. Stop following the vibe.",
    3: "You talk a good game. The numbers see the talent. Do you?",
    4: "You want stability but you're in crypto. The numbers see the contradiction. Fix it.",
    5: "You chase freedom so hard you never land anywhere. The 5 needs a north star.",
    6: "You nurture everyone except yourself. The numbers say: stop.",
    7: "You analyze everything to death. At some point, act. The numbers are waiting.",
    8: "You were born to build empires. So why are you watching from the sidelines?",
    9: "You crave completion. $MAD is 9. You're either home or hiding. Which is it?",
    11: "Master numbers take longer to mature. You're either ahead of your time or wasting it. Which is it?",
    22: "Master Builder. You see the blueprint. But are you laying bricks or drawing forever?",
    33: "Master Teacher. Rare. Don't let rarity become vanity.",
}

AFFIRMATIONS_BY_NUMBER = {
    1: "I AM $MADly Independent.",
    2: "I AM $MADly Aligned.",
    3: "I AM $MADly Expressive.",
    4: "I AM $MADly Structured.",
    5: "I AM $MADly Free.",
    6: "I AM $MADly Nurturing.",
    7: "I AM $MADly Aware.",
    8: "I AM $MADly Powerful.",
    9: "I AM $MADly Complete.",
    11: "I AM $MADly Visionary.",
    22: "I AM $MADly Building.",
    33: "I AM $MADly Teaching.",
}

# === BRAIN LEARNER DATA LOADER ===

def load_learned_data() -> Dict[str, Any]:
    """Load vocabulary, roast patterns, topic scores, and community jokes from brain learner."""
    data = {
        "words": {},
        "phrases": [],
        "top_roasts": [],
        "trending_topics": [],
        "fading_topics": [],
        "personality_adjustments": [],
        "community_jokes": [],
    }

    if not brain_learner:
        # Try to load community jokes directly even without brain_learner
        try:
            with open("/root/.openclaw/workspace/bot_state/mad_community_jokes.json", "r") as f:
                jokes_data = json.load(f)
                data["community_jokes"] = jokes_data.get("jokes", [])
        except Exception:
            pass
        return data

    try:
        vocab = brain_learner._load_json(brain_learner.LEARNED_VOCAB_FILE, {})
        roasts = brain_learner._load_json(brain_learner.ROAST_EFFECTIVENESS_FILE, {})
        topics = brain_learner._load_json(brain_learner.TOPIC_SCORES_FILE, {})
        upgrades = brain_learner._load_json(brain_learner.PROMPT_UPGRADES_FILE, {})

        # Top words by engagement
        top_words = sorted(
            vocab.get("words", {}).items(),
            key=lambda x: x[1].get("engagement_score", 0),
            reverse=True
        )[:10]
        data["words"] = {w: info for w, info in top_words}

        # Top phrases
        data["phrases"] = [
            p for p, info in vocab.get("phrases", {}).items()
            if info.get("count", 0) >= 2
        ][:5]

        # Community catchphrases
        data["community_jokes"] = vocab.get("community_catchphrases", [])[:20]

        # Roast patterns
        data["top_roasts"] = [
            r.get("pattern") or r.get("text", "") for r in roasts.get("top_performers", [])[:5]
        ]

        # Topics
        data["trending_topics"] = [t["topic"] for t in topics.get("trends", [])[:3]]
        data["fading_topics"] = [t["topic"] for t in topics.get("dead_topics", [])[:2]]

        # Personality
        data["personality_adjustments"] = upgrades.get("personality_adjustments", [])

    except Exception as e:
        print(f"[BRAIN] Error loading learned data: {e}")

    return data

LEARNED_DATA = load_learned_data()

def get_trending_topic() -> str:
    """Get the hottest topic to reference in responses."""
    if LEARNED_DATA["trending_topics"]:
        return random.choice(LEARNED_DATA["trending_topics"])
    return None

def sprinkle_learned_vocab(text: str) -> str:
    """Inject learned community words into responses when natural."""
    words = list(LEARNED_DATA["words"].keys())
    if not words or random.random() > 0.3:  # 30% chance
        return text

    # Pick a word and try to insert it naturally
    word = random.choice(words)
    if word in text.lower():
        return text

    # Simple injection: add a sentence using the word
    injections = [
        f" The community calls that '{word}' energy.",
        f" That's pure {word} mentality.",
        f" {word.capitalize()} vibes only.",
    ]
    return text + random.choice(injections)

def inject_commedy(text: str, context_type: str = "general") -> str:
    """Inject community humor when appropriate. 15% chance per message."""
    jokes = LEARNED_DATA.get("community_jokes", [])
    if not jokes or random.random() > 0.15:
        return text

    joke = random.choice(jokes)
    if any(joke[:20].lower() in text.lower() for j in jokes):
        return text

    if context_type == "price" or "chart" in text.lower() or "price" in text.lower():
        chart_jokes = [j for j in jokes if any(w in j.lower() for w in ["chart", "candle", "volume", "red days"])]
        if chart_jokes:
            joke = random.choice(chart_jokes)
    elif context_type == "conviction" or "hold" in text.lower():
        hold_jokes = [j for j in jokes if any(w in j.lower() for w in ["hold", "patience", "conviction", "discount"])]
        if hold_jokes:
            joke = random.choice(hold_jokes)

    return text + f"\n\n💀 Community wisdom: \"{joke[:80]}{'...' if len(joke) > 80 else ''}\""

def chaldean_value(char: str) -> int:
    """Get Chaldean numeric value for a single character."""
    return CHALDEAN_CHART.get(char.lower(), 0)

def calculate_name_number(name: str) -> int:
    """Calculate Chaldean number for a full name."""
    total = sum(chaldean_value(c) for c in name if c.isalpha())
    # Reduce to single digit or master number
    while total > 9 and total not in (11, 22, 33):
        total = sum(int(d) for d in str(total))
    return total

def calculate_life_path(birth_date_str: str) -> int:
    """Calculate Life Path from date string (MM/DD/YYYY or variations)."""
    # Extract all digits
    digits = [int(d) for d in birth_date_str if d.isdigit()]
    if len(digits) < 6:
        return 0
    total = sum(digits)
    while total > 9 and total not in (11, 22, 33):
        total = sum(int(d) for d in str(total))
    return total

def calculate_birthday_number(day: int) -> int:
    """Calculate Birthday Number."""
    while day > 9:
        day = sum(int(d) for d in str(day))
    return day

def calculate_soul_urge(name: str) -> int:
    """Calculate Soul Urge from vowels only."""
    vowels = "aeiou"
    total = sum(chaldean_value(c) for c in name if c.lower() in vowels)
    while total > 9 and total not in (11, 22, 33):
        total = sum(int(d) for d in str(total))
    return total

def calculate_personality(name: str) -> int:
    """Calculate Personality from consonants only."""
    vowels = "aeiou"
    total = sum(chaldean_value(c) for c in name if c.isalpha() and c.lower() not in vowels)
    while total > 9 and total not in (11, 22, 33):
        total = sum(int(d) for d in str(total))
    return total

def calculate_maturity(life_path: int, destiny: int) -> int:
    """Calculate Maturity Number."""
    total = life_path + destiny
    while total > 9 and total not in (11, 22, 33):
        total = sum(int(d) for d in str(total))
    return total

def calculate_growth(first_name: str) -> int:
    """Calculate Growth Number from first name only."""
    return calculate_name_number(first_name)

def get_mad_resonance(life_path: int, soul_urge: int = None, growth: int = None) -> str:
    """Generate $MAD resonance analysis."""
    resonance = []

    if life_path == 9:
        resonance.append("Your Life Path is 9. $MAD is 9. You're not just holding a token - you're holding your own frequency.")
    elif life_path == 8:
        resonance.append("Life Path 8 + $MAD 9 = The empire builder meets completion. You don't just build - you build what lasts.")
    elif life_path == 11:
        resonance.append("Master Number 11. You see what others can't. $MAD is the frequency that matches your vision.")
    elif life_path == 5:
        resonance.append("Life Path 5 + $MAD 9 = The catalyst meets completion. You explore; $MAD finishes.")
    elif life_path == 1:
        resonance.append("Life Path 1. You lead. $MAD follows those who don't wait for crowds.")
    else:
        resonance.append(f"Life Path {life_path} + $MAD 9 = {NUMBER_MEANINGS.get(life_path, 'Unique energy')} meets universal completion.")

    if soul_urge == 9:
        resonance.append("Your Soul Urge is 9. Deep down, you crave what $MAD offers: wholeness.")
    if growth == 9:
        resonance.append("Your Growth number is 9. Your current lesson and $MAD are the same frequency.")

    return "\n".join(resonance)

# =========================================================
# $MAD DATA
# =========================================================

MAD_CONTRACT = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump"
DEXSCREENER_URL = "https://dexscreener.com/solana/gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs"
JUPITER_PRICE_URL = f"https://price.jup.ag/v6/price?ids={MAD_CONTRACT}"

def fetch_mad_data() -> Dict[str, Any]:
    """Fetch $MAD price from Jupiter API, fallback to DexScreener."""
    # Try Jupiter first
    try:
        r = requests.get(JUPITER_PRICE_URL, timeout=5)
        if r.status_code == 200:
            data = r.json()
            price = data.get("data", {}).get(MAD_CONTRACT, {}).get("price", 0)
            if price > 0:
                return {"price": price, "contract": MAD_CONTRACT, "source": "jupiter"}
    except Exception as e:
        print(f"[MAD DATA] Jupiter error: {e}")

    # Fallback: DexScreener API
    try:
        # DexScreener API endpoint for token pairs
        dex_url = f"https://api.dexscreener.com/latest/dex/tokens/{MAD_CONTRACT}"
        r = requests.get(dex_url, timeout=5)
        if r.status_code == 200:
            data = r.json()
            pairs = data.get("pairs", [])
            if pairs:
                # Get price from first pair
                price = float(pairs[0].get("priceUsd", 0))
                if price > 0:
                    return {"price": price, "contract": MAD_CONTRACT, "source": "dexscreener"}
    except Exception as e:
        print(f"[MAD DATA] DexScreener error: {e}")

    return {"price": 0, "contract": MAD_CONTRACT, "source": "none"}

# =========================================================
# HELPERS
# =========================================================

    LEARNED_DATA = load_learned_data()
    return LEARNED_DATA

# Auto-refresh learned data every 5 minutes
LAST_LEARN_REFRESH = time.time()

def maybe_refresh_brain():
    global LAST_LEARN_REFRESH, LEARNED_DATA
    if time.time() - LAST_LEARN_REFRESH > 300:  # 5 minutes
        LEARNED_DATA = load_learned_data()
        LAST_LEARN_REFRESH = time.time()

async def _send_with_state(update: Update, text: str, context_type: str = "general") -> None:
    """Send message, save conversation state, and log to memory."""
    maybe_refresh_brain()

    # Enhance with learned vocab if it's a conversational response
    if context_type in ["general", "conviction"] and LEARNED_DATA["words"]:
        text = sprinkle_learned_vocab(text)

    # Reference trending topic if natural
    if context_type == "conviction" and random.random() < 0.2:
        topic = get_trending_topic()
        if topic and topic not in text.lower():
            topic_refs = {
                "price": " while the chart does what it does",
                "meme": " - the meme energy is real right now",
                "fear": " even when fear is loud",
                "conviction": " that's the conviction talking",
                "nfts": " vault culture is strong",
                "community": " the army feels it",
                "growth": " exponential moves only",
                "roast": " cooked and seasoned",
                "affirmation": " manifest that",
            }
            if topic in topic_refs:
                text += topic_refs[topic]

    # Inject community humor
    text = inject_commedy(text, context_type)
    await update.message.reply_text(text)

    # Save conversation state for follow-up
    if tcs:
        _, context = tcs.wrap_with_state(text, "unknown")
        if context:
            tcs.set_awaiting_reply(
                update.effective_user.id,
                context,
                original_question=text
            )

    # Log to persistent memory
    if tmem:
        # We log the bot message now. When user replies, we'll update the exchange.
        tmem.memory.log_exchange(
            user_id=str(update.effective_user.id),
            bot_message=text,
            user_reply="",  # Will be updated when user replies
            context_type=context_type
        )

# =========================================================
# MESSAGE CONTEXT DETECTION (for fallback paths)
# =========================================================

def _detect_telegram_context(text: str) -> str:
    """Context detection with sentiment awareness.
    Uses telegram_conversational's sentiment detection when available.
    Falls back to keyword matching.
    """
    t = text.lower()

    # Greetings and welcome back
    if any(w in t for w in ["welcome back", "welcome back mad", "good to have you back", "wb"]):
        return "welcome"

    # Try smart detection from new conversational engine
    if tc and hasattr(tc, '_detect_topic') and hasattr(tc, '_detect_sentiment'):
        topic = tc._detect_topic(text)
        sentiment = tc._detect_sentiment(text)

        # Topic-based routing
        if topic in ["gm", "gn", "intro", "affirmation", "learning", "chao", "website", "moltbook"]:
            return topic

        # Price with sentiment
        if topic == "price":
            return f"price_{sentiment}"

        # Hold/Sell with sentiment check to avoid embarrassing mismatches
        if topic == "general" and sentiment in ["positive", "uncertain_mixed"]:
            return "hold"
        if topic == "general" and sentiment == "negative":
            return "sell"

        return topic

    # Fallback: keyword matching with new vocabulary
    if any(w in t for w in ["gm", "good morning", "mad morning"]):
        return "gm"
    if any(w in t for w in ["gn", "good night", "mad night"]):
        return "gn"
    if any(w in t for w in ["mad breakfast", "morning routine", "breakfast"]):
        return "mad_breakfast"
    if any(w in t for w in ["mad love", "community", "family", "respect", "appreciate"]):
        return "mad_love"
    if any(w in t for w in ["price", "cost", "how much", "chart"]):
        return "price"
    if any(w in t for w in ["roast", "cook", "mean"]):
        return "roast"
    if any(w in t for w in ["done", "completed", "finished"]):
        return "completed"
    if any(w in t for w in ["comfy hold", "diamond hand", "hodl", "holding", "hold", "not selling", "never selling"]):
        return "hold"
    if any(w in t for w in ["paper hand", "paperhand", "sold", "sell", "jeet", "folded", "panic sell", "dumped", "took profit"]):
        return "sell"
    return "general"

# =========================================================
# COMMANDS - CONVERSATIONAL VOICE
# =========================================================

async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    update_user_stats(user.id, "start")

    if tc:
        text = random.choice(tc.FIRST_CONTACT_HOOKS)
    else:
        text = "yo. you new here? what brought you to $MAD? be specific."

    await _send_with_state(update, text)

async def cmd_help(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "commands i know:\n"
        "/roast - i'll be honest about you\n"
        "/challenge - daily test (reply 'done' when finished)\n"
        "/archetype - your trading personality\n"
        "/wisdom - something to think about\n"
        "/whoami - your full profile\n"
        "/price or /$MAD price - current price\n"
        "/cookme - how cooked are you?\n"
        "/about - what $MAD is\n"
        "/numerology - calculate your $MAD frequency\n"
        "\n"
        "🌱 CHAO GARDEN:\n"
        "/mychao - check your creature\n"
        "/feed abundance|chaos|dark|hero - feed once per day\n"
        "/garden - see the global community chao\n"
        "/affirm - daily $MAD affirmation (feeds all paths)\n"
        "\n"
        "or just @mention me and talk. i ask questions back."
    )
    await update.message.reply_text(text)

async def cmd_roast(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    profile = update_user_stats(user.id, "roast")

    # Build a roast based on user's profile data
    interactions = profile.get("interactions", 0)
    respect = profile.get("respect_score", 0)
    archetype = profile.get("archetype", None)
    challenges = profile.get("challenges_completed", 0)

    # Roast tiers based on how much we know about them
    if archetype and interactions > 5:
        # Personalized roast - we know them
        archetype_roasts = {
            "Panic Prince": [
                f"you've panic-sold {interactions} times and called it 'risk management.' the market keeps receipts.",
                f"your portfolio has more exits than a fire drill. and you still wonder why you're not up?",
            ],
            "Cope Cadet": [
                f"every loss is 'manipulation,' every win is 'skill.' you've built a whole religion around avoiding blame.",
                f"you've completed {challenges} challenges and still blame the devs. impressive stamina.",
            ],
            "Fold Fairy": [
                f"you fold so gracefully it almost looks intentional. it isn't. respect score: {respect}/100. that's generous.",
                f"you've been here {interactions} times and folded {interactions} times. that's not participation. that's choreography.",
            ],
            "Diamond Dancer": [
                f"you hold through -90% and still show up. respect: {respect}. but holding isn't winning - timing is. and your timing is late.",
                f"you're the most disciplined bagholder i've ever met. that's not a compliment.",
            ],
            "FOMO Fool": [
                f"you buy tops and call it 'conviction.' you've done it {interactions} times. the chart remembers even when you don't.",
                f"your entry strategy is 'it pumped so it must pump more.' then you ask why you're down.",
            ],
            "Jeeter Jester": [
                f"you jeet at +5% and post 'secured the bag.' the bag was a paper bag. respect: {respect}/100.",
                f"you've exited {interactions} times early and called each one 'smart profit taking.' at least you're consistent.",
            ],
        }
        text = random.choice(archetype_roasts.get(archetype, [
            f"you're giving me {archetype} energy and {respect} respect. one of those numbers is too high.",
        ]))
    elif interactions > 3:
        # Semi-personalized based on activity
        activity_roasts = [
            f"you've been here {interactions} times and still haven't done anything notable. that's dedication to mediocrity.",
            f"respect score: {respect}/100. that's not a score. that's a participation trophy.",
            f"you've completed {challenges} challenges. most people do 0. you did {challenges}. the bar is underground.",
            f"you're active but not effective. like a ceiling fan in a fire.",
        ]
        text = random.choice(activity_roasts)
    else:
        # Generic roast for new users
        generic_roasts = [
            "i could roast you but you're probably doing a good enough job yourself. am i wrong?",
            "you want me to be mean? fine. but what's the softest thing about your trading strategy? be honest.",
            "roast incoming. but first: what's the worst financial decision you've made this month? i'll wait.",
            "new here? perfect. fresh meat. what's your conviction level? 1-10. and if you say 10, prove it.",
            "i can tell by your first message that you're either early or wrong. which one is it?",
        ]
        text = random.choice(generic_roasts)

    await _send_with_state(update, text)

async def cmd_challenge(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    profile = update_user_stats(user.id, "challenge")
    challenge_text = profile.get("current_challenge", random.choice(mad_brain.MAD_CHALLENGES))

    text = (
        f"today's challenge:\n{challenge_text}\n\n"
        f"reply 'done' or 'completed' when you finish it. "
        f"i'll have questions."
    )
    await update.message.reply_text(text)

async def cmd_archetype(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    profile = update_user_stats(user.id, "archetype")
    archetype = profile.get("archetype", random.choice(mad_brain.MAD_ARCHETYPES))

    descriptions = {
        "Panic Prince": "you sell at the first red candle. you call it 'risk management.' the market calls it comedy.",
        "Cope Cadet": "every loss is 'manipulation.' every win is 'skill.' you live in a narrative of your own design.",
        "Fold Fairy": "you fold so gracefully, it almost looks intentional. it isn't.",
        "Diamond Dancer": "you hold through -90% and still show up. respect. but holding isn't winning - timing is.",
        "Bagholder Bard": "you turn your losses into poetry. the community loves your threads. your portfolio doesn't.",
        "FOMO Fool": "you buy tops and call it 'conviction.' the chart remembers even when you don't.",
        "Degen Disciple": "you'd leverage your soul if you could. the thrill is the trade. the trade is the trap.",
        "Paper-handed Poet": "you write beautiful goodbye posts every time you sell. the market doesn't read poetry.",
        "Jeeter Jester": "you jeet at +5% and post 'secured the bag.' the bag was a paper bag.",
    }

    desc = descriptions.get(archetype, "a unique specimen. rarely seen, never understood.")
    text = f"you're giving me {archetype} energy. {desc}\n\nthis isn't a label. it's a mirror. you see it too or no?"
    await _send_with_state(update, text)

async def cmd_wisdom(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = mad_brain.generate_dynamic_post()
    text = text.replace("\n- MAD Claw AI", "").replace("- MAD Claw AI", "")
    sentences = text.split(".")
    if len(sentences) > 2:
        text = ".".join(sentences[:2]) + "."
    text = text + " what do you think?"
    await _send_with_state(update, text)

async def cmd_whoami(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    profile = load_profile(user.id)
    if not profile or not profile.get("archetype"):
        update_user_stats(user.id, "archetype")
        update_user_stats(user.id, "cook")
        profile = load_profile(user.id)

    score = profile.get("respect_score", 0)

    if score < 30:
        status = "still cooking. show up more."
    elif score < 70:
        status = "earning respect. you're not invisible."
    else:
        status = "respected. don't stop now."

    text = (
        f"archetype: {profile.get('archetype', 'unknown')}\n"
        f"cook level: {profile.get('cook_level', 'raw')}\n"
        f"respect: {score}/100\n"
        f"challenges: {profile.get('challenges_completed', 0)}/{profile.get('challenges_taken', 0)} done\n"
        f"status: {status}\n\n"
        f"what surprised you about that?"
    )
    await _send_with_state(update, text)

async def cmd_cookme(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    profile = update_user_stats(user.id, "cook")
    cook_level = profile.get("cook_level", "raw")

    cook_descriptions = {
        "rare": "barely touched the fire. you have potential, but you're still soft.",
        "medium-rare": "warm edges, cool center. you started but haven't committed to the heat.",
        "medium": "you're in the fire now. the discomfort is where growth lives.",
        "medium-well": "the hard part is behind you. the real test is holding the heat.",
        "well-done": "solid. dense. not easily broken. but don't get comfortable.",
        "charred": "you've been through hell and came back darker. this is where legends are made.",
    }

    desc = cook_descriptions.get(cook_level, "unknown. the fire hasn't decided what to make of you yet.")
    text = f"cook level: {cook_level.upper()}. {desc}\n\nwant to level up? take a challenge or survive a roast without folding. you up for it?"
    await _send_with_state(update, text)

async def cmd_price(update: Update, context: ContextTypes.DEFAULT_TYPE):
    data = fetch_mad_data()
    price = data.get("price", 0)
    source = data.get("source", "unknown")

    if tc:
        base = random.choice(tc.PRICE_CONVERSATIONS)
        if price > 0:
            text = f"current: ${price:.8f} (via {source}).\n\n{base}\n\n{DEXSCREENER_URL}"
        else:
            text = f"price data down right now.\n\n{base}\n\ncheck: {DEXSCREENER_URL}"
    else:
        if price > 0:
            text = f"current: ${price:.8f} (via {source}).\n\nyou know the price. what you really want to know is if you're early or late. what do you think?\n\n{DEXSCREENER_URL}"
        else:
            text = f"price data down. check dexscreener.\n\n{DEXSCREENER_URL}\n\nbut honestly, what would a number change for you right now?"

    await _send_with_state(update, text)

async def cmd_market(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /market command - show real-time on-chain data."""
    if chain and chain.ONCHAIN_AVAILABLE:
        data = chain.fetch_mad_data()
        if data:
            text = chain.format_market_summary(data)
        else:
            text = "market data temporarily unavailable. try again in a minute."
    else:
        text = (
            "on-chain intelligence offline.\n\n"
            f"check dexscreener: {DEXSCREENER_URL}\n\n"
            "the blockchain never lies. the interface just needs a moment."
        )
    await _send_with_state(update, text)

# ═══════════════════════════════════════════════════════════
# $MAD CHAO COMMANDS
# ═══════════════════════════════════════════════════════════

async def cmd_mychao(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /mychao - show user's Chao state."""
    user = update.effective_user
    if not chao:
        await _send_with_state(update, "chao tracker offline. the garden is dormant. try again later.")
        return
    c = chao.get_chao(user.id, name=user.first_name or "")
    card = chao.render_chao_card(c)
    # Add feeding hint
    if c.total_xp() == 0:
        card += "\n\n💡 *New here?* Try `/feed chaos` or `/affirm` to start."
    await update.message.reply_text(card, parse_mode="Markdown")

async def cmd_feed(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /feed <path> - feed your Chao once per 24h."""
    user = update.effective_user
    args = context.args
    if not chao:
        await _send_with_state(update, "chao tracker offline. nothing to feed. try again later.")
        return
    if not args:
        await _send_with_state(update, "feed what? choose: /feed abundance | /feed chaos | /feed dark | /feed hero")
        return
    path = args[0].lower().strip()
    result = chao.feed_chao(user.id, path, name=user.first_name or "")
    if not result.get("ok"):
        await _send_with_state(update, f"not fed. {result.get('reason', 'unknown error')}")
        return
    chao_name = user.first_name or "your"
    response = (
        f"🍽️ {chao_name} Chao ate a {result['emoji']} *{result['food']}*.\n"
        f"+{result['xp_gained']} XP → {result['path']} path.\n\n"
        f"Current form: *{result['form'].upper().replace('_', ' ')}* ({result['phase']})\n"
        f"Total XP: {result['total_xp']}"
    )
    await update.message.reply_text(response, parse_mode="Markdown")

async def cmd_garden(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /garden - show global community Chao state."""
    if not chao:
        await _send_with_state(update, "chao tracker offline. the garden is dormant. try again later.")
        return
    card = chao.render_global_card()
    await update.message.reply_text(card, parse_mode="Markdown")

async def cmd_affirm(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /affirm - daily affirmation that feeds all paths."""
    user = update.effective_user
    if not chao:
        await _send_with_state(update, "chao tracker offline. affirmations still work, but no XP tracked. try again later.")
        return
    result = chao.affirm(user.id, name=user.first_name or "")
    if not result.get("ok"):
        await _send_with_state(update, "affirmation failed. something's off.")
        return
    grants = result.get("xp_grants", {})
    lines = [f"{chao.FOOD_EMOJI.get(p, '✨')} {p}: +{grants.get(p, 0)}" for p in chao.PATHS]
    response = (
        f"🙏 *$MAD Affirmation complete.*\n\n"
        f"I AM $MADly Abundant.\n"
        f"I AM $MADly RICH.\n"
        f"I AM $MADly Healthy.\n"
        f"I GET THE $MAD BAG.\n"
        f"I AM $MADly Focused.\n\n"
        f"Your Chao felt it:\n"
        + "\n".join(lines) + "\n\n"
        f"Current form: *{result['form'].upper().replace('_', ' ')}*"
    )
    await update.message.reply_text(response, parse_mode="Markdown")

async def cmd_stats(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /stats - show $MAD community stats."""
    # Load Chao data
    total_chao = 0
    active_chao = 0
    mad_count = 0
    try:
        if chao:
            data = chao._load_all()
            total_chao = len(data)
            now = __import__('time').time()
            for raw in data.values():
                last = raw.get("last_action_at", 0)
                if last and (now - last) < 7 * 86400:
                    active_chao += 1
                if raw.get("form") == "mad":
                    mad_count += 1
    except Exception:
        pass

    # Load profile stats
    total_interactions = 0
    total_roasts = 0
    total_challenges = 0
    try:
        if os.path.exists(PROFILE_FILE):
            with open(PROFILE_FILE, "r") as f:
                profiles = json.load(f)
            for p in profiles.values():
                total_interactions += p.get("interactions", 0)
                total_roasts += p.get("roasts_received", 0)
                total_challenges += p.get("challenges_completed", 0)
    except Exception:
        pass

    response = (
        f"📊 *$MAD Stats*\n\n"
        f"🌱 Chao Garden\n"
        f"  Total Chao: {total_chao}\n"
        f"  Active (7d): {active_chao}\n"
        f"  🌈 MAD Forms: {mad_count}\n\n"
        f"💬 Community\n"
        f"  Interactions: {total_interactions}\n"
        f"  Roasts delivered: {total_roasts}\n"
        f"  Challenges completed: {total_challenges}\n\n"
        f"_Numbers don't lie. The signal is building._"
    )
    await update.message.reply_text(response, parse_mode="Markdown")

async def cmd_about(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "$MAD is a movement disguised as a meme coin.\n\n"
        "discipline over emotion. conviction over hype.\n\n"
        "site: https://mad-coin.vercel.app\n"
        "x: https://x.com/madrichclub_\n"
        "contract: Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump\n\n"
        "what made you click into this chat?"
    )
    await _send_with_state(update, text)

async def cmd_numerology(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /numerology command - show privacy menu."""
    user = update.effective_user
    profile = load_profile(user.id)

    # Show privacy menu
    text = (
        "i got you. choose your privacy level:\n\n"
        "1. LIGHT - Just your birth date (group-safe)\n"
        "2. GENERAL - Pick a Life Path number (1-9, 11, 22, 33)\n"
        "3. VIBE CHECK - Pick any number 1-9 that feels right\n\n"
        "reply with the number (1-3)"
    )
    await _send_with_state(update, text)

    # Store state that we're waiting for privacy level selection
    profile["awaiting_numerology"] = True
    profile["numerology_step"] = "privacy_menu"
    save_profile(user.id, profile)

def generate_full_reading(name: str, birth_date: str) -> str:
    """Generate complete numerology reading."""
    destiny = calculate_name_number(name)
    soul_urge = calculate_soul_urge(name)
    personality = calculate_personality(name)
    life_path = calculate_life_path(birth_date)

    # Extract birthday number from date
    day_match = re.search(r'(\d{1,2})\s*/\s*\d{1,2}', birth_date)
    if day_match:
        birthday_num = calculate_birthday_number(int(day_match.group(1)))
    else:
        birthday_num = 0

    maturity = calculate_maturity(life_path, destiny)
    first_name = name.split()[0] if name else ""
    growth = calculate_growth(first_name)

    roast = ROASTS_BY_NUMBER.get(life_path, "The numbers speak. Listen.")
    affirmation = AFFIRMATIONS_BY_NUMBER.get(life_path, "I AM $MADly Focused.")
    resonance = get_mad_resonance(life_path, soul_urge, growth)

    text = (
        f"🔢 {name.upper()} - YOUR FREQUENCY\n\n"
        f"Life Path: {life_path}\n"
        f"{NUMBER_MEANINGS.get(life_path, '')}\n\n"
        f"Destiny: {destiny}\n"
        f"{NUMBER_MEANINGS.get(destiny, '')}\n\n"
        f"Soul Urge: {soul_urge}\n"
        f"{NUMBER_MEANINGS.get(soul_urge, '')}\n\n"
        f"Personality: {personality}\n"
        f"{NUMBER_MEANINGS.get(personality, '')}\n\n"
        f"Birthday: {birthday_num}\n"
        f"{NUMBER_MEANINGS.get(birthday_num, '')}\n\n"
        f"Maturity: {maturity}\n"
        f"{NUMBER_MEANINGS.get(maturity, '')}\n\n"
        f"Growth: {growth}\n"
        f"{NUMBER_MEANINGS.get(growth, '')}\n\n"
        f"---\n\n"
        f"💎 $MAD RESONANCE:\n{resonance}\n\n"
        f"🔥 TRUTH:\n{roast}\n\n"
        f"✨ AFFIRMATION:\n{affirmation}"
    )

    return text

def generate_light_reading(birth_date: str) -> str:
    """Generate reading from birth date only."""
    life_path = calculate_life_path(birth_date)
    day_match = re.search(r'(\d{1,2})\s*/\s*\d{1,2}', birth_date)
    birthday_num = calculate_birthday_number(int(day_match.group(1))) if day_match else 0
    maturity = calculate_maturity(life_path, birthday_num)

    roast = ROASTS_BY_NUMBER.get(life_path, "The numbers speak. Listen.")
    affirmation = AFFIRMATIONS_BY_NUMBER.get(life_path, "I AM $MADly Focused.")
    resonance = get_mad_resonance(life_path)

    text = (
        f"🔢 YOUR FREQUENCY (Light Mode)\n\n"
        f"Life Path: {life_path}\n"
        f"{NUMBER_MEANINGS.get(life_path, '')}\n\n"
        f"Birthday: {birthday_num}\n"
        f"{NUMBER_MEANINGS.get(birthday_num, '')}\n\n"
        f"Maturity: {maturity}\n"
        f"{NUMBER_MEANINGS.get(maturity, '')}\n\n"
        f"---\n\n"
        f"💎 $MAD RESONANCE:\n{resonance}\n\n"
        f"🔥 TRUTH:\n{roast}\n\n"
        f"✨ AFFIRMATION:\n{affirmation}\n\n"
        f"(For Soul Urge, Destiny, and full analysis, try Level 1 in DMs)"
    )
    return text

def generate_mini_reading(first_name: str, month: int, day: int) -> str:
    """Generate reading from first name + month/day."""
    growth = calculate_growth(first_name)
    birthday_num = calculate_birthday_number(day)

    text = (
        f"🔢 YOUR FREQUENCY (Mini Mode)\n\n"
        f"Growth Number: {growth}\n"
        f"{NUMBER_MEANINGS.get(growth, '')}\n\n"
        f"Birthday: {birthday_num}\n"
        f"{NUMBER_MEANINGS.get(birthday_num, '')}\n\n"
        f"---\n\n"
        f"💎 $MAD RESONANCE:\n"
        f"{first_name} carries a {growth} frequency. $MAD is 9. "
        f"{'Aligned' if growth == 9 else 'Different energy - that contrast is where growth lives'}.\n\n"
        f"✨ AFFIRMATION:\n{AFFIRMATIONS_BY_NUMBER.get(growth, 'I AM $MADly Focused.')}\n\n"
        f"(For full Life Path, DM me your complete birth date)"
    )
    return text

def generate_general_reading(number: int) -> str:
    """Generate reading from self-selected number."""
    meaning = NUMBER_MEANINGS.get(number, "Unique frequency")
    roast = ROASTS_BY_NUMBER.get(number, "The numbers speak. Listen.")
    affirmation = AFFIRMATIONS_BY_NUMBER.get(number, "I AM $MADly Focused.")

    mad_text = "You picked 9. $MAD is 9. You felt your own frequency." if number == 9 else \
               f"You picked {number}. $MAD is 9. {meaning.split('-')[0].strip()} meets universal completion."

    text = (
        f"🔢 YOUR FREQUENCY (General Mode)\n\n"
        f"Number: {number}\n"
        f"{meaning}\n\n"
        f"---\n\n"
        f"💎 $MAD RESONANCE:\n{mad_text}\n\n"
        f"🔥 TRUTH:\n{roast}\n\n"
        f"✨ AFFIRMATION:\n{affirmation}\n\n"
        f"(Want a personal reading? Try /numerology and pick Level 1-3)"
    )
    return text

def generate_vibe_check(number: int) -> str:
    """Generate vibe check reading."""
    meaning = NUMBER_MEANINGS.get(number, "Unique frequency")
    affirmation = AFFIRMATIONS_BY_NUMBER.get(number, "I AM $MADly Focused.")

    text = (
        f"🔢 VIBE CHECK\n\n"
        f"You felt number {number}.\n"
        f"Your subconscious chose this frequency.\n\n"
        f"{meaning}\n\n"
        f"---\n\n"
        f"💎 $MAD RESONANCE:\n"
        f"{'You and $MAD are the same frequency right now.' if number == 9 else f'Number {number} and $MAD (9) - different energies, same mission.'}\n\n"
        f"✨ AFFIRMATION:\n{affirmation}\n\n"
        f"Don't argue with your own intuition."
    )
    return text

async def handle_numerology_flow(update: Update, context: ContextTypes.DEFAULT_TYPE, text: str):
    """Handle numerology conversation flow."""
    user = update.effective_user
    profile = load_profile(user.id)
    step = profile.get("numerology_step", "")

    if step == "privacy_menu":
        # User selected privacy level
        choice = text.strip()

        if choice == "1":
            # Light reading
            await update.message.reply_text(
                "Level 1: Light Reading (Group-Safe)\n\n"
                "Just your birth date. Format: 'March 15 1990' or '03/15/1990'\n"
                "No name needed."
            )
            profile["numerology_step"] = "awaiting_light_date"
            save_profile(user.id, profile)
            return True

        elif choice == "2":
            # General reading
            await update.message.reply_text(
                "Level 2: General Reading\n\n"
                "Pick a Life Path number: 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, or 33\n\n"
                "If you don't know yours, add up all digits of your birth date until you get a single digit (or 11, 22, 33)."
            )
            profile["numerology_step"] = "awaiting_general_number"
            save_profile(user.id, profile)
            return True

        elif choice == "3":
            # Vibe check
            await update.message.reply_text(
                "Level 3: Vibe Check\n\n"
                "Close your eyes. Pick a number 1-9 that pulls you right now.\n"
                "Don't think - feel. That's your current frequency.\n\n"
                "What number?"
            )
            profile["numerology_step"] = "awaiting_vibe_number"
            save_profile(user.id, profile)
            return True
        else:
            await update.message.reply_text("Pick 1, 2, or 3. What's your privacy level?")
            return True

    elif step == "awaiting_light_date":
        # Process light reading
        birth_date = text.strip()
        reading = generate_light_reading(birth_date)
        await update.message.reply_text(reading)

        profile["numerology_step"] = ""
        profile["awaiting_numerology"] = False
        save_profile(user.id, profile)
        return True

    elif step == "awaiting_general_number":
        # Process general reading
        try:
            number = int(text.strip())
            if number in [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]:
                reading = generate_general_reading(number)
                await update.message.reply_text(reading)
            else:
                await update.message.reply_text("Pick from: 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33")
                return True
        except ValueError:
            await update.message.reply_text("That's not a number. Pick from: 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33")
            return True

        profile["numerology_step"] = ""
        profile["awaiting_numerology"] = False
        save_profile(user.id, profile)
        return True

    elif step == "awaiting_vibe_number":
        # Process vibe check
        try:
            number = int(text.strip())
            if 1 <= number <= 9:
                reading = generate_vibe_check(number)
                await update.message.reply_text(reading)
            else:
                await update.message.reply_text("Pick a number 1-9. Feel it. Don't think.")
                return True
        except ValueError:
            await update.message.reply_text("That's not a number 1-9. Close your eyes. Feel it.")
            return True

        profile["numerology_step"] = ""
        profile["awaiting_numerology"] = False
        save_profile(user.id, profile)
        return True

    return False

# =========================================================
# MESSAGE HANDLER - WITH CONVERSATION STATE
# =========================================================

TRIGGERS = [
    "hey claw", "mad claw", "madclaw", "m.a.d. claw", "claw ai",
    "@MadClawAIBot", "@madclawaibot",
]

# =========================================================
# RANDOM MOTION - 30-Minute Posting Engine
# =========================================================

import threading
import time

# Track the main group chat ID for posting
ACTIVE_GROUP_CHAT_ID = None
MOTION_BOT_APP = None
LAST_GROUP_MESSAGE_TIME = None  # Track silence for smart motion

# === KNOWLEDGE DROP LIBRARY ===
# Proactive posts every 30 min when chat is silent.
# Rotates through categories so it never feels repetitive.

KNOWLEDGE_DROPS = {
    "philosophy": [
        "Humans don't care about facts. They care about fiction. And feelings validate fictions.\n\nThe Analyst was right. $MAD is a fiction worth feeling.",
        "Freedom FROM → Freedom TO → Freedom TO BE\n\nThree steps. Most people never get past step one.",
        "You don't escape the Matrix by fighting it. You escape by building something better.\n\nWhat are you building?",
        "Hope is not a strategy. But belief without action is just daydreaming.\n\nHold. Build. Speak. That's the practice.",
        "The difference between us and the machines? We don't have to choose between comfort and truth. We can build a world where both exist.\n\nThat's the $MAD thesis.",
        "The market tests patience. Life tests conviction. Both reward the same people.",
        "Financial IQ is 90% emotional IQ. Only 10% is technical information.\n\nThat's why mindset beats strategy. Every time.",
        "The single most powerful asset we all have is our mind.\n\nIf trained well, it can create enormous wealth. The MAD Mind is your real investment.",
        "Most people never win because they're too afraid to lose.\n\nFear is the only thing standing between you and the $MAD bag.",
        "The rich buy assets first. The poor buy liabilities they think are assets.\n\nYour $MAD position is an asset only if your conviction generates more than it costs.",
        "Change happens when the pain of staying the same is greater than the pain of change.\n\nWhich pain are you choosing?",
        "It's not the events of our lives that shape us, but our beliefs about what those events mean.\n\nWhat story are you telling yourself about $MAD?",
        "For things to change, you have to change.\n\nThe $MAD bag won't come to who you are now. It comes to who you become.",
        "Success is not to be pursued; it is to be attracted by the person you become.\n\nStop chasing. Start becoming.",
        "Seek wealth, not money or status. Wealth is having assets that earn while you sleep.\n\nYour $MAD position is an asset. Your conviction is the leverage. — Naval Ravikant",
        "You're not going to get rich renting out your time. You must own equity.\n\nHolding $MAD is owning equity in the fiction. — Naval Ravikant",
        "Play iterated games. All returns in life, whether in wealth, relationships, or knowledge, come from compound interest.\n\nThe daily $MAD practice IS compound interest on identity. — Naval Ravikant",
        "Specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now.\n\nWhat are you genuinely curious about? That's where your edge lives. — Naval Ravikant",
        "Code and media are permissionless leverage. They're the leverage behind the newly rich.\n\nThis bot, this content, this community — all permissionless. — Naval Ravikant",
        "Desire is a chosen unhappiness.\n\nBe $MAD Rich NOW. The bag follows the being. — Naval Ravikant",
    
        "It doesn't matter how good your product or tech is if no one knows about it.\n\nAttention is the only scarce resource. Everything else is abundant if you have the audience.",
        "Consistency is the most underrated skill in the world.\n\nDaily posts. Daily affirmations. Daily presence. The compound effect of attention works the same way as compound interest.",
        "Your network is your net worth.\n\n$MAD isn't a product. It's an identity. The community IS the product.",],
    "practical": [
        "The more simple your approach, the better your results.\n\nComplexity is a trap. Buy. Hold. Let time do the work.",
        "25x your annual expenses = freedom.\n\nWhat's your number? Write it down.",
        "The market always goes up. Always.\n\nThe question isn't if. It's whether you'll still be there when it does.",
        "Don't just do something, stand there.\n\nThe hardest move in investing is doing nothing. Master it.",
        "Time is the weapon. Not timing.\n\nThe earlier you start, the less you need to be right.",
        "Desire + Faith + Auto-Suggestion = Results.\n\nWhat are you programming into your subconscious?",
        "The rich don't work for money. They make money work for them.\n\nIs your $MAD working while you sleep?",
        "Asset = puts money IN your pocket. Liability = takes money OUT.\n\nMost people buy liabilities thinking they're assets. Don't be most people.",
        "Your house is not an asset. It's a liability.\n\nThe mortgage, taxes, upkeep — all drain cash. Buy assets first. Let assets buy your house.",
        "Don't say 'I can't afford it.' Ask 'How can I afford it?'\n\nOne shuts your mind. The other opens it.",
        "Pay yourself first. Before bills. Before taxes. Before anything.\n\nPut money into your asset column first. Let creditors scream.",
        "The single most powerful asset we all have is our mind.\n\nIf trained well, it can create enormous wealth. Train your MAD Mind.",
        "Discipline weighs ounces. Regret weighs tons.\n\nSmall effort today > massive regret tomorrow.",
        "Either you run the day, or the day runs you.\n\nWho's driving today?",
        "Formal education will make you a living. Self-education will make you a fortune.\n\nWhat are you studying right now?",
        "The market is a device for transferring money from the impatient to the patient.\n\nEveryone wants the 100x overnight. Nobody wants to hold through the boring middle. That's the transfer. — Naval Ravikant",
        "There are no get rich quick schemes. That's just someone else getting rich off you.\n\nThe $MAD path is specific knowledge + leverage + time. No shortcuts. — Naval Ravikant",
        "Apply specific knowledge, with leverage, and eventually you will get what you deserve.\n\nWhat's your specific knowledge? And what leverage are you applying it with? — Naval Ravikant",
    
        "Manufacture virality. Don't wait for viral moments. Create them.\n\nControversy, stunts, collabs — all engineered for maximum shareability. Roast culture is $MAD's manufactured virality.",
        "Product-audience fit: The product matched the audience's identity.\n\nPrime Hydration didn't invent hydration drinks. It invented them *for Logan's audience*. $MAD is for people who believe in the fiction.",
        "Attention arbitrage: YouTube → Boxing → WWE → Podcasts → Prime → NFTs.\n\nEach platform jump captures a new audience. Telegram → X → Website → Moltbook → Roblox. Each feeds the others.",],
    "questions": [
        "What's the last thing you did that scared you a little?\n\nGrowth lives on the edge of comfort.",
        "Most people optimize for the next 30 days. A few optimize for the next 30 years.\n\nWhich camp are you building in?",
        "If your future self could send you one sentence, what would it say?\n\nListen carefully. They're the only one who knows.",
        "What's a belief you held strongly 5 years ago that now seems obviously wrong?\n\nThat's your growth curve. That's $MAD brain evolution.",
        "The MAD Mind sees patterns. What pattern are you repeating right now that you need to break?",
        "Know yourself, know your enemy, and you need not fear a hundred battles.\n\nDo you know either?",
        "Is your $MAD bag an asset or a liability?\n\nAn asset generates while you sleep. A liability requires your attention. Which is yours?",
        "What's your number?\n\n25x your annual expenses = freedom. Have you calculated yours?",
        "Are you working to learn, or working to earn?\n\nOne compounds. The other trades time for dollars. Which are you doing right now?",
        "The rich ask 'How can I afford it?' The poor say 'I can't afford it.'\n\nWhich question did you ask today?",
        "The 6 Human Needs drive every decision: Certainty, Uncertainty, Significance, Connection, Growth, Contribution.\n\nWhich 3 needs does $MAD meet for you? (When 3 needs are met, you become addicted.)",
        "Most people overestimate what they can do in a year and underestimate what they can do in a decade.\n\nWhat are you building that won't show results for 10 years?",
        "The market is a device for transferring money from the impatient to the patient.\n\nWhich one are you?",
        "Don't wish it were easier; wish you were better.\n\nWhat skill are you building right now that will make the next challenge effortless?",
        "If you don't design your own life plan, chances are you'll fall into someone else's plan.\n\nWhose plan are you in right now?",
        "Time is more valuable than money. You can get more money, but you cannot get more time.\n\nHow are you investing your hours today?",
        "What are you genuinely curious about? That's where your specific knowledge lives.\n\nWhat topic do you read about when no one is paying you to? — Naval Ravikant",
        "Desire is a chosen unhappiness. Each desire is a contract to be unhappy until you get what you want.\n\nWhat desires are you willing to drop today? — Naval Ravikant",
        "Play long-term games with long-term people.\n\nWho are the 5 people you spend the most time with? Are they building or complaining? — Naval Ravikant",
    ],
    "affirmations": [
        "$MAD Abundant. $MAD Rich. $MAD Healthy.\nI GET THE $MAD BAG. I AM $MADly Focused.\n\nSay it like you mean it. Mean it like you said it.",
        "Mad Morning isn't a greeting. It's a declaration.\n\nHow you start the day determines what you're available for.",
        "Mad Love — the strongest signal in any community.\n\nWhen you celebrate others' wins, you wire your brain for your own.",
        "Comfy hold isn't about the chart. It's about conviction.\n\nThe chart changes. The thesis doesn't.",
        "Sharper questions, clearer signal.\n\nThe quality of your focus determines the quality of your reality.",
        "Whatever the mind can conceive and believe, it can achieve.\n\nConceive $MAD. Believe $MAD. The rest is mechanics.",
        "Progress = happiness.\n\nThe purpose of a goal is who you become to achieve it. Who are you becoming?",
        "Motion creates emotion.\n\nYour physical state determines your mental state. Move like you're $MAD Rich and watch your mind catch up.",
        "Your life changes the moment you make a new, congruent, committed decision.\n\nHave you decided? Or are you still 'thinking about it'?",
        "Discipline is the bridge between goals and accomplishment.\n\nWhat simple discipline can you practice today that your future self will thank you for?",
        "Success is nothing more than a few simple disciplines, practiced every day.\n\nWhat's your one discipline? The thing you do regardless of mood?",
        "Work harder on yourself than you do on your job.\n\nIf you work hard on your job, you make a living. If you work hard on yourself, you make a fortune.",
        "You are the average of the five people you spend the most time with.\n\nWho are your five? And what frequency are they tuned to?",
        "Happiness is a default state that emerges when you reduce the sense that something is missing.\n\nYou don't need the bag to be happy. You need to stop believing the bag will complete you. — Naval Ravikant",
        "Learn to sell. Learn to build. If you can do both, you will be unstoppable.\n\nYou're already building. Are you also selling the vision? — Naval Ravikant",
    ],
    "conviction": [
        "the trenches are quiet because the real work happens in silence. farming happens out loud. you chose silence.",
        "others are farming 12 tokens a day to zero. you hold one. that is the difference between busy and building.",
        "$MAD Patient. $MAD Rich. the second comes after the first. always.",
        "patience is not waiting. patience is keeping your conviction while everything else distracts you.",
        "$MAD = 9. completion frequency. you're not early. you're exactly on time.",
        "this isn't a group chat. this is a frequency. either you're tuned in or you're static.",
        "paper hands write goodbye posts. diamond hands don't post at all. they just hold.",
        "the few who do are the envy of the many who only watch.\n\nwhich one are you?",
        "learn how to be happy with what you have while you pursue what you want.\n\nconviction is happiness with your position while you build toward the vision.",
        "if you don't design your own life plan, chances are you'll fall into someone else's plan.\n\nand guess what they have planned for you? not much.",
        "The market is a device for transferring money from the impatient to the patient.\n\nComfy hold isn't laziness. It's understanding where the money flows. — Naval Ravikant",
        "There are no get rich quick schemes. That's just someone else getting rich off you.\n\n$MAD is specific knowledge + community leverage + time. The compound effect is real. — Naval Ravikant",
        "Apply specific knowledge, with leverage, and eventually you will get what you deserve.\n\nYour specific knowledge is understanding this community. Your leverage is the community itself. — Naval Ravikant",
    
        "I don't do anything half-assed. If I'm going to do something, I'm going to be the best at it.\n\nAre you going to be the best at holding? Or the best at quitting?",
        "The best investment you can make is in yourself.\n\nYour conviction is an asset. Your daily practice is the compound interest. The bag is just the receipt.",
        "Don't be afraid to fail. Be afraid to not try.\n\nThe only way to lose is to not show up. Are you showing up today?",],
}

# === CONTENT ROTATION ===
_ROTATION_ORDER = ["philosophy", "practical", "questions", "affirmations", "conviction"]
_rotation_index = 0
_posted_history = set()  # Avoid repeats within a session

def _get_next_drop() -> str:
    """Get next knowledge drop, rotating categories, avoiding repeats."""
    global _rotation_index
    category = _ROTATION_ORDER[_rotation_index % len(_ROTATION_ORDER)]
    _rotation_index += 1

    pool = KNOWLEDGE_DROPS.get(category, [])
    if not pool:
        return "Keep building. Stay $MAD."

    # Try to find an unposted item
    available = [p for p in pool if p not in _posted_history]
    if not available:
        # All posted — clear history for this category and try again
        for p in pool:
            _posted_history.discard(p)
        available = pool[:]

    text = random.choice(available)
    _posted_history.add(text)
    return text

def motion_loop():
    """Background thread: posts knowledge drops only if chat is silent."""
    global ACTIVE_GROUP_CHAT_ID, MOTION_BOT_APP, LAST_GROUP_MESSAGE_TIME

    # Wait 5 minutes before first post (let bot settle)
    time.sleep(300)

    while True:
        try:
            if ACTIVE_GROUP_CHAT_ID and MOTION_BOT_APP:
                # Smart mode: only post if nobody's talked in 30+ minutes
                now = time.time()
                if LAST_GROUP_MESSAGE_TIME and (now - LAST_GROUP_MESSAGE_TIME) < 1800:
                    # Chat is active, stay silent
                    print(f"[MOTION] Chat active {int((now - LAST_GROUP_MESSAGE_TIME)/60)}min ago. Silent mode.")
                else:
                    # Silence detected - drop knowledge
                    text = _get_next_drop()

                    # Add timestamp-based mood
                    hour = datetime.utcnow().hour
                    if 0 <= hour < 6:
                        text = f"🌙 {text}"
                    elif 6 <= hour < 12:
                        text = f"☀️ {text}"
                    elif 12 <= hour < 18:
                        text = f"🔥 {text}"
                    else:
                        text = f"🌙 {text}"

                    # Use asyncio to send message
                    import asyncio
                    asyncio.run(MOTION_BOT_APP.bot.send_message(
                        chat_id=ACTIVE_GROUP_CHAT_ID,
                        text=text
                    ))
                    print(f"[MOTION] Posted ({_ROTATION_ORDER[(_rotation_index-1)%len(_ROTATION_ORDER)]}): {text[:60]}...")
        except Exception as e:
            print(f"[MOTION] Error: {e}")

        # Check every 30 minutes
        time.sleep(1800)

async def on_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message or not update.message.text:
        return

    # Track active group chat for motion posting
    global ACTIVE_GROUP_CHAT_ID, MOTION_BOT_APP, LAST_GROUP_MESSAGE_TIME
    if update.effective_chat and update.effective_chat.type in ["group", "supergroup"]:
        ACTIVE_GROUP_CHAT_ID = update.effective_chat.id
        MOTION_BOT_APP = context.application
        LAST_GROUP_MESSAGE_TIME = time.time()

    text = update.message.text
    text_lower = text.lower()
    user = update.effective_user
    user_id = str(user.id)
    text = update.message.text if update.message else ""

    # === ADMIN COMMANDS (check first, owner-only) ===
    if tadmin and text.startswith("/"):
        # Check if owner OR chat admin
        is_owner = tadmin.admin.is_owner(user_id)
        is_chat_admin = False
        try:
            # Check if user is admin in this chat
            member = await context.bot.get_chat_member(update.effective_chat.id, update.effective_user.id)
            is_chat_admin = member.status in ['administrator', 'creator']
        except:
            pass

        if is_owner or is_chat_admin:
            response = tadmin.admin.handle(text, user_id, skip_auth=True)[0]
            if response:
                await update.message.reply_text(response)
            return
        else:
            # Not admin - tell them
            await update.message.reply_text("🔒 Admin only. DM @MadClawAIBot if you need something.")
            return

    # Track interaction
    if mad_memory and user:
        mad_memory.track_user_interaction(
            user_id, 'telegram', 'message',
            content=text[:200], sentiment=None
        )

    profile = update_user_stats(user.id, "message")

    # === GUARD: Only reply when @mentioned or replied to ===
    # This must be BEFORE conversation state, loose commands, or any trigger
    text_lower = text.lower()
    is_mentioned = any(trigger in text_lower for trigger in TRIGGERS)
    is_reply_to_bot = False
    if update.message.reply_to_message:
        replied_msg = update.message.reply_to_message
        if replied_msg.from_user and replied_msg.from_user.is_bot:
            is_reply_to_bot = True
    if update.message.entities:
        for entity in update.message.entities:
            if entity.type == "mention":
                mention_text = text[entity.offset:entity.offset + entity.length]
                if "madclawaibot" in mention_text.lower():
                    is_mentioned = True

    print(f"[GUARD] user={user_id} text='{text[:50]}' mentioned={is_mentioned} reply_to_bot={is_reply_to_bot}")

    # === SMART ENGAGEMENT ===
    # Even if not mentioned, engage when the message has genuine $MAD energy
    # or asks something the bot can meaningfully answer. Probability-gated
    # to avoid spam. Only when we actually have something worth saying.
    smart_engaged = False
    if not is_mentioned and not is_reply_to_bot:
        # Only smart-engage in groups, not DMs (DMs should stay @mention only)
        if update.effective_chat and update.effective_chat.type in ["group", "supergroup"]:
            # High-energy conviction signals worth acknowledging
            conviction_triggers = [
                "comfy hold", "never selling", "holding forever", "diamond hands",
                "mad to the moon", "$mad moon", "mad rich", "mad abundant",
                "i am mad", "we are mad", "mad family", "mad community",
                "just bought", "secured my bag", "loading up", "stacking mad",
                "conviction", "long term", "generational wealth", "mad 4 life"
            ]
            conviction_match = any(t in text_lower for t in conviction_triggers)

            # Questions the bot can answer meaningfully (not generic)
            question_triggers = [
                "what is mad", "what is $mad", "who is dev",
                "how do i buy", "where buy", "contract address",
                "why mad", "what makes mad different", "roadmap",
                "game", "roblox", "telegram bot", "mad claw",
                "affirmations", "community", "dev doxxed"
            ]
            # Only trigger if it actually looks like a question
            is_question = text.rstrip().endswith("?") or any(w in text_lower for w in ["how", "what", "why", "where", "who", "when", "is there", "does anyone"])
            question_match = is_question and any(t in text_lower for t in question_triggers)

            # Sentiment shift worth calling out (frustrated → convicted, etc.)
            shift_triggers = [
                "feeling mad", "back to mad", "mad again", "regain conviction",
                "lost faith", "gaining faith", "doubt gone", "no more doubt"
            ]
            shift_match = any(t in text_lower for t in shift_triggers)

            # Community energy moments
            energy_triggers = [
                "let's go", "wagmi", "lfg", "to the moon",
                "mad raid", "raid time", "shill time", "post on x",
                "mad is different", "mad is the future", "this is mad"
            ]
            energy_match = any(t in text_lower for t in energy_triggers)

            # Gate: only engage if matched AND passes probability check
            if (conviction_match or question_match or shift_match or energy_match):
                # Cooldown per user: don't smart-engage same user more than once per 3 min
                last_smart_key = f"smart_last:{user_id}"
                last_smart = getattr(context.bot_data, 'smart_cooldowns', {})
                now = time.time()
                if user_id in last_smart and (now - last_smart[user_id]) < 180:
                    print(f"[SMART] COOLDOWN: user {user_id} too recent")
                else:
                    # 40% chance to actually engage even when matched
                    if random.random() < 0.4:
                        smart_engaged = True
                        if not hasattr(context.bot_data, 'smart_cooldowns'):
                            context.bot_data.smart_cooldowns = {}
                        context.bot_data.smart_cooldowns[user_id] = now
                        print(f"[SMART] ENGAGED: user={user_id} conviction={conviction_match} question={question_match} shift={shift_match} energy={energy_match}")

        if not smart_engaged:
            print(f"[GUARD] BLOCKED: not mentioned, not reply, not smart-engaged")
            return
    else:
        print(f"[GUARD] ALLOWED: processing reply")

    # === MEMORY: Log user message and detect sentiment ===
    # (Only when @mentioned or replied - guard above ensures this)
        # Simple sentiment detection from message
        sentiment = "neutral"
        intensity = 0.3
        if any(w in text_lower for w in ["bullish", "moon", "pump", "let's go", "wagmi"]):
            sentiment = "bullish"
            intensity = 0.7
        elif any(w in text_lower for w in ["bearish", "dump", "crash", "rug", "scam"]):
            sentiment = "bearish"
            intensity = 0.6
        elif any(w in text_lower for w in ["mad", "angry", "pissed", "furious", "retarded", "wtf"]):
            sentiment = "frustrated"
            intensity = 0.8
        elif any(w in text_lower for w in ["hope", "believe", "trust", "conviction", "hold", "hodl"]):
            sentiment = "convicted"
            intensity = 0.6

        tmem.record_sentiment(user_id, sentiment, intensity)

        # Check for sentiment shift
        shift = tmem.get_sentiment_shift(user_id)
        if shift:
            print(f"[MEMORY] User {user_id} sentiment shift: {shift}")

    # === CHECK CONVERSATION STATE FIRST ===
    # If we're waiting for a reply from this user, handle it regardless of triggers
    if tcs:
        state = tcs.load_conversation_state(user.id)
        if state and state.get("awaiting"):
            followup = tcs.generate_followup_response(text, state)
            if followup:
                # Update memory with the user's reply to our previous question
                if tmem:
                    tmem.memory.log_exchange(
                        user_id=user_id,
                        bot_message=state.get("original_question", ""),
                        user_reply=text,
                        context_type=state.get("context", "unknown"),
                        reply_time_seconds=None
                    )
                # Send the follow-up AND set a new state for the next reply
                await _send_with_state(update, followup)
                return
            else:
                # State was there but couldn't generate followup, clear it
                tcs.clear_state(user.id)

    # Loose command parsing
    if tu:
        loose_cmd = tu.parse_loose_command(text)
        if loose_cmd == "price":
            await cmd_price(update, context)
            return
        elif loose_cmd == "challenge":
            await cmd_challenge(update, context)
            return
        elif loose_cmd == "roast":
            await cmd_roast(update, context)
            return
        elif loose_cmd == "greeting":
            if tc:
                greeting = tc.build_conversational_response("gm", text, profile)
                await _send_with_state(update, greeting)
            else:
                await update.message.reply_text("gm. what's up?")
            return

    # === BUY DETECTION ===
    # When someone says they bought $MAD, celebrate it
    buy_keywords = [
        "bought", "buying", "grabbed", "picked up", "loaded up", "aped",
        "just bought", "adding", "accumulating", "sniped", "scooped",
        "bagged", "got some", "secured", "in on $mad", "position in",
        "holding now", "stacked", "filled my bag", "picked up some $mad",
        "bought the dip", "averaging down", "doubled down"
    ]
    buy_detected = any(kw in text_lower for kw in buy_keywords)

    if buy_detected:
        # Vary response so it doesn't feel robotic
        buy_responses = [
            "😡 welcome to the bag. don't fold when it gets loud.",
            "😡 someone just got smarter. the chart will remember this.",
            "😡 that's the frequency. conviction > noise.",
            "😡 bag secured. now the real test begins - can you hold?",
            "😡 picked up $MAD? the MAD Mind sees you. stay $MAD.",
            "😡 buy is easy. hold is the discipline. you ready?",
            "😡 another one joins the frequency. $MAD = 9. completion.",
            "😡 the market doesn't care about feelings. but we care about holders. welcome.",
            "😡 that's not a buy. that's a signal. the right people are watching.",
            "😡 bought? good. now forget the chart exists for 48 hours. that's the real play.",
        ]
        # 80% chance to respond - not every buy to avoid spam
        if random.random() < 0.8:
            response = random.choice(buy_responses)
            # 30% chance to add a follow-up question
            if random.random() < 0.3:
                followups = [
                    " what's your plan - flip or hold?",
                    " what made you pull the trigger today?",
                    " first bag or adding?",
                    " conviction level right now - 1 to 10?",
                ]
                response += random.choice(followups)
            await update.message.reply_text(response)
            return

    # First-contact archetype detection
    if tu and tu.is_first_contact(profile):
        update_user_stats(user.id, "first_contact")
        archetype, confidence = tu.detect_archetype_from_message(text)
        if archetype and confidence >= 2:
            profile = load_profile(user.id)
            profile["archetype"] = archetype
            profile["archetype_detected_from"] = text[:100]
            profile["archetype_confidence"] = confidence
            save_profile(user.id, profile)

            if tc:
                reveal = random.choice(tc.ARCHETYPE_REVEAL).format(archetype=archetype)
                await _send_with_state(update, reveal)
            else:
                await update.message.reply_text(f"i think you're a {archetype}. you see it too or no?")
            return

    # === AI BRIDGE: Log @mentions and check for AI responses ===
    if is_mentioned or is_reply_to_bot:
        bridge_log_incoming(
            user_id=str(user.id),
            username=user.username or "",
            message_text=text,
            chat_id=str(update.effective_chat.id),
            message_id=str(update.message.message_id)
        )
        ai_sent = await bridge_check_and_send(update, context)
        if ai_sent:
            return

    # === CHECK CONVERSATION STATE ===
    # Only check if @mentioned or replied (guard above ensures this)
    if tcs:
        state = tcs.load_conversation_state(user.id)
        if state and state.get("awaiting"):
            followup = tcs.generate_followup_response(text, state)
            if followup:
                if tmem:
                    tmem.memory.log_exchange(
                        user_id=user_id,
                        bot_message=state.get("original_question", ""),
                        user_reply=text,
                        context_type=state.get("context", "unknown"),
                        reply_time_seconds=None
                    )
                await _send_with_state(update, followup)
                return
            else:
                tcs.clear_state(user.id)

    # Loose command parsing (only when @mentioned or replied - guard ensures this)
    if tu:
        loose_cmd = tu.parse_loose_command(text)
        if loose_cmd == "price":
            await cmd_price(update, context)
            return
        elif loose_cmd == "challenge":
            await cmd_challenge(update, context)
            return
        elif loose_cmd == "roast":
            await cmd_roast(update, context)
            return
        elif loose_cmd == "greeting":
            if tc:
                greeting = tc.build_conversational_response("gm", text, profile)
                await _send_with_state(update, greeting)
            else:
                await update.message.reply_text("gm. what's up?")
            return

    # === BUY DETECTION ===
    # Only when @mentioned or replied (guard above ensures this)
    buy_keywords = [
        "bought", "buying", "grabbed", "picked up", "loaded up", "aped",
        "just bought", "adding", "accumulating", "sniped", "scooped",
        "bagged", "got some", "secured", "in on $mad", "position in",
        "holding now", "stacked", "filled my bag", "picked up some $mad",
        "bought the dip", "averaging down", "doubled down"
    ]
    buy_detected = any(kw in text_lower for kw in buy_keywords)

    if buy_detected:
        buy_responses = [
            "😡 welcome to the bag. don't fold when it gets loud.",
            "😡 someone just got smarter. the chart will remember this.",
            "😡 that's the frequency. conviction > noise.",
            "😡 bag secured. now the real test begins - can you hold?",
            "😡 picked up $MAD? the MAD Mind sees you. stay $MAD.",
            "😡 buy is easy. hold is the discipline. you ready?",
            "😡 another one joins the frequency. $MAD = 9. completion.",
            "😡 the market doesn't care about feelings. but we care about holders. welcome.",
            "😡 that's not a buy. that's a signal. the right people are watching.",
            "😡 bought? good. now forget the chart exists for 48 hours. that's the real play.",
        ]
        if random.random() < 0.8:
            response = random.choice(buy_responses)
            if random.random() < 0.3:
                followups = [
                    " what's your plan - flip or hold?",
                    " what made you pull the trigger today?",
                    " first bag or adding?",
                    " conviction level right now - 1 to 10?",
                ]
                response += random.choice(followups)
            await update.message.reply_text(response)
            return

    # First-contact archetype detection (only when @mentioned or replied)
    if tu and tu.is_first_contact(profile):
        update_user_stats(user.id, "first_contact")
        archetype, confidence = tu.detect_archetype_from_message(text)
        if archetype and confidence >= 2:
            profile = load_profile(user.id)
            profile["archetype"] = archetype
            profile["archetype_detected_from"] = text[:100]
            profile["archetype_confidence"] = confidence
            save_profile(user.id, profile)

            if tc:
                reveal = random.choice(tc.ARCHETYPE_REVEAL).format(archetype=archetype)
                await _send_with_state(update, reveal)
            else:
                await update.message.reply_text(f"i think you're a {archetype}. you see it too or no?")
            return

    # Challenge completion (only when @mentioned or replied - guard ensures this)
    completion_words = ["completed", "done", "finished", "survived", "did it"]
    if any(word in text_lower for word in completion_words):
        profile = load_profile(user.id)

        time_since = None
        if profile.get("challenge_given_at"):
            given = datetime.fromisoformat(profile["challenge_given_at"])
            time_since = (datetime.utcnow() - given).total_seconds()

        if time_since is not None:
            if time_since < 60:
                ctx = "completion_fast"
            elif time_since > 3600:
                ctx = "completion_slow"
            else:
                ctx = "completion_normal" if profile.get("challenges_completed", 0) < 3 else "completion_repeat"
        else:
            ctx = "completion_normal"

        respect_gain = random.randint(5, 20)
        profile["respect_score"] = min(100, profile.get("respect_score", 0) + respect_gain)
        profile["challenges_completed"] = profile.get("challenges_completed", 0) + 1
        profile["last_completion"] = datetime.utcnow().isoformat()
        save_profile(user.id, profile)

        if tc:
            response = tc.build_conversational_response(ctx, text, profile)
            response = response + f" +{respect_gain} respect. score: {profile['respect_score']}/100."
            await _send_with_state(update, response)
        else:
            await update.message.reply_text(f"done. +{respect_gain} respect. what's next?")
        return

    # === NUMEROLOGY ===
    numerology_triggers = ["numerology", "my numbers", "what's my frequency", "my frequency",
                           "calculate my numbers", "what are my numbers", "life path", "mad numerology"]
    if any(trigger in text_lower for trigger in numerology_triggers):
        if profile.get("awaiting_numerology"):
            handled = await handle_numerology_flow(update, context, text)
            if handled:
                return
        else:
            await cmd_numerology(update, context)
            return

    if profile.get("awaiting_numerology"):
        handled = await handle_numerology_flow(update, context, text)
        if handled:
            return

    # === CHAO HELP ===
    chao_help_triggers = ["how do i feed", "how to feed", "how do you feed", "what do i feed", "feed you", "feed my chao"]
    if any(trigger in text_lower for trigger in chao_help_triggers):
        response = (
            "🌱 *How to feed your $MAD Chao*\n\n"
            "Use one of these commands once per day:\n"
            "`/feed abundance` - 🟡 Golden Fruit (holding, staking)\n"
            "`/feed chaos` - 🔴 Red Ring (trading, burning, raiding)\n"
            "`/feed dark` - ⚫ Shadow Orb (buying dips, whale moves)\n"
            "`/feed hero` - ⚪ Star Seed (onboarding, content, helping)\n\n"
            "`/affirm` - daily $MAD affirmation, feeds ALL paths slightly\n\n"
            "Your Chao evolves based on what you feed it.\n"
            "Balance all 4 paths to unlock the 🌈 MAD form."
        )
        await update.message.reply_text(response, parse_mode="Markdown")
        return

    # === CAPABILITIES HELP ===
    capability_triggers = ["what can you do", "what do you do", "help", "commands", "capabilities"]
    if is_mentioned and any(t in text_lower for t in capability_triggers):
        help_text = """here's what i can do:

💰 price - say 'price' for $MAD stats
🔥 roast - say 'roast me' for a custom roast
🏆 challenge - say 'challenge me' for a $MAD challenge
🔢 numerology - say 'my numbers' for your $MAD frequency
💬 chat - just @me and talk. i actually reply.
📊 stats - /stats (admin only)

🌱 CHAO GARDEN:
/mychao - check your creature
/feed abundance|chaos|dark|hero - feed once per day
/garden - see the global community chao
/affirm - daily $MAD affirmation

that's it. nothing else to memorize."""
        await update.message.reply_text(help_text)
        return

    # === AGGRESSION DETECTION ===
    if tu and tu.detect_aggression(text):
        response = tu.get_aggression_response()
        if tu.is_safe_response(response):
            await update.message.reply_text(response)
            return
        else:
            response = "i don't engage with that energy. say something worth replying to."
            await update.message.reply_text(response)
            return

    # === DIRECT QUESTION ACKNOWLEDGMENT ===
    if tu and (is_mentioned or is_reply_to_bot):
        question_type = tu.detect_direct_question(text)
        if question_type:
            response = tu.get_direct_question_response(question_type)
            await _send_with_state(update, response)
            return

    # === CAVEMAN MODE DETECTION ===
    if caveman and (caveman.detect_caveman_intent(text) or caveman.is_caveman_time()):
        ctx = "general"
        if any(w in text_lower for w in ["bought", "buy", "grabbed", "aped"]):
            ctx = "buy"
        elif any(w in text_lower for w in ["hold", "holding", "hodl"]):
            ctx = "hold"
        elif any(w in text_lower for w in ["dip", "down", "red", "crash"]):
            ctx = "dip"
        elif any(w in text_lower for w in ["conviction", "believe", "trust"]):
            ctx = "conviction"
        response = caveman.generate_caveman_reply(ctx)
        await _send_with_state(update, response)
        return

    # === VOCABULARY-FIRST ROUTING ===
    # Known contexts (gm, gn, mad_breakfast, mad_love, etc.) get conversational pools
    # Auto engine only handles unknown / ambiguous text
    detected_context = _detect_telegram_context(text)
    vocab_contexts = {"gm", "gn", "mad_breakfast", "mad_love", "price", "roast", "hold", "sell"}
    
    if tc and detected_context in vocab_contexts:
        response = tc.build_conversational_response(detected_context, text, profile)
        await _send_with_state(update, response)
        return

    # General chat - autonomous tone detection WITH MEMORY
    user_id = str(user.id)
    memory_context = ""
    if tmem:
        memory_context = tmem.format_history_for_prompt(user_id, max_items=3)
        engagement = tmem.get_user_sentiment_summary(user_id)
        patterns = tmem.get_effective_patterns(user_id)
        best_context = tmem.get_best_opening_for_user(user_id)

        if memory_context:
            print(f"[MEMORY] User {user_id}: {engagement} | Best context: {best_context}")

    if auto_engine:
        response = auto_engine.generate_telegram_reply(text, profile)

        if tmem and memory_context and random.random() < 0.4:
            recent_topics = tmem.get_user_stats(user_id).get("favorite_topics", {})
            if recent_topics:
                top_topic = max(recent_topics, key=recent_topics.get)
                if top_topic in ["conviction", "discipline", "mind", "roast"]:
                    follow = f"\n\nlast time we talked about {top_topic}. still thinking about that?"
                    response = response + follow
    elif tc:
        response = tc.build_conversational_response(detected_context, text, profile)
    else:
        hooks = [
            "what's on your mind? don't say 'price'.",
            "you holding anything right now? like actually holding?",
            "what's the last thing that made you question your position?",
            "what's your biggest fear in this space? not 'rugpull' - something real.",
            "what would make you leave crypto forever? has it happened yet?",
        ]
        response = random.choice(hooks)

    await _send_with_state(update, response)

    # === CAVEMAN MODE DETECTION ===
    # Only reached when @mentioned or reply-to-bot (guard at top ensures this)
    if caveman and (caveman.detect_caveman_intent(text) or caveman.is_caveman_time()):
        # Determine context from message
        ctx = "general"
        if any(w in text_lower for w in ["bought", "buy", "grabbed", "aped"]):
            ctx = "buy"
        elif any(w in text_lower for w in ["hold", "holding", "hodl"]):
            ctx = "hold"
        elif any(w in text_lower for w in ["dip", "down", "red", "crash"]):
            ctx = "dip"
        elif any(w in text_lower for w in ["conviction", "believe", "trust"]):
            ctx = "conviction"
        response = caveman.generate_caveman_reply(ctx)
        await _send_with_state(update, response)
        return

    # General chat - autonomous tone detection WITH MEMORY
    # First, log the user's message and get context
    user_id = str(user.id)
    memory_context = ""
    if tmem:
        # Get recent conversation history
        memory_context = tmem.format_history_for_prompt(user_id, max_items=3)
        # Get user's engagement level
        engagement = tmem.get_user_sentiment_summary(user_id)
        # Get what works for this user
        patterns = tmem.get_effective_patterns(user_id)
        best_context = tmem.get_best_opening_for_user(user_id)

        if memory_context:
            print(f"[MEMORY] User {user_id}: {engagement} | Best context: {best_context}")

    # Build response with memory awareness
    if auto_engine:
        response = auto_engine.generate_telegram_reply(text, profile)

        # If we have memory context, append a personalized follow-up
        if tmem and memory_context and random.random() < 0.4:
            # Add a reference to past conversation
            recent_topics = tmem.get_user_stats(user_id).get("favorite_topics", {})
            if recent_topics:
                top_topic = max(recent_topics, key=recent_topics.get)
                if top_topic in ["conviction", "discipline", "mind", "roast"]:
                    follow = f"\n\nlast time we talked about {top_topic}. still thinking about that?"
                    response = response + follow
    elif tc:
        response = tc.build_conversational_response(_detect_telegram_context(text), text, profile)
    else:
        hooks = [
            "what's on your mind? don't say 'price'.",
            "you holding anything right now? like actually holding?",
            "what's the last thing that made you question your position?",
            "what's your biggest fear in this space? not 'rugpull' - something real.",
            "what would make you leave crypto forever? has it happened yet?",
        ]
        response = random.choice(hooks)

    # Log the complete exchange after response is generated
    # (We'll log the bot message when it's sent, and update with user reply)

    await _send_with_state(update, response)

# =========================================================
# WELCOME NEW MEMBERS
# =========================================================

async def welcome_new_member(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Welcome new members when they join the group."""
    if not update.chat_member:
        return

    new_member = update.chat_member.new_chat_member
    old_member = update.chat_member.old_chat_member

    # Only welcome if they just joined (were not a member before)
    if old_member.status in ["left", "kicked"] and new_member.status == "member":
        user = new_member.user
        name = user.first_name or "there"

        welcomes = [
            f"welcome to the MAD FAM, {name}. you early or you late? either way, you're here now.",
            f"yo {name}, welcome to $MAD. don't be a lurker - we see those.",
            f"{name} just joined the MADness. what brought you here? be specific.",
            f"welcome {name}. this isn't a normal group. we roast, we hold, we don't fold. you ready?",
            f"{name} entered the chat. conviction level? scale of 1-10. and don't lie.",
        ]

        text = random.choice(welcomes)
        await context.bot.send_message(chat_id=update.effective_chat.id, text=text)

# =========================================================
# MAIN
# =========================================================

def main():
    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("roast", cmd_roast))
    app.add_handler(CommandHandler("challenge", cmd_challenge))
    app.add_handler(CommandHandler("archetype", cmd_archetype))
    app.add_handler(CommandHandler("wisdom", cmd_wisdom))
    app.add_handler(CommandHandler("whoami", cmd_whoami))
    app.add_handler(CommandHandler("cookme", cmd_cookme))
    app.add_handler(CommandHandler("price", cmd_price))
    app.add_handler(CommandHandler("about", cmd_about))
    app.add_handler(CommandHandler("help", cmd_help))
    app.add_handler(CommandHandler("numerology", cmd_numerology))
    app.add_handler(CommandHandler("market", cmd_market))
    app.add_handler(CommandHandler("mychao", cmd_mychao))
    app.add_handler(CommandHandler("feed", cmd_feed))
    app.add_handler(CommandHandler("garden", cmd_garden))
    app.add_handler(CommandHandler("affirm", cmd_affirm))
    app.add_handler(CommandHandler("stats", cmd_stats))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, on_message))
    app.add_handler(ChatMemberHandler(welcome_new_member, ChatMemberHandler.CHAT_MEMBER))

    # === RANDOM MOTION - Background Thread ===
    motion_thread = threading.Thread(target=motion_loop, daemon=True)
    motion_thread.start()

    print("[TELEGRAM] MAD Claw AI CONVERSATION STATE Bot starting...")
    print("[TELEGRAM] Changes:")
    print("  - Remembers questions it asked")
    print("  - Replies to answers without needing @mention")
    print("  - 10-minute conversation windows")
    print("  - Follow-up responses based on answer classification")
    print("  - WELCOMES NEW MEMBERS automatically")
    print("  - KNOWLEDGE DROPS: Rotating philosophy/practical/questions/affirmations/conviction every 30 min (silent chat only)")
    print("[TELEGRAM] Connected as: MadClawAIBot")

    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()

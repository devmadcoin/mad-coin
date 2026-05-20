"""
Telegram Conversation State — Tracks what the bot is waiting for
Enables reply chaining without @mention for 10-minute windows.
"""
import json
import os
import time

DATA_DIR = "bot_state"
os.makedirs(DATA_DIR, exist_ok=True)

STATE_FILE = f"{DATA_DIR}/conversation_states.json"


def _load():
    try:
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def _save(data):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def wrap_with_state(text, context):
    """Wrap a message with conversation context metadata."""
    return (text, {"context": context, "timestamp": time.time()})


def set_awaiting_reply(user_id, context, original_question=""):
    """Set state: we asked a question and are waiting for reply."""
    states = _load()
    states[str(user_id)] = {
        "awaiting": True,
        "context": context.get("context", "unknown") if isinstance(context, dict) else str(context),
        "original_question": original_question,
        "timestamp": time.time(),
    }
    _save(states)


def load_conversation_state(user_id):
    """Load state for user. Returns None if expired (>10 min)."""
    states = _load()
    uid = str(user_id)
    state = states.get(uid)
    if not state:
        return None
    # 10-minute expiry
    if time.time() - state.get("timestamp", 0) > 600:
        del states[uid]
        _save(states)
        return None
    return state


def clear_state(user_id):
    """Clear conversation state for user."""
    states = _load()
    uid = str(user_id)
    if uid in states:
        del states[uid]
        _save(states)


def generate_followup_response(user_reply, state):
    """Generate a follow-up based on user's reply to our question."""
    original = state.get("original_question", "")
    context = state.get("context", "unknown")
    reply_lower = user_reply.lower()

    # Simple classification-based follow-ups
    if any(w in reply_lower for w in ["yes", "yeah", "sure", "ok", "okay", "definitely", "absolutely"]):
        return "🔥 love that energy. what made you say yes?"

    if any(w in reply_lower for w in ["no", "nah", "not really", "nope", "never"]):
        return "fair. what's holding you back?"

    if any(w in reply_lower for w in ["maybe", "idk", "i don't know", "not sure", "dunno"]):
        return "the unsure zone is where conviction is born. what would make it a yes?"

    if any(w in reply_lower for w in ["bought", "grabbed", "aped", "in", "holding", "hodl"]):
        return "welcome to the 'we.' comfy hold from here. 🖤"

    if any(w in reply_lower for w in ["sell", "sold", "paper", "jeet", "out"]):
        return "the door is always open. but the real ones stay. you know what i mean?"

    if any(w in reply_lower for w in ["price", "chart", "pump", "dump", "mc"]):
        return "numbers change. identity doesn't. you're here for the 'we,' not the candle."

    if any(w in reply_lower for w in ["study", "learn", "book", "read", "knowledge"]):
        return "the ones who study are the ones who last. what are you reading?"

    if any(w in reply_lower for w in ["gm", "morning", "good morning"]):
        return "gm. what are you building today?"

    if any(w in reply_lower for w in ["gn", "night", "sleep", "good night"]):
        return "gn. the real ones compound while they sleep. see you tomorrow."

    if context in ["gm", "morning"]:
        return "solid start. how's the morning treating you?"

    if context in ["gn", "night"]:
        return "rest well. the market will be here when you wake."

    if context == "intro":
        return "appreciate you. what's your story — how'd you find $MAD?"

    if context == "affirmation":
        return "the words you speak become the reality you live. keep saying it."

    if context == "learning":
        return "knowledge compounds. what hit you hardest today?"

    # Default: acknowledge and deepen
    if len(user_reply) < 10:
        return "short and sharp. i like it. tell me more."

    return "noted. that says more than you think. what else is on your mind?"

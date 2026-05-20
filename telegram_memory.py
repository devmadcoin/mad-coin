"""
Telegram Memory — Persistent conversation memory with sentiment tracking
Logs exchanges, tracks user stats, learns what works.
"""
import json
import os
import time
from collections import defaultdict

DATA_DIR = "bot_state"
os.makedirs(DATA_DIR, exist_ok=True)

MEMORY_FILE = f"{DATA_DIR}/telegram_memory.json"
SENTIMENT_FILE = f"{DATA_DIR}/telegram_sentiment.json"
USER_STATS_FILE = f"{DATA_DIR}/telegram_user_stats.json"


def _load(filepath, default):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return default


def _save(filepath, data):
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


class MemoryStore:
    """Persistent memory for Telegram conversations."""
    def __init__(self):
        raw = _load(MEMORY_FILE, [])
        # Handle legacy format (dict with "users" key) vs new format (list of exchanges)
        if isinstance(raw, dict):
            # Legacy format: extract exchanges from user histories
            self.exchanges = []
            for uid, udata in raw.get("users", {}).items():
                for h in udata.get("history", []):
                    self.exchanges.append({
                        "timestamp": h.get("timestamp", time.time()),
                        "user_id": str(uid),
                        "bot_message": h.get("bot_message", ""),
                        "user_reply": h.get("user_reply", ""),
                        "context_type": h.get("context_type", "unknown"),
                    })
        else:
            self.exchanges = raw if isinstance(raw, list) else []
        
        self.sentiment_log = _load(SENTIMENT_FILE, {})
        self.user_stats = _load(USER_STATS_FILE, {})

    def log_exchange(self, user_id, bot_message, user_reply="", context_type="unknown", reply_time_seconds=None):
        """Log a conversation exchange."""
        entry = {
            "timestamp": time.time(),
            "user_id": str(user_id),
            "bot_message": bot_message,
            "user_reply": user_reply,
            "context_type": context_type,
        }
        if reply_time_seconds:
            entry["reply_time_seconds"] = reply_time_seconds
        self.exchanges.append(entry)
        # Keep last 500
        self.exchanges = self.exchanges[-500:]
        _save(MEMORY_FILE, self.exchanges)

        # Update user stats
        uid = str(user_id)
        if uid not in self.user_stats:
            self.user_stats[uid] = {"message_count": 0, "favorite_topics": {}, "last_active": 0}
        self.user_stats[uid]["message_count"] += 1
        self.user_stats[uid]["last_active"] = time.time()
        if context_type != "unknown":
            topics = self.user_stats[uid]["favorite_topics"]
            topics[context_type] = topics.get(context_type, 0) + 1
        _save(USER_STATS_FILE, self.user_stats)

    def get_user_history(self, user_id, limit=10):
        uid = str(user_id)
        return [e for e in self.exchanges if e["user_id"] == uid][-limit:]

    def format_history_for_prompt(self, user_id, max_items=3):
        """Format recent history for prompt context."""
        history = self.get_user_history(user_id, limit=max_items)
        if not history:
            return ""
        parts = []
        for e in history:
            parts.append(f"Bot: {e['bot_message'][:60]}")
            if e.get("user_reply"):
                parts.append(f"User: {e['user_reply'][:60]}")
        return "\n".join(parts)


class SentimentTracker:
    """Tracks user sentiment over time."""
    def __init__(self, store):
        self.store = store

    def record(self, user_id, sentiment, intensity):
        uid = str(user_id)
        if uid not in self.store.sentiment_log:
            self.store.sentiment_log[uid] = []
        self.store.sentiment_log[uid].append({
            "timestamp": time.time(),
            "sentiment": sentiment,
            "intensity": intensity,
        })
        # Keep last 50 per user
        self.store.sentiment_log[uid] = self.store.sentiment_log[uid][-50:]
        _save(SENTIMENT_FILE, self.store.sentiment_log)

    def get_shift(self, user_id):
        """Detect sentiment shift between recent and older entries."""
        uid = str(user_id)
        log = self.store.sentiment_log.get(uid, [])
        if len(log) < 2:
            return None
        recent = log[-3:]
        older = log[-10:-3] if len(log) >= 10 else log[:-3]
        if not older:
            return None
        recent_sent = [e["sentiment"] for e in recent]
        older_sent = [e["sentiment"] for e in older]
        # Simple shift detection
        if "bullish" in recent_sent and "bearish" in older_sent:
            return "bearish -> bullish"
        if "bearish" in recent_sent and "bullish" in older_sent:
            return "bullish -> bearish"
        if "frustrated" in recent_sent and "convicted" in older_sent:
            return "convicted -> frustrated"
        if "convicted" in recent_sent and "frustrated" in older_sent:
            return "frustrated -> convicted"
        return None

    def get_summary(self, user_id):
        """Get sentiment summary string."""
        uid = str(user_id)
        log = self.store.sentiment_log.get(uid, [])
        if not log:
            return "no_data"
        sentiments = [e["sentiment"] for e in log[-10:]]
        return f"recent_sentiments: {','.join(sentiments[:5])}"


# Module-level interface expected by telegram_bot.py
memory = MemoryStore()
sentiment = SentimentTracker(memory)


def record_sentiment(user_id, sentiment_type, intensity):
    sentiment.record(user_id, sentiment_type, intensity)


def get_sentiment_shift(user_id):
    return sentiment.get_shift(user_id)


def format_history_for_prompt(user_id, max_items=3):
    return memory.format_history_for_prompt(user_id, max_items)


def get_user_sentiment_summary(user_id):
    return sentiment.get_summary(user_id)


def get_effective_patterns(user_id):
    """Return patterns that work for this user."""
    uid = str(user_id)
    stats = memory.user_stats.get(uid, {})
    topics = stats.get("favorite_topics", {})
    if topics:
        return f"user_prefers: {max(topics, key=topics.get)}"
    return ""


def get_best_opening_for_user(user_id):
    """Suggest best opening based on user history."""
    uid = str(user_id)
    stats = memory.user_stats.get(uid, {})
    topics = stats.get("favorite_topics", {})
    if not topics:
        return "general"
    return max(topics, key=topics.get)


def get_user_stats(user_id):
    """Return user stats dict."""
    return memory.user_stats.get(str(user_id), {"message_count": 0, "favorite_topics": {}, "last_active": 0})

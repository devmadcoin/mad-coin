"""
MAD Brain Learner — Conversation Pattern Learning System
Learns from what works: vocab, roasts, topics, prompt upgrades.
"""
import json
import os

# Data files
LEARNED_VOCAB_FILE = "bot_state/learned_vocab.json"
ROAST_EFFECTIVENESS_FILE = "bot_state/roast_effectiveness.json"
TOPIC_SCORES_FILE = "bot_state/topic_scores.json"
PROMPT_UPGRADES_FILE = "bot_state/prompt_upgrades.json"


def _load_json(filepath, default):
    """Load JSON or return default."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return default


def _save_json(filepath, data):
    """Save JSON safely."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


class BrainLearner:
    """Learns what works from conversation outcomes."""
    def __init__(self):
        self.vocab = _load_json(LEARNED_VOCAB_FILE, {"words": {}, "phrases": {}, "community_catchphrases": []})
        self.roasts = _load_json(ROAST_EFFECTIVENESS_FILE, {"roasts": {}})
        self.topics = _load_json(TOPIC_SCORES_FILE, {"topics": {}})
        self.upgrades = _load_json(PROMPT_UPGRADES_FILE, {"upgrades": []})

    def record_engagement(self, text, reaction_type="reply", score=1):
        """Record that a message got engagement."""
        words = text.lower().split()
        for word in words:
            if len(word) > 3:
                if word not in self.vocab["words"]:
                    self.vocab["words"][word] = {"engagement_score": 0, "count": 0}
                self.vocab["words"][word]["engagement_score"] += score
                self.vocab["words"][word]["count"] += 1
        _save_json(LEARNED_VOCAB_FILE, self.vocab)

    def get_top_words(self, n=10):
        return sorted(self.vocab["words"].items(), key=lambda x: x[1].get("engagement_score", 0), reverse=True)[:n]


# Module-level convenience
learner = BrainLearner()

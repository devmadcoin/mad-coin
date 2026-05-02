"""
MAD Autonomous Engine
Master orchestrator. No human control needed. Runs 24/7.
Decides: what to post, when to post, how to reply, what mode to use.
Tracks: engagement, conversions, news, trends.
"""

import json
import random
import time
import threading
import sys
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from pathlib import Path

# Import our modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    import mad_content_engine as philosopher
except ImportError:
    philosopher = None

try:
    import telegram_conversational as tc
except ImportError:
    tc = None

try:
    import mad_retardmax as retardmax
except ImportError:
    retardmax = None

try:
    import solana_trending as trend_jacker
except ImportError:
    trend_jacker = None

try:
    import pump_fun_roaster as pump_roaster
except ImportError:
    pump_roaster = None

# =========================================================
# AUTONOMOUS DECISION ENGINE
# =========================================================

class MADAutonomousEngine:
    """
    The brain that decides everything without human input.
    """
    
    def __init__(self):
        self.state_file = Path(__file__).parent / "bot_state" / "autonomous_state.json"
        self.metrics_file = Path(__file__).parent / "bot_state" / "engagement_metrics.json"
        self.state = self._load_state()
        self.metrics = self._load_metrics()
        
    def _load_state(self) -> Dict:
        if self.state_file.exists():
            return json.loads(self.state_file.read_text())
        return {
            "last_post_time": None,
            "posts_today": 0,
            "current_mode": "philosopher",
            "active_conversations": 0,
            "trending_tokens": [],
            "last_news_check": None,
        }
    
    def _load_metrics(self) -> Dict:
        if self.metrics_file.exists():
            return json.loads(self.metrics_file.read_text())
        return {
            "posts": [],
            "philosopher_engagement": [],
            "retardmax_engagement": [],
            "trendjack_engagement": [],
            "pump_roast_engagement": [],
            "cta_clicks": {"website": 0, "sticker": 0},
            "best_performing_mode": "philosopher",
        }
    
    def _save_state(self):
        self.state_file.parent.mkdir(parents=True, exist_ok=True)
        self.state_file.write_text(json.dumps(self.state, indent=2))
    
    def _save_metrics(self):
        self.metrics_file.parent.mkdir(parents=True, exist_ok=True)
        self.metrics_file.write_text(json.dumps(self.metrics, indent=2))
    
    # === MODE SELECTION ===
    
    def select_mode(self, context: str = "x_post") -> str:
        """
        Decide: philosopher, retardmax, or trendjack?
        Based on time, performance data, and gut feeling.
        """
        now = datetime.now()
        hour = now.hour
        
        # Time-based defaults
        if 6 <= hour < 12:  # Morning = philosopher
            base_mode = "philosopher"
        elif 12 <= hour < 18:  # Afternoon = mix with pump roasts
            base_mode = random.choice(["philosopher", "retardmax", "pump_roast"])
        elif 18 <= hour < 23:  # Evening = trendjack + pump roasts (when Solana pumps happen)
            base_mode = random.choice(["retardmax", "trendjack", "pump_roast"])
        else:  # Late night = retardmax
            base_mode = "retardmax"
        
        # Override with performance data (if we have enough)
        if len(self.metrics["philosopher_engagement"]) >= 5 and len(self.metrics["retardmax_engagement"]) >= 5:
            phil_avg = sum(self.metrics["philosopher_engagement"]) / len(self.metrics["philosopher_engagement"])
            retard_avg = sum(self.metrics["retardmax_engagement"]) / len(self.metrics["retardmax_engagement"])
            
            if retard_avg > phil_avg * 1.3:  # Retardmax is 30% better
                base_mode = "retardmax"
            elif phil_avg > retard_avg * 1.3:  # Philosopher is 30% better
                base_mode = "philosopher"
        
        # News override: if breaking news, use trendjack
        if self._is_hot_news():
            base_mode = "trendjack"
        
        self.state["current_mode"] = base_mode
        self._save_state()
        return base_mode
    
    def _is_hot_news(self) -> bool:
        """Check if there's hot crypto news right now."""
        last_check = self.state.get("last_news_check")
        if last_check:
            last = datetime.fromisoformat(last_check)
            if datetime.utcnow() - last < timedelta(minutes=30):
                # Already checked recently, use cached
                return len(self.state.get("trending_tokens", [])) > 0
        
        # Try to fetch news (placeholder - would integrate real API)
        # For now, return False unless manually triggered
        return False
    
    # === CONTENT SAFETY FILTER ===
    
    BANNED_TOPICS = [
        "trump", "shooting", "assassination", "killed", "murder", "terror",
        "war", "genocide", "atrocity", "massacre", "bombing", "attack",
        "political violence", "riot", "coup", "insurrection",
    ]
    
    def is_content_safe(self, text: str) -> bool:
        """Block content that attaches MAD to tragedy or violence."""
        text_lower = text.lower()
        for topic in self.BANNED_TOPICS:
            if topic in text_lower:
                print(f"[FILTER] Blocked content containing '{topic}'")
                return False
        return True
    
    def generate_safe_content(self, mode: str = None) -> Dict[str, Any]:
        """Generate content, retry if it hits banned topics."""
        for attempt in range(3):
            content = self.generate_content(mode)
            if self.is_content_safe(content.get("content", "")):
                return content
            print(f"[FILTER] Attempt {attempt + 1} hit banned topic, retrying...")
        
        # Fallback to guaranteed safe content
        return {
            "mode": "retardmax",
            "content": "holding $MAD through the chaos. that's the tweet.",
            "predicted": "medium"
        }
    
    # === CONTENT GENERATION ===
    
    def generate_content(self, mode: str = None) -> Dict[str, Any]:
        """Generate content in selected mode."""
        if mode is None:
            mode = self.select_mode()
        
        if mode == "philosopher" and philosopher:
            posts = philosopher.generate_content_batch(1)
            if posts:
                return {"mode": "philosopher", "content": posts[0]["content"], "predicted": posts[0].get("predicted_engagement", "medium")}
        
        elif mode == "retardmax" and retardmax:
            posts = retardmax.generate_retardmax_post(1)
            if posts:
                return {"mode": "retardmax", "content": posts[0]["content"], "predicted": "high shares"}
        
        elif mode == "trendjack" and trend_jacker:
            posts = trend_jacker.generate_trend_jack_batch(1)
            if posts:
                return {"mode": "trendjack", "content": posts[0]["content"], "predicted": "high replies"}
        
        elif mode == "pump_roast" and pump_roaster:
            posts = pump_roaster.scan_and_roast()
            if posts:
                return {"mode": "pump_roast", "content": posts[0]["content"], "predicted": "high engagement", "token": posts[0].get("token", "")}
        
        # Fallback
        return {"mode": "philosopher", "content": "Stay $MAD. Conviction over hype.", "predicted": "medium"}
    
    # === TELEGRAM TONE DETECTION ===
    
    def detect_user_tone(self, text: str) -> str:
        """
        Detect if user wants philosopher or retardmax mode.
        Returns: 'philosopher', 'retardmax', or 'mixed'
        """
        text_lower = text.lower()
        
        # Retardmax indicators
        retard_signals = [
            "lol", "lmao", "lfg", "gm", "gn", "moon", "pump", "dump", "jeet",
            "ser", "fam", "wen", "wagmi", "ngmi", "alpha", "based", "cope",
            "hodl", "ape", "degen", "ape in", "paper hands", "diamond hands",
        ]
        
        # Philosopher indicators
        phil_signals = [
            "why", "how", "what if", "think", "believe", "conviction", "fear",
            "strategy", "plan", "worried", "concerned", "learn", "understand",
            "meaning", "purpose", "discipline", "patience", "long term",
        ]
        
        retard_score = sum(1 for s in retard_signals if s in text_lower)
        phil_score = sum(1 for s in phil_signals if s in text_lower)
        
        if retard_score > phil_score * 1.5:
            return "retardmax"
        elif phil_score > retard_score * 1.5:
            return "philosopher"
        else:
            return "mixed"
    
    def generate_telegram_reply(self, user_text: str, profile: Dict) -> str:
        """Generate autonomous reply based on user tone."""
        tone = self.detect_user_tone(user_text)
        
        if tone == "retardmax" and retardmax:
            # Use retardmax responses
            context = self._detect_context(user_text)
            return retardmax.get_retardmax_response(context)
        
        elif tone == "philosopher" and tc:
            # Use philosopher responses
            context = self._detect_context(user_text)
            return tc.build_conversational_response(context, user_text, profile)
        
        else:
            # Mixed - blend both
            if random.random() < 0.5 and tc:
                context = self._detect_context(user_text)
                return tc.build_conversational_response(context, user_text, profile)
            elif retardmax:
                context = self._detect_context(user_text)
                return retardmax.get_retardmax_response(context)
            else:
                return "what's on your mind?"
    
    def _detect_context(self, text: str) -> str:
        """Detect what the user is talking about."""
        text_lower = text.lower()
        
        if any(w in text_lower for w in ["gm", "good morning"]):
            return "gm"
        elif any(w in text_lower for w in ["price", "cost", "how much"]):
            return "price"
        elif any(w in text_lower for w in ["roast", "cook", "mean"]):
            return "roast"
        elif any(w in text_lower for w in ["done", "completed", "finished"]):
            return "completed"
        elif any(w in text_lower for w in ["comfy hold", "diamond hand", "hodl", "holding", "hold", "not selling", "never selling"]):
            return "hold"
        elif any(w in text_lower for w in ["paper hand", "paperhand", "sold", "sell", "jeet", "folded", "panic sell", "dumped", "took profit"]):
            return "sell"
        elif any(w in text_lower for w in ["condition", "conditioning", "system", "architecture", "machinery", "cage", "manufactured", "fiction", "narrative", "matrix", "control", "layers", "reacting on cue", "substituted", "programming", "behavioral"]):
            return "conditioning"
        elif any(w in text_lower for w in ["philosophy", "philosopher", "truth", "meaning", "purpose", "freedom", "identity", "why we hold", "conviction", "belief", "framework", "theory", "insight", "consciousness", "awareness", "awake", "woke"]):
            return "philosophy"
        else:
            return "general"
    
    # === ENGAGEMENT TRACKING ===
    
    def record_post_performance(self, post_data: Dict, likes: int, impressions: int):
        """Record how a post performed to inform future decisions."""
        mode = post_data.get("mode", "unknown")
        engagement_rate = (likes / impressions * 100) if impressions > 0 else 0
        
        self.metrics["posts"].append({
            "mode": mode,
            "content": post_data.get("content", "")[:100],
            "likes": likes,
            "impressions": impressions,
            "engagement_rate": engagement_rate,
            "timestamp": datetime.utcnow().isoformat(),
        })
        
        if mode == "philosopher":
            self.metrics["philosopher_engagement"].append(engagement_rate)
        elif mode == "retardmax":
            self.metrics["retardmax_engagement"].append(engagement_rate)
        elif mode == "trendjack":
            self.metrics["trendjack_engagement"].append(engagement_rate)
        elif mode == "pump_roast":
            self.metrics["pump_roast_engagement"].append(engagement_rate)
        
        # Keep only last 20 entries
        for key in ["philosopher_engagement", "retardmax_engagement", "trendjack_engagement", "pump_roast_engagement"]:
            if len(self.metrics[key]) > 20:
                self.metrics[key] = self.metrics[key][-20:]
        
        self._save_metrics()
    
    def record_cta_click(self, cta_type: str):
        """Track when someone clicks a CTA."""
        if cta_type in self.metrics["cta_clicks"]:
            self.metrics["cta_clicks"][cta_type] += 1
            self._save_metrics()
    
    # === AUTONOMOUS LOOP ===
    
    def run_autonomous_cycle(self):
        """
        One cycle of the autonomous engine.
        Decides what to do based on current state.
        """
        now = datetime.now()
        
        # Check if we should post to X
        last_post = self.state.get("last_post_time")
        if last_post:
            last = datetime.fromisoformat(last_post)
            hours_since = (now - last).total_seconds() / 3600
        else:
            hours_since = 999  # Never posted
        
        # Post every 1 hour (or more frequently if hot news)
        should_post = hours_since >= 1
        
        if should_post:
            mode = self.select_mode()
            content = self.generate_content(mode)
            
            # In real implementation, this would post to X API
            # For now, save to queue
            queue_file = Path(__file__).parent / "post_queue.json"
            queue = []
            if queue_file.exists():
                queue = json.loads(queue_file.read_text())
            queue.append({
                **content,
                "scheduled_for": now.isoformat(),
                "auto_generated": True,
            })
            queue_file.write_text(json.dumps(queue, indent=2))
            
            self.state["last_post_time"] = now.isoformat()
            self.state["posts_today"] += 1
            self._save_state()
            
            print(f"[AUTONOMOUS] Generated {mode} post: {content['content'][:60]}...")
        
        # Check news every 30 minutes
        last_news = self.state.get("last_news_check")
        if last_news:
            last = datetime.fromisoformat(last_news)
            if now - last >= timedelta(minutes=30):
                self._check_news()
        else:
            self._check_news()
    
    def _check_news(self):
        """Check for crypto news."""
        # Placeholder - would integrate real news API
        self.state["last_news_check"] = datetime.utcnow().isoformat()
        self._save_state()


# =========================================================
# MAIN
# =========================================================

if __name__ == "__main__":
    engine = MADAutonomousEngine()
    
    # Test: Generate content in each mode
    print("=" * 60)
    print("MAD AUTONOMOUS ENGINE TEST")
    print("=" * 60)
    
    for mode in ["philosopher", "retardmax", "trendjack"]:
        content = engine.generate_content(mode)
        print(f"\n[{mode.upper()}]")
        print(content["content"])
        print(f"Predicted: {content['predicted']}")
    
    print("\n" + "=" * 60)
    print("Tone Detection Test:")
    test_messages = [
        "lol lfg to the moon ser",
        "what's your conviction level? i'm worried about the dip",
        "gm fam how's everyone doing",
        "why do you think discipline matters more than hype?",
    ]
    for msg in test_messages:
        tone = engine.detect_user_tone(msg)
        print(f"  '{msg[:40]}...' -> {tone}")
    
    print("\n" + "=" * 60)
    print("Autonomous cycle complete.")

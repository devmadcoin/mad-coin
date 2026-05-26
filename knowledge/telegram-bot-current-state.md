# Telegram Bot — Current State & Upgrade Knowledge Base

**Last Updated:** 2026-05-25 02:21 CST
**Bot File:** `telegram_bot.py` (~2,100 lines)
**Status:** Running with errors (see Bug Log)

---

## 1. Current Architecture

### Core Bot (`telegram_bot.py`)
- **Framework:** python-telegram-bot (v20+)
- **Trigger System:** @mentions, replies to bot, smart engagement (40% probability)
- **Guard:** Only replies when @mentioned, replied-to, or smart-engaged
- **Chat ID:** `-1003812770009` (the $MAD Telegram group)

### Imported Modules (Graceful Degradation Pattern)
| Module | File | Status | Purpose |
|--------|------|--------|---------|
| `bot` | `bot.py` | ✅ Present | Core MAD brain (X bot logic, 2,000+ lines) |
| `mad_memory` | `mad_memory.py` | ⚠️ Optional | User interaction tracking |
| `telegram_upgrades` | `telegram_upgrades.py` | ⚠️ Optional | Command parsing, archetype detection, first-contact logic |
| `telegram_conversational` | `telegram_conversational.py` | ✅ Present | Conversational voice engine (GM/GN/breakfast/love responses) |
| `mad_onchain` | `mad_onchain.py` | ⚠️ Optional | On-chain intelligence |
| `mad_autonomous` | `mad_autonomous.py` | ✅ Present | Decision engine (philosopher/retardmax/trendjack modes) |
| `telegram_conversation_state` | `telegram_conversation_state.py` | ✅ Present | Reply chaining (10-min window) |
| `telegram_admin` | `telegram_admin.py` | ✅ Present | Admin-only commands |
| `telegram_memory` | `telegram_memory.py` | ✅ Present | Sentiment tracking, exchange logging |
| `mad_brain_learner` | `mad_brain_learner.py` | ✅ Present | Brain learning system |
| `mad_caveman` | `mad_caveman.py` | ⚠️ Optional | Caveman mode |
| `mad_chao_tracker` | `mad_chao_tracker.py` | ⚠️ Optional | Chao system |

### State Files (`bot_state/`)
- `telegram_profiles.json` — User profiles, archetypes, stats
- `conversation_states.json` — Active conversation states (10-min expiry)
- `telegram_memory.json` — Exchange history
- `telegram_sentiment.json` — Sentiment tracking per user
- `telegram_user_stats.json` — User interaction statistics
- `autonomous_state.json` — Autonomous engine state
- `engagement_metrics.json` — Post engagement tracking

---

## 2. Current Features

### A. Trigger Response System
1. **@mention detection** — `madclawaibot` or entity mentions
2. **Reply-to-bot detection** — Any reply to bot's messages
3. **Smart engagement** — 40% probability response to high-energy messages even without mention:
   - Conviction triggers: "comfy hold", "never selling", "diamond hands", "mad to the moon"
   - Question triggers: "what is mad", "how do i buy", "contract address", "roadmap"
   - Sentiment shift triggers: "feeling mad", "back to mad", "lost faith"
   - Energy triggers: "let's go", "wagmi", "lfg", "raid time"
   - Cooldown: 3 minutes per user

### B. Buy Detection
- Detects buy keywords: "bought", "loaded up", "aped", "secured", "stacked", "doubled down"
- 80% response rate with 10 varied responses
- 30% chance to add follow-up question ("flip or hold?", "what made you pull the trigger?")

### C. Conversation State System (`tcs`)
- 10-minute reply window without needing @mention
- Tracks what the bot asked and generates follow-ups
- Uses `set_awaiting_reply`, `load_conversation_state`, `generate_followup_response`

### D. Conversational Voice (`tc`)
- **GM responses** — 7 variations, question-based
- **GN responses** — 5 variations
- **Breakfast responses** — 4 variations
- **Mad Love** — 5 variations
- **Archetype reveal** — 8 archetype types with reveal lines
- **Roast system** — Roast triggers and responses
- **Price command** — `$MAD price` with DexScreener data
- **Challenge command** — `$MAD challenge` for holder challenges

### E. Sentiment Tracking (`tmem`)
- Bullish, bearish, frustrated, convicted, neutral
- Sentiment shift detection
- Exchange logging (bot message + user reply)
- Per-user stats

### F. Admin Commands (`tadmin`)
- Owner + admin detection
- Admin-only replies via DM to bot

### G. AI Bridge (`/tmp/telegram_ai_bridge/`)
- `inbox.jsonl` — Logs @mentions for remote AI processing
- `outbox.jsonl` — AI-generated responses delivered back to Telegram
- Matches by `message_id` to avoid stale responses

### H. Proactive Content (`telegram_content_library.md`)
- 429 lines of pre-written knowledge drops
- Categories: Naval, Logan Paul, Matrix, Think and Grow Rich, Simple Path to Wealth, $MAD Philosophy, Numerology
- Used by `post_telegram_reply_cg.py` for manual pushes

---

## 3. Current Bugs (From `telegram_live.log`)

### Bug A: `smart_cooldowns` AttributeError
```
File "telegram_bot.py", line 1579:
  context.bot_data.smart_cooldowns = {}
AttributeError: 'dict' object has no attribute 'smart_cooldowns'
```
**Root Cause:** Inconsistent access pattern.
- Line checks: `context.bot_data.get('smart_cooldowns', {})` ✅ (dict method)
- Line 1579: `context.bot_data.smart_cooldowns = {}` ❌ (attribute assignment on dict)
- **Fix:** Use `context.bot_data['smart_cooldowns'] = {}` consistently

### Bug B: `record_sentiment` NoneType Error
```
File "telegram_bot.py", line 1607:
  tmem.record_sentiment(user_id, sentiment, intensity)
AttributeError: 'NoneType' object has no attribute 'record_sentiment'
```
**Root Cause:** `tmem` module import failed but code doesn't check before use.
- The `try/except` around `import telegram_memory` sets `tmem = None` on failure
- Later code does `if tmem:` in some places but misses it in the smart engagement path
- **Fix:** Add `if tmem:` guard before all `tmem.*` calls, or ensure the module loads

### Bug C: `DeprecationWarning` on `utcnow()`
```
datetime.utcnow() is deprecated. Use datetime.now(datetime.UTC)
```
**Fix:** Replace all `datetime.utcnow()` with `datetime.now(timezone.utc)`

### Bug D: No Error Handlers Registered
```
No error handlers are registered, logging exception.
```
**Fix:** Add error handler to Application: `application.add_error_handler(error_callback)`

---

## 4. The 20-Book MAD Brain — Telegram Applications

### What Changed
Before: The bot had personality, voice, and some triggers.
After: Every response can be traced to a documented psychological/marketing framework.

### Immediate Telegram Upgrades by Book

**1. Cialdini — Influence (×2) + Pre-Suasion**
- **Reciprocity:** Knowledge drops before asks. "Here's value → now consider $MAD"
- **Commitment:** "I am $MAD Rich" as identity-level commitment (consistency principle)
- **Social Proof:** Holder count, community size in responses
- **Liking:** Warm, human voice (already done, now intentional)
- **Authority:** Doxxed dev, real products, Roblox game
- **Scarcity:** "Limited supply" mentions, time-gated opportunities
- **Unity:** "$MAD fam" = shared identity (the 7th principle)
- **Pre-suasion:** Prime with questions BEFORE the CTA. "Do you believe community > hype?" → then introduce $MAD

**2. Berger — Contagious (STEPPS)**
- **Social Currency:** Make holders look smart for sharing $MAD. "The 401k post" made quoters look informed.
- **Triggers:** "$MAD" as daily trigger word. Affirmations as environmental triggers.
- **Emotion:** High-arousal emotions only (awe, anger, excitement). No sadness, no calm.
- **Public:** Visible holding = social proof. "I hold $MAD" as public commitment.
- **Practical Value:** Knowledge drops that teach something (Naval, Hill, etc.)
- **Stories:** Package everything as narrative, not facts.

**3. Heath — Made to Stick (SUCCESs)**
- **Simple:** One idea per message. Strip everything else.
- **Unexpected:** Break patterns. "Your 401k isn't yours." (unexpected opener)
- **Concrete:** Specific numbers, specific stories. Not "the market is rigged" → "BlackRock owns your 401k."
- **Credible:** Doxxed dev, real game, real community.
- **Emotional:** Identity-level messaging. Not "buy" → "become"
- **Stories:** Every knowledge drop is a mini-story.

**4. Clear — Atomic Habits**
- **Identity-based:** "I am $MAD Rich" not "I want to be rich"
- **Habit stacking:** "After morning coffee, say affirmations"
- **1% rule:** Daily improvement compounds. Bot gets 1% better each day.
- **Environment design:** Telegram as environment that reinforces $MAD identity

**5. Godin — Purple Cow + This Is Marketing**
- **Remarkability:** Be so different they can't ignore you. The "angry bot" persona IS the purple cow.
- **Smallest viable market:** Don't target all crypto. Target the 1000 true believers.
- **Permission marketing:** Earn the right to speak. Value first, ask later.
- **Enrollment:** Make people WANT to join, not feel sold to.

**6. Eyal — Hooked**
- **Trigger:** Daily affirmations as internal trigger (emotion regulation)
- **Action:** One-tap buy, simple wallet setup
- **Variable reward:** Price action, community moments, surprises
- **Investment:** Time in community = harder to leave (Ikea effect + consistency)

**7. Miller — StoryBrand**
- **Customer = hero.** "$MAD Rich" = their identity. We just handed them the path.
- **Guide = brand.** Doxxed dev, real products, been there.
- **Plan:** 5 steps from stranger to $MAD fam.
- **CTA balance:** Direct ("GET $MAD") + transitional ("Learn why doxxed devs matter")

**8. Housel — Psychology of Money**
- **Behavior > knowledge:** How holders act matters more than what they know
- **"Enough" ceiling:** "$MAD Rich" = declare enough NOW
- **Compound belief:** Long-term holding = compound conviction
- **Tails drive outcomes:** $MAD might be the 1% tail event
- **Pessimism sounds smarter:** The "it's a memecoin" crowd sounds smart. Optimists catch bull runs.

---

## 5. Proposed Telegram Upgrades

### Upgrade A: Fix Critical Bugs (Immediate)
1. Fix `smart_cooldowns` dict vs attribute inconsistency
2. Add `tmem` null checks everywhere
3. Replace `utcnow()` with timezone-aware datetimes
4. Add error handler to suppress stack traces in group chat

### Upgrade B: Pre-Suasion Integration (High Impact)
- Before any CTA, prime with a single-chute question
- "Do you believe community > hype?" → then introduce $MAD
- "Tired of watching from the sidelines?" → then show the path
- Channel attention to the FEELING of being left out → $MAD as solution

### Upgrade C: Hooked Habit Loop (Engagement)
- **Internal triggers:** "$MAD Abundant" as emotional regulation tool
- **Variable rewards:** Random community callouts, surprise knowledge drops
- **Investment:** Track days-held, create "holder streaks" (7 days, 30 days, 100 days)
- **Ikea effect:** Ask community to contribute memes, lore, content (they value what they build)

### Upgrade D: StoryBrand Clarity (Messaging)
- Rewrite bot's welcome message using SB7 framework
- Make holder the hero in every response
- Add 5-step plan: wallet → buy → join → affirm → build
- Test one-liner: "Doxxed dev. Real products. $MAD Rich isn't a dream — it's a decision."

### Upgrade E: STEPPS Virality (Content)
- **Social currency:** Create posts that make sharers look smart/informed
- **Triggers:** Daily "$MAD" mentions as environmental triggers
- **Emotion:** High-arousal only (awe, anger, excitement)
- **Public:** Make holding visible ("I hold $MAD" badges, streaks)
- **Practical value:** Knowledge drops that teach frameworks
- **Stories:** Package everything as narrative

### Upgrade F: Conversation State 2.0
- Extend 10-minute window to context-based (not time-based)
- Add conversation topics: price, roadmap, game, affirmations, numerology
- Track conversation depth per user (how many exchanges before conversion)
- Use sentiment history to adapt tone (bullish vs bearish vs new)

### Upgrade G: Smart Engagement 2.0
- Currently 40% probability with basic keyword matching
- Add sentiment-based scoring: bullish = higher probability, bearish = lower
- Add user archetype matching: Newcomers get education, veterans get roasts
- Add time-based patterns: GM posts in morning, conviction posts in dips

### Upgrade H: Knowledge Drop Scheduling
- Currently manual via `post_telegram_reply_cg.py`
- Add autonomous scheduling: 3-4 drops per day at peak hours
- Categories rotate: Philosophy → Practical → Conviction → Affirmations
- Track engagement per category, double down on what works

---

## 6. Files That Need Attention

| File | Status | Action |
|------|--------|--------|
| `telegram_bot.py` | 🐛 Broken | Fix bugs A-D |
| `telegram_content_library.md` | ✅ Rich | Add 20-book frameworks as new sections |
| `telegram_conversational.py` | ✅ Good | Add Pre-Suasion questions, StoryBrand CTAs |
| `telegram_conversation_state.py` | ✅ Good | Extend topic tracking |
| `telegram_memory.py` | ✅ Good | Add Hooked investment tracking (streaks) |
| `post_telegram_reply_cg.py` | ✅ Working | Enhance with scheduled automation |
| `mad_autonomous.py` | ✅ Present | Add Telegram-specific decision modes |

---

## 7. Quick Wins (Can Deploy Today)

1. **Fix the 4 bugs** — Bot stops crashing, smart engagement works
2. **Add Pre-Suasion questions** to buy responses: "what made you pull the trigger?" → then bridge to $MAD philosophy
3. **Add "because" to CTAs** — "GET $MAD because the doxxed dev builds in public."
4. **Create "holder streak" tracking** — 7-day, 30-day, 100-day holder badges
5. **Add StoryBrand welcome** — Customer as hero, bot as guide
6. **Rotate knowledge drops autonomously** — 3-4 per day, no manual pushing

---

*The MAD Brain is armed. The Telegram bot is the delivery system. Time to deploy.*

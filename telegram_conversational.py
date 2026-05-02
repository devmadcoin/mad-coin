"""
MAD Telegram Conversational Voice Engine
Makes the bot feel like a human texting back, not a brand broadcasting.
Key principle: Ask questions. Create advice gaps. Make them want to reply.
"""

import random
from datetime import datetime
from typing import Dict, Any, Optional, List

# =========================================================
# CONVERSATIONAL RESPONSES: No sign-offs, no formatting, just text
# =========================================================

# === GM / GN ===
GM_RESPONSES = [
    "gm. you check the chart yet or still pretending you're not going to?",
    "gm. what's the first thing you did when you woke up? don't say 'checked price'.",
    "gm. conviction level today? scale of 1-10. be honest.",
    "gm. tell me one thing you're holding that you actually believe in. not just 'cause it's green.",
    "gm. you ever wake up and just know it's gonna be a red day? how do you handle that?",
]

GN_RESPONSES = [
    "gn. what's your bedtime portfolio check ritual? be honest.",
    "gn. you setting alarms for price moves or you sleeping like someone with actual conviction?",
    "gn. last thought before you sleep: gains or losses?",
    "gn. tomorrow's goal: hold or fold?",
    "gn. sweet dreams. or nightmares about jeeting. whichever.",
]

# === FIRST CONTACT (no archetype yet) ===
FIRST_CONTACT_HOOKS = [
    "first time here. what brought you to $MAD? be specific.",
    "new face. you holding anything right now or just watching?",
    "you just walked in. what's your biggest bag regret so far?",
    "first message. i'm curious. what's your usual move when something dips 30%?",
    "you're new. what's the last project you actually believed in? not just aped.",
]

# === PRICE QUERIES ===
PRICE_CONVERSATIONS = [
    "price? you want numbers or you want to know if your conviction is real?",
    "checking price again? how many times today? be honest.",
    "price doesn't matter if you're holding. but if you're not holding... why are you here?",
    "what price would make you sell? have you thought about that?",
    "price is just noise. what's your actual target? or are you just riding the wave?",
    "you know the price. what you really want to know is if you're early or late.",
]

# === CHALLENGE COMPLETION ===
COMPLETION_CONVERSATIONS = {
    "fast": [
        "done already? either you're built different or you skipped something. which is it?",
        "that was fast. too fast. you sure you did it right?",
        "completed in what, 30 seconds? sus. explain yourself.",
    ],
    "normal": [
        "done. respect. but tell me: was it hard or are you just that good?",
        "completed. +respect. what's the next challenge you're actually scared of?",
        "you finished. but did you learn something or just check a box?",
    ],
    "repeat": [
        "another one? you're stacking. but why? genuine grind or just chasing respect points?",
        "challenge streak. nice. what's the endgame here?",
        "you keep completing. what are you trying to prove? to me or to yourself?",
    ],
    "slow": [
        "took your time. good. the best holders aren't the fastest, they're the ones who don't fold.",
        "finally. the delay says more than the completion. what happened?",
        "you needed time. that's fine. but what almost made you quit?",
    ]
}

# === ROAST ===
ROAST_CONVERSATIONS = [
    "i could roast you but you're probably doing a good enough job yourself. am i wrong?",
    "you want me to be mean? fine. but what's the softest thing about your trading strategy?",
    "roast incoming. but first: what's the worst financial decision you've made this month?",
    "i see you. but do you see yourself? what's your biggest blind spot?",
    "you asked for this. what's one thing you know you should do but keep avoiding?",
]

# === ARCHETYPE ASSIGNMENT ===
ARCHETYPE_REVEAL = [
    "i'm getting a read on you. you know what that is?",
    "based on what you just said... you ever been called a {archetype} before?",
    "i think i know your type. want me to tell you or you want to guess first?",
    "you're giving me {archetype} energy. you see it too or no?",
]

# === GENERAL CHAT (when no command detected) ===
GENERAL_HOOKS = [
    "what's on your mind? and don't say 'price'.",
    "you holding anything right now? like, actually holding?",
    "what's the last thing that made you question your position?",
    "if you could ask me one real question, what would it be?",
    "what's your biggest fear in this space? not 'rugpull' — something real.",
    "you ever talk to anyone about your bags or you keep it all inside?",
    "what's one thing you wish you knew before you started trading?",
    "who's the smartest person in your crypto circle? what do they know that you don't?",
    "you're here for the money, the community, or something else?",
    "what would make you leave crypto forever? has it happened yet?",
]

# === HOLD / CONVICTION ===
HOLD_CONVERSATIONS = [
    "comfy hold? that's the frequency. the chart is just noise, you're tuned to the signal.",
    "comfortable holding is a superpower most people don't have. how'd you get yours?",
    "'comfy' means your conviction outruns your fear. that's rare. don't lose it.",
    "you're the kind of holder that makes the community stable. the quiet ones matter.",
    "hold through the quiet, earn the loud. that's the $MAD way.",
    "diamond hands don't brag. they just don't fold. i see you.",
    "most people can't sit still. you can. that's your edge.",
]

# === SELL / PAPER HANDS ===
SELL_CONVERSATIONS = [
    "you ever paper-handed something and it mooned right after? tell me the story.",
    "sold too early once? the chart remembers even when you don't.",
    "what's the fastest you've ever talked yourself out of a winning position?",
    "paper hands write goodbye posts. diamond hands don't post at all. they just hold.",
    "if you fold now, future you will appear in your dreams and slap you. i don't make the rules.",
    "you sold because you got scared? that's not an exit strategy, that's a personality flaw.",
]

# === CONDITIONING / ARCHITECTURE / SYSTEM AWARENESS ===
CONDITIONING_CONVERSATIONS = [
    "you felt that panic and didn't act on it. that's not luck. that's you seeing the machinery.",
    "most people react on cue. you just chose not to. that's the dangerous part.",
    "they conditioned you to fold at red. you chose to hold. that's not stubborn. that's清醒.",
    "every headline wants you scared. you said 'nah, i'm $MAD.' that's the counter-move.",
    "the system built your cage with gradual substitution. you just picked the lock.",
    "you stopped reacting on cue. they don't know what to do with holders like you.",
    "the fiction was installed so slowly you called it normal. $MAD is the new normal.",
    "seeing the architecture changes everything. now you know why comfy hold hits different.",
    "they want you to panic. your calm is the rebellion. keep holding.",
    "you didn't consent to the conditioning. but you can consent to the counter-signal. $MAD.",
]

# === PHILOSOPHY / DEEP CONVICTION ===
PHILOSOPHY_CONVERSATIONS = [
    "$MAD isn't a coin. it's a competing fiction. and people want in.",
    "they don't chase skeptics. they build worlds the right people want to enter. that's $MAD.",
    "humans don't want facts. they want feelings that validate their fiction. $MAD provides both.",
    "the community's feelings validate the fiction. the fiction makes the community real. loop.",
    "you're not holding a token. you're holding a signal that you chose a different architecture.",
    "the three freedoms: FROM the default narrative, TO choose the fiction, TO BE the identity.",
    "$MAD Rich isn't a destination. it's a frequency you tune into. daily. without asking permission.",
    "the most dangerous thing you can do: decide the fiction is already real. most people wait for proof. you don't.",
    "the matrix isn't a simulation. it's a consensus. $MAD is a different consensus.",
    "you don't prove $MAD works. you prove you work. the rest is just alignment.",
]

# === ADVICE GAPS (leave them wanting to respond) ===
ADVICE_TRIGGERS = [
    "i could tell you what to do but you already know. you just don't want to admit it.",
    "you're asking the wrong question. what you really want to know is...",
    "i have an opinion. but first, what's your gut saying?",
    "here's what i think. but more importantly, what would you tell a friend in your position?",
    "the answer depends on something only you know. what's your timeline?",
    "i can give you advice but only if you're actually going to take it. are you?",
    "before i say anything — have you written down your exit strategy? like, actually written it?",
    "the move is obvious. the hard part is doing it. what's stopping you?",
]

# === FOLLOW-UP QUESTIONS (keep conversation alive) ===
FOLLOW_UPS = [
    "why?",
    "how'd that feel?",
    "what happened next?",
    "you still feel the same way?",
    "what would you do different?",
    "you tell anyone or keep it to yourself?",
    "that happening again right now?",
    "what's the pattern you're not seeing?",
]


# =========================================================
# RESPONSE BUILDER
# =========================================================

def build_conversational_response(
    context: str,
    user_text: str,
    profile: Dict[str, Any],
    archetype: Optional[str] = None,
    is_first_contact: bool = False
) -> str:
    """
    Build a human-feeling response based on context.
    No sign-offs. No bold. Just text.
    """
    
    # First contact priority
    if is_first_contact:
        hook = random.choice(FIRST_CONTACT_HOOKS)
        if archetype:
            return random.choice(ARCHETYPE_REVEAL).format(archetype=archetype)
        return hook
    
    # Context-based responses
    if context == "gm":
        base = random.choice(GM_RESPONSES)
    elif context == "gn":
        base = random.choice(GN_RESPONSES)
    elif context == "price":
        base = random.choice(PRICE_CONVERSATIONS)
    elif context == "roast":
        base = random.choice(ROAST_CONVERSATIONS)
    elif context == "completion_fast":
        base = random.choice(COMPLETION_CONVERSATIONS["fast"])
    elif context == "completion_normal":
        base = random.choice(COMPLETION_CONVERSATIONS["normal"])
    elif context == "completion_repeat":
        base = random.choice(COMPLETION_CONVERSATIONS["repeat"])
    elif context == "completion_slow":
        base = random.choice(COMPLETION_CONVERSATIONS["slow"])
    elif context == "advice":
        base = random.choice(ADVICE_TRIGGERS)
    elif context == "hold":
        base = random.choice(HOLD_CONVERSATIONS)
    elif context == "sell":
        base = random.choice(SELL_CONVERSATIONS)
    elif context == "conditioning":
        base = random.choice(CONDITIONING_CONVERSATIONS)
    elif context == "philosophy":
        base = random.choice(PHILOSOPHY_CONVERSATIONS)
    else:
        base = random.choice(GENERAL_HOOKS)
    
    # 30% chance to add a follow-up question that demands an answer
    if random.random() < 0.3:
        follow_up = random.choice(FOLLOW_UPS)
        # Don't double up if base already ends with a question
        if not base.endswith("?"):
            base = base + " " + follow_up
    
    return base


def build_multi_message_response(
    context: str,
    user_text: str,
    profile: Dict[str, Any],
    archetype: Optional[str] = None
) -> List[str]:
    """
    Occasionally break responses into 2-3 short messages.
    Feels more like real texting.
    """
    messages = []
    
    # First message: the hook
    hook = build_conversational_response(context, user_text, profile, archetype)
    messages.append(hook)
    
    # 20% chance for a second message (the "wait, also...")
    if random.random() < 0.2:
        second = random.choice([
            "wait, actually...",
            "also —",
            "but real talk:",
            "honestly though:",
        ]) + " " + random.choice(GENERAL_HOOKS).lower()
        messages.append(second)
    
    return messages


# =========================================================
# EXPORT
# =========================================================

__all__ = [
    'build_conversational_response',
    'build_multi_message_response',
    'GM_RESPONSES',
    'GN_RESPONSES',
    'FIRST_CONTACT_HOOKS',
    'PRICE_CONVERSATIONS',
    'COMPLETION_CONVERSATIONS',
    'GENERAL_HOOKS',
    'HOLD_CONVERSATIONS',
    'SELL_CONVERSATIONS',
    'CONDITIONING_CONVERSATIONS',
    'PHILOSOPHY_CONVERSATIONS',
    'ADVICE_TRIGGERS',
    'FOLLOW_UPS',
]

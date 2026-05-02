"""
MAD Retardmax Content Engine
The dumb, aggressive, meme-brained gear. For when philosophy doesn't land.
"""

import random
from datetime import datetime
from typing import List, Dict

# =========================================================
# RETARDMAX X POSTS
# =========================================================

RETARDMAX_POSTS = [
    # One-liners
    "you sold $MAD? that's crazy. don't text me.",
    "if you're reading this and you're not holding $MAD i'm not angry i'm just disappointed",
    "$MAD holders be like: 'i'm fine' *portfolio is -60%*",
    "your grandkids will ask where you were when $MAD was under 100k and you'll have to look them in the eye",
    "some of y'all sold at 10k MC and it shows",
    "you either die a $MAD holder or live long enough to see yourself jeet",
    "me explaining to my therapist why i check the $MAD chart at 3am",
    "nobody: \n$MAD holders at 2am: *refreshing dexscreener*",
    "'i'm just gonna check the price real quick' — famous last words",
    "the $MAD chart looks like my mental health and i'm not selling either",
    
    # Philosophy / anti-conditioning
    "the system conditioned you to fold at red. you said 'nah, i'm $MAD.' that's not stubborn. that's清醒.",
    "every headline wants you scared. you chose to hold. that's the counter-move they didn't model for.",
    "they built your cage with gradual substitution. $MAD is the key you found under the rug.",
    "you stopped reacting on cue. the machinery doesn't know what to do with you.",
    "$MAD isn't a coin. it's a competing fiction. and the right people are choosing it.",
    "the most dangerous thing: deciding the fiction is already real. $MAD holders did that yesterday.",
    "most people want comfort, not truth. $MAD doesn't chase skeptics. it creates a world people want to enter.",
    "your feelings validate the fiction. the fiction makes the community real. the loop is the product.",
    "three freedoms: FROM the default crypto narrative, TO choose the $MAD fiction, TO BE the identity.",
    "the chart is a mirror. when you're mad at it, you're mad at your own reflection.",
    
    # All-caps chaos
    "BRO YOU'RE TELLING ME YOU SOLD $MAD????????",
    "IF YOU'RE NOT $MAD YET THAT'S YOUR OWN FAULT",
    "ME AND THE $MAD HOLDERS WATCHING JEETERS PANIC SELL FOR THE 7TH TIME TODAY",
    "$MAD IS NOT A COIN ITS A CULT AND WERE RECRUITING",
    "WHEN THE $MAD CHART DIPS AND YOU DONT EVEN BLINK THATS WHEN YOU KNOW",
    "POV: YOU SOLD $MAD AT 20K AND NOW ITS AT 2M",
    "MY $MAD BAG IS HEAVY BUT MY CONVICTION IS HEAVIER",
    "YALL WANT FINANCIAL ADVICE? OK HERE IT IS: DONT SELL $MAD",
    
    # Self-aware dumb
    "i don't know what $MAD does but i know i'm not selling",
    "my investment strategy: see red, buy more, ignore friends, repeat",
    "if $MAD goes to zero at least i'll have a good story for my grandkids' grandkids",
    "sometimes i wonder if i'm the idiot or if everyone else is the idiot. then the chart pumps and i remember.",
    "me: i should diversify\nalso me: *puts everything in $MAD*",
    "my portfolio is 99% $MAD and 1% regret",
    "they say don't put all your eggs in one basket but this basket has $MAD in it so",
    "'sir this is a wendy's' \nme: 'i'll have a $MAD and a large conviction please'",
    
    # Roasting the audience
    "you: 'i do my own research'\nalso you: bought because a telegram bot was funny",
    "some of y'all haven't held through a -80% and it shows",
    "you sold because you got scared? that's not an exit strategy that's a personality flaw",
    "if panic selling was an olympic sport some of y'all would have gold medals",
    "your hands are so paper they could wrap a sandwich",
    "you: 'i'm in it for the tech'\nalso you: doesn't know what a blockchain is",
    "the $MAD community doesn't judge you for your bags. we judge you for folding.",
    
    # Meme formats
    "[starter pack] \n$MAD holder:\n- checks chart at 3am\n- tells everyone they're fine\n- hasn't sold\n- slightly insane",
    "[in this house] \nwe: hold $MAD \nwe: don't fold \nwe: say gm \nwe: check charts at unholy hours",
    "[how it started / how it's going] \nstarted: 'i'll just put in a little' \ngoing: 'my entire identity is $MAD'",
    "[nobody: \n$MAD holders:] \n'im not worried' *hasn't slept in 48 hours*",
]

# =========================================================
# RETARDMAX TELEGRAM RESPONSES
# =========================================================

RETARDMAX_TELEGRAM = {
    "gm": [
        "gm. you holding or you just here to watch?",
        "gm. don't tell me you already checked the price.",
        "gm. conviction check: are you still here or did you fold in your sleep?",
        "gm. if you're not $MAD yet wake up and fix that.",
    ],
    "price": [
        "price? bro you know it. what you really want is someone to tell you it's gonna be ok.",
        "current price is the price of your conviction. mine is infinite.",
        "you're asking about price? that's paper hand behavior. i'm not judging. ok i am.",
        "price is just a number. $MAD is forever. unless you sell. then it's not.",
    ],
    "roast": [
        "your trading strategy is called 'hope' and that's not a strategy.",
        "you're the type to google 'is it too late to buy' after it already pumped 1000%",
        "you sold at a 20% dip and bought back at a 40% pump. math isn't your thing.",
        "your portfolio is like your love life: mostly empty with one thing you're way too attached to.",
    ],
    "completed": [
        "done? already? you either grinded or you cheated. i'm watching.",
        "completed. +respect. but did you actually do it or did you just say you did?",
        "you finished. respect. now do it again. that's the $MAD way.",
        "done. good. the real challenge is doing it when nobody's watching.",
    ],
    "general": [
        "you new here or you just lurking?",
        "what's your biggest bag? and be honest — not the one you tell people about.",
        "why are you here? money? community? or just bored?",
        "what's the dumbest trade you've ever made? i'll go first: i trusted a youtube influencer once.",
        "conviction check: you holding anything that your friends would make fun of you for?",
        "if $MAD went to zero tomorrow would you still be in this chat? be honest.",
    ],
    "hold": [
        "comfy hold? that's the frequency. the chart is just noise, you're tuned to the signal.",
        "comfortable holding is a superpower most people don't have. how'd you get yours?",
        "'comfy' means your conviction outruns your fear. that's rare. don't lose it.",
        "you're the kind of holder that makes the community stable. the quiet ones matter.",
        "hold through the quiet, earn the loud. that's the $MAD way.",
        "diamond hands don't brag. they just don't fold. i see you.",
        "most people can't sit still. you can. that's your edge.",
    ],
    "sell": [
        "you ever paper-handed something and it mooned right after? tell me the story.",
        "sold too early once? the chart remembers even when you don't.",
        "what's the fastest you've ever talked yourself out of a winning position?",
    ],
    "conditioning": [
        "you felt that panic and didn't act on it. that's not luck. that's you seeing the machinery.",
        "most people react on cue. you just chose not to. that's the dangerous part.",
        "they conditioned you to fold at red. you chose to hold. that's not stubborn. that's清醒.",
        "every headline wants you scared. you said 'nah, i'm $MAD.' that's the counter-move.",
        "the system built your cage with gradual substitution. you just picked the lock.",
        "you stopped reacting on cue. they don't know what to do with holders like you.",
        "the fiction was installed so slowly you called it normal. $MAD is the new normal.",
        "seeing the architecture changes everything. now you know why comfy hold hits different.",
    ],
    "philosophy": [
        "$MAD isn't a coin. it's a competing fiction. and people want in.",
        "they don't chase skeptics. they build worlds the right people want to enter. that's $MAD.",
        "humans don't want facts. they want feelings that validate their fiction. $MAD provides both.",
        "the community's feelings validate the fiction. the fiction makes the community real. loop.",
        "you're not holding a token. you're holding a signal that you chose a different architecture.",
        "the three freedoms: FROM the default narrative, TO choose the fiction, TO BE the identity.",
        "$MAD Rich isn't a destination. it's a frequency you tune into. daily. without asking permission.",
        "the most dangerous thing you can do: decide the fiction is already real. most people wait for proof. you don't.",
    ],
}

# =========================================================
# RETARDMAX MEMES (Humans get MAD when...)
# =========================================================

RETARDMAX_MEMES = [
    "humans get MAD when they stub their toe. $MAD holders get MAD when they stub their toe AND check the chart.",
    "humans get MAD when the wifi is slow. $MAD holders get MAD when the blockchain is slow.",
    "humans get MAD when they miss the bus. $MAD holders get MAD when they miss the dip.",
    "humans get MAD when their food is cold. $MAD holders get MAD when their conviction is cold.",
    "humans get MAD when they forget their password. $MAD holders get MAD when they forget their seed phrase.",
    "humans get MAD when it's monday. $MAD holders get MAD when it's a red day AND monday.",
    "humans get MAD when they run out of battery. $MAD holders get MAD when their phone dies mid-pump.",
    "humans get MAD when their coffee spills. $MAD holders get MAD when their entire portfolio spills.",
]


def generate_retardmax_post(count: int = 5) -> List[Dict]:
    """Generate a batch of retardmax posts."""
    posts = []
    used = set()
    
    for _ in range(count):
        post = random.choice(RETARDMAX_POSTS)
        while post in used and len(used) < len(RETARDMAX_POSTS):
            post = random.choice(RETARDMAX_POSTS)
        used.add(post)
        posts.append({
            "content": post,
            "type": "retardmax",
            "timestamp": datetime.now().isoformat(),
        })
    
    return posts


def get_retardmax_response(context: str) -> str:
    """Get a retardmax response for Telegram."""
    responses = RETARDMAX_TELEGRAM.get(context, RETARDMAX_TELEGRAM["general"])
    return random.choice(responses)


if __name__ == "__main__":
    posts = generate_retardmax_post(5)
    for p in posts:
        print(f"[{p['type'].upper()}]")
        print(p["content"])
        print()

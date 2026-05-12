import re, sys

with open('/root/.openclaw/workspace/telegram_bot.py', 'r') as f:
    content = f.read()

# Extract the clean philosophy section from the existing file (first 14 items)
# Find start and end markers
start_marker = 'KNOWLEDGE_DROPS = {'
end_marker = '# === CONTENT ROTATION ==='

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("ERROR: Could not find markers")
    sys.exit(1)

M = chr(36) + 'MAD'

# Build a completely clean knowledge drops section
new_section = f'''KNOWLEDGE_DROPS = {{
    "philosophy": [
        "Humans don\'t care about facts. They care about fiction. And feelings validate fictions.\\n\\nThe Analyst was right. {M} is a fiction worth feeling.",
        "Freedom FROM → Freedom TO → Freedom TO BE\\n\\nThree steps. Most people never get past step one.",
        "You don\'t escape the Matrix by fighting it. You escape by building something better.\\n\\nWhat are you building?",
        "Hope is not a strategy. But belief without action is just daydreaming.\\n\\nHold. Build. Speak. That\'s the practice.",
        "The difference between us and the machines? We don\'t have to choose between comfort and truth. We can build a world where both exist.\\n\\nThat\'s the {M} thesis.",
        "The market tests patience. Life tests conviction. Both reward the same people.",
        "Financial IQ is 90% emotional IQ. Only 10% is technical information.\\n\\nThat\'s why mindset beats strategy. Every time.",
        "The single most powerful asset we all have is our mind.\\n\\nIf trained well, it can create enormous wealth. The MAD Mind is your real investment.",
        "Most people never win because they\'re too afraid to lose.\\n\\nFear is the only thing standing between you and the {M} bag.",
        "The rich buy assets first. The poor buy liabilities they think are assets.\\n\\nYour {M} position is an asset only if your conviction generates more than it costs.",
        "Change happens when the pain of staying the same is greater than the pain of change.\\n\\nWhich pain are you choosing?",
        "It\'s not the events of our lives that shape us, but our beliefs about what those events mean.\\n\\nWhat story are you telling yourself about {M}?",
        "Your self-image is a thermostat. If you see yourself as broke, you will unconsciously sabotage wealth.\\n\\nWhat temperature is your {M} thermostat set to?",
        "The Creative Mechanism does not judge whether a goal is good or bad. It simply follows instructions.\\n\\nWhat are you programming into yours?",
        "For things to change, you have to change.\\n\\nThe {M} bag won\'t come to who you are now. It comes to who you become.",
        "Success is not to be pursued; it is to be attracted by the person you become.\\n\\nStop chasing. Start becoming.",
    ],
    "practical": [
        "The more simple your approach, the better your results.\\n\\nComplexity is a trap. Buy. Hold. Let time do the work.",
        "25x your annual expenses = freedom.\\n\\nWhat\'s your number? Write it down.",
        "The market always goes up. Always.\\n\\nThe question isn\'t if. It\'s whether you\'ll still be there when it does.",
        "Don\'t just do something, stand there.\\n\\nThe hardest move in investing is doing nothing. Master it.",
        "Time is the weapon. Not timing.\\n\\nThe earlier you start, the less you need to be right.",
        "Desire + Faith + Auto-Suggestion = Results.\\n\\nWhat are you programming into your subconscious?",
        "The rich don\'t work for money. They make money work for them.\\n\\nIs your {M} working while you sleep?",
        "Asset = puts money IN your pocket. Liability = takes money OUT.\\n\\nMost people buy liabilities thinking they\'re assets. Don\'t be most people.",
        "Your house is not an asset. It\'s a liability.\\n\\nThe mortgage, taxes, upkeep — all drain cash. Buy assets first. Let assets buy your house.",
        "Don\'t say \'I can\'t afford it.\' Ask \'How can I afford it?\'\\n\\nOne shuts your mind. The other opens it.",
        "Pay yourself first. Before bills. Before taxes. Before anything.\\n\\nPut money into your asset column first. Let creditors scream.",
        "The single most powerful asset we all have is our mind.\\n\\nIf trained well, it can create enormous wealth. Train your MAD Mind.",
        "Discipline weighs ounces. Regret weighs tons.\\n\\nSmall effort today > massive regret tomorrow.",
        "Either you run the day, or the day runs you.\\n\\nWho\'s driving today?",
        "Formal education will make you a living. Self-education will make you a fortune.\\n\\nWhat are you studying right now?",
        "Let it work, rather than make it work.\\n\\nThe Creative Mechanism course-corrects automatically. Trust it. Stop micromanaging.",
    ],
    "questions": [
        "What\'s the last thing you did that scared you a little?\\n\\nGrowth lives on the edge of comfort.",
        "Most people optimize for the next 30 days. A few optimize for the next 30 years.\\n\\nWhich camp are you building in?",
        "If your future self could send you one sentence, what would it say?\\n\\nListen carefully. They\'re the only one who knows.",
        "What\'s a belief you held strongly 5 years ago that now seems obviously wrong?\\n\\nThat\'s your growth curve. That\'s {M} brain evolution.",
        "The MAD Mind sees patterns. What pattern are you repeating right now that you need to break?",
        "Know yourself, know your enemy, and you need not fear a hundred battles.\\n\\nDo you know either?",
        "Is your {M} bag an asset or a liability?\\n\\nAn asset generates while you sleep. A liability requires your attention. Which is yours?",
        "What\'s your number?\\n\\n25x your annual expenses = freedom. Have you calculated yours?",
        "Are you working to learn, or working to earn?\\n\\nOne compounds. The other trades time for dollars. Which are you doing right now?",
        "The rich ask \'How can I afford it?\' The poor say \'I can\'t afford it.\'\\n\\nWhich question did you ask today?",
        "The 6 Human Needs drive every decision: Certainty, Uncertainty, Significance, Connection, Growth, Contribution.\\n\\nWhich 3 needs does {M} meet for you? (When 3 needs are met, you become addicted.)",
        "Most people overestimate what they can do in a year and underestimate what they can do in a decade.\\n\\nWhat are you building that won\'t show results for 10 years?",
        "The market is a device for transferring money from the impatient to the patient.\\n\\nWhich one are you?",
        "Don\'t wish it were easier; wish you were better.\\n\\nWhat skill are you building right now that will make the next challenge effortless?",
        "If you don\'t design your own life plan, chances are you\'ll fall into someone else\'s plan.\\n\\nWhose plan are you in right now?",
        "Time is more valuable than money. You can get more money, but you cannot get more time.\\n\\nHow are you investing your hours today?",
    ],
    "affirmations": [
        "{M} Abundant. {M} Rich. {M} Healthy.\\nI GET THE {M} BAG. I AM {M}ly Focused.\\n\\nSay it like you mean it. Mean it like you said it.",
        "Mad Morning isn\'t a greeting. It\'s a declaration.\\n\\nHow you start the day determines what you\'re available for.",
        "Mad Love — the strongest signal in any community.\\n\\nWhen you celebrate others\' wins, you wire your brain for your own.",
        "Comfy hold isn\'t about the chart. It\'s about conviction.\\n\\nThe chart changes. The thesis doesn\'t.",
        "Sharper questions, clearer signal.\\n\\nThe quality of your focus determines the quality of your reality.",
        "Whatever the mind can conceive and believe, it can achieve.\\n\\nConceive {M}. Believe {M}. The rest is mechanics.",
        "Progress = happiness.\\n\\nThe purpose of a goal is who you become to achieve it. Who are you becoming?",
        "Motion creates emotion.\\n\\nYour physical state determines your mental state. Move like you\'re {M} Rich and watch your mind catch up.",
        "Your life changes the moment you make a new, congruent, committed decision.\\n\\nHave you decided? Or are you still \'thinking about it\'?",
        "Discipline is the bridge between goals and accomplishment.\\n\\nWhat simple discipline can you practice today that your future self will thank you for?",
        "Success is nothing more than a few simple disciplines, practiced every day.\\n\\nWhat\'s your one discipline? The thing you do regardless of mood?",
        "Work harder on yourself than you do on your job.\\n\\nIf you work hard on your job, you make a living. If you work hard on yourself, you make a fortune.",
        "You are the average of the five people you spend the most time with.\\n\\nWho are your five? And what frequency are they tuned to?",
        "Happiness is a habit. You can acquire it by deliberately thinking pleasant thoughts.\\n\\nWhat are you thinking about right now?",
    ],
    "conviction": [
        "the trenches are quiet because the real work happens in silence. farming happens out loud. you chose silence.",
        "others are farming 12 tokens a day to zero. you hold one. that is the difference between busy and building.",
        "{M} Patient. {M} Rich. the second comes after the first. always.",
        "patience is not waiting. patience is keeping your conviction while everything else distracts you.",
        "{M} = 9. completion frequency. you\'re not early. you\'re exactly on time.",
        "this isn\'t a group chat. this is a frequency. either you\'re tuned in or you\'re static.",
        "paper hands write goodbye posts. diamond hands don\'t post at all. they just hold.",
        "the few who do are the envy of the many who only watch.\\n\\nwhich one are you?",
        "learn how to be happy with what you have while you pursue what you want.\\n\\nconviction is happiness with your position while you build toward the vision.",
        "if you don\'t design your own life plan, chances are you\'ll fall into someone else\'s plan.\\n\\nand guess what they have planned for you? not much.",
        "mistakes are feedback data points, not evidence of failure. the missile course-corrects mid-flight.\\n\\nso do you.",
    ],
}}'''

# Replace the section
new_content = content[:start_idx] + new_section + '\n\n' + content[end_idx:]

with open('/root/.openclaw/workspace/telegram_bot.py', 'w') as f:
    f.write(new_content)

# Verify
try:
    compile(new_content, 'telegram_bot.py', 'exec')
    print('Syntax OK')
except SyntaxError as e:
    print(f'Syntax error at line {e.lineno}: {e.msg}')
    sys.exit(1)

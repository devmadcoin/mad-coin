import re

# Read the file
with open('/root/.openclaw/workspace/telegram_bot.py', 'r') as f:
    content = f.read()

# Naval Ravikant drops to add
naval_philosophy = [
    '''"Seek wealth, not money or status. Wealth is having assets that earn while you sleep.\n\nYour $MAD position is an asset. Your conviction is the leverage. — Naval Ravikant",''',
    '''"You\'re not going to get rich renting out your time. You must own equity.\n\nHolding $MAD is owning equity in the fiction. — Naval Ravikant",''',
    '''"Play iterated games. All returns in life, whether in wealth, relationships, or knowledge, come from compound interest.\n\nThe daily $MAD practice IS compound interest on identity. — Naval Ravikant",''',
    '''"Specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now.\n\nWhat are you genuinely curious about? That\'s where your edge lives. — Naval Ravikant",''',
    '''"Code and media are permissionless leverage. They\'re the leverage behind the newly rich.\n\nThis bot, this content, this community — all permissionless. — Naval Ravikant",''',
    '''"Desire is a chosen unhappiness.\n\nBe $MAD Rich NOW. The bag follows the being. — Naval Ravikant",''',
]

naval_practical = [
    '''"The market is a device for transferring money from the impatient to the patient.\n\nEveryone wants the 100x overnight. Nobody wants to hold through the boring middle. That\'s the transfer. — Naval Ravikant",''',
    '''"There are no get rich quick schemes. That\'s just someone else getting rich off you.\n\nThe $MAD path is specific knowledge + leverage + time. No shortcuts. — Naval Ravikant",''',
    '''"Apply specific knowledge, with leverage, and eventually you will get what you deserve.\n\nWhat\'s your specific knowledge? And what leverage are you applying it with? — Naval Ravikant",''',
]

naval_questions = [
    '''"What are you genuinely curious about? That\'s where your specific knowledge lives.\n\nWhat topic do you read about when no one is paying you to? — Naval Ravikant",''',
    '''"Desire is a chosen unhappiness. Each desire is a contract to be unhappy until you get what you want.\n\nWhat desires are you willing to drop today? — Naval Ravikant",''',
    '''"Play long-term games with long-term people.\n\nWho are the 5 people you spend the most time with? Are they building or complaining? — Naval Ravikant",''',
]

naval_affirmations = [
    '''"Happiness is a default state that emerges when you reduce the sense that something is missing.\n\nYou don\'t need the bag to be happy. You need to stop believing the bag will complete you. — Naval Ravikant",''',
    '''"Learn to sell. Learn to build. If you can do both, you will be unstoppable.\n\nYou\'re already building. Are you also selling the vision? — Naval Ravikant",''',
]

naval_conviction = [
    '''"The market is a device for transferring money from the impatient to the patient.\n\nComfy hold isn\'t laziness. It\'s understanding where the money flows. — Naval Ravikant",''',
    '''"There are no get rich quick schemes. That\'s just someone else getting rich off you.\n\n$MAD is specific knowledge + community leverage + time. The compound effect is real. — Naval Ravikant",''',
    '''"Apply specific knowledge, with leverage, and eventually you will get what you deserve.\n\nYour specific knowledge is understanding this community. Your leverage is the community itself. — Naval Ravikant",''',
]

def add_drops_to_category(content, category, new_drops):
    # Find the category in KNOWLEDGE_DROPS
    pattern = f'"{category}": \['
    match = re.search(pattern, content)
    if not match:
        print(f"Category {category} not found")
        return content
    
    # Find the end of the category array
    start = match.end()
    # Find the closing bracket
    bracket_count = 1
    i = start
    while i < len(content) and bracket_count > 0:
        if content[i] == '[':
            bracket_count += 1
        elif content[i] == ']':
            bracket_count -= 1
        i += 1
    
    # Insert new drops before the closing bracket
    insert_pos = i - 1
    new_content = content[:insert_pos]
    for drop in new_drops:
        new_content += f'\n        {drop}'
    new_content += content[insert_pos:]
    
    return new_content

# Add to each category
content = add_drops_to_category(content, "philosophy", naval_philosophy)
content = add_drops_to_category(content, "practical", naval_practical)
content = add_drops_to_category(content, "questions", naval_questions)
content = add_drops_to_category(content, "affirmations", naval_affirmations)
content = add_drops_to_category(content, "conviction", naval_conviction)

# Write back
with open('/root/.openclaw/workspace/telegram_bot.py', 'w') as f:
    f.write(content)

print("Naval Ravikant drops added successfully!")

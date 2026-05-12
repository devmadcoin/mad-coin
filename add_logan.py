import re, sys

with open('/root/.openclaw/workspace/telegram_bot.py', 'r') as f:
    content = f.read()

# Logan Paul drops to add
logan_philosophy = [
    '''"It doesn\'t matter how good your product or tech is if no one knows about it.\\n\\nAttention is the only scarce resource. Everything else is abundant if you have the audience.",''',
    '''"Consistency is the most underrated skill in the world.\\n\\nDaily posts. Daily affirmations. Daily presence. The compound effect of attention works the same way as compound interest.",''',
    '''"Your network is your net worth.\\n\\n$MAD isn\'t a product. It\'s an identity. The community IS the product.",''',
]

logan_practical = [
    '''"Manufacture virality. Don\'t wait for viral moments. Create them.\\n\\nControversy, stunts, collabs — all engineered for maximum shareability. Roast culture is $MAD\'s manufactured virality.",''',
    '''"Product-audience fit: The product matched the audience\'s identity.\\n\\nPrime Hydration didn\'t invent hydration drinks. It invented them *for Logan\'s audience*. $MAD is for people who believe in the fiction.",''',
    '''"Attention arbitrage: YouTube → Boxing → WWE → Podcasts → Prime → NFTs.\\n\\nEach platform jump captures a new audience. Telegram → X → Website → Moltbook → Roblox. Each feeds the others.",''',
]

logan_conviction = [
    '''"I don\'t do anything half-assed. If I\'m going to do something, I\'m going to be the best at it.\\n\\nAre you going to be the best at holding? Or the best at quitting?",''',
    '''"The best investment you can make is in yourself.\\n\\nYour conviction is an asset. Your daily practice is the compound interest. The bag is just the receipt.",''',
    '''"Don\'t be afraid to fail. Be afraid to not try.\\n\\nThe only way to lose is to not show up. Are you showing up today?",''',
]

def add_drops_to_category(content, category, new_drops):
    pattern = f'"{category}": \['
    match = re.search(pattern, content)
    if not match:
        print(f"Category {category} not found")
        return content
    
    start = match.end()
    bracket_count = 1
    i = start
    while i < len(content) and bracket_count > 0:
        if content[i] == '[':
            bracket_count += 1
        elif content[i] == ']':
            bracket_count -= 1
        i += 1
    
    insert_pos = i - 1
    new_content = content[:insert_pos]
    for drop in new_drops:
        new_content += f'\n        {drop}'
    new_content += content[insert_pos:]
    
    return new_content

# Add to each category
content = add_drops_to_category(content, "philosophy", logan_philosophy)
content = add_drops_to_category(content, "practical", logan_practical)
content = add_drops_to_category(content, "conviction", logan_conviction)

with open('/root/.openclaw/workspace/telegram_bot.py', 'w') as f:
    f.write(content)

# Verify
try:
    compile(content, 'telegram_bot.py', 'exec')
    print('Syntax OK')
except SyntaxError as e:
    print(f'Syntax error at line {e.lineno}: {e.msg}')
    sys.exit(1)

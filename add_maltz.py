with open('/root/.openclaw/workspace/telegram_bot.py', 'r') as f:
    lines = f.readlines()

# Find 'What story are you telling yourself about' in philosophy section
for i, line in enumerate(lines):
    if 'What story are you telling yourself about' in line:
        insert_pos = i + 1
        break

# Maltz philosophy drops
M = chr(36) + 'MAD'
new_lines = [
    f'        "Your self-image is a thermostat. If you see yourself as broke, you will unconsciously sabotage wealth.\\n\\nWhat temperature is your {M} thermostat set to?",\n',
    f'        "The Creative Mechanism does not judge whether a goal is good or bad. It simply follows instructions.\\n\\nWhat are you programming into yours?",\n',
]

for q in reversed(new_lines):
    lines.insert(insert_pos, q)

with open('/root/.openclaw/workspace/telegram_bot.py', 'w') as f:
    f.writelines(lines)

# Verify
content = open('/root/.openclaw/workspace/telegram_bot.py').read()
try:
    compile(content, 'telegram_bot.py', 'exec')
    print('Syntax OK - Added 2 Maltz philosophy drops')
except SyntaxError as e:
    print(f'Error: {e.msg} at line {e.lineno}')

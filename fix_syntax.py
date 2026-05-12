import re

with open('/root/.openclaw/workspace/telegram_bot.py', 'r') as f:
    lines = f.readlines()

# Find the knowledge drops section (lines around 1270-1390)
# We need to merge lines that are part of broken multi-line strings

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    stripped = line.strip()
    
    # Check if this is a broken string line (starts with quote, doesn't end with quote, not a docstring)
    if (stripped.startswith('"') and not stripped.startswith('"""') and 
        not stripped.endswith('",') and not stripped.endswith('"],') and
        stripped.count('"') % 2 != 0 and
        '\\n' not in stripped):  # If it has \n it's a normal inline multiline
        
        # This is a broken string - collect until we find the closing quote
        parts = [stripped]
        j = i + 1
        while j < len(lines):
            next_line = lines[j].strip()
            parts.append(next_line)
            # Check if this line ends the string
            combined = ' '.join(parts)
            if combined.count('"') % 2 == 0 and (combined.endswith('",') or combined.endswith('"],')):
                break
            j += 1
        
        # Reconstruct as single line with \n escapes
        # Remove empty parts and join with \n
        content_parts = []
        for p in parts:
            p = p.strip()
            if p.startswith('"'):
                p = p[1:]  # Remove opening quote
            if p.endswith('",') or p.endswith('"],') or p.endswith('"'):
                # Check if this is the closing part
                if p.count('"') >= 1:
                    # Find last quote
                    last_quote = p.rfind('"')
                    if last_quote > 0:
                        content_parts.append(p[:last_quote])
                    else:
                        content_parts.append(p)
                else:
                    content_parts.append(p)
            else:
                content_parts.append(p)
        
        # Build the fixed line
        full_content = '\\n\\n'.join(content_parts)
        # Determine if it should end with ", or 
        ending = '",' if '],\n' not in lines[j] else '",'
        fixed_line = '        "' + full_content + ending + '\n'
        new_lines.append(fixed_line)
        i = j + 1
    else:
        new_lines.append(line)
        i += 1

with open('/root/.openclaw/workspace/telegram_bot.py', 'w') as f:
    f.writelines(new_lines)

# Verify
with open('/root/.openclaw/workspace/telegram_bot.py', 'r') as f:
    content = f.read()
try:
    compile(content, 'telegram_bot.py', 'exec')
    print('Syntax OK after fix')
except SyntaxError as e:
    print(f'Still broken at line {e.lineno}: {e.msg}')

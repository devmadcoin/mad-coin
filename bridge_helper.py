# Telegram AI Bridge Helper
# Usage: check inbox, write responses to outbox

import json
from pathlib import Path

INBOX = Path("/tmp/telegram_ai_bridge/inbox.jsonl")
OUTBOX = Path("/tmp/telegram_ai_bridge/outbox.jsonl")

def check_inbox():
    """Check for new @mentions that need responses."""
    if not INBOX.exists():
        print("No inbox yet.")
        return []
    
    with open(INBOX, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    entries = []
    for line in lines:
        try:
            entry = json.loads(line.strip())
            entries.append(entry)
        except json.JSONDecodeError:
            continue
    
    return entries

def write_response(chat_id: str, response_text: str, message_id: str = ""):
    """Write a response to the outbox for the bot to send."""
    entry = {
        "chat_id": chat_id,
        "message_id": message_id,
        "response": response_text,
        "timestamp": __import__("time").time(),
        "sent": False,
    }
    with open(OUTBOX, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    print(f"Response queued for chat {chat_id} msg {message_id}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python bridge_helper.py check")
        print("       python bridge_helper.py respond <chat_id> <message_id> <response_text>")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == "check":
        entries = check_inbox()
        if not entries:
            print("No messages in inbox.")
        else:
            print(f"{len(entries)} messages in inbox:")
            for e in entries:
                print(f"  [{e.get('username', '?')}] {e.get('text', '?')[:60]}...")
                print(f"    chat_id={e.get('chat_id')} message_id={e.get('message_id')}")
    
    elif cmd == "respond" and len(sys.argv) >= 5:
        chat_id = sys.argv[2]
        message_id = sys.argv[3]
        response = " ".join(sys.argv[4:])
        write_response(chat_id, response, message_id)
    else:
        print("Unknown command")

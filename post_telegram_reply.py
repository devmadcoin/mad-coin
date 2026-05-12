import requests
import os
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
CHAT_ID = "-1003812770009"

def send_message(text):
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": text,
        "parse_mode": "HTML"
    }
    response = requests.post(url, json=payload)
    return response.json()

with open("telegram_reply_zeke.txt", "r") as f:
    message = f.read()

result = send_message(message)
print("Sent:", result.get("ok"), "Message ID:", result.get("result", {}).get("message_id"))

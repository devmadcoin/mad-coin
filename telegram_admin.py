"""
Telegram Admin — Owner-only command handler
"""
import os

OWNER_ID = os.getenv("TELEGRAM_OWNER_ID", "0")


class Admin:
    """Simple admin command handler."""
    def is_owner(self, user_id):
        return str(user_id) == str(OWNER_ID)

    def handle(self, text, user_id, skip_auth=False):
        """Handle admin command. Returns (response, should_reply)."""
        cmd = text.split()[0].lower()

        commands = {
            "/status": "🤖 Bot is running. Knowledge drops active. Meme posting active.",
            "/stats": "📊 Check bot_state/ for detailed stats.",
            "/reload": "🔄 Reloading modules... (restart bot for full reload)",
            "/drop": "💧 Triggering knowledge drop...",
            "/help": "🔧 Admin commands: /status /stats /reload /drop /meme /mood",
            "/meme": "🎨 Meme posting is handled by content engine.",
            "/mood": "🧠 Mood tracking is active in conversation memory.",
        }

        response = commands.get(cmd)
        return (response, bool(response))


admin = Admin()

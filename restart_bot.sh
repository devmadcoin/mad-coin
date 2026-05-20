#!/bin/bash
# MAD Claw Bot Restart Script
set -e

echo "🔧 Restarting MAD Claw Bot..."

# Kill any existing bot processes
pkill -f "telegram_bot.py" 2>/dev/null || true
sleep 2

# Verify no duplicates
if pgrep -f "telegram_bot.py" > /dev/null; then
    echo "❌ Old process still running. Force killing..."
    kill -9 $(pgrep -f "telegram_bot.py") 2>/dev/null || true
    sleep 1
fi

# Start fresh
cd /root/.openclaw/workspace
nohup python3 telegram_bot.py >> telegram_live.log 2>&1 &
NEW_PID=$!

sleep 3

if ps -p $NEW_PID > /dev/null 2>&1; then
    echo "✅ Bot started successfully (PID: $NEW_PID)"
    echo "📋 Last log:"
    tail -5 telegram_live.log
else
    echo "❌ Bot failed to start. Check telegram_live.log"
    tail -20 telegram_live.log
    exit 1
fi

import os
import sys
from dotenv import load_dotenv
import tweepy

# Load credentials
load_dotenv()

# X API v2 credentials
api_key = os.getenv("X_API_KEY")
api_secret = os.getenv("X_API_SECRET")
access_token = os.getenv("X_ACCESS_TOKEN")
access_token_secret = os.getenv("X_ACCESS_TOKEN_SECRET")
bearer_token = os.getenv("X_BEARER_TOKEN")

# Authenticate with X API v2
client = tweepy.Client(
    bearer_token=bearer_token,
    consumer_key=api_key,
    consumer_secret=api_secret,
    access_token=access_token,
    access_token_secret=access_token_secret
)

# V1.1 API for media uploads (v2 doesn't support media upload directly)
auth = tweepy.OAuth1UserHandler(api_key, api_secret, access_token, access_token_secret)
api_v1 = tweepy.API(auth)

def post_tweet(text, media_paths=None):
    """Post a tweet. Optionally attach media files."""
    media_ids = []
    if media_paths:
        for path in media_paths:
            if os.path.exists(path):
                media = api_v1.media_upload(path)
                media_ids.append(media.media_id)
            else:
                print(f"Warning: Media file not found: {path}")

    try:
        if media_ids:
            response = client.create_tweet(text=text, media_ids=media_ids)
        else:
            response = client.create_tweet(text=text)
        print(f"Tweet posted: https://x.com/i/web/status/{response.data['id']}")
        return response.data['id']
    except Exception as e:
        print(f"Error posting tweet: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python post_x.py 'Tweet text' [media1.png media2.png ...]")
        sys.exit(1)

    tweet_text = sys.argv[1]
    media_files = sys.argv[2:] if len(sys.argv) > 2 else None
    post_tweet(tweet_text, media_files)

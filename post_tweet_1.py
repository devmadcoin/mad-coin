import os
from dotenv import load_dotenv
import tweepy

load_dotenv()

client = tweepy.Client(
    bearer_token=os.getenv("X_BEARER_TOKEN"),
    consumer_key=os.getenv("X_API_KEY"),
    consumer_secret=os.getenv("X_API_SECRET"),
    access_token=os.getenv("X_ACCESS_TOKEN"),
    access_token_secret=os.getenv("X_ACCESS_TOKEN_SECRET")
)

auth = tweepy.OAuth1UserHandler(
    os.getenv("X_API_KEY"),
    os.getenv("X_API_SECRET"),
    os.getenv("X_ACCESS_TOKEN"),
    os.getenv("X_ACCESS_TOKEN_SECRET")
)
api_v1 = tweepy.API(auth)

with open("tweet_text_1.txt", "r") as f:
    tweet_text = f.read()

media = api_v1.media_upload("public/memes/MAD-3-MONTHS.png")
response = client.create_tweet(text=tweet_text, media_ids=[media.media_id])
print("Posted:", response.data["id"])

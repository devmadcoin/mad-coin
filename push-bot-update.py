import requests, base64, json

TOKEN = "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"
OWNER = "devmadcoin"
REPO = "mad-coin"
BRANCH = "main"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}

files = [
    ("mad_content_engine.py", "feat: rewrite X bot content strategy with Moltbook-informed voice"),
    ("bot.py", "feat: reduce posting frequency from 60-70min to 8-12 hours"),
    (".env", "config: persist new posting frequency defaults"),
]

def push_file(path, message):
    with open(f"/root/.openclaw/workspace/{path}", "r") as f:
        content = f.read()
    
    encoded = base64.b64encode(content.encode()).decode()
    
    r = requests.get(
        f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{path}?ref={BRANCH}",
        headers=headers,
    )
    sha = r.json().get("sha") if r.status_code == 200 else None
    
    payload = {
        "message": message,
        "content": encoded,
        "branch": BRANCH,
    }
    if sha:
        payload["sha"] = sha
    
    r = requests.put(
        f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{path}",
        headers=headers,
        json=payload,
    )
    
    if r.status_code in [200, 201]:
        print(f"✅ {path} — pushed")
        return True
    else:
        print(f"❌ {path} — {r.status_code}: {r.text[:200]}")
        return False

for path, msg in files:
    push_file(path, msg)

print("\nDone.")

# WebGL Export Guide — $MAD Games on the Website

## Goal
Build Unity games → Export as WebGL → Embed on mad-coin.vercel.app

---

## Setup

### 1. Unity Version
Use **Unity 2022.3 LTS** or newer (stable, WebGL support is solid)

### 2. Install WebGL Build Support
- Unity Hub → Installs → your version → Add Modules
- Check "WebGL Build Support"

### 3. Project Settings

**Player Settings (Edit → Project Settings → Player → WebGL):**
- Resolution: 960×600 (embeddable) or responsive
- Template: Default or Minimal
- Compression Format: Gzip (smaller builds)
- Publish Settings:
  - Enable Exceptions: None (for release) / Full (for debug)
  - Compression: Brotli (best) or Gzip (compatible)

**Important Settings:**
- **WebAssembly 2023** support: ON (better performance)
- **Code Optimization**: Size (for faster load) or Speed (for better FPS)

---

## Build Steps

1. **File → Build Settings**
2. Switch Platform to **WebGL**
3. Click **Build**
4. Choose output folder (e.g., `builds/webgl/mad-runner/`)
5. Wait for build (2-10 min depending on project size)

---

## Output Structure

```
builds/webgl/mad-runner/
├── index.html          # Entry point
├── Build/
│   ├── mad-runner.data.gz
│   ├── mad-runner.framework.js.gz
│   ├── mad-runner.loader.js
│   └── mad-runner.wasm.gz
└── TemplateData/       # Loading bar, favicon, etc.
```

---

## Embedding on Website

### Option A: iframe (Easiest)

Host the WebGL build on Vercel/Netlify, embed via iframe:

```html
<!-- In your Next.js page -->
<iframe 
  src="/games/mad-runner/index.html"
  width="100%"
  height="600"
  style="border: none; border-radius: 12px;"
  allowfullscreen
/>
```

### Option B: Unity WebGL API (Advanced)

For two-way communication (game ↔ website):

```javascript
// In your React/Next.js component
const unityRef = useRef(null);

// Send message TO Unity game
const sendToGame = () => {
  unityRef.current?.sendMessage('GameManager', 'SetPlayerName', '$MAD Dev');
};

// Receive message FROM Unity game
useEffect(() => {
  window.addEventListener('message', (e) => {
    if (e.data.type === 'COIN_COLLECTED') {
      console.log('Player collected', e.data.amount, 'coins!');
    }
  });
}, []);
```

```csharp
// In Unity C# script
using UnityEngine;

public class WebBridge : MonoBehaviour
{
    // Called from JavaScript
    public void SetPlayerName(string name)
    {
        Debug.Log("Player name from web: " + name);
    }
    
    // Send TO JavaScript
    public void ReportCoinCollected(int amount)
    {
        Application.ExternalCall("parent.postMessage", 
            $"{{\"type\":\"COIN_COLLECTED\",\"amount\":{amount}}}", "*");
    }
}
```

---

## Hosting on Vercel

### 1. Copy Build to Public Folder

```bash
# In your Next.js project
cp -r builds/webgl/mad-runner public/games/mad-runner
```

### 2. Add to next.config.js

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/games/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};
```

> **Why these headers?** WebAssembly (WASM) requires COOP/COEP for SharedArrayBuffer support (needed for threading).

### 3. Create Game Page

```tsx
// app/game/mad-runner/page.tsx
'use client';

export default function MadRunnerGame() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-black text-white mb-8">
          MAD RUNNER <span className="text-[#FF2D2D]">3D</span>
        </h1>
        
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
          <iframe
            src="/games/mad-runner/index.html"
            className="w-full h-full"
            allowFullScreen
          />
        </div>
        
        <div className="mt-8 text-white/60">
          <p>Collect $MAD coins. Avoid jeeters. Get MAD rich.</p>
        </div>
      </div>
    </main>
  );
}
```

---

## Performance Tips

| Issue | Solution |
|-------|----------|
| Long load time | Use Addressables, load assets on demand |
| Large build size | Compress textures, use ASTC/ETC2, remove unused assets |
| Low FPS | Lower quality settings, reduce draw calls, use LODs |
| Audio lag | Preload audio clips, use Web Audio API |

**Recommended Max Build Size:** Under 50MB for fast loading

---

## Mobile WebGL

Unity WebGL works on mobile browsers but with caveats:
- **iOS Safari**: Limited memory (~200MB), can crash on large games
- **Chrome Android**: Better, but still limited vs native app

**Solutions:**
1. Detect mobile → Show "Download the App" button
2. Use lighter assets on mobile
3. Consider React Native wrapper for "app-like" experience

---

## Quick Checklist

- [ ] Install WebGL Build Support
- [ ] Set compression to Brotli/Gzip
- [ ] Test in Chrome/Edge (best WASM support)
- [ ] Add COOP/COEP headers
- [ ] Optimize for <50MB build
- [ ] Test on mobile (or show download prompt)
- [ ] Add fullscreen button
- [ ] Handle audio autoplay restrictions

---

## $MAD Game Ideas for WebGL

1. **MAD Runner** — Endless runner, collect coins, avoid obstacles
2. **Jeeter Smasher** — Clicker game, smash jeeters for $MAD
3. **MAD Match** — Match-3 with $MAD themed gems
4. **HODL Simulator** — Time your buys/sells, leaderboard
5. **$MAD Trivia** — Crypto/crypto culture quiz

All can be lightweight WebGL games embeddable on the site.

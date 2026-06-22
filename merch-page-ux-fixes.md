# $MAD Merch Page — UX Fixes (Prioritized)

## Fix 1: Remove Duplicate "MAD Stickers" Card
**Problem:** Two identical "MAD Stickers $5.98" cards appear in the product grid.
**Fix:** Remove the duplicate or replace with a different product.

```jsx
// BEFORE (duplicate)
<ProductCard label="Classic" status="In Stock" name="MAD Stickers" price="$5.98" />
<ProductCard label="Classic" status="In Stock" name="MAD Stickers" price="$5.98" /> // REMOVE THIS

// AFTER (single + next product)
<ProductCard label="Classic" status="In Stock" name="MAD Stickers" price="$5.98" />
{/* Next product here */}
```

---

## Fix 2: Add Consistent CTAs to All Product Cards
**Problem:** Only the first stickers card has "Grab the Sticker" — others have no clear action.
**Fix:** Every card gets a button. Label matches the product name.

```jsx
// ProductCard component — add CTA prop
<ProductCard
  label="Classic"
  status="In Stock"
  name="MAD Stickers"
  price="$5.98"
  cta="Grab the Sticker"
  ctaLink="/merch/stickers"
/>

<ProductCard
  label="Premium"
  status="Selling Fast"
  name="Card Wrap"
  price="$10.98"
  cta="Get the Wrap"
  ctaLink="/merch/card-wrap"
/>

<ProductCard
  label="Luxury"
  status="Low Stock"
  name="Rich Wrap"
  price="$10.98"
  cta="Get the Rich Wrap"
  ctaLink="/merch/rich-wrap"
/>

<ProductCard
  label="Fan Favorite"
  status="In Stock"
  name="Peeker"
  price="$9.98"
  cta="Get the Peeker"
  ctaLink="/merch/peeker"
/>
```

---

## Fix 3: Collapse the Sold-Out "Drop 001" Section
**Problem:** Wall of text for a product that's gone forever. Wastes prime real estate.
**Fix:** Compact badge + expandable "The Legend" section.

```jsx
// BEFORE (wall of text)
<section className="sold-out-section">
  <h2>Drop 001 — Legacy SOLD OUT FOREVER</h2>
  <p>Only 26 ever made. No restocks. No reprints.</p>
  <p>Every buyer received 1,000,000 $MAD tokens each.</p>
  <p>This will never happen again.</p>
  <p>The hat that started the legend...</p>
  {/* ... more text */}
</section>

// AFTER (compact + expandable)
<section className="sold-out-badge">
  <div className="flex items-center gap-3">
    <span className="text-red-500 font-bold">SOLD OUT FOREVER</span>
    <span className="text-white/45">26 made. No restocks.</span>
    <button 
      onClick={() => setShowLegend(!showLegend)}
      className="text-white/55 underline hover:text-white"
    >
      {showLegend ? 'Hide' : 'The Legend'}
    </button>
  </div>
  
  {showLegend && (
    <div className="mt-4 text-white/55 text-sm">
      <p>Every buyer received 1,000,000 $MAD tokens each.</p>
      <p>This will never happen again. The hat that started the legend.</p>
    </div>
  )}
</section>
```

---

## Fix 4: Loading Skeleton for Stats
**Problem:** "Loading $MAD stats..." with no visual feedback looks broken.
**Fix:** Add a pulse animation or simple spinner.

```jsx
// BEFORE
<div className="loading">Loading $MAD stats...</div>

// AFTER
<div className="loading flex items-center gap-2">
  <div className="w-4 h-4 border-2 border-white/45 border-t-white rounded-full animate-spin" />
  <span className="text-white/45">Loading $MAD stats...</span>
</div>

// CSS (Tailwind)
// animate-spin is built-in. No custom CSS needed.
```

---

## Fix 5: Clarify "Premium" vs "Luxury" Wraps
**Problem:** Card Wrap ($10.98, "Premium") and Rich Wrap ($10.98, "Luxury") — same price, different labels. Confusing.
**Fix:** Either differentiate price or add a "vs" comparison tooltip.

```jsx
// Option A: Differentiate price
<ProductCard
  label="Premium"
  status="Selling Fast"
  name="Card Wrap"
  price="$10.98"
  cta="Get the Wrap"
/>

<ProductCard
  label="Luxury"
  status="Low Stock"
  name="Rich Wrap"
  price="$12.98" // or $14.98
  cta="Get the Rich Wrap"
/>

// Option B: Same price, add tooltip explaining difference
<ProductCard
  label="Premium"
  status="Selling Fast"
  name="Card Wrap"
  price="$10.98"
  description="Matte finish, subtle texture"
  cta="Get the Wrap"
/>

<ProductCard
  label="Luxury"
  status="Low Stock"
  name="Rich Wrap"
  price="$10.98"
  description="Gloss finish, metallic accents"
  cta="Get the Rich Wrap"
/>
```

---

## Quick Wins (Optional but Nice)

### 6. Marquee Speed Reduction
```css
// Slow down the ticker
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 40s linear infinite; /* was 20s, now 40s */
}
```

### 7. Image Fallback for Customer Proof
```jsx
// Add fallback text if images fail
<img
  src={proof.image}
  alt={proof.alt}
  onError={(e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'block';
  }}
/>
<div className="hidden text-white/45 text-sm p-4">
  {proof.fallbackText}
</div>
```

### 8. "Next Drop" Teaser
```jsx
// Add below the product grid
<section className="next-drop mt-16 text-center">
  <p className="text-white/45 text-sm uppercase tracking-widest">Coming Soon</p>
  <h3 className="text-2xl font-bold mt-2">Drop 002 — ???</h3>
  <p className="text-white/55 mt-2">Join Telegram for early access.</p>
  <a href="https://t.me/madrichclub" className="inline-block mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white">
    Join Telegram
  </a>
</section>
```

---

## Priority Order
1. Fix 1 (duplicate) — 5 min
2. Fix 2 (CTAs) — 10 min
3. Fix 4 (loading skeleton) — 5 min
4. Fix 3 (sold-out collapse) — 10 min
5. Fix 5 (price clarity) — 5 min
6. Quick wins — 15 min

**Total: ~50 minutes of dev work.**

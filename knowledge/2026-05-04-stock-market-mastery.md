# Stock Market Mastery — Complete Study
> Studied: 2026-05-04
> Source: Synthesized from multiple authoritative sources

---

## 1. MARKET STRUCTURE & MECHANICS

### The Ecosystem
- **Stock Exchanges**: NYSE (auction market, largest by market cap), NASDAQ (fully electronic, tech-heavy), LSE, etc.
- **Brokers**: Intermediaries executing trades. Full-service vs discount. Make money via commissions, spreads, payment for order flow.
- **Market Makers**: Provide liquidity by quoting bid/ask prices continuously. Profit from bid-ask spread. Without them, low-volume stocks would be illiquid.
- **HFT Firms**: Execute millions of trades/second. Reduced spreads, improved efficiency, but created new dynamics.

### Order Types
| Order | What It Does | Risk Level |
|-------|-------------|------------|
| Market | Execute immediately at best available price | High (price not guaranteed) |
| Limit | Execute only at specified price or better | Low (may not fill) |
| Stop | Trigger market order when price hits level | Medium (slippage possible) |

### Order Book Dynamics
- **Top of Book**: Highest bid + lowest ask = current market price
- **Price Priority**: Best prices execute first
- **Time Priority**: First-in-queue gets filled first at same price
- **Dark Pools**: Private exchanges for institutional block trades. Remove liquidity from public markets.

### Settlement
- T+2 standard (trade date + 2 business days)
- Clearing matches trades, settlement transfers securities/funds

---

## 2. TECHNICAL ANALYSIS

### Moving Averages (Trend)
| Type | Calculation | Use Case |
|------|------------|----------|
| SMA | Simple average over period | Long-term trend |
| EMA | Weighted toward recent prices | Faster reaction |

- **Golden Cross**: 50 MA crosses above 200 MA = bullish
- **Death Cross**: 50 MA crosses below 200 MA = bearish
- Price above MA = uptrend; below = downtrend

### RSI — Relative Strength Index (Momentum)
- Range: 0-100
- >70 = overbought (potential pullback)
- <30 = oversold (potential bounce)
- Default period: 14 days
- **Divergence**: Price makes higher high but RSI makes lower high = weakening momentum

### MACD — Moving Average Convergence Divergence (Trend + Momentum)
- MACD Line = 12 EMA - 26 EMA
- Signal Line = 9 EMA of MACD Line
- Histogram = MACD Line - Signal Line
- Bullish: MACD crosses above signal line
- Bearish: MACD crosses below signal line
- Zero line cross = trend confirmation

### Support & Resistance
- **Support**: Price level where buying pressure prevents further decline
- **Resistance**: Price level where selling pressure prevents further rise
- Clusters of large orders at specific prices create these levels
- Break above resistance = new support; break below support = new resistance

### Multi-Indicator Strategy
```
STRONG BUY SIGNAL:
- RSI < 30 (oversold)
- Price near support
- MACD bullish crossover
- Price above 50 EMA
```

---

## 3. FUNDAMENTAL ANALYSIS

### The Three Financial Statements
1. **Income Statement**: Revenue, expenses, profit over time
2. **Balance Sheet**: Assets, liabilities, equity at point in time
3. **Cash Flow Statement**: Actual cash in/out

### Key Valuation Ratios
| Ratio | Formula | Interpretation |
|-------|---------|---------------|
| P/E | Price / Earnings Per Share | How much paid per $1 of earnings. Lower = potentially undervalued. Compare within industry. |
| PEG | P/E / Earnings Growth Rate | <1 = potentially undervalued considering growth |
| P/B | Price / Book Value Per Share | Market value vs accounting value. Good for mature industries. |
| P/S | Price / Revenue Per Share | Useful for unprofitable growth companies |
| ROE | Net Income / Shareholders' Equity | Return on shareholder capital. Higher = more efficient. |
| D/E | Total Debt / Total Equity | Financial leverage. High = more risk. |
| Dividend Yield | Annual Dividend / Price | Income return. Attractive for income investors. |

### Valuation Methods
- **DCF (Discounted Cash Flow)**: Project future cash flows, discount to present value
- **DDM (Dividend Discount Model)**: Value based on expected dividends
- **Comparable Analysis**: Compare ratios to peers

### Fundamental Quick Reference
```
What to Look For:
✓ Positive, consistent trends over 5-10 years
✓ Healthy cash flow
✓ Manageable debt
✓ Superior profitability vs peers
✓ Durable competitive advantage (moat)
✓ Capable management with skin in the game
✓ Favorable industry tailwinds
```

---

## 4. RISK MANAGEMENT

### The 1-2% Rule
- Risk NO MORE than 1-2% of total capital per trade
- $10,000 account = max $200 risk per position
- Survives losing streaks, preserves capital

### Position Sizing Formula
```
Position Size = (Account Size × Risk %) / Stop Loss Amount

Example:
- Account: $20,000
- Risk per trade: 1% ($200)
- Stop loss: $2 per share
- Position Size = $200 / $2 = 100 shares
```

### Risk-to-Reward Ratio
- Minimum 2:1 (risk $1 to make $2)
- With 2:1 ratio and 50% win rate = profitable over time
- Plan this BEFORE entering, not after

### Stop-Loss Rules
- Define before entering position
- Place based on technical level (below support, not arbitrary %)
- Trailing stops: adjust upward as profit grows
- Never move stop-loss further away after placing it

### Daily/Weekly Loss Limits
- Set hard stop for trading session
- Hit limit = walk away, no exceptions
- Prevents emotional revenge trading

### Diversification
- Spread across asset classes, sectors, geographies
- Core holdings (1-3) + Satellite holdings (3-8)
- Correlation awareness: correlated positions = higher total risk

### Volatility Adjustment
- Use ATR (Average True Range) for dynamic position sizing
- High volatility = smaller positions
- Low volatility = larger positions
- Same dollar risk regardless of instrument

---

## 5. MARKET CYCLES & MACROECONOMICS

### Cycle Types
| Cycle | Duration | Definition |
|-------|----------|------------|
| Secular Bull | 5+ years | Above-average returns with short declines |
| Secular Bear | 5+ years | Flat or declining prices |
| Cyclical Bull | Months-2 years | 30% rise in 2mo or 15% in 6mo |
| Cyclical Bear | Months-2 years | 30% drop in 2mo or 15% in 5mo |

### Full Market Cycle
- Every bull builds excesses that get reverted in the following bear
- "What goes up must come down" — Sir Isaac Newton
- Current incomplete cycle suggests eventual mean reversion
- Jack Bogle predicted two more 50% declines over next decade

### Key Economic Indicators
| Indicator | What It Shows | Market Impact |
|-----------|--------------|---------------|
| CPI (Inflation) | Price changes in goods/services | Fed policy driver |
| Fed Funds Rate | Central bank lending rate | Borrowing costs, stock valuations |
| GDP Growth | Economic output | Corporate earnings proxy |
| Unemployment | Labor market health | Consumer spending signal |
| M2 Money Supply | Liquidity in system | Inflation/asset price driver |

### Fed Policy Impact
- **Low rates + QE**: Stimulate economy, boost asset prices
- **High rates + QT**: Cool economy, pressure stocks
- **Rate cuts**: Usually bullish for stocks (cheaper borrowing)
- **Rate hikes**: Usually bearish (higher borrowing costs, lower present value of future earnings)

### Historical Pattern
- Steep inflation declines often precede multiyear bull markets
- 2009: CPI dropped 4.2%, S&P 500 began 9-year winning streak
- 1982: Similar pattern, 8-year winning streak followed
- Inflation at 2% = Fed comfort zone

---

## 6. OPTIONS TRADING

### Core Concepts
- **Call**: Right to BUY at strike price before expiration
- **Put**: Right to SELL at strike price before expiration
- **Premium**: Price paid for the option contract
- **Strike Price**: Predetermined exercise price
- **Expiration**: Last day option is valid

### Moneyness
| State | Call | Put |
|-------|------|-----|
| ITM (In-the-Money) | Stock > Strike | Stock < Strike |
| ATM (At-the-Money) | Stock = Strike | Stock = Strike |
| OTM (Out-of-the-Money) | Stock < Strike | Stock > Strike |

### Option Pricing Factors
```
Premium = Intrinsic Value + Time Value + Volatility Premium

Key Drivers:
1. Underlying stock price (most direct)
2. Time until expiration (time decay accelerates in final 30 days)
3. Implied volatility (higher = more expensive)
4. Interest rates & dividends (minor effect)
```

### Buyer vs Seller
| | Buyer (Holder) | Seller (Writer) |
|---|---|---|
| Pays/Receives | Pays premium | Receives premium |
| Right/Obligation | Right, not obligation | Obligation if exercised |
| Risk | Limited to premium | Unlimited (naked calls) |
| Profit | Unlimited (calls) / Substantial (puts) | Capped at premium |

### Basic Strategies
| Strategy | Setup | Use Case |
|----------|-------|----------|
| Long Call | Buy call | Bullish speculation |
| Long Put | Buy put | Bearish speculation / hedge |
| Covered Call | Own stock, sell call | Income generation |
| Protective Put | Own stock, buy put | Downside insurance |
| Cash-Secured Put | Sell put with cash aside | Acquire stock at lower price |

---

## 7. TRADING PSYCHOLOGY

### The Amateur vs Professional Mindset
- **Amateurs focus on returns** — "How much can I make?"
- **Professionals focus on risk** — "How much can I lose?"

### Emotional Traps
| Emotion | Manifestation | Solution |
|---------|--------------|----------|
| Fear | Panic selling, hesitation | Pre-defined plan, trust the system |
| Greed | Oversizing, moving targets | Stick to position sizing rules |
| Ego | Refusing to take loss | Set stops before entry, honor them |
| Revenge | Trading after loss to "get back" | Daily loss limits, walk away |
| FOMO | Chasing breakouts | Wait for pullbacks, stick to strategy |

### Discipline Principles
1. Define plan before market opens
2. Follow rules even when uncomfortable
3. Review trades regularly, refine over time
4. Emotional resilience = technical skill

---

## 8. INVESTMENT STRATEGIES

### Time Horizon Spectrum
| Style | Holding Period | Approach |
|-------|---------------|----------|
| Day Trading | Hours | Technical, high frequency, strict stops |
| Swing Trading | Days-Weeks | Technical + momentum, 9/21 EMA cross |
| Position Trading | Weeks-Months | Trend following, fundamentals + technical |
| Long-term Investing | Years+ | Fundamental, buy-and-hold, compound |

### Value Investing
- Buy undervalued companies with margin of safety
- P/E below industry average, strong balance sheet
- Patience required — market may take years to recognize value
- Warren Buffett approach

### Growth Investing
- Pay premium for above-average growth
- Accept higher P/E if growth justifies it
- Focus on revenue/earnings growth trajectory
- More volatile, higher risk/reward

### Index Investing
- Buy entire market via ETFs (SPY, VOO, QQQ)
- Lowest fees, maximum diversification
- 90% of active managers underperform over 15 years
- Recommended for most investors

---

## 9. SYNTHESIS — $MAD APPLICATION

### What $MAD Holders Should Know
1. **The Market is a Voting Machine Short-term, Weighing Machine Long-term** — Ben Graham
   - Short-term: sentiment, hype, manipulation drive price
   - Long-term: fundamentals, earnings, cash flow determine value
   - $MAD is currently in "voting machine" phase — community sentiment IS the fundamental

2. **Compounding is the Eighth Wonder of the World** — Einstein (attributed)
   - 10% annual return doubles money every 7.2 years
   - Time in market beats timing the market
   - $MAD's exponential growth thesis mirrors compound interest

3. **Volatility is the Price of Admission**
   - 10% corrections happen every year on average
   - 20% bear markets happen every 3-5 years
   - 50% crashes happen once per generation
   - Those who survive volatility capture long-term gains

4. **Risk Management is Survival**
   - Never risk what you can't afford to lose
   - Position sizing preserves capital for the next opportunity
   - Stop losses protect against catastrophic damage

5. **Sentiment Extremes are Contrarian Signals**
   - When everyone is bullish = time to be cautious
   - When everyone is fearful = time to be greedy
   - "Be fearful when others are greedy, greedy when others are fearful" — Buffett

### Key Quotes for $MAD Voice
- "The market transfers money from the impatient to the patient"
- "Price is what you pay, value is what you get"
- "In the short run, the market is a voting machine. In the long run, it's a weighing machine."
- "Risk comes from not knowing what you're doing"

---

## 10. QUICK REFERENCE CHEAT SHEET

### Before Any Trade
```
☐ Defined entry price
☐ Defined stop-loss (1-2% risk max)
☐ Defined profit target (2:1 minimum)
☐ Position size calculated
☐ Checked correlations with existing positions
☐ Checked news/earnings calendar
☐ Emotional state: calm and objective
```

### Market Health Check
```
☐ S&P 500 above/below 200-day MA?
☐ VIX level (fear gauge) — >20 = elevated fear
☐ Fed policy direction
☐ Earnings season impact
☐ Major economic data releases this week
```

### Reading a Stock Quickly
```
1. Check trend (price vs 50/200 MA)
2. Check momentum (RSI, MACD)
3. Check support/resistance levels
4. Check valuation (P/E vs peers)
5. Check earnings trend (3-5 years)
6. Check debt levels (D/E ratio)
7. Check institutional ownership
```

---

*Knowledge status: COMPLETE baseline study. Continuous updates as markets evolve.*

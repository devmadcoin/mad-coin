export const PAGE_LINKS = [
  { label: "Home", href: "/" },
  { label: "MAD AI", href: "/mad-mind" },
  { label: "Community", href: "/community" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Game", href: "/game" },
  { label: "MAD Art", href: "/mad-art" },
  { label: "Rewards", href: "/rewards" },
  { label: "Shop", href: "/merch" },
];

/* ---------------- MAD AI ---------------- */

export const SUPPLY = 490_820_000;

export const MILESTONES = [
  { mcap: 1_000_000, icon: "🎯" },
  { mcap: 5_000_000, icon: "📈" },
  { mcap: 10_000_000, icon: "🚀" },
  { mcap: 25_000_000, icon: "💎" },
  { mcap: 50_000_000, icon: "🔥" },
  { mcap: 100_000_000, icon: "👑" },
];

export const LIFE_PATH: Record<number, { title: string; reading: string }> = {
  1: { title: "The Leader", reading: "You move first and apologize never. Your frequency is initiative — in $MAD terms, you're the one who buys the fear and leads the charge." },
  2: { title: "The Diplomat", reading: "You read rooms others don't even notice. Your edge is timing — you hold when others fold because you feel the shift before it shows." },
  3: { title: "The Creator", reading: "Your vibration is expression. Memes, content, energy — you pump the culture, and the culture pumps the chart." },
  4: { title: "The Builder", reading: "Discipline is your default setting. You DCA, you stake, you show up daily. Boring to some. Deadly effective for you." },
  5: { title: "The Free Spirit", reading: "Chaos doesn't scare you — it charges you. You thrive in volatility. Just remember: conviction beats impulse." },
  6: { title: "The Nurturer", reading: "You build community wherever you land. People hold because you hold them. The FAM runs on frequencies like yours." },
  7: { title: "The Seeker", reading: "You verify everything. On-chain proof, dev history, lock contracts — your skepticism is a superpower in this market." },
  8: { title: "The Powerhouse", reading: "Wealth frequency incarnate. You think in cycles and multipliers. Your risk: moving too fast. Your gift: moving at all." },
  9: { title: "The Humanitarian", reading: "You give before you take — literally the $MAD model. Your returns come through what you build for others." },
  11: { title: "The Illuminator (Master)", reading: "Master number. You see patterns in noise. Your intuition is your alpha — trust it, but size your positions like a mortal." },
  22: { title: "The Master Builder", reading: "Master number. You turn vision into infrastructure. You're not here for a trade — you're here for an empire." },
};

export const ZODIAC = [
  { animal: "Rat", icon: "🐀", style: "The Accumulator — stacks quietly, strikes precisely. Nobody sees your bag until it matters." },
  { animal: "Ox", icon: "🐂", style: "The Grinder — unshakeable holder. Dips don't exist in your vocabulary, only discounts." },
  { animal: "Tiger", icon: "🐅", style: "The Hunter — bold entries, fearless conviction. You were born for volatile markets." },
  { animal: "Rabbit", icon: "🐇", style: "The Strategist — careful, quick, and always three hops ahead of the crowd." },
  { animal: "Dragon", icon: "🐉", style: "The Visionary — natural-born cult leader energy. When you talk, wallets listen." },
  { animal: "Snake", icon: "🐍", style: "The Analyst — cold, patient, precise. You sell tops and buy fear without flinching." },
  { animal: "Horse", icon: "🐎", style: "The Sprinter — high energy, fast moves. Channel it into conviction, not impulse." },
  { animal: "Goat", icon: "🐐", style: "The Loyalist — community first, always. You're the reason the FAM holds together." },
  { animal: "Monkey", icon: "🐒", style: "The Opportunist — clever and adaptable. You find alpha where others find noise." },
  { animal: "Rooster", icon: "🐓", style: "The Herald — loud, proud, early. You call the dawn before anyone sees the sun." },
  { animal: "Dog", icon: "🐕", style: "The Guardian — fiercely loyal to the FAM. FUD bounces off you like rain." },
  { animal: "Pig", icon: "🐖", style: "The Enjoyer — here for the journey and the gains. Your optimism is contagious." },
];

export const ELEMENTS = ["Metal", "Water", "Wood", "Fire", "Earth"] as const;

export const ARCHETYPES = {
  diamond: { name: "The Diamond Hands", icon: "💎", desc: "Pressure doesn't break you — it makes you. While others panic-sell the dip, you're the floor everyone stands on. Your conviction is your compound interest." },
  trench: { name: "The Trench Warrior", icon: "⚔️", desc: "You've seen rugs, dumps, and FUD storms — and you're still standing. Battle-scarred and sharper for it. The trenches made you dangerous." },
  manifestor: { name: "The Manifestor", icon: "✨", desc: "You spoke it before it happened. Your frequency attracts the outcome — vision board in your head, chart in your hands." },
  scientist: { name: "The Mad Scientist", icon: "🧪", desc: "On-chain data, tokenomics, lock contracts — you read the fine print others skip. Your edge is knowing exactly what you hold and why." },
  leader: { name: "The Cult Leader", icon: "🔥", desc: "You don't join movements — you start them. Your energy is contagious, your DMs are full, and the FAM grows every time you speak." },
} as const;

export type ArchetypeKey = keyof typeof ARCHETYPES;

export const QUIZ: { q: string; opts: { text: string; a: ArchetypeKey }[] }[] = [
  {
    q: "The chart just dropped 40% in an hour. You...",
    opts: [
      { text: "Buy more. This is the discount I prayed for.", a: "diamond" },
      { text: "Check the dev wallet and lock contracts — then decide.", a: "scientist" },
      { text: "Post conviction in the chat. Morale matters.", a: "leader" },
      { text: "Nothing. I've survived worse.", a: "trench" },
      { text: "Light a candle. The reversal is already written.", a: "manifestor" },
    ],
  },
  {
    q: "Your friend asks why you hold $MAD. You say...",
    opts: [
      { text: "Numbers don't lie — look at the locks and burns.", a: "scientist" },
      { text: "Because I said I would. That's it.", a: "diamond" },
      { text: "Because we're going to make it. All of us.", a: "manifestor" },
      { text: "Let me tell you the whole story — pull up a chair.", a: "leader" },
      { text: "Weak hands ask why. Strong hands ask how much.", a: "trench" },
    ],
  },
  {
    q: "It's 3AM. Where are you?",
    opts: [
      { text: "Asleep. Conviction doesn't need babysitting.", a: "diamond" },
      { text: "Reading on-chain data for fun.", a: "scientist" },
      { text: "In the chat, keeping the energy alive.", a: "leader" },
      { text: "Watching the chart like it's a war zone.", a: "trench" },
      { text: "Journaling my vision for the next leg up.", a: "manifestor" },
    ],
  },
  {
    q: "Pick a superpower:",
    opts: [
      { text: "Unbreakable patience", a: "diamond" },
      { text: "Reading minds (and wallets)", a: "scientist" },
      { text: "Unlimited charisma", a: "leader" },
      { text: "Immunity to pain", a: "trench" },
      { text: "Bending reality to my will", a: "manifestor" },
    ],
  },
  {
    q: "Your $MAD hits 10x. First move?",
    opts: [
      { text: "Hold. 10x is a milestone, not a destination.", a: "diamond" },
      { text: "Recalculate my position sizing.", a: "scientist" },
      { text: "Tell everyone. Then get them in.", a: "leader" },
      { text: "Take nothing. This is round one.", a: "trench" },
      { text: "Thank the universe and set the next intention.", a: "manifestor" },
    ],
  },
  {
    q: "Someone FUDs $MAD in the replies. You...",
    opts: [
      { text: "Ignore. Time will argue for me.", a: "diamond" },
      { text: "Drop the transaction hashes. Receipts only.", a: "scientist" },
      { text: "Rally the FAM to ratio them.", a: "leader" },
      { text: "Clap back instantly. No mercy.", a: "trench" },
      { text: "Send them love. Hurt people hurt projects.", a: "manifestor" },
    ],
  },
  {
    q: "Your portfolio philosophy:",
    opts: [
      { text: "Few bets, held forever.", a: "diamond" },
      { text: "Data-driven, always rebalancing.", a: "scientist" },
      { text: "Community picks — if the FAM's in, I'm in.", a: "leader" },
      { text: "High risk, high reward, no fear.", a: "trench" },
      { text: "Whatever feels aligned with my vision.", a: "manifestor" },
    ],
  },
  {
    q: "Choose your battle cry:",
    opts: [
      { text: '\"Stay $MAD.\"', a: "diamond" },
      { text: '\"Verify, then trust.\"', a: "scientist" },
      { text: "\"We're all gonna make it.\"", a: "leader" },
      { text: '\"No retreat, no surrender.\"', a: "trench" },
      { text: "\"It's already done.\"", a: "manifestor" },
    ],
  },
];

export const FREQUENCY_QS = [
  { q: "How's your sleep lately?", opts: ["Nonexistent — chart-tired", "Broken most nights", "Solid enough", "Great, honestly", "Deep and peaceful"] },
  { q: "Your bank account vibes:", opts: ["Negative aura", "Surviving", "Stable", "Growing", "Overflowing"] },
  { q: "When you wake up, your first thought:", opts: ['"What did I lose?"', '"What did I miss?"', '"What\'s the plan?"', '"What\'s the opportunity?"', '"Gratitude."'] },
  { q: "Your circle right now:", opts: ["Energy vampires", "Mostly alone", "A few solid ones", "Builders and dreamers", "A movement"] },
  { q: "Your relationship with risk:", opts: ["Paralyzed by it", "It owns me", "Calculated tango", "Comfortable dance partner", "Risk fears ME"] },
];

export const FREQUENCIES = [
  { min: 0, name: "Broke Frequency", rx: "Prescription: One week of discipline. No impulse buys. Track every dollar. You can't attract wealth while broadcasting scarcity." },
  { min: 5, name: "Struggling Frequency", rx: "Prescription: Cut one draining habit, add one building habit. Small wins compound — the frequency rises with proof." },
  { min: 10, name: "Building Frequency", rx: "Prescription: You're close. Protect the routine. Stack skills next to tokens — both appreciate." },
  { min: 15, name: "Abundant Frequency", rx: "Prescription: Start giving. Tip, donate, teach. Abundance multiplies when it circulates — ask the $MAD treasury." },
  { min: 18, name: "Transcendent Frequency", rx: "Prescription: You ARE the signal. Your only job now: don't let the frequency drop. Stay $MAD." },
];

/* ---------------- COMMUNITY ---------------- */

export const IMPACT_STATS = {
  communitiesSupported: 8,
  totalDonatedUSD: 65049,
  totalTokensDonated: 27_500_000,
  tokensBurned: 500_000_000,
  onChainProof: "https://app.streamflow.finance/contract/solana/mainnet/2Qg5Ugf2eH12ry9w3StU9sMvo5biuruK7ob2sni2Yref",
};

export const COMMUNITIES = [
  { logo: "/assets/logos/normie.png", name: "Normie", handle: "@NormieCEO", platform: "X", description: "Locked 1.0344M Normie tokens via Streamflow to support the Normie community ecosystem.", amountUSD: 1061, tokenAmount: 1_034_400, tokenSymbol: "NORMIE", txHash: "2KDGBDDab2AQCBwnF1eWsEupVUdgS6uHMGtVD2CXJ7j9", xPost: "https://x.com/madrichclub_/status/2052921091342107024", date: "2025-04-15" },
  { logo: "/assets/logos/derpydave.png", name: "DerpyDave", handle: "@Being_DerpyAF", platform: "X", description: "Locked 8.155M $DERPYDAVE tokens via Streamflow. Non-cancelable until 2060.", amountUSD: 758, tokenAmount: 8_155_000, tokenSymbol: "DERPYDAVE", txHash: "2Qg5Ugf2eH12ry9w3StU9sMvo5biuruK7ob2sni2Yref", xPost: "https://x.com/madrichclub_/status/2053391015109955771", date: "2025-04-18" },
  { logo: "/assets/logos/luxxlounge.png", name: "TheLuxxLounge", handle: "@TheLuxxLounge", platform: "X", description: "Locked 1,036,883 $TLLT tokens via Streamflow. Non-cancelable until 2060.", amountUSD: 284, tokenAmount: 1_036_883, tokenSymbol: "TLLT", txHash: "4noTMqJg5w6noGRGEnDaUcFHFUhhcHvG9ALT31c7mcBR", xPost: "https://x.com/madrichclub_/status/2057508965567877497", date: "2025-05-01" },
  { logo: "/assets/logos/hiney.png", name: "HINEY", handle: "@hineycoin", platform: "X", description: "Locked 1,027,002 $HINEY tokens via Streamflow. Non-cancelable until 2060.", amountUSD: 169, tokenAmount: 1_027_002, tokenSymbol: "HINEY", txHash: "61gPdDSq4Qcft5rNkLr6iFaTefU7UdtSHWPpwbtveuGW", xPost: "https://x.com/madrichclub_/status/2058759994485715249", date: "2025-05-08" },
  { logo: "/assets/logos/touchgrass.png", name: "TouchGrass", handle: "@XTouchGrass", platform: "X", description: "Locked 1,019,634 $TOUCHGRASS tokens via Streamflow. Non-cancelable until 2060.", amountUSD: 132, tokenAmount: 1_019_634, tokenSymbol: "TOUCHGRASS", txHash: "CUTM1NuyFpoU5UNmXbjiRtJRL53dssyWrDkX9Xv6ziiy", xPost: "https://x.com/madrichclub_/status/2060080223954346354", date: "2025-05-12" },
  { logo: "/assets/logos/stash.png", name: "Stash", handle: "@gostashxyz", platform: "X", description: "Locked 33,890 $STASH tokens via Streamflow. Non-cancelable until 2060.", amountUSD: 124, tokenAmount: 33_890, tokenSymbol: "STASH", txHash: "FvH6cCN9vNAEqXFsQrYrAjoKD1Bs12BqqVKokWc66xiS", xPost: "https://x.com/madrichclub_/status/2062897412516217028", date: "2025-05-20" },
  { logo: "/assets/logos/randycoin.png", name: "RandyCoin", handle: "@RandyCoinAI", platform: "X", description: "Locked 1,754,679 $RNDY tokens via Streamflow. Non-cancelable until 2060.", amountUSD: 72, tokenAmount: 1_754_679, tokenSymbol: "RNDY", txHash: "HBkYVaUT3GB1iGWxJhaMGNsYLnVvaL1ymo5ML8aoTZuR", xPost: "https://x.com/madrichclub_/status/2063766619059638771", date: "2025-05-25" },
  { logo: "/assets/logos/digikoinz.png", name: "DIGIKOINZ", handle: "@DIGI_KOINZ", platform: "X", description: "Locked 1,038,763 $KOINZ tokens via Streamflow. Non-cancelable until 2060.", amountUSD: 70, tokenAmount: 1_038_763, tokenSymbol: "KOINZ", txHash: "J73caZFu4pUBCmU9QjLqJkLX4uX3xkHBQ7M2LHG1sUc5", xPost: "https://x.com/madrichclub_/status/2074232348292661547", date: "2025-06-10" },
];

/* ---------------- ROADMAP ---------------- */

export const TRACKS = [
  {
    icon: "🎮", name: "Games", status: "LIVE", pct: 100,
    desc: "+1 MAD PER SECOND on Roblox. MAD SHOT. ASMR Tower Obby — optimized for console, PC, mobile, tablet, and VR.",
    milestones: [
      { text: "+1 MAD PER SECOND launched on Roblox", done: true },
      { text: "MAD SHOT shooter launched", done: true },
      { text: "What Makes You Mad? ASMR Tower Obby launched", done: true },
      { text: "Leaderboards & competitive modes", done: true },
      { text: "MAD games to infinity — more coming", done: true },
    ],
  },
  {
    icon: "👕", name: "Merch", status: "IN PROGRESS", pct: 50,
    desc: "Physical + digital drops. Every item tells a story. Drop 001: 26 hats, each carrying a 1M $MAD reward.",
    milestones: [
      { text: "Design system & story-driven items", done: true },
      { text: "MAD // LIMITED 001 — 26 hats, 1M $MAD reward", done: true },
      { text: "Next drop — tees & accessories", done: false },
      { text: "Community-designed apparel", done: false },
    ],
  },
  {
    icon: "🎵", name: "Music", status: "COMING SOON", pct: 25,
    desc: "Soundtrack to the madness. Phonk, rage, victory. Mello Will collaboration locked in.",
    milestones: [
      { text: "Collaboration with Mello Will", done: true },
      { text: "$MAD anthem — original track", done: false },
      { text: "Soundtrack for games & content", done: false },
      { text: "Community music submissions", done: false },
    ],
  },
  {
    icon: "🍔", name: "Food", status: "COMING SOON", pct: 0,
    desc: "Coming.",
    milestones: [{ text: "Collaboration with food brands", done: false }],
  },
  {
    icon: "📹", name: "Content", status: "LIVE", pct: 50,
    desc: "The MAD Show. Animations, lore, weekly drops.",
    milestones: [
      { text: "'I'M MAD GETTING RUGGED' animation", done: true },
      { text: "Coffee Collects YouTube (3 channels)", done: true },
      { text: "MAD Chronicles Episode 2", done: false },
      { text: "Weekly MAD Minute shorts", done: false },
    ],
  },
  {
    icon: "🎉", name: "Events", status: "IN PROGRESS", pct: 75,
    desc: "Challenges, rewards, IRL activations. The community shows up.",
    milestones: [
      { text: "MAD Health Challenge — 100 winners", done: true },
      { text: "MAD Rich Animal Challenge — 100 winners", done: true },
      { text: "$MAD Rewards at 1M MC — $4,000 to 50 people", done: true },
      { text: "IRL Event — August 8th", done: false },
    ],
  },
  {
    icon: "💰", name: "Finance", status: "LIVE", pct: 67,
    desc: "Staking, burns, treasury. The economic engine.",
    milestones: [
      { text: "50% supply burned", done: true },
      { text: "7 communities locked to 2060", done: true },
      { text: "Burn #2 protocol (10K holders)", done: false },
    ],
  },
];

/* ---------------- GAME ---------------- */

export const GAMES_LINKS = {
  strikeout: "https://www.roblox.com/games/130190330491603/Strikeout",
  madIncremental: "https://www.roblox.com/games/123392566067659/MAD-INCREMENTAL",
  shirt: "https://www.roblox.com/catalog/89506653556378/MAD-brown-skate-shirt",
  robuxVideo: "Pte0bOa16xI",
  setupVideo: "V0LBY-ZiklY",
  kubo: "https://x.com/Kubo100x",
};

/* ---------------- MAD ART ---------------- */

export const ART_LOOPS = [
  { src: "/assets/loops/mad-thinking.mp4", label: "MAD Thinking" },
  { src: "/assets/loops/hahaha.mp4", label: "HAHAHA" },
  { src: "/assets/loops/mad-excited.mp4", label: "MAD Excited" },
  { src: "/assets/loops/mad-spirit-bomb.mp4", label: "MAD Spirit Bomb" },
  { src: "/assets/loops/super-mad.mp4", label: "SUPER MAD" },
];

export const GALLERY: { src: string; title: string; tag: string }[] = [
  { src: "/assets/mad-art/mad-cyber-troll-v2.jpg", title: "Cyber Troll", tag: "Character" },
  { src: "/assets/mad-art/mad-jungle-pill.jpg", title: "Jungle Pill", tag: "Scene" },
  { src: "/assets/mad-art/mad-morning-cereal.jpg", title: "Morning Cereal", tag: "Character" },
  { src: "/assets/memes/MAD-2-MONTHS.png", title: "2 Months", tag: "Milestone" },
  { src: "/assets/memes/MAD-3-MONTHS.png", title: "3 Months", tag: "Milestone" },
  { src: "/assets/memes/MAD-ARMY.png", title: "MAD Army", tag: "Community" },
  { src: "/assets/memes/MAD-ART-1.png", title: "MAD Art #1", tag: "Digital" },
  { src: "/assets/memes/MAD-ART-2.png", title: "MAD Art #2", tag: "Digital" },
  { src: "/assets/memes/MAD-ART-3.png", title: "MAD Art #3", tag: "Digital" },
  { src: "/assets/memes/MAD-ART-4.png", title: "MAD Art #4", tag: "Digital" },
  { src: "/assets/memes/MAD-AT-BEARS.png", title: "At Bears", tag: "Meme" },
  { src: "/assets/memes/MAD-BELIEVE.png", title: "Believe", tag: "Meme" },
  { src: "/assets/memes/MAD-BELIEVING.png", title: "Believing", tag: "Meme" },
  { src: "/assets/memes/MAD-COMMUNITY.png", title: "Community", tag: "Community" },
  { src: "/assets/memes/MAD-DOCTOR.png", title: "Doctor", tag: "Meme" },
  { src: "/assets/memes/MAD-DOLLAR.png", title: "MAD Dollar", tag: "Meme" },
  { src: "/assets/memes/MAD-HOLD-ON-DEAR-LIFE.png", title: "HODL", tag: "Meme" },
  { src: "/assets/memes/MAD-KINGS-ONLY.png", title: "Kings Only", tag: "Meme" },
  { src: "/assets/memes/MAD-LAST-FARM.png", title: "Last Farm", tag: "Meme" },
  { src: "/assets/memes/MAD-NEPTUNE.png", title: "Neptune", tag: "Digital" },
  { src: "/assets/memes/MAD-RED-EYE.png", title: "Red Eye", tag: "Meme" },
  { src: "/assets/memes/MAD-RICH-BATH.png", title: "Rich Bath", tag: "Digital" },
  { src: "/assets/memes/MAD-RICH-IN-THE-TUB.png", title: "Rich in Tub", tag: "Digital" },
  { src: "/assets/memes/MAD-RICH-OR-BROKE.png", title: "Rich or Broke", tag: "Meme" },
  { src: "/assets/memes/MAD-ROLLERCOASTER.png", title: "Rollercoaster", tag: "Meme" },
  { src: "/assets/memes/MAD-SCAM-CALL.png", title: "Scam Call", tag: "Meme" },
  { src: "/assets/memes/MAD-SCHOOL.png", title: "MAD School", tag: "Meme" },
  { src: "/assets/memes/MAD-YOU-SIDELINED.png", title: "Sidelined", tag: "Meme" },
  { src: "/assets/memes/MAKE-MAD-GREAT-AGAIN.png", title: "Make MAD Great", tag: "Meme" },
  { src: "/assets/memes/WE-MAD-ZOOMIN.png", title: "We MAD Zoomin'", tag: "Meme" },
  { src: "/assets/memes/YOU-MAKE-ME-MAD.png", title: "You Make Me MAD", tag: "Meme" },
  { src: "/assets/memes/YOU-WILL-BE-MAD.png", title: "You Will Be MAD", tag: "Meme" },
  { src: "/assets/mad-art/mad-attitude.png", title: "MAD Attitude", tag: "Character" },
  { src: "/assets/mad-art/mad-this-is-fine.png", title: "This Is Fine", tag: "Meme" },
  { src: "/assets/mad-art/mad-donut-temptation.png", title: "Donut Temptation", tag: "Meme" },
  { src: "/assets/mad-art/mad-stay-mad-soldier.png", title: "STAY $MAD Soldier", tag: "Character" },
  { src: "/assets/mad-art/mad-car-wash-rain.png", title: "Car Wash Curse", tag: "Meme" },
];

/* ---------------- REWARDS ---------------- */

export const REWARD_WALLET = "FdWFKfUmyRFzusT4Gj77sKr1ArjJCHG7kTgw6pvbo9iW";

export const REWARD_ROAD = [
  { mcap: "$1M", status: "done" as const, usd: "$5,000", note: "2.5M $MAD · 50 winners paid" },
  { mcap: "$10M", status: "next" as const, usd: "$20,000", note: "1M $MAD ready · 80 winners · min 1K $MAD" },
  { mcap: "$25M", status: "locked" as const, usd: "TBA", note: "Reward TBA" },
  { mcap: "$50M", status: "locked" as const, usd: "TBA", note: "Reward TBA" },
  { mcap: "$75M", status: "locked" as const, usd: "TBA", note: "Reward TBA" },
  { mcap: "$100M", status: "locked" as const, usd: "TBA", note: "Reward TBA" },
];

export const PAST_CHALLENGES = [
  { name: "$MAD Health Competition", date: "Jun 2026", note: "20 pushups · 50K $MAD each", post: "https://x.com/madrichclub_/status/2061871512991437267" },
  { name: "$MAD Rich Animal Challenge", date: "Jun 2026", note: "Pet + cash · 20K $MAD each", post: "https://x.com/madrichclub_/status/2065002932349931857" },
];

/* ---------------- MERCH ---------------- */

export const PRODUCTS = [
  { id: "stickers", name: "MAD Stickers", tier: "Classic", stock: "In Stock", stockTone: "green" as const, price: "$5.98", image: "/stickers/Mad-Sticker-logo.png", desc: "Clean, bold, and easy to place anywhere. The easiest way to carry $MAD into the real world.", url: "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-sticker", stars: 5 },
  { id: "card-wrap", name: "Card Wrap", tier: "Premium", stock: "Selling Fast", stockTone: "yellow" as const, price: "$10.98", image: "/stickers/Mad-Premium-Embossed-Card-Wrap.png", desc: "A sharper premium look with texture and attitude.", url: "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-premium-embossed-card-wrap", stars: 4 },
  { id: "rich-wrap", name: "Rich Wrap", tier: "Luxury", stock: "Low Stock", stockTone: "red" as const, price: "$10.98", image: "/stickers/Mad-Rich-Premium-Embossed-Card-Wrap.png", desc: "The louder luxury version with richer flex energy.", url: "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-premium-embossed-card-wrap-copy", stars: 5 },
  { id: "peeker", name: "Peeker", tier: "Fan Favorite", stock: "In Stock", stockTone: "green" as const, price: "$9.98", image: "/stickers/Mad-Peeker.png", desc: "Small piece. Fast attention. Big signal.", url: "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-peeker", stars: 4 },
];

export const MERCH_VIDEOS = [
  { id: "s-eE7s_bGoc", title: "Custom sticker in action", tag: "#madrichenergy" },
  { id: "osW5w0b2Lp4", title: "The hype is real", tag: "#madrichenergy" },
];

export const PROOF_PHOTOS = [
  { img: "/assets/testimonials/dino-stickers.png", caption: "Got my sticker. Laptop game strong.", by: "@Iam__dino9" },
  { img: "/assets/testimonials/dkwtt-mad-hat-game.png", caption: "Hydrated and $MAD.", by: "@lit_terrestrial" },
];

/* Aliases for page imports */
export const ARTWORKS = GALLERY;
export const LOOPS = ART_LOOPS;

/* ---------------- REWARDS ---------------- */

export const REWARD_MILESTONES = [
  { mc: "$1M", usd: "$5,000", reward: "2.5M $MAD", winners: 50, status: "done" as const },
  { mc: "$10M", usd: "$20,000", reward: "1M $MAD", winners: 80, status: "active" as const },
  { mc: "$25M", usd: "TBA", reward: "TBA", winners: 0, status: "locked" as const },
  { mc: "$50M", usd: "TBA", reward: "TBA", winners: 0, status: "locked" as const },
  { mc: "$75M", usd: "TBA", reward: "TBA", winners: 0, status: "locked" as const },
  { mc: "$100M", usd: "TBA", reward: "TBA", winners: 0, status: "locked" as const },
];

/* ---------------- MERCH ---------------- */

export const FEATURED = {
  image: "/stickers/Mad-Sticker-logo.png",
  name: "MAD Stickers",
  tag: "Classic",
  stock: "In Stock",
  stockTone: "green" as const,
  price: "$5.98",
  url: "https://notaveragestickers.com/products/mad-%F0%9F%98%A1-sticker",
  featuredText: "The easiest way to carry $MAD into the real world. Simple, loud, collectible, and built for instant signal.",
};

export const MERCH_LINKS = {
  shop: "https://notaveragestickers.com/collections/mad",
};

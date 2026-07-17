export const CA = "Fa7ZE9nCEYnrHsnoeHuhEExJpchtrBtKXnWe6CgHpump";
export const PAIR = "gt3dwhhkrd2mnqmmchpzdetpg4ttaa23exn1m2vwinfs";

export const LINKS = {
  buy: `https://jup.ag/tokens/${CA}`,
  chart: `https://dexscreener.com/solana/${PAIR}`,
  x: "https://x.com/madrichclub_",
  xCommunity: "https://x.com/i/communities/2019256566248312879",
  youtube: "https://www.youtube.com/@madrichclub",
  lockProof: `https://solscan.io/token/${CA}`,
};

export const EXCHANGES = [
  { name: "Jupiter", img: "/assets/exchanges/jupiter.png", url: `https://jup.ag/tokens/${CA}` },
  { name: "DEXScreener", img: "/assets/exchanges/dexscreener.png", url: `https://dexscreener.com/solana/${PAIR}` },
  { name: "Solscan", img: "/assets/exchanges/solscan.png", url: `https://solscan.io/token/${CA}` },
  { name: "Birdeye", img: "/assets/exchanges/birdeye.png", url: `https://birdeye.so/solana/token/${CA}` },
  { name: "OKX", img: "/assets/exchanges/okx.png", url: `https://web3.okx.com/token/solana/${CA}` },
  { name: "Gate.io", img: "/assets/exchanges/gate.png", url: `https://www.gate.com/alpha/sol-${CA}` },
  { name: "MEXC", img: "/assets/exchanges/mexc.png", url: "https://www.mexc.com/dex/trade" },
];

export const DROP = {
  videoId: "IZe9GScHUNM",
  title: "Coffee Blox x SugarStar",
  tag: "Mad ASMR Obby",
  copy: "We teamed up with SugarStar to play the WEIRDEST Roblox game ever — What Makes You Mad? ASMR Tower Obby. Slide, jump, and butter your way through chaotic ASMR-inspired obstacle courses. Pure MAD energy.",
};

export const TALKS = {
  videoId: "gJsb2p2Uig8",
  title: "The MAD Mind Unfiltered",
  copy: "Raw conversations with the MAD FAM. No scripts, no filters — just real people talking about why they chose Motivation, Alignment, and Discipline. This is what conviction sounds like.",
};

export const EPISODES = [
  {
    n: "01",
    videoId: "xXHGyQz0i5Y",
    title: "The Betrayal",
    copy: "They promised everything. They delivered nothing. But you didn't quit — you got MAD. The moment that started it all.",
  },
  {
    n: "02",
    videoId: "xa2ygGIRblE",
    title: "The Come-Up",
    copy: "You took the hit. You got back up. Now you're building something they can't take away. Pain into power.",
  },
  {
    n: "03",
    videoId: null,
    title: "Loading...",
    copy: "The next chapter is being written. New episodes drop weekly.",
  },
];

export const STATS = [
  { value: 4.5, suffix: "K+", label: "MAD FAM Members", decimals: 1 },
  { value: 7, suffix: "", label: "Communities Locked", decimals: 0 },
  { value: 3, suffix: "", label: "Live Roblox Games", decimals: 0 },
  { value: Infinity, suffix: "", label: "Vibes", decimals: 0 },
];

export type Testimonial = {
  name: string;
  handle: string;
  pfp: string;
  quote: string;
  url?: string;
  proof?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sapient",
    handle: "@sapient_ru",
    pfp: "/assets/testimonials/sapient-pfp.png",
    quote:
      "Most projects sell a future. $MAD sells a present. Doxxed dev, real product, real holders. We are still very early here.",
  },
  {
    name: "DKWTT",
    handle: "@lit_terrestrial",
    pfp: "/assets/testimonials/dkwtt-chadwick-pfp.png",
    quote:
      "Ordered the $MAD American Dad hat on the day that my Dad passed. This is not just a hat to me — it's Motivation, Alignment & Discipline.",
    proof: "/assets/testimonials/dkwtt-mad-hat-game.png",
  },
  {
    name: "Dino",
    handle: "@Iam__dino9",
    pfp: "/assets/testimonials/dino-pfp.png",
    quote:
      "Real community. Real stickers. Real holders. $MAD isn't just a token, it's a movement you can hold in your hands.",
    url: "https://x.com/Iam__dino9/status/2061859571363381318",
    proof: "/assets/testimonials/dino-stickers.png",
  },
  {
    name: "Heydun",
    handle: "@Grpx_Heydun",
    pfp: "/assets/testimonials/heydun-pfp.png",
    quote:
      "Keep building, believe, never stop. Every small step changes the future. The $MAD community is strong and unstoppable.",
    url: "https://x.com/Grpx_Heydun/status/2070831387914170412",
  },
  {
    name: "IDC Lord",
    handle: "@idclord",
    pfp: "/assets/testimonials/idclord-pfp.png",
    quote:
      "Brought $MAD to campus. Showed the game to my friends. Now they're holders too. Organic growth, real believers.",
  },
  {
    name: "Kimdunk77",
    handle: "@kimdunk77",
    pfp: "/assets/testimonials/kimdunk77-pfp.png",
    quote:
      "Made a whole promo video for $MAD because I actually believe in it. The dev is doxxed, the game is live, and the vibes are unmatched.",
  },
  {
    name: "M Luffy",
    handle: "@mluffy_onsol",
    pfp: "/assets/testimonials/mluffy-pfp.png",
    quote:
      "Met up with other $MAD holders at school. We talk charts, we talk dreams, we talk about what's next. This isn't just a coin.",
  },
  {
    name: "Treshon",
    handle: "@treshon_jarrell",
    pfp: "/assets/testimonials/treshon-pfp.png",
    quote:
      "Thanks to the $MAD team for listening to me. Thank you for impacting the next generation. Thank you so much $MAD.",
    url: "https://x.com/treshon_jarrell/status/2067302160744784190",
  },
];

export const TEAM = [
  {
    role: "Dev / Founder",
    name: "$MAD Dev",
    sub: "Coffee Collects",
    img: "/assets/team/mad-dev-coffee-collects.png",
    links: [
      { label: "X", url: "https://x.com/madrichclub_" },
      { label: "YouTube", url: "https://www.youtube.com/@CoffeeCollectsHQ" },
    ],
  },
  {
    role: "Community Builder",
    name: "crypto guru",
    sub: "@followdv80",
    img: "/assets/team/crypto-guru-followdv80.png",
    links: [{ label: "X", url: "https://x.com/followdv80" }],
  },
  {
    role: "Community Builder",
    name: "Perspective 360",
    sub: "@Derrick152667",
    img: "/assets/team/perspective-360-kakashi.png",
    links: [{ label: "X", url: "https://x.com/Derrick152667" }],
  },
  {
    role: "Community Builder",
    name: "Dino",
    sub: "@Iam__dino9",
    img: "/assets/team/dino-moderator.png",
    links: [{ label: "X", url: "https://x.com/Iam__dino9" }],
  },
  {
    role: "MAD Artist",
    name: "Heydun",
    sub: "@Grpx_Heydun",
    img: "/assets/team/mad-artist-heydun.png",
    links: [{ label: "X", url: "https://x.com/Grpx_Heydun" }],
  },
];

export const NAV_LINKS = [
  { label: "Drop", href: "#drop" },
  { label: "Movement", href: "#movement" },
  { label: "FAM", href: "#fam" },
  { label: "Chronicles", href: "#chronicles" },
  { label: "Command", href: "#command" },
  { label: "Team", href: "#team" },
];

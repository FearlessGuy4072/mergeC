export const shops = [
  {
    id: "wefco-mart",
    name: "WEFCO MART",
    subtitle: "Daily rewards & essentials",
    theme: "cyan",
    position: { left: "52%", top: "32%" }, // move this to match your bg
    items: [
      { id: 1, title: "Energy Cell", price: 100, currency: "COINS", rarity: "Common" },
      { id: 2, title: "Nano Repair Kit", price: 250, currency: "COINS", rarity: "Rare" },
    ],
  },
  {
    id: "yaku-forge",
    name: "YAKU FORGE",
    subtitle: "Weapon upgrades & crafting",
    theme: "pink",
    position: { left: "63%", top: "72%" }, // move this to match your bg
    items: [
      { id: 1, title: "Plasma Blade", price: 2, currency: "TOKENS", rarity: "Epic" },
      { id: 2, title: "Core Enhancer", price: 5, currency: "TOKENS", rarity: "Legendary" },
    ],
  },
  {
    id: "black-market",
    name: "BLACK MARKET",
    subtitle: "Limited drops (NFT ready)",
    theme: "purple",
    position: { left: "18%", top: "45%" }, // move this to match your bg
    items: [
      { id: 1, title: "Neon Mask (NFT)", price: 0.01, currency: "MATIC", rarity: "Legendary" },
      { id: 2, title: "Cyber Jacket (NFT)", price: 0.02, currency: "MATIC", rarity: "Epic" },
    ],
  },
];

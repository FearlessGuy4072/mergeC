// Web3 config for Sepolia - update REWARD_NFT_ADDRESS after deployment
export const SEPOLIA_CHAIN_ID = 11155111;
export const REWARD_NFT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace after deploy
export const REWARD_ABI = [
  'function buyReward(string memory tokenURI) external payable',
  'function rewardPrice() view returns (uint256)',
  'function nextTokenId() view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
];

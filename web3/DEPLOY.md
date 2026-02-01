# Deploy RewardNFT to Sepolia

## Prerequisites

- [Foundry](https://getfoundry.sh/) installed (`curl -L https://foundry.paradigm.xyz | bash` then `foundryup`)
- MetaMask with Sepolia ETH
- Sepolia RPC URL (e.g. https://rpc.sepolia.org)

## Build

```bash
cd web3
forge build
```

## Deploy

1. Create `.env` in web3 folder:

   ```
   PRIVATE_KEY=your_metamask_private_key_here
   ```

2. Deploy to Sepolia:

   ```bash
   forge script script/Deploy.s.sol:DeployRewardNFT --rpc-url https://rpc.sepolia.org --broadcast -vvvv
   ```

3. Copy the deployed contract address from the output.

4. Update `frontend/ETH-GAME/public/game-map/src/web3Config.js`:
   ```js
   export const REWARD_NFT_ADDRESS = "0xYOUR_DEPLOYED_ADDRESS";
   ```

## Verify on Etherscan (optional)

```bash
forge script script/Deploy.s.sol:DeployRewardNFT --rpc-url https://rpc.sepolia.org --broadcast --verify -vvvv
```

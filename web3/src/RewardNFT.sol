// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RewardNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public nextTokenId;

    // Price per reward NFT in wei (0.001 ETH = 1e15 for Sepolia testing)
    uint256 public rewardPrice = 0.001 ether;

    constructor() ERC721("CyberpunkReward", "CPR") Ownable(msg.sender) {}

    // Mint a new reward NFT for a player (owner only)
    function mintReward(address to, string memory tokenURI) external onlyOwner {
        uint256 tokenId = nextTokenId;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        nextTokenId++;
    }

    // Buy reward NFT with ETH (public)
    function buyReward(string memory tokenURI) external payable nonReentrant {
        require(msg.value >= rewardPrice, "Insufficient ETH");
        uint256 tokenId = nextTokenId;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        nextTokenId++;
        // Refund excess if any
        if (msg.value > rewardPrice) {
            (bool ok, ) = msg.sender.call{value: msg.value - rewardPrice}("");
            require(ok, "Refund failed");
        }
    }

    // Owner can update price
    function setRewardPrice(uint256 newPrice) external onlyOwner {
        rewardPrice = newPrice;
    }

    // Owner withdraw ETH
    function withdraw() external onlyOwner {
        (bool ok, ) = owner().call{value: address(this).balance}("");
        require(ok, "Withdraw failed");
    }

    // Redeem (burn) the NFT
    function redeemReward(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _burn(tokenId);
    }
}

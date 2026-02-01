// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/RewardNFT.sol";

contract Deploy is Script {
    function run() external {
        // Start broadcasting transactions
        vm.startBroadcast();

        // Deploy the RewardNFT contract
        RewardNFT rewardNFT = new RewardNFT();

        // Stop broadcasting
        vm.stopBroadcast();
    }
}

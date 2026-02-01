// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Script, console } from "forge-std/Script.sol";
import { RewardNFT } from "../src/RewardNFT.sol";

contract DeployRewardNFT is Script {
    RewardNFT public rewardNFT;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        rewardNFT = new RewardNFT();
        console.log("RewardNFT deployed at:", address(rewardNFT));

        vm.stopBroadcast();
    }
}

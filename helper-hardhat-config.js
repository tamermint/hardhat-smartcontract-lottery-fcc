const { ethers } = require("hardhat")

const networkConfig = {
    11155111: {
        name: Sepolia,
        subscritionId: "0",
        vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        entranceFee: ethers.utils.parseEther("0.01"),
        interval: "30",
        callbackGasLimit: "500000",
    },
    31337: {
        name: "hardhat",
        subscritionId: "0",
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        entranceFee: ethers.utils.parseEther("0.01"),
        interval: "30",
        callbackGasLimit: "500000",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}

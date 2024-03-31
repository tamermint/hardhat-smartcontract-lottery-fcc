const { network, ethers } = require("hardhat")
const developmentChains = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25") //base fee is how the oracles offset their gas costs. 0.25 is the premium, it costs 0.25 to make a request
const GAS_PRICE_LINK = 1e9 //calculated value based on gas price of the chain

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        log("local network detected! Deploying mocks..")
        await deploy("VRFCoordinatorMock", {
            from: deployer,
            args: [BASE_FEE, GAS_PRICE_LINK],
            log: true,
        })
        log("Mocks deployed!")
        log("---------------------------")
    }
}

module.exports.tags = ["all", "mocks"]

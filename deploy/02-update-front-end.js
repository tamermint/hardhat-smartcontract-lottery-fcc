const { ethers, network } = require("hardhat")
const fs = require("fs")
const { FRONT_END_ABI_FILE, FRONT_END_CONTRACTS_FILE } = require("../helper-hardhat-config")

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(FRONT_END_CONTRACTS_FILE, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId].includes(raffle.address)) {
            contractAddresses[chainId] = raffle.address
        } else {
            contractAddresses[chainId] = [raffle.address]
        }
    }
    fs.writeFileSync(FRONT_END_CONTRACTS_FILE, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]

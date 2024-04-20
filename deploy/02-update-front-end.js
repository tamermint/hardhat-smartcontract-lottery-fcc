const { ethers, network } = require("hardhat")
const fs = require("fs")
const { FRONT_END_ABI_FILE, FRONT_END_CONTRACTS_FILE } = require("../helper-hardhat-config")

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("front end written!")
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const contractAddresses = JSON.parse(fs.readFileSync(FRONT_END_CONTRACTS_FILE, "utf8"))
    if (network.config.chainId.toString() in contractAddresses) {
        console.log("chainID is in contractAddresses")
        if (!contractAddresses[network.config.chainId.toString()].includes(raffle.address)) {
            contractAddresses[network.config.chainId.toString()] = raffle.address
        } else {
            contractAddresses[network.config.chainId.toString()] = [raffle.address]
        }
    }
    fs.writeFileSync(FRONT_END_CONTRACTS_FILE, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]

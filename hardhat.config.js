require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL ||
    "https://eth-sepolia.g.alchemy.com/v2/bKBDD7WLPKM4bWKh52RJoH8AHWwW-7SR"
const PRIVATE_KEY =
    process.env.PRIVATE_KEY || "7ba3cd2ec0a37dd61cbf9055423646d49db40fb1df723b8b48270fe62b371883"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "GQCFWZYCHZNS9ADST63E78JVEQYMCVVNZW"
const COINMARKETCAP_API_KEY =
    process.env.COINMARKETCAP_API_KEY || "2a2bced9-fe22-40c7-8d51-3d8df28fef13"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        localhost: {
            chainId: 31337,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
            saveDeployments: true,
            chainId: 11155111,
        },
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            sepolia: ETHERSCAN_API_KEY,
        },
        customChains: [
            {
                network: "sepolia",
                chainId: 11155111,
                urls: {
                    apiURL: "https://api-sepolia.etherscan.io/api",
                    browserURL: "https://sepolia.etherscan.io/",
                },
            },
        ],
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    solidity: "0.8.7",
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    mocha: {
        timeout: 400000, //to check for test if event gets fired within 200 secs otherwise test fails
    },
}

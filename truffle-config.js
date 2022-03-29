const HDWalletProvider = require('@truffle/hdwallet-provider');

require('dotenv').config();
const {
    ETHERSCAN_API_KEY,
    BSCSCAN_API_KEY,
    MNEMONIC,
    DEPLOY_GAS_LIMIT,
    DEPLOY_GAS_PRICE,
    INFURA_ID_PROJECT
} = process.env;

const Web3 = require("web3");
const web3 = new Web3();

module.exports = {
    plugins: ['truffle-plugin-verify', 'truffle-contract-size'],

    api_keys: {
        etherscan: ETHERSCAN_API_KEY,
        bscscan: BSCSCAN_API_KEY
    },

    networks: {
        // development: {
        //     host: "127.0.0.1",
        //     port: 8545,
        //     network_id: "*",
        //     //gas: 30000000
        // },
        ropsten: {
            provider: () => new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/" + INFURA_ID_PROJECT),
            network_id: 3,
            gas: DEPLOY_GAS_LIMIT,
            confirmations: 2,
            skipDryRun: true
        },
        // mainnet: {
        //     provider: () => new HDWalletProvider(MNEMONIC, "https://mainnet.infura.io/v3/" + INFURA_ID_PROJECT),
        //     network_id: 1,
        //     gasPrice: web3.utils.toWei(DEPLOY_GAS_PRICE, 'gwei'),
        //     gas: DEPLOY_GAS_LIMIT,
        //     skipDryRun: false
        // },
        kovan: {
            provider: () => new HDWalletProvider(MNEMONIC, "https://kovan.infura.io/v3/" + INFURA_ID_PROJECT),
            network_id: 42,
            confirmations: 1,
            gas: DEPLOY_GAS_LIMIT,
            skipDryRun: true
        },
        rinkeby: {
            provider: () => new HDWalletProvider(MNEMONIC, "https://rinkeby.infura.io/v3/" + INFURA_ID_PROJECT),
            network_id: 4,
            confirmations: 2,
            gas: DEPLOY_GAS_LIMIT,
            skipDryRun: true
        },
        bscTestnet: {
            provider: () => new HDWalletProvider(MNEMONIC, "https://data-seed-prebsc-2-s2.binance.org:8545"),
            network_id: 97,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        },
        // bsc: {
        //     provider: () => new HDWalletProvider(MNEMONIC, "https://bsc-dataseed3.binance.org"),
        //     network_id: 56,
        //     gasPrice: web3.utils.toWei(DEPLOY_GAS_PRICE, 'gwei'),
        //     gas: DEPLOY_GAS_LIMIT,
        //     confirmations: 2,
        //     timeoutBlocks: 200,
        //     skipDryRun: true
        // },
        maticMainnet: {
            provider: () => new HDWalletProvider(MNEMONIC, "https://polygon-rpc.com/"),
            network_id: 137,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: false
        },
        maticTestnet: {
            provider: () => new HDWalletProvider(MNEMONIC, "https://matic-mumbai.chainstacklabs.com"),
            network_id: 80001,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        }
    },

    compilers: {
        solc: {
            version: "0.8.13",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    }
};
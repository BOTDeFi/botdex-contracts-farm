const BN = require('bn.js');

require('dotenv').config();
const {
    NAME,
    SYMBOL,
    DECIMALS
} = process.env;

const USDT = artifacts.require("BOTTest");


module.exports = async function (deployer, network) {
    if (network == "bscTestnet" || network == "development") {

        await deployer.deploy(
            USDT,
            NAME,
            SYMBOL,
            DECIMALS
        );

    }
};
const BN = require('bn.js');

require('dotenv').config();
const {
} = process.env;

const Multicall2 = artifacts.require("Multicall2");


module.exports = async function (deployer, network) {
    if (network == "bscTestnet" || network == "development") {

    await deployer.deploy(
        Multicall2
    );

    }
};
const BN = require('bn.js');

require('dotenv').config();
const {
    PROPELLANT,
    PROPELLANTPERBLOCK,
    STARTBLOCK
} = process.env;

const FARM = artifacts.require("MasterBotdex");


module.exports = async function (deployer, network) {
    if (network == "bscTestnet" || network == "development") {

        await deployer.deploy(
            FARM,
            PROPELLANT,
            PROPELLANTPERBLOCK,
            STARTBLOCK
            );

    }
};
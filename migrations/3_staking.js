const BN = require('bn.js');

require('dotenv').config();
let {
    TIMESLOCKUP,
    APYs
} = process.env;

const {
    TOKEN,
    REWARDKEEPER
} = process.env;

TIMESLOCKUP = TIMESLOCKUP.replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "").split(" ");
APYs = APYs.replace(/"/g, "").replace(/\[/g, "").replace(/\]/g, "").split(" ");

const Staking = artifacts.require("BotdexStaking");


module.exports = async function (deployer, network) {
    if (network == "bscTestnet" || network == "development") {
    console.log(TOKEN);
    await deployer.deploy(
        Staking,
        TOKEN,
        REWARDKEEPER,
        TIMESLOCKUP,
        APYs
    );

    }
};
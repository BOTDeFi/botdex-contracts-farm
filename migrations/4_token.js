const BN = require('bn.js');

require('dotenv').config();
const {
    TOKENOWNER,
    TOKENNAME,
    TOKENSYMBOL,
    DECIMAL,
    AMOUNTOFTOKENWEI,
    SETMXTXPER,
    SETMXWALLETPER,
    FEEWALLET,
    ROUTER
} = process.env;

const Token = artifacts.require("Token");


module.exports = async function (deployer, network) {
    if (network == "bscTestnet" || network == "development") {

        await deployer.deploy(
            Token,
            TOKENOWNER,
            TOKENNAME,
            TOKENSYMBOL,
            DECIMAL,
            AMOUNTOFTOKENWEI,
            SETMXTXPER,
            SETMXWALLETPER,
            FEEWALLET,
            ROUTER
        );

    }
};
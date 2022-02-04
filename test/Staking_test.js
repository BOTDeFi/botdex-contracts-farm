const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');
const BOTToken = artifacts.require('BOTTest');
const Staking = artifacts.require('BotdexStaking');

let Token;
let StakingInst;

contract('BotdexStaking', ([rewardKeeper, alice, dev, minter]) => {
    beforeEach(async () => {
        Token = await BOTToken.new('BOT Token', 'BOT', 0,  { from: minter });
        StakingInst = await Staking.new(Token.address, rewardKeeper, [2592000, 7776000, 15552000, 31536000], [50, 200, 500, 1200],  { from: dev });
    });

    it('get pools length', async () => {
        assert.equal((await StakingInst.getPoolLength()).toString(), "4");
    });

    it('add new pool', async () =>{
        await StakingInst.addStakingPool(62208000, 2800, { from: dev });
        // assert.equal((await StakingInst.getPoolInfo(4)).timeLockUp_.toString(), "62208000");
        // assert.equal((await StakingInst.getPoolInfo(4)).APY_.toString(), "2800"); 
        assert.equal((await StakingInst.getPoolLength()).toString(), "5");
    });

    // it.only('change pool visability', async () =>{
    //     console.log(await StakingInst.pools);
    //     //assert.equal(await StakingInst.pools[1].isDead.toString(), "false");
    //     await StakingInst.changePoolVisability(1, { from: dev });
    //     await expectRevert.unspecified(StakingInst.changePoolVisability(1, { from: alice }));
    //     //assert.equal(StakingInst.pools[1].isDead.toString(), "true");
    // });

    it('enter staking and withdraw reward / real case', async () =>{
        await Token.mint(alice, "1000", { from: minter });   
        await Token.mint(rewardKeeper, "1000000", { from: minter }); 
        await Token.approve(StakingInst.address, "1000000", { from: rewardKeeper });
        await Token.approve(StakingInst.address, "500", { from: alice });
        await StakingInst.enterStaking(3, "500", { from: alice });
        await time.increase(31536000);
        await StakingInst.withdrawReward(3, { from: alice });
        assert.equal((await Token.balanceOf(alice)).toString(), "1600");
    });

    it('should fail while depositing for dead pool', async () =>{
        await Token.mint(alice, "1000", { from: minter });   
        await Token.mint(rewardKeeper, "1000000", { from: minter }); 
        await Token.approve(StakingInst.address, "1000000", { from: rewardKeeper });
        await Token.approve(StakingInst.address, "500", { from: alice });
        await StakingInst.changePoolVisability(3, { from: dev });
        await expectRevert(StakingInst.enterStaking(3, "500", { from: alice }), "Staking: this pool is unavailable");
    });

    it('should fail while withdrawing untill lock time end', async () =>{
        await Token.mint(alice, "1000", { from: minter });   
        await Token.mint(rewardKeeper, "1000000", { from: minter }); 
        await Token.approve(StakingInst.address, "1000000", { from: rewardKeeper });
        await Token.approve(StakingInst.address, "500", { from: alice });
        await StakingInst.enterStaking(3, "500", { from: alice });
        await time.increase(100000);
        await expectRevert(StakingInst.withdrawReward(3, { from: alice }), "Staking: wait till the end of lock time");
    });

    it('should fail while depositing when there is no more reward', async () =>{
        await Token.mint(alice, "1000", { from: minter });   
        await Token.mint(rewardKeeper, "500", { from: minter }); 
        await Token.approve(StakingInst.address, "500", { from: rewardKeeper });
        await Token.approve(StakingInst.address, "500", { from: alice });
        await expectRevert(StakingInst.enterStaking(3, "500", { from: alice }), "Staking: there is no reward for you, sorry. Come back later!");
    });

    it('should fail while depositing for non-existing pool', async () =>{
        await Token.mint(alice, "1000", { from: minter });   
        await Token.mint(rewardKeeper, "1000000", { from: minter }); 
        await Token.approve(StakingInst.address, "1000000", { from: rewardKeeper });
        await Token.approve(StakingInst.address, "500", { from: alice });
        await expectRevert(StakingInst.enterStaking(6, "500", { from: alice }), "Staking: wrong pool"); 
    });
});
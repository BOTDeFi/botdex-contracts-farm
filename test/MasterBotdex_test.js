const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');
const RocketPropellant = artifacts.require('BOTTest');
const MasterBotdex = artifacts.require('MasterBotdex');
const MockBEP20 = artifacts.require('libs/MockBEP20');

contract('MasterBotdex', ([alice, bob, treasure, minter]) => {
    beforeEach(async () => {
        this.propellant = await RocketPropellant.new("BOT", "BOT", "18", { from: minter });
        this.lp1 = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
        this.lp2 = await MockBEP20.new('LPToken', 'LP2', '1000000', { from: minter });
        this.lp3 = await MockBEP20.new('LPToken', 'LP3', '1000000', { from: minter });
        this.botdex = await MasterBotdex.new(this.propellant.address, '1000', '100', { from: minter });

        await this.lp1.transfer(bob, '2000', { from: minter });
        await this.lp2.transfer(bob, '2000', { from: minter });
        await this.lp3.transfer(bob, '2000', { from: minter });

        await this.lp1.transfer(alice, '2000', { from: minter });
        await this.lp2.transfer(alice, '2000', { from: minter });
        await this.lp3.transfer(alice, '2000', { from: minter });
        await this.botdex.setTreasure(treasure, { from: minter });  
        await this.propellant.mint(treasure, "1000000000", { from: minter });
        await this.propellant.approve(this.botdex.address, "1000000000", { from: treasure })  
    });
    it('real case', async () => {
      await this.botdex.add('1000', this.lp1.address, true, { from: minter });
      await this.botdex.add('2000', this.lp1.address, true, { from: minter });
      await this.botdex.add('1000', this.lp2.address, true, { from: minter });
      await this.botdex.add('500', this.lp3.address, true, { from: minter });
      assert.equal((await this.botdex.poolLength()).toString(), "4");
      await time.advanceBlockTo('170');
      await this.lp3.approve(this.botdex.address, '1000', { from: alice });
      assert.equal((await this.propellant.balanceOf(alice)).toString(), '0');
      await this.botdex.deposit(3, '20', { from: alice });
      await this.botdex.withdraw(3, '20', { from: alice });
      assert.equal((await this.propellant.balanceOf(alice)).toString(), '111');
    })


    it('deposit/withdraw', async () => {
      await this.botdex.add('1000', this.lp1.address, true, { from: minter });
      await this.botdex.add('1000', this.lp1.address, true, { from: minter });
      await this.botdex.add('1000', this.lp2.address, true, { from: minter });
      await this.botdex.add('1000', this.lp3.address, true, { from: minter });
      assert.equal((await this.botdex.poolLength()).toString(), "4");
      await this.lp1.approve(this.botdex.address, '1000', { from: alice });

      await this.botdex.deposit(1, '20', { from: alice });
      await this.botdex.deposit(1, '40', { from: alice });
      assert.equal((await this.lp1.balanceOf(alice)).toString(), '1940');

      await this.botdex.withdraw(1, '60', { from: alice });
      assert.equal((await this.lp1.balanceOf(alice)).toString(), '2000');
      assert.equal((await this.propellant.balanceOf(alice)).toString(), '499');

      await this.lp1.approve(this.botdex.address, '100', { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '2000');
      await this.botdex.deposit(1, '50', { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '1950');
      await this.botdex.deposit(1, '0', { from: bob });
      assert.equal((await this.propellant.balanceOf(bob)).toString(), '250');
      await this.botdex.emergencyWithdraw(1, { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '2000');
    })

    it('update multiplier', async () => {
      await this.botdex.add('1000', this.lp1.address, true, { from: minter });
      await this.botdex.add('2000', this.lp1.address, true, { from: minter });
      await this.botdex.add('1000', this.lp2.address, true, { from: minter });
      await this.botdex.add('1000', this.lp3.address, true, { from: minter });
      await time.advanceBlockTo('250');
      await this.lp2.approve(this.botdex.address, '1000', { from: alice });
      await this.lp2.approve(this.botdex.address, '1000', { from: bob });
      await this.botdex.deposit(2, '100', { from: alice });
      await this.botdex.deposit(2, '100', { from: bob });
      await time.increase('123456');

      await this.botdex.withdraw(2, '100', { from: alice });
      await this.botdex.withdraw(2, '100', { from: bob });

      assert.equal((await this.propellant.balanceOf(bob)).toString(), '400');
      assert.equal((await this.propellant.balanceOf(alice)).toString(), '400');
    });
});

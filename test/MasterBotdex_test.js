const { expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert } = require('chai');
const RocketPropellant = artifacts.require('BOTTest');
const MasterBotdex = artifacts.require('MasterBotdex');
const MockBEP20 = artifacts.require('libs/MockBEP20');

contract('MasterBotdex', ([alice, bob, treasure, dev, minter]) => {
    beforeEach(async () => {
        this.propellant = await RocketPropellant.new("BOT", "BOT", "18", { from: minter });
        this.lp1 = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
        this.lp2 = await MockBEP20.new('LPToken', 'LP2', '1000000', { from: minter });
        this.lp3 = await MockBEP20.new('LPToken', 'LP3', '1000000', { from: minter });
        this.botdex = await MasterBotdex.new(this.propellant.address, dev, '1000', '100', { from: minter });

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
      this.lp4 = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
      this.lp5 = await MockBEP20.new('LPToken', 'LP2', '1000000', { from: minter });
      this.lp6 = await MockBEP20.new('LPToken', 'LP3', '1000000', { from: minter });
      this.lp7 = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
      this.lp8 = await MockBEP20.new('LPToken', 'LP2', '1000000', { from: minter });
      this.lp9 = await MockBEP20.new('LPToken', 'LP3', '1000000', { from: minter });
      await this.botdex.add('2000', this.lp1.address, true, { from: minter });
      await this.botdex.add('1000', this.lp2.address, true, { from: minter });
      await this.botdex.add('500', this.lp3.address, true, { from: minter });
      await this.botdex.add('500', this.lp3.address, true, { from: minter });
      await this.botdex.add('500', this.lp3.address, true, { from: minter });
      await this.botdex.add('500', this.lp3.address, true, { from: minter });
      await this.botdex.add('500', this.lp3.address, true, { from: minter });
      await this.botdex.add('100', this.lp3.address, true, { from: minter });
      await this.botdex.add('100', this.lp3.address, true, { from: minter });

      assert.equal((await this.botdex.poolLength()).toString(), "10");

      await time.advanceBlockTo('170');
      await this.lp3.approve(this.botdex.address, '1000', { from: alice });
      assert.equal((await this.propellant.balanceOf(alice)).toString(), '0');
      console.log(alice);
      console.log(this.botdex.address);
      await this.botdex.deposit(3, '20', { from: alice });
      await this.botdex.withdraw(3, '20', { from: alice });
      assert.equal((await this.propellant.balanceOf(alice)).toString(), '65');
    })


    it('deposit/withdraw', async () => {
      await this.botdex.add('1000', this.lp1.address, true, { from: minter });
      await this.botdex.add('1000', this.lp2.address, true, { from: minter });
      await this.botdex.add('1000', this.lp3.address, true, { from: minter });

      await this.lp1.approve(this.botdex.address, '100', { from: alice });

      await this.botdex.deposit(1, '20', { from: alice });
      await this.botdex.deposit(1, '0', { from: alice });
      await this.botdex.deposit(1, '40', { from: alice });
      await this.botdex.deposit(1, '0', { from: alice });
      assert.equal((await this.lp1.balanceOf(alice)).toString(), '1940');

      await this.botdex.withdraw(1, '60', { from: alice });
      assert.equal((await this.lp1.balanceOf(alice)).toString(), '2000');
      assert.equal((await this.propellant.balanceOf(alice)).toString(), '999');

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
      await this.botdex.add('1000', this.lp2.address, true, { from: minter });
      await this.botdex.add('1000', this.lp3.address, true, { from: minter });

      await this.lp1.approve(this.botdex.address, '100', { from: alice });
      await this.lp1.approve(this.botdex.address, '100', { from: bob });
      await this.botdex.deposit(1, '100', { from: alice });
      await this.botdex.deposit(1, '100', { from: bob });
      await this.botdex.deposit(1, '0', { from: alice });
      await this.botdex.deposit(1, '0', { from: bob });

      await this.propellant.approve(this.botdex.address, '100', { from: alice });
      await this.propellant.approve(this.botdex.address, '100', { from: bob });

      await this.botdex.updateMultiplier('0', { from: minter });

      await time.increase('1830918');

      await this.botdex.withdraw(1, '100', { from: alice });
      await this.botdex.withdraw(1, '100', { from: bob });

      assert.equal((await this.propellant.balanceOf(alice)).toString(), '500');
      assert.equal((await this.propellant.balanceOf(bob)).toString(), '250');

    });

    it('should allow dev and only dev to update dev', async () => {
        assert.equal((await this.botdex.devaddr()).valueOf(), dev);
        await expectRevert(this.botdex.dev(bob, { from: bob }), 'dev: wut?');
        await this.botdex.dev(bob, { from: dev });
        assert.equal((await this.botdex.devaddr()).valueOf(), bob);
        await this.botdex.dev(alice, { from: bob });
        assert.equal((await this.botdex.devaddr()).valueOf(), alice);
    })
});

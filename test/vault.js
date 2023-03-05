const Vault = artifacts.require('Vault')
const { expectRevert, balance, time } = require('@openzeppelin/test-helpers')
const { web3 } = require('@openzeppelin/test-helpers/src/setup')
const { toWei, toBN } = web3.utils

contract('Vault', ([alice, bob]) => {
  let contract
  beforeEach(async () => {
    contract = await Vault.new()
    await contract.deposit({ from: alice, value: toWei('0.2', 'ether') })
  })

  it('should allow withdrawing', async () => {
    const tracker = await balance.tracker(bob)
    const withdraw = await contract.withdraw({ from: bob })

    const { delta, fees } = await tracker.deltaWithFees()

    expect(withdraw.receipt.status).to.be.true
    expect(
      delta.eq(toBN(toWei('0.1', 'ether')).sub(fees))
    ).to.be.true
  })

  it('should prevent from withdrawing again on the same day', async () => {
    await contract.withdraw({ from: bob })
    await time.increase(time.duration.hours(12))

    await expectRevert.unspecified(contract.withdraw({ from: bob }))
  })

  xit('should allow another withdrawal the next day', async () => {
    await contract.withdraw({ from: bob })
    await time.increase(time.duration.hours(36))
    const lastWithdraw = await contract.withdraw({ from: bob })

    expect(lastWithdraw.receipt.status).to.be.true
  })
})

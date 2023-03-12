const Vault = artifacts.require('Vault')
const { expectRevert, time } = require('@openzeppelin/test-helpers')
const { web3 } = require('@openzeppelin/test-helpers/src/setup')
const { toWei } = web3.utils

contract('Vault', ([alice, bob]) => {
  let contract
  beforeEach(async () => {
    contract = await Vault.new()
    await contract.deposit({ from: alice, value: toWei('0.2', 'ether') })
  })

  it('should allow withdrawing', async () => {
    const withdraw = await contract.withdraw({ from: bob })

    expect(withdraw.receipt.status).to.be.true
  })

  it('should prevent from withdrawing again on the same day', async () => {
    await contract.withdraw({ from: bob })
    await time.increase(time.duration.hours(12))

    await expectRevert(contract.withdraw({ from: bob }), 'Account under timelock')
  })

  it('should allow another withdrawal the next day', async () => {
    await contract.withdraw({ from: bob })
    await time.increase(time.duration.hours(36))
    const lastWithdraw = await contract.withdraw({ from: bob })

    expect(lastWithdraw.receipt.status).to.be.true
  })
})

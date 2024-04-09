const Tickets = artifacts.require('Tickets'); // artifacts is a global variable i
const assert = require('assert'); //  Assertions are built into node.js
// We import the contract we want to test (in this case, our Migrations contract) and then use it in our tests

contract('Tickets', (accounts) => {
  const BUYER = accounts[1];
  const TICKET_ID = 0;

  it('should allower a user to buy a ticket', async () => {
    const instance = await Tickets.deployed();
    const originalTicket = await instance.tickets(
      TICKET_ID
    );
    await instance.buyTicket(TICKET_ID, {
      from: BUYER,
      value: originalTicket.price,
    });
    const updatedTicket = await instance.tickets(TICKET_ID);
    assert.equal(
      updatedTicket.owner,
      BUYER,
      'the buyer should now own this ticket'
    );
  });
});

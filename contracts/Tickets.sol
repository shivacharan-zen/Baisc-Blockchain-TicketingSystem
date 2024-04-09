pragma solidity >=0.4.22 <0.9.0; // tells about versions

uint256 constant TOTAL_TICKETS = 20; 

contract Tickets { // any thing which we define as contract is called a smart contract in Solidity 
                   // anything we create here  will be deployed on the Ethereum blockchain and used to store and use.
  address public owner = msg.sender; //  'msg' variable gives us information about the account  that sent this transaction and 'owner' stores that senders address

  struct Ticket {
    uint256 price; //  the price of each ticket // uint256 is a datatype
    address owner;  // who owns this ticket?
  }

  Ticket[TOTAL_TICKETS] public tickets;

  constructor() { // same as java constructor 
    for (uint256 i = 0; i < TOTAL_TICKETS; i++) {
      tickets[i].price = 1e17; // 0.1 ETH
      tickets[i].owner = address(0x0); //  null address, means no one has it yet  
    }
  }

  function buyTicket(uint256 _index) external payable {
    require(_index < TOTAL_TICKETS && _index >= 0);
    require(tickets[_index].owner == address(0x0));
    require(msg.value >= tickets[_index].price);// msg value  is how much ethereum sent to this function
    tickets[_index].owner = msg.sender;
  }
}//_index is an input parameter of type uint256
import Web3 from 'web3';
import configuration from '../build/contracts/Tickets.json';
import 'bootstrap/dist/css/bootstrap.css';
import ticketImage from './images/ticket.png';

const createElementFromString = (string) => {
  const el = document.createElement('div');
  el.innerHTML = string;
  return el.firstChild;
};

const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;

// Connect using window.ethereum (MetaMask), Web3.givenProvider, or fallback
const web3 = new Web3(window.ethereum || Web3.givenProvider || 'http://localhost:7545');
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

let account;

const accountEl = document.getElementById('account');
const ticketsEl = document.getElementById('tickets');
const TOTAL_TICKETS = 10;
const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

const createPopup = (message) => {
  // ... (same as before)
};

const buyTicket = async (ticket) => {
  try {
    if (!account) {
      throw new Error('Please connect your wallet to purchase a ticket.');
    }

    await contract.methods.buyTicket(ticket.id).send({ from: account, value: ticket.price });
    createPopup(`Ticket ${ticket.id + 1} purchased successfully! ${TOTAL_TICKETS - (ticket.id + 1)} tickets remaining.`);
    refreshTickets(); // Update ticket list after purchase
  } catch (error) {
    console.error('Error buying ticket:', error);
    createPopup('Error: Ticket purchase failed!');
  }
};

const refreshTickets = async () => {
  ticketsEl.innerHTML = '';
  for (let i = 0; i < TOTAL_TICKETS; i++) {
    const ticket = await contract.methods.tickets(i).call();
    ticket.id = i;

    const ticketEl = createElementFromString(
      ticket.owner === EMPTY_ADDRESS
        ? `<div class="ticket card" style="width: 18rem;">
            <img src="${ticketImage}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">Ticket</h5>
              <p class="card-text">${ticket.price / 1e18} Eth</p>
              <button class="btn btn-primary">Buy Ticket</button>
            </div>
          </div>`
        : `<div class="ticket card text-muted" style="width: 18rem;">
            <img src="${ticketImage}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">Sold Out</h5>
            </div>
          </div>`
    );
    

    ticketButton(ticketEl, buyTicket, ticket.owner !== EMPTY_ADDRESS);
    ticketsEl.appendChild(ticketEl);
  }
};

const ticketButton = (ticketEl, buyTicketFn, isAvailable) => {
  // Assuming ticketButton function exists and handles button behavior
  const buyButton = ticketEl.querySelector('button');
  if (buyButton) {
    buyButton.disabled = !isAvailable; // Enable/disable button based on availability
    buyButton.onclick = () => buyTicketFn(ticket);
  }
};

// Handle window load event (assuming connectWalletBtn and balanceOfAccount functions exist)
window.addEventListener('load', async () => {
  try {
    const accounts = await web3.eth.requestAccounts();
    account = accounts[0];
    accountEl.innerText = account;

    // Optional check if account is connected (replace if using MetaMask)
    if (!account) {
      console.warn('No account connected. Please connect a wallet.');
    }

    await refreshTickets(); // Fetch initial ticket data
  } catch (error) {
    console.error('Error initializing:', error);
    displayError(error.message || 'An error occurred.'); // Handle errors gracefully
  }
});

function displayError(errMsg) {
  const errorEl = document.createElement('div');
  errorEl.classList.add('error-message'); // Add a CSS class for styling (optional)
  errorEl.innerHTML = `
    <p>ERROR! ${errMsg}</p>
    <button class="btn btn-sm btn-danger">Close</button>
    <a href="#" class="btn btn-sm btn-primary">Connect Wallet</a>
  `;

  document.body.appendChild(errorEl);

  const closeButton = errorEl.querySelector('button');
  if (closeButton) {
    closeButton.onclick = () => errorEl.remove();
  }

  const connectWalletBtn = errorEl.querySelector('a');
  if (connectWalletBtn) {
    // Assuming connectToMetaMask or similar function exists
    connectWalletBtn.onclick = async () => {
      try {
        await connectToMetaMask();
        errorEl.remove(); // Remove error message if connection successful
      } catch (error) {
        console.error('Error connecting to wallet:', error);
        // Consider updating error message or handling further
      }
    };
  }
}

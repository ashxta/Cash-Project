let people = [{ name: '', amount: 0 }];
let transactions = [];

function addPerson() {
    const container = document.getElementById('people-container');
    const personEntry = document.createElement('div');
    personEntry.classList.add('input-fields');
    personEntry.innerHTML = `
        <div class="input-item">
            <label for="name-${people.length}" class="input-label">Name:</label>
            <input type="text" id="name-${people.length}" class="input-field" required>
        </div>
        <div class="input-item">
            <label for="amount-${people.length}" class="input-label">Amount Spent:</label>
            <input type="number" id="amount-${people.length}" class="input-field" required>
        </div>
    `;
    container.appendChild(personEntry);
    people.push({ name: '', amount: 0 });
}

// Replace this with your deployed backend URL if needed
const backendURL = 'https://ashita-cash-project.vercel.app/calculate'; // Vercel URL

// Add event listener to submit form
document.getElementById('expense-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const people = [];
    // Assuming the people form section is populated dynamically
    document.querySelectorAll('.input-fields').forEach(inputFields => {
        const name = inputFields.querySelector('.input-item input[name^="name"]').value;
        const amountSpent = inputFields.querySelector('.input-item input[name^="amount"]').value;
        people.push({ name, amountSpent: parseFloat(amountSpent) });
    });

    try {
        // Send POST request to backend
        const response = await fetch(backendURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Make sure to specify JSON content
            },
            body: JSON.stringify({ people }), // Send the people data to the backend
        });

        const result = await response.json(); // Assuming the backend responds with JSON

        if (result.error) {
            alert('Failed to calculate transactions: ' + result.error);
        } else {
            // Update the transactions display with the response data
            updateTransactions(result.transactions);
        }
    } catch (error) {
        alert('Failed to calculate transactions');
    }
});

// Function to update the displayed transactions
function updateTransactions(transactions) {
    const transactionsContainer = document.getElementById('transactions-container');
    transactionsContainer.innerHTML = ''; // Clear previous transactions

    transactions.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.classList.add('transaction-item');

        // Transaction details
        transactionItem.innerHTML = `
            <img src="transaction-icon.gif" alt="Transaction icon">
            <p>${transaction.name}: ${transaction.amount}</p>
        `;

        transactionsContainer.appendChild(transactionItem);
    });
}

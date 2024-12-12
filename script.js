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

document.getElementById('expense-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const people = [];
    // Collect form data
    document.querySelectorAll('.input-fields').forEach(inputFields => {
        const name = inputFields.querySelector('.input-item input[name^="name"]').value;
        const amountSpent = inputFields.querySelector('.input-item input[name^="amount"]').value;
        if (name && amountSpent) {
            people.push({ name, amountSpent: parseFloat(amountSpent) });
        }
    });

    // Debugging log for collected form data
    console.log('Form Data:', people);  // Log the collected data to the console

    // Validate before sending
    if (people.length === 0) {
        alert("Please add some data before submitting.");
        return;
    }

    // Send the data to the backend (if you have one)
    fetch('https://ashita-cash-project.vercel.app/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            people: people,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        // Debugging log for backend response
        console.log('Backend Response:', data);  // Log the response to check if it’s valid
        if (data.error) {
            alert('Failed to calculate transactions: ' + data.error);
        } else {
            updateTransactions(data.transactions);  // Update transactions if valid data received
        }
    })
    .catch(error => {
        alert('Failed to fetch data: ' + error.message);
    });
});

function updateTransactions(transactions) {
    const transactionsContainer = document.getElementById('transactions-container');
    transactionsContainer.innerHTML = '';

    if (transactions && transactions.length > 0) {
        transactions.forEach(transaction => {
            const transactionItem = document.createElement('div');
            transactionItem.classList.add('transaction-item');
            transactionItem.innerHTML = `
                <img src="transaction-icon.gif" alt="Transaction icon">
                <p>${transaction.name}: ${transaction.amount}</p>
            `;
            transactionsContainer.appendChild(transactionItem);
        });
    } else {
        transactionsContainer.innerHTML = "<p>No transactions found.</p>";
    }
}

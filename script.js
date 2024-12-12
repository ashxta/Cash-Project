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

document.getElementById('expense-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const people = [];
    const nameInputs = document.querySelectorAll('.input-field[type="text"]');
    const amountInputs = document.querySelectorAll('.input-field[type="number"]');

    // Collect data
    nameInputs.forEach((nameInput, index) => {
        people.push({
            name: nameInput.value.trim(),
            amount: Number(amountInputs[index].value),
        });
    });

    try {
        // Send data to the backend
        const response = await fetch('http://127.0.0.1:5000/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ people }),
        });

        // Parse the response
        const data = await response.json();
        const transactionsContainer = document.getElementById('transactions-container');
        transactionsContainer.innerHTML = ''; // Clear previous transactions

        if (data.transactions.length === 0) {
            transactionsContainer.innerHTML = '<p>No transactions needed.</p>';
        } else {
            data.transactions.forEach(transaction => {
                const transactionDiv = document.createElement('div');
                transactionDiv.className = 'transaction-item';
                transactionDiv.innerHTML = `
                    <img src="transaction-icon.gif" alt="Icon">
                    <p>${transaction.payer} pays ${transaction.payee}: ${transaction.amount}</p>
                `;
                transactionsContainer.appendChild(transactionDiv);
            });
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to calculate transactions. Please try again.');
    }
});

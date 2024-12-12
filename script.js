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

    // Collect people data
    const formData = [];
    people.forEach((person, index) => {
        const name = document.getElementById(`name-${index}`).value;
        const amount = parseInt(document.getElementById(`amount-${index}`).value, 10);
        formData.push({ name, amount });
    });

    // Send POST request to backend
    const response = await fetch('http://127.0.0.1:5000/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ people: formData })
    });

    const result = await response.json();
    transactions = result.transactions;

    // Display transactions
    const transactionsContainer = document.getElementById('transactions-container');
    transactionsContainer.innerHTML = ''; // Clear previous results

    if (transactions.length === 0) {
        transactionsContainer.innerHTML = '<p class="text-gray-500">No transactions needed.</p>';
    } else {
        transactions.forEach(transaction => {
            const div = document.createElement('div');
            div.classList.add('transaction-item');
            div.innerHTML = `
                <img src="transaction-icon.gif" alt="Transaction icon">
                <p>${transaction.payer} pays ${transaction.payee}: ${transaction.amount}</p>
            `;
            transactionsContainer.appendChild(div);
        });
    }
});

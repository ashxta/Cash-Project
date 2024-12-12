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

document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents page reload and form reset

    // Get the values from the inputs
    const name = document.getElementById('name-0').value;
    const amount = document.getElementById('amount-0').value;

    // Ensure that both fields are filled out
    if (name && amount) {
        // Create a new transaction element
        const transactionContainer = document.getElementById('transactions-container');
        const transactionItem = document.createElement('div');
        transactionItem.classList.add('transaction-item');

        transactionItem.innerHTML = `
            <img src="transaction-icon.gif" alt="Transaction icon">
            <p><strong>Name:</strong> ${name} <strong>Amount Spent:</strong> ${amount}</p>
        `;

        // Add the new transaction to the container
        transactionContainer.appendChild(transactionItem);

        // Optionally, clear the form inputs
        document.getElementById('name-0').value = '';
        document.getElementById('amount-0').value = '';
    } else {
        alert('Please fill in both fields.');
    }
});

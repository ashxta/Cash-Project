let people = []; // Keep track of the people dynamically added

// Function to add a new person input field
function addPerson() {
    const peopleContainer = document.getElementById('people-container');
    const index = people.length;

    const personDiv = document.createElement('div');
    personDiv.classList.add('person');
    personDiv.innerHTML = `
        <input type="text" id="name-${index}" placeholder="Name" required>
        <input type="number" id="amount-${index}" placeholder="Amount Spent" required>
        <button type="button" onclick="removePerson(${index})" class="remove-button">Remove</button>
    `;

    peopleContainer.appendChild(personDiv);

    // Add a new person to the array
    people.push({ name: '', amount: 0 });
}

// Function to remove a person input field
function removePerson(index) {
    const personDiv = document.getElementById(`name-${index}`).parentNode;
    personDiv.remove();
    people.splice(index, 1);
}

// Add event listener for "Add Another Person" button
document.getElementById('add-person').addEventListener('click', addPerson);

// Form submission logic remains the same
document.getElementById('expense-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Collect updated people data
    const formData = people.map((_, index) => {
        const name = document.getElementById(`name-${index}`).value;
        const amount = parseInt(document.getElementById(`amount-${index}`).value, 10);
        return { name, amount };
    });

    // Send POST request to backend
    try {
        const response = await fetch(`${backendURL}/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ people: formData })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from the server');
        }

        const result = await response.json();
        console.log(result); // Debugging line to check response
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
    } catch (error) {
        console.error('Error during fetch operation:', error);
        alert('An error occurred. Please try again.');
    }
});

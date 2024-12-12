// Automatically determine the backend URL
const backendURL = `${window.location.protocol}//${window.location.hostname}:5000`;

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
        console.log(result);  // Debugging line to check response
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

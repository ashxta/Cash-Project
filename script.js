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

// Updated script.js for handling the API request to deployed backend
document.getElementById("expense-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const people = [];
    const nameFields = document.querySelectorAll("input[id^='name-']");
    const amountFields = document.querySelectorAll("input[id^='amount-']");

    for (let i = 0; i < nameFields.length; i++) {
        const name = nameFields[i].value.trim();
        const amount = parseFloat(amountFields[i].value.trim());
        if (name && !isNaN(amount)) {
            people.push({ name, amount });
        }
    }

    fetch("https://<your-backend-domain>/calculate", { // Update <your-backend-domain>
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ people }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to calculate transactions");
            }
            return response.json();
        })
        .then((data) => {
            const transactionsContainer = document.getElementById("transactions-container");
            transactionsContainer.innerHTML = ""; // Clear previous results

            data.transactions.forEach((transaction) => {
                const transactionItem = document.createElement("div");
                transactionItem.className = "transaction-item";
                transactionItem.innerHTML = `<p>${transaction}</p>`;
                transactionsContainer.appendChild(transactionItem);
            });
        })
        .catch((error) => {
            alert(error.message);
        });
});

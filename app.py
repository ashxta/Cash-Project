from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enables CORS for all origins

@app.route("/calculate", methods=["POST"])
def calculate_transactions():
    data = request.json
    people = data.get("people", [])
    
    # Calculate total amount and average
    total_amount = sum(p["amount"] for p in people)
    average_amount = total_amount / len(people)

    # Calculate transactions
    balances = {p["name"]: p["amount"] - average_amount for p in people}
    transactions = []

    creditors = [p for p in balances.items() if p[1] > 0]
    debtors = [p for p in balances.items() if p[1] < 0]

    for debtor in debtors:
        debtor_name, debtor_balance = debtor
        while debtor_balance < 0 and creditors:
            creditor_name, creditor_balance = creditors.pop(0)

            transfer_amount = min(-debtor_balance, creditor_balance)
            debtor_balance += transfer_amount
            creditor_balance -= transfer_amount

            transactions.append(f"{debtor_name} pays {creditor_name} ₹{transfer_amount:.2f}")

            if creditor_balance > 0:
                creditors.insert(0, (creditor_name, creditor_balance))

    return jsonify({"transactions": transactions}), 200

if __name__ == "__main__":
    app.run(debug=True)

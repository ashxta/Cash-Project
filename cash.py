from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/calculate": {
        "origins": ["https://ashita-cash-project.vercel.app", "http://localhost:*", "http://127.0.0.1:*"],
        "methods": ["POST"],
        "allow_headers": ["Content-Type"]
    }
})

class Person:
    def __init__(self, name, amount):
        self.name = name
        self.amount = amount

class Transaction:
    def __init__(self, payer, payee, amount):
        self.payer = payer
        self.payee = payee
        self.amount = amount

def calculate_balances(people):
    total_spent = sum(person.amount for person in people)
    average = total_spent // len(people)
    balances = [person.amount - average for person in people]
    return balances

def settle_transactions(balances, people):
    transactions = []
    giver = 0
    receiver = 0

    while True:
        while giver < len(balances) and balances[giver] >= 0:
            giver += 1
        while receiver < len(balances) and balances[receiver] <= 0:
            receiver += 1

        if giver == len(balances) or receiver == len(balances):
            break

        settlement = min(-balances[giver], balances[receiver])
        balances[receiver] -= settlement
        balances[giver] += settlement

        transactions.append(Transaction(
            people[giver].name,
            people[receiver].name,
            settlement
        ))

    return transactions

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    people = [Person(person['name'], person['amount']) for person in data['people']]
    balances = calculate_balances(people)
    transactions = settle_transactions(balances, people)
    result = [{"payer": t.payer, "payee": t.payee, "amount": t.amount} for t in transactions]
    return jsonify({"transactions": result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

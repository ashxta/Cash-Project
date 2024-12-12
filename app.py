from flask import Flask, request, jsonify
import subprocess
import json

app = Flask(__name__)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    people = data['people']
    
    # Save people data to a temporary file or pass it to the C program
    input_data = '\n'.join([f"{person['name']} {person['amount']}" for person in people])
    with open("people_data.txt", "w") as f:
        f.write(input_data)
    
    # Call the C program using subprocess (assuming it's compiled and available)
    result = subprocess.run(["./Cash Flow Minimizer - Graphs and Heaps"], capture_output=True, text=True)
    
    # Assuming the C program returns the transaction data
    transactions = []
    for line in result.stdout.splitlines():
        payer, payee, amount = line.split(":")
        transactions.append({
            'payer': payer.strip(),
            'payee': payee.strip(),
            'amount': int(amount.strip())
        })

    return jsonify({"transactions": transactions})

if __name__ == '__main__':
    app.run(debug=True)

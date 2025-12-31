const balanceEl = document.getElementById('balance');
const incomeAmountEl = document.getElementById('income-amount');
const expenseAmountEl = document.getElementById('expense-amount');
const transactionListEl = document.getElementById('transaction-list');
const transactionFormEl = document.getElementById('transaction-form');
const descriptionInputEl = document.getElementById('description');
const amountInputEl = document.getElementById('amount');

// get trasactions from local storage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

transactionFormEl.addEventListener('submit', addTransaction);

function addTransaction(e){
    e.preventDefault();

    // form values
    const description = descriptionInputEl.value.trim();
    const amount = parseFloat(amountInputEl.value);

    transactions.push({id: Date.now().toString(), description, amount});

    localStorage.setItem('transactions', JSON.stringify(transactions));

    updateTransactionLists();
    updateSummary();

    transactionFormEl.reset();

}

function updateTransactionLists(){
    transactionListEl.innerHTML = '';

    // sorting the transactions so the latest appears on top
    const sortedTrasactions = [...transactions].reverse();

    sortedTrasactions.forEach(transaction => {
        const transactionElement = createTransactionElement(transaction);

        transactionListEl.appendChild(transactionElement);
    });

}

function createTransactionElement(transaction){
    const li = document.createElement('li');
    li.classList.add('transaction');

    li.classList.add(transaction.amount>0 ? 'income' : 'expnense');

    li.innerHTML = `
    <span>${transaction.description}</span>

    <span>${formatCurrency(transaction.amount)}
        <buton class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    </span>
    `;

    return li;
}


function updateSummary(){
    const balance = transactions.reduce((acc,transaction) => acc + transaction.amount, 0);

    const income = transactions.filter(transaction => transaction.amount > 0).reduce((acc, transaction) => acc + transaction.amount, 0);

    const expense = transactions.filter(transaction => transaction.amount < 0 ).reduce((acc, transaction) => acc + transaction.amount,0);

    //updateUI => fix formating
    balanceEl.innerText = formatCurrency(balance);
    incomeAmountEl.innerText = formatCurrency(income);
    expenseAmountEl.innerText = formatCurrency(expense);
}

function formatCurrency(number){
    return new Intl.NumberFormat('en-AU', {
        style: "currency",
        currency: "AUD"
    }).format(number)
}

function removeTransaction(id){
    //filter the item to delete
    console.log('iii')
    transactions = transactions.filter(transaction => transaction.id.toString() !== id.toString());
    console.log(transactions, id)

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionLists();
    updateSummary();
}

// initial call functions

updateTransactionLists();
updateSummary();
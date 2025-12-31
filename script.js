const balanceEl = document.getElementById('balance');
const incomeAmountEl = document.getElementById('income-amount');
const expenseAmountEl = document.getElementById('expense-amount');
const transactionListEl = document.getElementById('transaction-list');
const transactionFormEl = document.getElementById('transaction-form');
const descriptionInputEl = document.getElementById('description');
const amountInputEl = document.getElementById('amount');
const selectOption = document.getElementById('expense-type');

// get trasactions from local storage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

transactionFormEl.addEventListener('submit', addTransaction);

function addTransaction(e){
    e.preventDefault();

    // form values
    const description = descriptionInputEl.value.trim();
    const operator = selectOption.value;

    let amount = parseFloat(amountInputEl.value);

    operator === '+' ? amount :  amount = -amount;
    

    const id = Date.now();
    

    saveExpenses(id, description, amount);
    

    transactionFormEl.reset();

}

function saveExpenses(id, description, amount){
    transactions.push({id, description, amount});

    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    updateTransactionLists();
    updateSummary();
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
    li.id = transaction.id;
    li.classList.add('transaction');
    

    li.classList.add(transaction.amount>0 ? 'income' : 'expnense');

    li.innerHTML = `
    <span class="description-span">${transaction.description}</span>

    <span class="amount-span">
    ${formatCurrency(transaction.amount)}
    </span>

    <div class="buttons">
        <i class="fa-regular fa-pen-to-square edit-btn" onclick = "edit(event ,${transaction.id})"></i>
        <i class="fa-regular fa-trash-can delete-btn" onclick="removeTransaction(${transaction.id})"></i>
    </div>
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
    transactions = transactions.filter(transaction => transaction.id.toString() !== id.toString());

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionLists();
    updateSummary();
}

function edit(e,id){

   
    const targetedList = e.target.closest('.transaction');
    if(!targetedList) return;

    const description = targetedList.querySelector('.description-span');
    const descText = description.innerText;

    const amnt = targetedList.querySelector('.amount-span');
    const amount = amnt.innerText.replace(/[\$,]/g, '');
    
    const editButton = targetedList.querySelector('.edit-btn');

    const inputElForDesc = document.createElement('input');
    inputElForDesc.type= 'text';
    inputElForDesc.value = description.innerText;
    inputElForDesc.classList.add('description-input');

    const inputElForAmount = document.createElement('input');
    inputElForAmount.type= 'number';
    inputElForAmount.value = amount;
    inputElForAmount.classList.add('amount-input');

    description.replaceWith(inputElForDesc);
    amnt.replaceWith(inputElForAmount);
    editButton.classList.replace('fa-regular', 'fa-solid');
    
    editButton.classList.replace('fa-pen-to-square', 'fa-check');


    editButton.onclick = () => {
        let desc = targetedList.querySelector('.description-input').value;
        desc.trim() === '' ?  desc = descText : '';
        let amnt = targetedList.querySelector('.amount-input').value;
        amnt.trim()==='' ? amnt = amount : '';


        transactions = transactions.map(el => {
            if(el.id === id){
                el.description = desc;
                el.amount = parseFloat(amnt);
            }
            return el;
        })
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateTransactionLists();
        updateSummary();
        

    }
        
    

}

// initial call functions
updateTransactionLists();
updateSummary();
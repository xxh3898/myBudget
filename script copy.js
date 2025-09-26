// == 전역 변수 ==
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentType = 'expense';
let currentFilter = 'all';

// == DOM 요소 ==
const inDescription = document.getElementById('description');
const inAmount = document.getElementById('amount');

const btnIncome = document.getElementById('income');
const btnExpense = document.getElementById('expense');
const btnAdd = document.getElementById('add-btn');

const fAll=document.getElementById('fall');
const fIncome=document.getElementById('fincome');
const fExpense=document.getElementById('fexpense');

const listUl = document.getElementById('transaction-ul');

const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const totalBalance = document.getElementById('total-balance');

const balance = document.getElementById('balance');


// == 초기화 함수 ==
function init() {
    bindEvents();
    render();
}

// == 이벤트 리스너 ==
function bindEvents() {
    // 버튼들부터 
    //수입버튼
    btnIncome.addEventListener('click', function () {
        currentType = 'income';
    })
    //지출버튼
    btnExpense.addEventListener('click', function () {
        currentType = 'expense';
    })
    //추가버튼
    btnAdd.addEventListener('click', function () {
        // console.log(currentType);
        addTransaction();
    })
    //수정버튼
    //전체버튼
    fAll.addEventListener('click', function () {
        currentFilter = 'all';
        render();
    })
    //수입버튼
    fIncome.addEventListener('click', function () {
        currentFilter = 'income';
        render();
    })
    //지출버튼
    fExpense.addEventListener('click', function () {
        currentFilter = 'expense';
        render();
    })
}

//그 전에 값을 입력받아 객체를 만들어야함
function addTransaction() {
    transaction = {
        id: Date.now(),
        description: inDescription,
        amount: inAmount,
        type: currentType,
        date: new Date().toLocaleDateString
    }
    transactions.push(transaction);

}

function render() {
    //ul아래에 li생성
    listUl.innerHTML = '';
    const filteredLists = getFilteredLists();
    console.log(transactions);
    let t = function (t) {
       const li = document.createElement('li');

        li.innerHTML = `
            <div class="left">
                <time class="date">${t.date}</time>
                <span class="description">${t.description}</span>
            </div>
            <div class="right">
                <span class="amount" style="color: ${t.type === 'income' ? 'green' : 'red'};">${t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}원</span>
                <button class="delete-btn">삭제</button>
                <button class="edit-btn">수정</button>
                <div id="${t.id}"></div>
            </div>`;
                    listUl.appendChild(li);

    }
}
function getFilteredLists() {
    const filteredLists = [];
    if (currentFilter === 'all') {
        for (let t of transactions) {
            filteredLists.push(t);
        }
    } else if (currentFilter === 'income') {
        for (let t of transactions) {
            filteredLists.push(t);
        }
    } else if (currentFilter === 'expense') {
        for (let t of transactions) {
            filteredLists.push(t);
        }
    }
}

document.addEventListener('DOMContentLoaded', init);
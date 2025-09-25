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

const filterBtns = document.querySelectorAll('.filter-btn button');

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


// == 이벤트 연결 함수 ==
// todo.테두리 토글 함수로 빼기
function bindEvents() {
    btnIncome.addEventListener('click', function () {
        currentType = 'income';
        btnToggle(currentType);
    });

    btnExpense.addEventListener('click', function () {
        currentType = 'expense';
        btnToggle(currentType);
    });

    btnAdd.addEventListener('click', addTransaction);

    inAmount.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            addTransaction();
        }
    });

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            currentFilter = e.target.dataset.filter;

            filterBtns.forEach(function (b) {
                b.classList.remove('active');
            });

            e.target.classList.add('active');

            render();
        });
    });

    //테두리 토글
    function btnToggle() {
        if (currentType === 'income') {
            btnIncome.classList.add("border");
            btnExpense.classList.remove("border");
        } else {
            btnExpense.classList.add("border");
            btnIncome.classList.remove("border");
        }
    }
}

// == 거래 추가 함수 ==
function addTransaction() {
    const desc = inDescription.value.trim();
    const amount = Number(inAmount.value);

    if (!desc || !amount) {
        return alert('내용과 금액을 입력해주세요');
    }

    const transaction = {
        id: Date.now(),
        description: desc,
        amount: amount,
        type: currentType,
        date: new Date().toLocaleDateString()
    };

    transactions.push(transaction);

    saveAndRender();

    inDescription.value = '';
    inAmount.value = '';
}


// == 거래 삭제 함수 ==
function deleteTransaction(id) {
    transactions = transactions.filter(function (t) {
        return t.id !== id;
    });

    saveAndRender();
}

// == 거래 수정 ==
function editTransaction(id) {
    const t = transactions.find(function (tr) {
        return tr.id === id;
    });

    document.getElementById(id).innerHTML = `<input type="text" class="inputEdit" placeholder="수정할 내용을 입력하세요" id="editDescription">
                <input type="number" class="inputEdit" placeholder="수정할 금액을 입력하세요" id="editAmount"><button class="edit-btn" id="edit-btn">수정하기</button>`;
    const editDescription = document.getElementById('editDescription');
    const editAmount = document.getElementById('editAmount');
    const btnEdit = document.getElementById('edit-btn');

    btnEdit.addEventListener('click', function () {
        t.description = editDescription.value;
        t.amount = Number(editAmount.value);
        saveAndRender();
    })
}

function saveAndRender() {
    localStorage.setItem('transactions', JSON.stringify(transactions));

    render();
}

// == 렌더링 함수 ==
function render() {
    listUl.innerHTML = '';

    let filtered = transactions;
    if (currentFilter !== 'all') {
        filtered = transactions.filter(function (t) {
            return t.type === currentFilter;
        });
    }

    filtered.forEach(function (t) {
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
            </div>
        `;

        li.querySelector('.delete-btn').addEventListener('click', function () {
            deleteTransaction(t.id);
        });

        //수정
        li.querySelector('.edit-btn').addEventListener('click', function () {
            editTransaction(t.id)
        })

        listUl.appendChild(li);
    });

    // == 요약 부분 ==
    const incomeSum = transactions
        .filter(function (t) { return t.type === 'income'; })
        .reduce(function (a, c) { return a + c.amount; }, 0);

    const expenseSum = transactions
        .filter(function (t) { return t.type === 'expense'; })
        .reduce(function (a, c) { return a + c.amount; }, 0);

    totalIncome.textContent = incomeSum.toLocaleString() + '원';
    totalExpense.textContent = expenseSum.toLocaleString() + '원';

    const remain = incomeSum - expenseSum;

    totalBalance.textContent = remain.toLocaleString() + '원';
    totalBalance.style.color = remain > 0 ? "green" : "red";
    balance.textContent = remain.toLocaleString() + '원';
    balance.style.color = remain > 0 ? "green" : "red";
}

document.addEventListener('DOMContentLoaded', init);
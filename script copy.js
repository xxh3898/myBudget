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

const fAll = document.getElementById('fall');
const fIncome = document.getElementById('fincome');
const fExpense = document.getElementById('fexpense');

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
    btnIncome.addEventListener('click', function () {
        currentType = 'income';
        btnToggle(currentType);
    })
    btnExpense.addEventListener('click', function () {
        currentType = 'expense';
        btnToggle(currentType);

    })
    btnAdd.addEventListener('click', function () {
        // console.log(currentType);
        addTransaction();
    })
    inAmount.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            addTransaction();
        }
    });
    fAll.addEventListener('click', function () {
        currentFilter = 'all';
        checked(currentFilter);
        saveAndRender();
    })
    fIncome.addEventListener('click', function () {
        currentFilter = 'income';
        checked(currentFilter);
        saveAndRender();
    })
    fExpense.addEventListener('click', function () {
        currentFilter = 'expense';
        checked(currentFilter);
        saveAndRender();
    })
}
function btnToggle(currentType) {
    if (currentType === 'income') {
        btnIncome.classList.add('border');
        btnExpense.classList.remove('border');
        console.log("income");

    } else {
        btnExpense.classList.add('border');
        btnIncome.classList.remove('border');
        console.log("expense");
    }
}

function checked(currentFilter){
if (currentFilter === 'all') {
        fAll.classList.add('active');
        fIncome.classList.remove('active');
        fExpense.classList.remove('active');
    } else if(currentFilter === 'income'){
        fAll.classList.remove('active');
        fIncome.classList.add('active');
        fExpense.classList.remove('active');
    } else if(currentFilter === 'expense'){
        fAll.classList.remove('active');
        fIncome.classList.remove('active');
        fExpense.classList.add('active');
    }
}

//그 전에 값을 입력받아 객체를 만들어야함
function addTransaction() {

    transaction = {
        id: Date.now(),
        description: inDescription.value, //value를 가져와야함
        amount: Number(inAmount.value),
        type: currentType,
        date: new Date().toLocaleDateString()
    }
    const desc = inDescription.value.trim();
    const amount = Number(inAmount.value);
    if (!desc || !amount) { //공백 입력시
        alert("내용과 금액을 입력해주세요");
        return;
    }
    transactions.push(transaction);
    saveAndRender();
    console.log("추가 타입:" + transaction.type);
    inDescription.value = '';
    inAmount.value = '';

}

function render() {
    //ul아래에 li생성
    listUl.innerHTML = '';
    const filteredLists = getFilteredLists();
    filteredLists.forEach(function (t) { //transactions는 배열(여러 거래 항목)이기 때문에 각 항목마다 HTML 요소(<li>)를 하나씩 만들어서 DOM에 추가하려면 항목들을 하나씩 순회(iterate)해야 함
        const li = document.createElement('li');

        li.innerHTML = `
            <div class="left">
                <time class="date">${t.date}</time>
                <span class="description">${t.description}</span>
            </div>
            <div class="right">
                <span class="amount" style="color: ${t.type === 'income' ? 'green' : 'red'};">
                    ${t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}원
                </span>
                <button class="delete-btn">삭제</button>
                <button class="edit-btn">수정</button>
                <div id="${t.id}"></div>
            </div>
        `;

        listUl.appendChild(li); // 실제 DOM에 추가 실제 페이지에 보이려면 부모 노드에 붙여줘야 함
        console.log("type:" + t.type);


        // document.getElementById('deleteBtn').addEventListener('click', function () {
        li.querySelector('.delete-btn').addEventListener('click', function () { //document.을 안쓰는 이유는 각각의 li 항목마다 자기 자신 안에 있는 삭제 버튼을 찾고 이벤트를 연결하기 위해
            console.log("삭제이벤트 호출");

            deleteTransaction(t.id);


        })
        li.querySelector('.edit-btn').addEventListener('click', function () {
            console.log("수정이벤트 호출");

            editTransaction(t.id);


        })
    });

    //요약부분 해야함
    let totalIncomeSum = 0;

    for (let t of transactions) {
        if (t.type === 'income') {
            totalIncomeSum += t.amount;
        }
    }

    let totalExpenseSum = 0;

    for (let t of transactions) {
        if (t.type === 'expense') {
            totalExpenseSum += t.amount;
        }
    }
    totalIncome.textContent = totalIncomeSum.toLocaleString() + '원'; //toLocaleString() -> 천원단위로 컴마

    totalExpense.textContent = totalExpenseSum.toLocaleString() + '원';;
    balance.textContent = (totalIncomeSum - totalExpenseSum).toLocaleString() + '원';;
    totalBalance.textContent = (totalIncomeSum - totalExpenseSum).toLocaleString() + '원';;
}
//로컬 저장함수
function saveAndRender() {
    localStorage.setItem('transactions', JSON.stringify(transactions));

    render();
}

function editTransaction(id) {
    console.log("수정");
    document.getElementById(id).innerHTML = `<input type="text" class="inputEdit" placeholder="수정할 내용을 입력하세요" id="editDescription">
            <input type="number" class="inputEdit" placeholder="수정할 금액을 입력하세요" id="editAmount">
            <button class="edit-btn" id="edit-btn">수정하기</button>`;
    const editDescription = document.getElementById('editDescription');
    const editAmount = document.getElementById('editAmount');

    document.getElementById('edit-btn').addEventListener('click', function () {
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].id === id) {
                transactions[i].description = editDescription.value;
                transactions[i].amount = Number(editAmount.value);
            }

        }
        saveAndRender();
    })
}
function deleteTransaction(id) {
    console.log("delete");
    //transactions배열에 지우고자하는 아이디와 같은 객체 빼고 다시 한 바퀴 돌려서 넣기
    let newTransactions = []
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].id !== id) {
            newTransactions.push(transactions[i]);
        }
    }
    transactions = newTransactions;
    saveAndRender();
}
function getFilteredLists() {
    const filteredLists = [];
    if (currentFilter === 'all') {
        for (let t of transactions) {
            filteredLists.push(t);
        }
        console.log('전체필터출력');
    } else if (currentFilter === 'income') {
        for (let t of transactions) {
            if (t.type == 'income') {
                filteredLists.push(t)
            }
        }
        console.log('수입필터출력');
    } else if (currentFilter === 'expense') {
        for (let t of transactions) {
            if (t.type == 'expense') {
                filteredLists.push(t)
            }
        }
        console.log('지출필터출력');
    }

    return filteredLists; //리턴을 해야함 값을 return하지 않으면 undefined를 반환
}

document.addEventListener('DOMContentLoaded', init);
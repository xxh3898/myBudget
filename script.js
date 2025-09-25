// == 전역 변수 (데이터 & 상태 관리) ==
// 거래 내역을 localStorage에서 불러오거나, 없으면 빈 배열로 초기화
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
// 현재 선택된 거래 타입 (수입 / 지출)
let currentType = 'expense';
// 현재 필터 상태 (전체 / 수입 / 지출)
let currentFilter = 'all';

// == DOM 요소 가져오기 ==
// 입력창 - 내용
const inDescription = document.getElementById('description');
// 입력창 - 금액
const inAmount = document.getElementById('amount');

// 버튼 - 수입 선택
const btnIncome = document.getElementById('income');
// 버튼 - 지출 선택
const btnExpense = document.getElementById('expense');
// 버튼 - 거래 추가
const btnAdd = document.getElementById('add-btn');


// 필터 버튼들 (전체 / 수입 / 지출)
const filterBtns = document.querySelectorAll('.filter-btn button');

// 거래 내역 리스트가 들어갈 UL
const listUl = document.getElementById('transaction-ul');

// 요약 영역: 총 수입
const totalIncome = document.getElementById('total-income');
// 요약 영역: 총 지출
const totalExpense = document.getElementById('total-expense');
// 요약 영역: 현재 잔액 (요약용)
const totalBalance = document.getElementById('total-balance');

// 헤더에 표시되는 "현재 잔액"
const balance = document.getElementById('balance');


// == 초기화 함수 ==

// 페이지가 로드되면 실행
function init() {
    bindEvents();  // 이벤트 연결
    render();      // 거래 내역과 요약 정보 화면에 출력
}


// == 이벤트 연결 함수 ==

function bindEvents() {
    // [수입 버튼] 클릭하면 현재 타입을 'income'으로 설정
    // 테두리 변경으로 확인 가능
    btnIncome.addEventListener('click', function () {
        currentType = 'income';
        btnIncome.classList.add("border");
        btnExpense.classList.remove("border");
    });

    // [지출 버튼] 클릭하면 현재 타입을 'expense'로 설정
    // 테두리 변경으로 확인 가능

    btnExpense.addEventListener('click', function () {
        currentType = 'expense';
        btnExpense.classList.add("border");
        btnIncome.classList.remove("border");
    });

    // [추가하기 버튼] 클릭하면 거래 추가
    btnAdd.addEventListener('click', addTransaction);

    // [금액 입력창]에서 엔터 키 누르면 거래 추가
    inAmount.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            addTransaction();
        }
    });

    // [필터 버튼들] 클릭 시 전체/수입/지출 필터 적용
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            // 클릭한 버튼의 data-filter 값 가져오기
            currentFilter = e.target.dataset.filter;

            // 모든 버튼에서 active 클래스 제거
            filterBtns.forEach(function (b) {
                b.classList.remove('active');
            });

            // 클릭한 버튼만 active 적용
            e.target.classList.add('active');

            render();
        });
    });
}


// == 거래 추가 함수 ==

function addTransaction() {
    // 입력된 내용과 금액 가져오기
    const desc = inDescription.value.trim(); // 공백 제거
    const amount = Number(inAmount.value);   // 숫자로 변환

    // 입력값이 없으면 경고 후 리턴
    if (!desc || !amount) {
        return alert('내용과 금액을 입력해주세요');
    }

    // 거래 객체 생성
    const transaction = {
        id: Date.now(),               // 고유 ID (현재 시간 기반)
        description: desc,            // 입력한 내용
        amount: amount,               // 입력한 금액
        type: currentType,            // 현재 선택된 타입 (수입/지출)
        date: new Date().toLocaleDateString() // 오늘 날짜
    };

    // 배열에 새 거래 추가
    transactions.push(transaction);

    // localStorage 저장 + 화면 다시 그리기
    saveAndRender();

    // 입력창 초기화
    inDescription.value = '';
    inAmount.value = '';
}


// == 거래 삭제 함수 ==

function deleteTransaction(id) {
    // ID가 일치하지 않는 거래만 남김 -> 해당 거래 삭제 효과
    transactions = transactions.filter(function (t) {
        return t.id !== id;
    });

    // 저장 및 다시 렌더링
    saveAndRender();
}


// == 저장 + 렌더링 함수 ==

function saveAndRender() {
    // localStorage에 transactions 배열 저장
    localStorage.setItem('transactions', JSON.stringify(transactions));

    render();
}


// == 렌더링 함수 ==

function render() {
    // 리스트 초기화 (비워주기)
    listUl.innerHTML = '';

    // 현재 필터에 맞는 거래만 선택
    let filtered = transactions;
    if (currentFilter !== 'all') {
        filtered = transactions.filter(function (t) {
            return t.type === currentFilter;
        });
    }

    // 거래 내역을 화면에 출력
    filtered.forEach(function (t) {
        const li = document.createElement('li');

        // 리스트 아이템 HTML
        //잔액에 따라서 색상 변경
        li.innerHTML = `
            <div class="left">
                <time class="date">${t.date}</time>
                <span class="description">${t.description}</span>
            </div>
            <div class="right">
                <span class="amount" style="color: ${t.type === 'income' ? 'green' : 'red'};">${t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}원</span>
                <button class="delete-btn">삭제</button>
            </div>
        `;

        // 삭제 버튼 클릭 시 해당 거래 삭제
        li.querySelector('.delete-btn').addEventListener('click', function () {
            deleteTransaction(t.id);
        });

        // 완성된 li를 UL에 추가
        listUl.appendChild(li);
    });

    // == 요약 부분 ==

    // 총 수입 계산
    const incomeSum = transactions
        .filter(function (t) { return t.type === 'income'; })
        .reduce(function (a, c) { return a + c.amount; }, 0);

    // 총 지출 계산
    const expenseSum = transactions
        .filter(function (t) { return t.type === 'expense'; })
        .reduce(function (a, c) { return a + c.amount; }, 0);

    // DOM에 출력
    totalIncome.textContent = incomeSum.toLocaleString() + '원';
    totalExpense.textContent = expenseSum.toLocaleString() + '원';

    // 잔액 = 수입 - 지출
    const remain = incomeSum - expenseSum;

    // 요약 / 헤더 잔액 모두 업데이트
    //잔액에 따라서 색상 변경
    totalBalance.textContent = remain.toLocaleString() + '원';
    totalBalance.style.color = remain > 0 ? "green" : "red";
    balance.textContent = remain.toLocaleString() + '원';
    balance.style.color = remain > 0 ? "green" : "red";
}


// DOMContentLoaded -> init 실행
document.addEventListener('DOMContentLoaded', init);
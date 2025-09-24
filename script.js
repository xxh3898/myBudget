//전역변수
let transactions = [];

//DOM 요소
//입력
const inDescription = document.getElementById('description');
const inAmount = document.getElementById('amount');
//버튼
const btnIncome = document.getElementById('add-income');
const btnExpense = document.getElementById('add-expense');
const btnAdd = document.querySelector('.add-btn');
//필터
const filter = document.querySelectorAll('.filter-btn button');
//리스트
const list = document.querySelector('.transaction-list ul');
//요약
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const totalBalance = document.getElementById('total-balance');
const balance = document.getElementById('balance');
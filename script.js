'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
let inputCloseUsername = document.querySelector('.form__input--user');
let inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/////////////////////////////////////////////////
// PROJECT STUFF

// conversion value
const eurToUSD = 1.1;

// display the transactions
const displayMovements = function (movements, sort = false) {
  // sorting functionality
  // if sort is true, sort ? sort : else, display movements
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // setting already existing things to NIL
  containerMovements.innerHTML = '';

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1
    }: ${type}</div>
    <div class="movements__value">${mov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// function to create short user names paul aji will be pa
const createUsernames = function (allAccounts) {
  allAccounts.forEach(function (indAccount) {
    indAccount.username = indAccount.owner
      .toLowerCase()
      .split(' ')
      .map(eachWord => eachWord[0])
      .join('');
  });
};

createUsernames(accounts);
console.log(accounts);

// function to display balance of an account
const displayBalance = account => {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance} EUR`;
};

// function to display how much money came in and went out and also the interest
// interest rate here is 1.2
// also we are putting in a constrain where in if the individual interest of a particular deposit isnt greater than or equal to 1 EUR, we avoid it
const displaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}EUR`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}EUR`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter((mov, i, arr) => {
      console.log(arr);
      return mov >= 1;
    })
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest}EUR`;
};

const updateUI = function (acc) {
  // display the account movements/transactions corresponding to which user logged in
  displayMovements(acc.movements);

  // display the balance
  displayBalance(acc);

  // display account summary at the bottom
  displaySummary(acc);
};

// EVENT HANDLERS

// this function is to check for the login
// i.e. if the login username and pass matches and then we login

// declaring a global variable currentAccount to compare the login account with other things
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // to prevent the form from submitting/reloading
  e.preventDefault();

  //to find account details using login username
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  // to check if the currentAccount we retrieved using the username and the PIN of that retrieved object matches!
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // account details match aaya,
    // change UI and display welcome message

    //using slice method
    // labelWelcome.textContent = `Welcome back, ${currentAccount.owner.slice(
    //   0,
    //   currentAccount.owner.indexOf(' ')
    // )}`;

    // using split method
    labelWelcome.textContent = `Welcome back, ${
      currentAccount?.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
  }
  // clear input fields so that pass and username wont remain there for everyone to see
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();

  // update the UI
  updateUI(currentAccount);
});

// setting transfers
btnTransfer.addEventListener('click', function (e) {
  // to prevent reload because this is a form
  e.preventDefault();

  // storing input amount in a variable
  const amount = Number(inputTransferAmount.value);

  // checking whether there is actually an account to which we are trying to transfer to
  const recAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  console.log(amount, recAccount);
  inputTransferAmount.value = inputTransferTo.value = '';

  //now inorder to transfer money, we have to check if the amount inputted is positive and also if the account has necessary balance
  if (
    amount > 0 &&
    recAccount && // to check whether the recAccount actually exists
    amount <= currentAccount.balance &&
    recAccount?.username != currentAccount.username
  ) {
    console.log(`Valid Transfer`);
    currentAccount.movements.push(-amount);
    recAccount.movements.push(amount);
    // update the UI
    updateUI(currentAccount);
  }
});

// closing account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value == currentAccount.username &&
    Number(inputClosePin.value) == currentAccount.pin
  ) {
    // to find index of account to be deleted
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );

    //deleting the account
    accounts.splice(index, 1);

    // after deleting, we need to hide the UI
    containerApp.style.opacity = 0;

    // set the welcome message to default message
    labelWelcome.textContent = `Log in to get started`;
  }
  // we have to set the input fields to default, athaayath close account inte username and password field if we click the submit arrow allengi it will remain there, why are we not doing this inside the loop? because loop ile condition vech correct username athaayath nammade accounts array il olla username adichaale aah fields clear aavu, but we want it in such a way that no matter what input we give, after hitting submit, we have to clear the field
  inputCloseUsername = inputClosePin = '';
});

// requesting loan
// loan can be requested if there has been a deposit of 10% of what the loan amount wsa requested
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  //storing loan amount in a variable
  const amount = Number(inputLoanAmount.value);

  //conditions for loan
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add/deposit the amount into movements array
    currentAccount.movements.push(amount);

    //update the UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// implementing the sorting button event handler
let sorted = false; //setting the state variable as default false
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);

  sorted = !sorted;
});

/////////////////////////////////////////////////
// PRACTICE STUFF

// for (const movement of movements) {
//   if (movement > 0) console.log(`You deposited ${movement}`);
//   else console.log(`You withdrew ${Math.abs(movement)}`);
// }

// movements.forEach(function (movement) {
//   if (movement > 0) console.log(`You deposited ${movement}`);
//   else console.log(`You withdrew ${Math.abs(movement)}`);
// });

// // const movementsUSD = movements.map(function (mov) {
// //   return mov * eurToUSD;
// // });

// // using arrow function
// const movementsUSD = movements.map(mov => mov * eurToUSD);
// console.log(movementsUSD);

// const movementUSDFor = [];
// for (const mov of movements) movementUSDFor.push(mov * eurToUSD);
// console.log(movementUSDFor);

// const movementsDescription = movements.map(
//   (mov, i, arr) =>
//     `Movement ${i + 1}: Account ${mov > 0 ? 'credited' : 'debited'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementsDescription);

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// const withdrawals = movements
//   .filter(mov => Math.abs(mov < 0))
//   .map(mov => Math.abs(mov));

// console.log(movements);
// console.log(deposits);
// console.log(withdrawals);

// console.log(movements);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration: ${i} Accumulator: ${acc}`);
//   return acc + cur;
// }, 0);

// const balance = movements.reduce((acc, mov) => acc + mov, 0);

// console.log(balance);

// // how to get maximum value in an array

// const max = movements.reduce((acc, mov, i) => {
//   console.log(`iteration:${i} accumulator:${acc} currentvalue${mov} `);
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);

// console.log(max);

// const dogAge = [5, 2, 4, 1, 15, 8, 3];

// const dogHumanAge = dogAge.map((cur, i, arr) => {
//   if (cur <= 2) return 2 * cur;
//   else {
//     return 16 + cur * 4;
//   }
// });

// console.log(dogAge);
// console.log(dogHumanAge);

// const filteredAge = dogHumanAge.filter((mov, i, arr) => {
//   return mov > 18;
// });
// console.log(filteredAge);

// const avgAge =
//   filteredAge.reduce((acc, cur, i, arr) => {
//     return acc + cur;
//   }, 0) / filteredAge.length;

// console.log(avgAge);

// find method
const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// flat method
const allMovementsArray = accounts.map(account => account.movements);
console.log(allMovementsArray);

const allMovements = allMovementsArray.flat();
console.log(allMovements);

const bankTotalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
console.log(bankTotalBalance);

//sorting
//ascending
const newArray = [100, 30, -20, 1000, 43, 2, -12, -1344];
console.log(...newArray);
newArray.sort((a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
});
console.log(...newArray);

//descending
const newArray2 = [100, 30, -20, 1000, 43, 2, -12, -1344];
console.log(...newArray2);
newArray2.sort((a, b) => {
  if (a > b) return -1;
  if (b > a) return 1;
});
console.log(...newArray2);

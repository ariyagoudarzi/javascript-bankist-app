const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: "Ariya Goudarzy",
  movements: [430, 1000, 700, 50, 90, 3500, 1024, 850, 330],
  interestRate: 1.25,
  pin: 5555,
};
const account6 = {
  owner: "Parham Alipor",
  movements: [430, -1000, 700, 50, -90, 3500, 1024, -850, 330],
  interestRate: 1.25,
  pin: 6666,
};

const accounts = [account1, account2, account3, account4, account5, account6];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const btnUpgrade = document.querySelector(".form__btn--upgrade");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value"><b>${mov}$</b></div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplyBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance}$`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}$`;

  const outcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}$`;

  const intrest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposite) => (deposite * acc.interestRate) / 100)
    .filter((deposite) => deposite >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${intrest}$`;
};

const creatUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
creatUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplyBalance(acc);
  calcDisplaySummary(acc);
};

let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value.toLowerCase()
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // => currentAccount && currentAccount.pin
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0][0].toUpperCase() +
      currentAccount.owner.split(" ")[0].slice(1)
    }`;
    containerApp.style.opacity = "1";

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUI(currentAccount);
  } else {
    labelWelcome.innerHTML = `<p style="color: #ff0000;">Wrong Password/Username</p>`;
    containerApp.style.opacity = "0";
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferTo.blur();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername?.value === currentAccount.username &&
    Number(inputClosePin?.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    labelWelcome.innerHTML = "Log in to get started";
    containerApp.style.opacity = "0";
    inputCloseUsername.value = inputClosePin.value = "";
    inputClosePin.blur();
  }
});

btnUpgrade.addEventListener("click", function () {
  if (currentAccount.movements.every((mov) => mov > 0)) {
    currentAccount.movements.push(1000);
    document.querySelector(".upgrade--status").innerHTML =
      '<p style="color: #fff;">You got 1000$</p>';
    updateUI(currentAccount);
  } else {
    document.querySelector(".upgrade--status").innerHTML =
      '<p style="color: #fff;">You got 1000$ if all of your movements be deposited</p>';
  }
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

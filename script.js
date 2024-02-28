const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2020-12-23T07:42:02.383Z",
    "2021-10-28T09:15:04.904Z",
    "2022-12-25T10:17:24.185Z",
    "2024-02-22T14:11:59.604Z",
    "2024-02-26T17:01:17.194Z",
    "2024-02-23T23:36:17.929Z",
    "2024-02-27T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Ariya Goudarzi",
  movements: [5000, 3400, -150, -790, 3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "IRR",
  locale: "fa-IR",
};

const admin = {
  owner: "Parham Alipor",
  movements: [430, -1000, 700, 50, -90, 3500, 1024, -850, 330],
  interestRate: 1.25,
  pin: 1234,
  username: "admin",
};

const accounts = [account1, account2, account3];

console.log(accounts);

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

const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = (date2, date1) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  else if (daysPassed === 1) return "YesterDay";
  else if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const Option = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      weekday: "long",
    };
    return Intl.DateTimeFormat(locale, Option).format(date);
  }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);

    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__dates"><b>${displayDate}</b></div>
        <div class="movements__value"><b>${formatCur(
          mov,
          acc.locale,
          acc.currency
        )}</b></div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplyBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(
    Math.round(outcomes),
    acc.locale,
    acc.currency
  );

  const intrest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposite) => (deposite * acc.interestRate) / 100)
    .filter((deposite) => deposite >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(intrest, acc.locale, acc.currency);
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
  displayMovements(acc);
  calcDisplyBalance(acc);
  calcDisplaySummary(acc);
};

let users = accounts.map((user) => [
  user.owner,
  user.movements,
  user.username,
  user.pin,
  user.movementsDates,
  user.currency,
]);
const showUserList = function (accs) {
  accs.forEach((user, i) => {
    const dateHtml = user[4]
      .map((date, i) => {
        return `${i + 1}) ${new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          weekday: "long",
        }).format(new Date(date))}`;
      })
      .map((date, i) => {
        if (i % 2 === 0)
          return `<p class="date-time-table" style="background-color: #dadaff;">${date}</p>`;
        else return `<p class="date-time-table">${date}</p>`;
      });

    const movements = user[1].map((mov, i) => {
      let formattedMov = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: user[5],
      }).format(mov);
      if (i % 2 === 0)
        return `<p class="date-time-table" style="background-color: #dadaff;">${
          i + 1
        }) ${formattedMov}</p>`;
      else return `<p class="date-time-table">${i + 1}) ${formattedMov}</p>`;
    });
    const html = `
    <tr>
      <th style="padding: 10px;">${i + 1}</th>
      <th style="padding: 10px;">${user[0]}</th>
      <th style="font-family: monospace; padding: 10px;">${user[3]} ${
      user[2]
    }</th>
      <th>${movements.join("")}</th>
      <th>${dateHtml.join("")}</th>
    </tr>
    `;
    document
      .querySelector(".users-label")
      .insertAdjacentHTML("beforeend", html);
  });
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      document.querySelector(".app-container").style.display = "none";
      labelWelcome.textContent = "Log in to get started";
    }

    time--;
  };
  let time = 120;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = "1";

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value.trim().toLowerCase()
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    document.querySelector(".app-container").style.display = "block";
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    document.querySelector(".admin-pannel").style.display = "none";
    // => currentAccount && currentAccount.pin
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0][0].toUpperCase() +
      currentAccount.owner.split(" ")[0].slice(1)
    }`;

    const displayDate = function () {
      const now = new Date();
      const Option = {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        weekday: "long",
      };
      labelDate.textContent = new Intl.DateTimeFormat(
        currentAccount.locale,
        Option
      ).format(now); // Tuesday, February 27, 2024 at 6:50 PM
    };
    displayDate();
    setInterval(displayDate, 60000);

    containerApp.style.opacity = "1";

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUI(currentAccount);

    const movementsRow = Array.from(
      document.querySelectorAll(".movements__row")
    );
    movementsRow.forEach((row, i) => {
      if (i % 2 === 0) row.style.backgroundColor = "rgba(243, 243, 243, 0.5)";
    });
  } else if (
    1234 === +inputLoginPin.value &&
    inputLoginUsername.value === "admin"
  ) {
    document.querySelector(".admin-pannel").style.display = "block";
    labelWelcome.textContent = `Welcome back ${
      admin.owner.split(" ")[0][0].toUpperCase() +
      admin.owner.split(" ")[0].slice(1)
    }(ADMIN)`;
    containerApp.style.opacity = "0";
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    showUserList(users);

    const bankBalance = [
      accounts
        .flatMap((user) => user.movements)
        .filter((mov) => mov > 0)
        .reduce((acc, mov) => acc + mov, 0),
      accounts
        .flatMap((user) => user.movements)
        .filter((mov) => mov < 0)
        .reduce((acc, mov) => acc + mov, 0),
    ];
    const bankBalanceHtml = `
    <tr>
      <th style="color:#39b385; padding: 15px 20px;">${bankBalance[0]}$</th>
      <th style="color:#e52a5a; padding: 15px 20px;">${Math.abs(
        bankBalance[1]
      )}$</th>
    </tr>
    `;
    document.querySelector(".balance-label").innerHTML += bankBalanceHtml;
  } else {
    labelWelcome.innerHTML = `<p style="color: #ff0000;">Wrong Password/Username</p>`;
    containerApp.style.opacity = "0";
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value.trim().toLowerCase()
  );
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);

    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();

    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferTo.blur();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);

      clearInterval(timer);
      timer = startLogOutTimer();
    }, 4500);

    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername?.value.trim().toLowerCase() ===
      currentAccount.username &&
    +inputClosePin?.value === currentAccount.pin
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

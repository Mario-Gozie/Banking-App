"use strict";

///////////////////////////////////////////////////BANKIST APP.

// Data

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
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

const accounts = [account1, account2, account3, account4];
accounts;
//Elements

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimmer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTranfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginusername = document.querySelector(".login__input--user");
const inputLoginpin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// CREATING USERNAME

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner // this is the point where the new property is created.
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("") // note that this join has to come after the closing of the map method. the map method has to finish its job and return an array before you can join
      .toUpperCase();
  });
};

createUsernames(accounts);

// DISPLAYING MOVEMENTS/TRANSACTIONS

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ""; //Here I am basically saying that please whatever that is original inside the HTML file during the time of createion should be removed so I can use Javascrip to imput values into the container. this will remove everything manually entered using when creating the html file. this is similar to setting textContent = '' but textContent remove only the text file while innerHTML remove the whole html content.

  // The movs variable below is saying. if sort is true, slice the content of the movement argument to create a new array, then sort in ascending order, else give us the movement like that. I had to slice to create a new array because the sort method changes the original array. This is one of the situation where the slice method is perfect for creating a new array rather than the spread operator because we are in the middle of a chain. note that here, we are sorting in asccending order

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal"; //Here I used a conditional to determine if this is a withrawal or deposit. I made this a variable because I will have to apply it in two places in the html file. see below and check out for '$' and curly braces '{}'
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov} €</div>
  </div>`; // Here I copied a html file from the original html, and manipulated the class and text file using template literals.
    containerMovements.insertAdjacentHTML("afterbegin", html);
    // To put the values into the html file container (in this case ), I will use a method called insert adjacentHTML. the insertAdjacent.html accepts two arguments. The positon and the actual value. The position could be after begining, which will place the latest data at the top/begining of the container. ther is beforeend position. which will place the newest data/value before the end of the container. there is also before begin, which will place the newest data before the beginining of the container. there is also afterend, which will place the newest data after the end of the container.
  });
};

displayMovements(account1.movements);

//JUST TO SHOW THE DIFFERENCE BETWEEN INNERHTML AND TEXTCONTENT CHECK THE CONSOLE.
console.log(containerMovements.innerHTML);
console.log(containerMovements.textContent);

// CALCULATING AND SHOWING BALANCE

const balance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

balance(account1);

// CALCULATING AND DISPLAYING SUMMARY

const calcDisplaySummary = function (acc) {
  // INCOME
  const incomes = acc.movements
    .filter((incom) => incom > 0)
    .reduce((acc, inc) => acc + inc, 0);
  labelSumIn.textContent = `${incomes}€`;
  // OUT
  const out = acc.movements
    .filter((wdl) => wdl < 0)
    .reduce((acc, widl) => acc + widl, 0);
  labelSumOut.textContent = `${Math.abs(out)}€ `;
  // INTEREST = 1.2% OF TOTAL AMOUNT for only interests that are up to 1 euro
  const interestRate = acc.interestRate / 100;
  const interest = acc.movements
    .filter((incom) => incom > 0)
    .map((int) => int * interestRate)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

// calcDisplaySummary(account.);

console.log(accounts[0]);

// This updates balance movements and summary
const updateUIAndMovements = function (acc) {
  // DISPLAY MOVEMENTS
  displayMovements(acc.movements);
  // DISPLAY BALANCE
  balance(acc);

  // DISPLAY SUMMARY
  calcDisplaySummary(acc);
};
// IMPLEMENTING THE LOGIN FEATURE OF THE APP.
let currentAccount; //creating current account variable.

// EVENT LISTENERS
btnLogin.addEventListener("click", function (e) {
  // Under normal circumstance, when you click on a button in a html form, it either reload the page or submit. to illustruste this, try adding an event listener to a button, then try printing something to the console, which will happen after clicking the button where the event listener was attached. This makes what is printed show as as a flash like in the case of submiting or reloading. but we want this to be steady. we need to make whats printed on the console to be steady.  this is done by inputing an argument which will represent all event (remember that methods have access to properties of an object or what they are called only if they are passed as arduements) and using the preventDefault method. This will prevent all natrual properties of the button.
  e.preventDefault();
  // console.log(`login`); // I used this to show the flashing when you click on form buttons withour preventing default.
  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginusername.value.toUpperCase();
  });

  console.log(currentAccount);

  if ((currentAccount.pin = Number(inputLoginpin.value))) {
    // I needed to convert input to number. remeber they come as numbers

    // Display the UI and print the welcome meassage
    labelWelcome.textContent = `welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;

    // CLEARING DETAIL FIELDS
    inputLoginusername.value = inputLoginpin.value = ""; // using equalto sign all through here will work because = or assignment operator works from right to left.

    inputLoginpin.blur(); // This will make the cusor that blinks inside an input space not to be visible after logging in.

    inputLoginusername.blur();

    // THE DISPLAY MOVEMENTS, DISPLAY MOVEMENTS, DISPLAY BALANCE WILL BE REPEATED IN THE TRANSFER SECTION SO LET ME PUT ALL FUNCTIONS INTO A FUNCTION.
    //   // DISPLAY MOVEMENTS
    //   displayMovements(currentAccount.movements);
    //   // DISPLAY BALANCE
    //   balance(currentAccount);

    //   // DISPLAY SUMMARY
    //   calcDisplaySummary(currentAccount);
    updateUIAndMovements(currentAccount);
  }
});

// TRANSFER SECTION
btnTranfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value.toUpperCase()
  );

  // IN the if statement below, I am saying that for a transfer to work, the amount inputed shoule be > than 0 , the reciever account must exist (Yes even though that the reciver account was retruned using find, it must be inputed into the if statement because the trasfer occurs within the if statement.), the amount must be less or equlat to the current person's account balance. and then the username must be different from the current account to avoid seding yourself money.

  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    recieverAccount &&
    amount <= currentAccount.balance &&
    recieverAccount?.username !== currentAccount.username
  ) {
    // Doung the Transfer.
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);
  }

  // UPDATING UI
  updateUIAndMovements(currentAccount);
});

// ASSUMING THE BANK SAYS THEY WILL ONLY GRANT LOAN ONLY IF THER IS AT LEAST A SINGLE DEPOSIT OF THE LOAN AMOUNT.

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amountRequested = Number(inputLoanAmount.value);
  if (
    amountRequested > 0 &&
    currentAccount.movements.some((movs) => movs >= amountRequested * 0.1)
  ) {
    // Add to Movement
    currentAccount.movements.push(amountRequested);
  }

  // update the UI
  updateUIAndMovements(currentAccount);
  inputLoanAmount.value = "";
});
// CLOSING AN ACCOUNT
// to close an acount, we need to use the splice method to remove that particular account from the accounts array and to use the SPLICE method, you need the account index and specify how many accounts you want to remove from the array. the index of a particular account can be found using the FINDINDEX method.

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value.toUpperCase() &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    // remember that splice takes the index as the first arguement and then how many values it will remove. also remember that splice best fits this condition because it mutates the original array. eg splice(index, number of values to remove.)

    // Longer process of doing the job

    const index = accounts.findIndex(
      (acc) => (acc.username = currentAccount.username)
    );
    // findindex is similar to indexof but indexof returns index based on value. while findindex return index based on conditions.

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  // Making Username and pin inactive after clicking on the close button
  inputClosePin.value = inputCloseUsername.value = "";
});

// Event Listener for Sort.
let sorted = false; // this is to preserve the state of the sort argument as false. this will make to possible for the trasaction detail area or the display movement area as the case may be to return to its original state when the sorted button is clicked the second time.

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  // Here, I simply set the sort argument to true using the ! sign on the the sorted variable which was originally false. You also remember that the sort arguement is also false where the display movements functions was declared.
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted; // here, I am basically reversing the sorted to false. this simply changes sorted from for to true and true to force.
});

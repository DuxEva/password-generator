"use strict";

const upperCase = document.getElementById("uppercase");
const lowerCase = document.getElementById("lowercase");
const numbers = document.getElementById("number");
const symbols = document.getElementById("symbol");
const length = document.getElementById("length");
const generateBtn = document.querySelector(".generate-password-btn");
const password = document.getElementById("password");
const strongStrength = document.querySelectorAll(".strenght-quality");
const strenghtMsg = document.querySelector(".strength-display");
const copyBtn = document.getElementById("copy");
const copyConfirmation = document.getElementById("copied");
const icons = document.querySelectorAll(".icon");

copyBtn.addEventListener("click", () => {
  password.select();
  if (password.value === "") {
    alert("Please generate a password first.");
    return;
  }
  navigator.clipboard.writeText(password.value);
  copyConfirmation.style.display = "block";
  setTimeout(() => {
    copyConfirmation.style.display = "none";
    copyConfirmation.style.transition = "all 0.5s ease-in-out";
  }, 1500);
});

const inputRange = document.getElementById("inputRange");
const activeColor = "#A4FFAF";
const inactiveColor = "#18171f";
let count = 0;

inputRange.addEventListener("input", function () {
  const ratio = ((this.value - this.min) / (this.max - this.min)) * 100;
  inputRange.value = this.value;
  length.value = this.value;
  this.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
});

const characterTypes = [upperCase, lowerCase, numbers, symbols];

characterTypes.forEach((type) => {
  type.addEventListener("click", () => {
    type.classList.toggle("active");
    // show the image icon when the button is active
    type.classList.contains("active")
      ? (type.children[0].style.display = "block")
      : (type.children[0].style.display = "none");
  });
});

generateBtn.addEventListener("click", () => {
  const hasUpperCase = upperCase.classList.contains("active");
  const hasLowerCase = lowerCase.classList.contains("active");
  const hasNumbers = numbers.classList.contains("active");
  const hasSymbols = symbols.classList.contains("active");
  length.value = inputRange.value;
  const lengthValue = +length.value;

  password.value = generatePassword(
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSymbols,
    lengthValue
  );

  if (length.value > 0) checkCharacterTypes(password.value);
});

// Function to generate random characters in a string based on the index
const randomCharactres = (str) =>
  str.charAt(Math.floor(Math.random() * str.length));

// Object containing functions to generate random characters
const randomCharactresObject = {
  upper: () => randomCharactres("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
  lower: () => randomCharactres("abcdefghijklmnopqrstuvwxyz"),
  number: () => Math.floor(Math.random() * 10).toString(),
  symbol: () => randomCharactres("!@#$%^&*()_-+=[]{}|;:,.<>?"),
};

function generatePassword(upper, lower, number, symbol, length) {
  let generatedPassword = "";
  const typesArr = [];
  if (upper) typesArr.push({ upper });
  if (lower) typesArr.push({ lower });
  if (number) typesArr.push({ number });
  if (symbol) typesArr.push({ symbol });

  if (typesArr.length === 0 || length <= 0) {
    alert("Please select at least one option and specify a valid length.");
  }

  for (let i = 0; i < length; i++) {
    const randomType = typesArr[Math.floor(Math.random() * typesArr.length)];
    generatedPassword += randomCharactresObject[Object.keys(randomType)[0]]();
  }

  return generatedPassword;
}

const checkCharacterTypes = (password) => {
  let hasUpperCase = false,
    hasLowerCase = false,
    hasNumbers = false,
    hasSymbols = false;

  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_-+=[]{}|;:,.<>?";

  for (let char of password) {
    upperCaseChars.includes(char)
      ? (hasUpperCase = true)
      : lowerCaseChars.includes(char)
      ? (hasLowerCase = true)
      : numberChars.includes(char)
      ? (hasNumbers = true)
      : symbolChars.includes(char)
      ? (hasSymbols = true)
      : null;
  }

  strongStrength.forEach((strength) => {
    strength.classList.remove("strenght-strong");
    strength.classList.remove("strenght-medium");
    strength.classList.remove("strenght-weak");
    strength.classList.remove("strenght-too-weak");
  });

  count = 0;

  if (hasUpperCase) count++;
  if (hasLowerCase) count++;
  if (hasNumbers) count++;
  if (hasSymbols) count++;

  if (count === 4) {
    Array.from(strongStrength).forEach((strength) => {
      strength.classList.add("strenght-strong");
      strenghtMsg.textContent = "Strong";
    });
  } else if (count === 3) {
    Array.from(strongStrength)
      .slice(0, 3)
      .forEach((strength) => {
        strength.classList.add("strenght-medium");
        strenghtMsg.textContent = "Medium";
      });
  } else if (count === 2) {
    Array.from(strongStrength)
      .slice(0, 2)
      .forEach((strength) => {
        strength.classList.add("strenght-weak");
        strenghtMsg.textContent = "Weak";
      });
  } else {
    strongStrength[0].classList.add("strenght-too-weak");
    strenghtMsg.textContent = "Too Weak";
  }
};

"use strict";

class PasswordGenerator {
  constructor() {
    this.upperCase = document.getElementById("uppercase");
    this.lowerCase = document.getElementById("lowercase");
    this.numbers = document.getElementById("number");
    this.symbols = document.getElementById("symbol");
    this.length = document.getElementById("length");
    this.generateBtn = document.querySelector(".generate-password-btn");
    this.password = document.getElementById("password");
    this.strongStrength = document.querySelectorAll(".strenght-quality");
    this.strenghtMsg = document.querySelector(".strength-display");
    this.copyBtn = document.getElementById("copy");
    this.copyConfirmation = document.getElementById("copied");
    this.icons = document.querySelectorAll(".icon");
    this.inputRange = document.getElementById("inputRange");
    this.activeColor = "#A4FFAF";
    this.inactiveColor = "#18171f";
    this.count = 0;

    this.characterTypes = [
      this.upperCase,
      this.lowerCase,
      this.numbers,
      this.symbols,
    ];

    this.init();
  }

  init() {
    this.copyBtn.addEventListener("click", this.copyPassword.bind(this));
    this.inputRange.addEventListener("input", this.updateInputRange.bind(this));
    this.characterTypes.forEach((type) => {
      type.addEventListener("click", this.toggleCharacterType.bind(this, type));
    });
    this.generateBtn.addEventListener(
      "click",
      this.generatePassword.bind(this)
    );
  }

  copyPassword() {
    this.password.select();
    if (this.password.value === "") {
      alert("Please generate a password first.");
      return;
    }
    navigator.clipboard.writeText(this.password.value);
    this.copyConfirmation.style.display = "block";
    setTimeout(() => {
      this.copyConfirmation.style.display = "none";
      this.copyConfirmation.style.transition = "all 0.5s ease-in-out";
    }, 1500);
  }

  updateInputRange(event) {
    const ratio =
      ((event.target.value - event.target.min) /
        (event.target.max - event.target.min)) *
      100;
    this.inputRange.value = event.target.value;
    this.length.value = event.target.value;
    event.target.style.background = `linear-gradient(90deg, ${this.activeColor} ${ratio}%, ${this.inactiveColor} ${ratio}%)`;
  }

  toggleCharacterType(type) {
    type.classList.toggle("active");
    type.classList.contains("active")
      ? (type.children[0].style.display = "block")
      : (type.children[0].style.display = "none");
  }

  generatePassword() {
    const hasUpperCase = this.upperCase.classList.contains("active");
    const hasLowerCase = this.lowerCase.classList.contains("active");
    const hasNumbers = this.numbers.classList.contains("active");
    const hasSymbols = this.symbols.classList.contains("active");
    const lengthValue = +this.length.value;

    const password = this.createPassword(
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSymbols,
      lengthValue
    );

    this.password.value = password;
    if (lengthValue > 0) this.checkCharacterTypes(password);
  }

  createPassword(upper, lower, number, symbol, length) {
    let generatedPassword = "";
    const typesArr = [];
    if (upper) typesArr.push({ upper });
    if (lower) typesArr.push({ lower });
    if (number) typesArr.push({ number });
    if (symbol) typesArr.push({ symbol });

    if (typesArr.length === 0 || length <= 0) {
      alert("Please select at least one option and specify a valid length.");
      return "";
    }

    for (let i = 0; i < length; i++) {
      const randomType = typesArr[Math.floor(Math.random() * typesArr.length)];
      generatedPassword +=
        this.randomCharactresObject[Object.keys(randomType)[0]]();
    }

    return generatedPassword;
  }

  get randomCharactresObject() {
    return {
      upper: () => this.randomCharactres("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
      lower: () => this.randomCharactres("abcdefghijklmnopqrstuvwxyz"),
      number: () => Math.floor(Math.random() * 10).toString(),
      symbol: () => this.randomCharactres("!@#$%^&*()_-+=[]{}|;:,.<>?"),
    };
  }

  randomCharactres(str) {
    return str.charAt(Math.floor(Math.random() * str.length));
  }

  checkCharacterTypes(password) {
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

    this.strongStrength.forEach((strength) => {
      strength.classList.remove("strenght-strong");
      strength.classList.remove("strenght-medium");
      strength.classList.remove("strenght-weak");
      strength.classList.remove("strenght-too-weak");
    });

    this.count = 0;

    if (hasUpperCase) this.count++;
    if (hasLowerCase) this.count++;
    if (hasNumbers) this.count++;
    if (hasSymbols) this.count++;

    if (this.count === 4) {
      Array.from(this.strongStrength).forEach((strength) => {
        strength.classList.add("strenght-strong");
        this.strenghtMsg.textContent = "Strong";
      });
    } else if (this.count === 3) {
      Array.from(this.strongStrength)
        .slice(0, 3)
        .forEach((strength) => {
          strength.classList.add("strenght-medium");
          this.strenghtMsg.textContent = "Medium";
        });
    } else if (this.count === 2) {
      Array.from(this.strongStrength)
        .slice(0, 2)
        .forEach((strength) => {
          strength.classList.add("strenght-weak");
          this.strenghtMsg.textContent = "Weak";
        });
    } else {
      this.strongStrength[0].classList.add("strenght-too-weak");
      this.strenghtMsg.textContent = "Too Weak";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PasswordGenerator();
});

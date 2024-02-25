"use strict";

// Set variables
const checkboxes = document.querySelectorAll("input[type='checkbox']");
const rangeInput = document.querySelector("#passlengthrange");
const numberInput = document.querySelector("#passlengthnumber");
const genpass = document.querySelector("#genpass");
const generate = document.querySelector("#generate");
const copy = document.querySelector("#copy");

const lowerCharacters = "abcdefghijklmnopqrstuvwxyz";
const upperCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-=_+";

function syncValues() {
  // This function syncs the values of the number input and the range input
  numberInput.value = rangeInput.value;
  genpass.value = numberInput.value;
}

// Gets a specific number of random characters from the selected string and returns them
function getRandomChars(chars, count) {
  let result = "";
  for (let i = 0; i < count; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Shuffles the string by converting it to an array of characters and then converts the array back to a string and returns it
function shuffleString(str) {
  let array = str.split("");
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap the characters at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join("");
}

addEventListener("DOMContentLoaded", () => {
  // Initial values
  rangeInput.value = 10;
  syncValues();
  generatePassword(checkboxes);
});

rangeInput.addEventListener("input", () => {
  numberInput.value = rangeInput.value;
  generatePassword(checkboxes);
});

numberInput.addEventListener("input", () => {
  rangeInput.value = numberInput.value;
  generatePassword(checkboxes);
});

copy.addEventListener("click", () => {
  const notification = document.querySelector(".notification");

  // Password is copied to the clipboard
  const copiedPassword = navigator.clipboard.writeText(genpass.value);

  // Checks if password was copied successfully or not
  if (copiedPassword) {
    notification.classList.add("notification-message-success");
    notification.textContent = "Password was copied successfully";
    // Removes success message after 800 milliseconds
    setTimeout(() => {
      notification.classList.remove("notification-message-success");
    }, 800);
  } else {
    notification.classList.add("notification-message-failure");
    notification.textContent = "Password wasn't copied";
    setTimeout(() => {
      // Removes failure message after 800 milliseconds
      notification.classList.remove("notification-message-failure");
    }, 800);
  }
});

generate.addEventListener("click", () => {
  generatePassword(checkboxes);
});

// Event listeners for all the checkboxes

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", function (e) {
    const isAtLeastOneChecked = [...checkboxes].some(
      (checkbox) => checkbox.checked
    );
    // At least one checkbox has to be checked for a password to be generated
    if (!isAtLeastOneChecked) {
      e.preventDefault();
    } else {
      generatePassword(checkboxes);
    }
  });
});

function generatePassword(checkboxes) {
  const checkedCheckboxes = document.querySelectorAll(
    "input[type='checkbox']:checked"
  );
  const passLength = +numberInput.value;

  // Calculates how many characters per checked checkbox are going to be used in the password
  const charsPerCheckedCheckbox = Math.floor(
    passLength / checkedCheckboxes.length
  );

  // Calculates the remaining characters using modulo
  const remainingChars = passLength % checkedCheckboxes.length;

  let chars = "",
    password = "";

  // For every checkbox that is checked random characters are picked and added to the chars variable
  checkedCheckboxes.forEach((checkbox) => {
    if (checkbox.id === "lowercase") {
      chars += getRandomChars(lowerCharacters, charsPerCheckedCheckbox);
    }
    if (checkbox.id === "uppercase") {
      chars += getRandomChars(upperCharacters, charsPerCheckedCheckbox);
    }
    if (checkbox.id === "numberchars") {
      chars += getRandomChars(numberCharacters, charsPerCheckedCheckbox);
    }
    if (checkbox.id === "specialchars") {
      chars += getRandomChars(symbolCharacters, charsPerCheckedCheckbox);
    }
  });

  /* 
  If the remaining characters are more than zero some random characters 
  from the previously selected ones are being picked and appended 
  at the end of variable chars. Then the password is shuffled.
  If not the password is only shuffled.
  */
  if (remainingChars > 0) {
    for (let i = 0; i < remainingChars; i++) {
      chars += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    password = shuffleString(chars);
  } else {
    password = shuffleString(chars);
  }

  genpass.value = password;
}

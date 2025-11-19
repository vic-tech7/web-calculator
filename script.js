const display = document.getElementById("display");

function appendToDisplay(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    const result = Function('"use strict"; return (' + display.value + ')')();
    display.value = result;
  } catch (error) {
    display.value = "bruhh, syntax Error";
    setTimeout(() => { display.value = ""; }, 1500); // auto-clear after error
  }
}

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9+\-*/.=]$/.test(key)) {
    appendToDisplay(key === '*' ? '*' : key === '-' ? '-' : key);
  } else if (key === "Enter") {
    event.preventDefault();
    calculate();
  } else if (key === "Escape") {
    clearDisplay();
  } else if (key === "Backspace") {
    event.preventDefault();
    deleteLast();
  }
});

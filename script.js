let display = document.getElementById("display");
let currentInput = "";

function appendToDisplay(value) {
  currentInput += value;
  display.value = currentInput;
}

function clearDisplay() {
  currentInput = "";
  display.value = "";
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  display.value = currentInput;
}

function calculate() {
  if (currentInput === "") return;
  try {
    let expression = currentInput
      .replace(/π/g, Math.PI)
      .replace(/e/g, Math.E)
      .replace(/×/g, "*")
      .replace(/\^/g, "**");

    let result = eval(expression);
    result = parseFloat(result.toFixed(10));

    currentInput = result.toString();
    display.value = currentInput;

  } catch {
    display.value = "Error";
    currentInput = "";
  }
}

function calculateAdvanced(type) {

  let value = parseFloat(currentInput);

  if (isNaN(value)) return;

  if (type === "sqrt") currentInput = Math.sqrt(value);
  if (type === "square") currentInput = Math.pow(value, 2);
  if (type === "sin") currentInput = Math.sin(value);
  if (type === "cos") currentInput = Math.cos(value);
  if (type === "tan") currentInput = Math.tan(value);
  if (type === "log") currentInput = Math.log10(value);
  if (type === "inv") currentInput = 1 / value;
  if (type === "exp") currentInput = Math.exp(value);
  if (type === "x^2") currentInput = Math.pow(value, 2);
  if (type === "cuberoot") currentInput = Math.cbrt(value);
  if (type === "rand") currentInput = Math.random();
  if (type === "fact") currentInput = factorial(value);
  if (type === "pi") currentInput = Math.PI;
  if (type === "e") currentInput = Math.E;
  if (type === "percent") currentInput = value / 100;

  display.value = currentInput;

}

function factorial(n) {

  if (n < 0) return NaN;
  if (n === 0) return 1;

  let result = 1;

  for (let i = 1; i <= n; i++) result *= i;

  return result;

}

function changeBackground() {

  const images = [
    "https://source.unsplash.com/1600x900/?abstract",
    "https://source.unsplash.com/1600x900/?space",
    "https://source.unsplash.com/1600x900/?technology",
    "https://source.unsplash.com/1600x900/?cyberpunk",
    "https://source.unsplash.com/1600x900/?geometry"
  ];

  const img = images[Math.floor(Math.random() * images.length)];

  document.body.style.backgroundImage = `url(${img})`;
  document.body.style.backgroundSize = "cover";

}

function generateShareLink() {

  const text = encodeURIComponent(currentInput);

  const url = window.location.origin + "?calc=" + text;

  navigator.clipboard.writeText(url);

  alert("Share link copied!");

}

window.onload = function () {

  const params = new URLSearchParams(window.location.search);

  if (params.has("calc")) {
    currentInput = params.get("calc");
    display.value = currentInput;
  }

};

function openProgrammerMode() {

  const num = parseInt(currentInput);

  if (isNaN(num)) return alert("Enter a number first");

  document.getElementById("programmer-overlay").style.display = "flex";

  convertBases();

}

function closeProgrammerMode() {

  document.getElementById("programmer-overlay").style.display = "none";

}

function convertBases() {

  const decInput = document.getElementById("dec-input");
  const binOutput = document.getElementById("bin-output");
  const hexOutput = document.getElementById("hex-output");

  const value = parseInt(decInput.value);

  if (!isNaN(value)) {

    binOutput.textContent = value.toString(2);
    hexOutput.textContent = "0x" + value.toString(16).toUpperCase();

  } else {

    binOutput.textContent = "0";
    hexOutput.textContent = "0x0";

  }

}

function openUnitConverter() {

  document.getElementById("unit-converter-overlay").style.display = "flex";

}

function closeUnitConverter() {

  document.getElementById("unit-converter-overlay").style.display = "none";

}

function openAISecurityAssistant() {

  document.getElementById("ai-chat-overlay").style.display = "flex";

}

function closeAIChat() {

  document.getElementById("ai-chat-overlay").style.display = "none";

}

function sendAIQuery() {

  const input = document.getElementById("ai-user-input");
  const messages = document.getElementById("ai-chat-messages");

  let msg = input.value.trim();

  if (!msg) return;

  let user = document.createElement("div");
  user.innerHTML = "<b>You:</b> " + msg;

  messages.appendChild(user);

  input.value = "";

  fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: msg
    })
  })
    .then(r => r.json())
    .then(data => {

      let ai = document.createElement("div");
      ai.innerHTML = "<b>VEC AI:</b> " + data.reply;

      messages.appendChild(ai);

      messages.scrollTop = messages.scrollHeight;

    })
    .catch(() => {

      let err = document.createElement("div");
      err.innerHTML = "<b>VEC AI:</b> Connection error.";

      messages.appendChild(err);

    });

}

function toggleHistoryPanel() {

  const panel = document.getElementById("history-panel");

  panel.classList.toggle("open");

}

window.appendToDisplay = appendToDisplay;
window.clearDisplay = clearDisplay;
window.deleteLast = deleteLast;
window.calculate = calculate;
window.calculateAdvanced = calculateAdvanced;
window.changeBackground = changeBackground;
window.generateShareLink = generateShareLink;
window.openProgrammerMode = openProgrammerMode;
window.closeProgrammerMode = closeProgrammerMode;
window.openUnitConverter = openUnitConverter;
window.closeUnitConverter = closeUnitConverter;
window.openAISecurityAssistant = openAISecurityAssistant;
window.closeAIChat = closeAIChat;
window.sendAIQuery = sendAIQuery;
window.toggleHistoryPanel = toggleHistoryPanel;
window.convertBases = convertBases;
let display = document.getElementById("display");
let currentInput = "";

/* ---------------- CALCULATOR ---------------- */

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
  if (!currentInput) return;

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

    saveHistory(expression, result);

  } catch {
    display.value = "Error";
    currentInput = "";
  }
}

function calculateAdvanced(type) {
  let value = parseFloat(currentInput);
  if (isNaN(value)) return;

  switch (type) {
    case "sqrt": currentInput = Math.sqrt(value); break;
    case "square": currentInput = Math.pow(value, 2); break;
    case "sin": currentInput = Math.sin(value); break;
    case "cos": currentInput = Math.cos(value); break;
    case "tan": currentInput = Math.tan(value); break;
    case "log": currentInput = Math.log10(value); break;
    case "fact": currentInput = factorial(value); break;
    case "pi": currentInput = Math.PI; break;
    case "e": currentInput = Math.E; break;
    case "percent": currentInput = value / 100; break;
  }

  display.value = currentInput;
}

function factorial(n) {
  if (n < 0) return NaN;
  let result = 1;
  for (let i = 1; i <= n; i++) result *= i;
  return result;
}

/* ---------------- HISTORY ---------------- */

let history = [];

function saveHistory(exp, result) {
  history.unshift({ exp, result });
  updateHistoryUI();
}

function updateHistoryUI() {
  const list = document.getElementById("history-list");
  list.innerHTML = "";

  history.forEach(item => {
    list.innerHTML += `
      <li>
        <div class="history-expression">${item.exp}</div>
        <div class="history-result">${item.result}</div>
      </li>
    `;
  });
}

function clearHistoryUI() {
  history = [];
  updateHistoryUI();
}

function toggleHistoryPanel() {
  document.getElementById("history-panel").classList.toggle("open");
}

/* ---------------- BACKGROUND ---------------- */

function changeBackground() {
  const images = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
  ];

  const img = images[Math.floor(Math.random() * images.length)];
  document.body.style.backgroundImage = `url(${img})`;
}

/* ---------------- SHARE ---------------- */

function generateShareLink() {
  navigator.clipboard.writeText(window.location.href);
  alert("Link copied!");
}

/* ---------------- PROGRAMMER MODE ---------------- */

function openProgrammerMode() {
  document.getElementById("programmer-overlay").style.display = "flex";
}

function closeProgrammerMode() {
  document.getElementById("programmer-overlay").style.display = "none";
}

function convertBases() {
  const value = parseInt(document.getElementById("dec-input").value);

  document.getElementById("bin-output").textContent =
    isNaN(value) ? "0" : value.toString(2);

  document.getElementById("hex-output").textContent =
    isNaN(value) ? "0x0" : "0x" + value.toString(16).toUpperCase();
}

/* ---------------- UNIT CONVERTER ---------------- */

function openUnitConverter() {
  document.getElementById("unit-converter-overlay").style.display = "flex";
}

function closeUnitConverter() {
  document.getElementById("unit-converter-overlay").style.display = "none";
}

/* ---------------- AI ---------------- */

function openAISecurityAssistant() {
  document.getElementById("ai-chat-overlay").style.display = "flex";
}

function closeAIChat() {
  document.getElementById("ai-chat-overlay").style.display = "none";
}

async function sendAIQuery() {
  const input = document.getElementById("ai-user-input");
  const messages = document.getElementById("ai-chat-messages");

  const prompt = input.value.trim();
  if (!prompt) return;

  messages.innerHTML += `<div><b>You:</b> ${prompt}</div>`;
  input.value = "";

  const loading = document.createElement("div");
  loading.innerHTML = "<b>VEC AI:</b> Thinking...";
  messages.appendChild(loading);

  try {
    const response = await fetch(
      `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
    );

    const reply = await response.text();
    loading.innerHTML = `<b>VEC AI:</b> ${reply}`;
  } catch {
    loading.innerHTML = `<b>VEC AI:</b> Connection error`;
  }
}

/* ---------------- IMAGE GENERATION ---------------- */

function generateImage() {
  const prompt = document.getElementById("ai-user-input").value.trim();
  if (!prompt) return;

  const messages = document.getElementById("ai-chat-messages");

  const url =
    "https://image.pollinations.ai/prompt/" +
    encodeURIComponent(prompt);

  messages.innerHTML += `
    <div>
      <b>Generated Image:</b><br>
      <img src="${url}" style="max-width:100%;border-radius:12px;margin-top:10px;">
    </div>
  `;
}

function editImage() {
  const prompt = document.getElementById("ai-user-input").value.trim();
  if (!prompt) return;

  const messages = document.getElementById("ai-chat-messages");

  const url =
    "https://image.pollinations.ai/prompt/" +
    encodeURIComponent("edit image " + prompt);

  messages.innerHTML += `
    <div>
      <b>Edited Image:</b><br>
      <img src="${url}" style="max-width:100%;border-radius:12px;">
    </div>
  `;
}

function clearAIChat() {
  document.getElementById("ai-chat-messages").innerHTML = "";
}

function insertPrompt(text) {
  document.getElementById("ai-user-input").value = text;
}

/* ---------------- CONTACT PAGE ---------------- */

function openContactPage() {
  alert(
`CONTACT CHAD FDEV

WhatsApp:
+34604157842

Email:
vectordevtech@gmail.com

GitHub:
https://github.com/vic-tech7`
  );
}

/* ---------------- DRAG AI WINDOW ---------------- */

dragElement(document.querySelector("#ai-chat-overlay .overlay-content"));

function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();

    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onmouseup = closeDrag;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();

    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;

    pos3 = e.clientX;
    pos4 = e.clientY;

    elmnt.style.position = "absolute";
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDrag() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
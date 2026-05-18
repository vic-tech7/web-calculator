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
    document.getElementById("ai-chat-overlay").classList.add("show");
}

function closeAIChat() {
    document.getElementById("ai-chat-overlay").classList.remove("show");
}

const aiBox = document.getElementById("ai-box");
const dragBar = document.getElementById("drag-bar");

let isDragging = false;
let offsetX, offsetY;

dragBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - aiBox.offsetLeft;
    offsetY = e.clientY - aiBox.offsetTop;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    aiBox.style.position = "fixed";
    aiBox.style.left = (e.clientX - offsetX) + "px";
    aiBox.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

async function sendAIQuery() {
    const input = document.getElementById("ai-user-input");
    const messages = document.getElementById("ai-chat-messages");

    const prompt = input.value.trim();
    if (!prompt) return;

    messages.innerHTML += `
        <div class="user-message">${prompt}</div>
    `;

    input.value = "";

    const loading = document.createElement("div");
    loading.className = "ai-message";
    loading.innerHTML = "Thinking...";
    messages.appendChild(loading);

    try {
        const response = await fetch(
            `https://text.pollinations.ai/${encodeURIComponent(prompt)}`
        );

        const reply = await response.text();
        loading.innerHTML = reply;

    } catch {
        loading.innerHTML = "Connection error";
    }

    messages.scrollTop = messages.scrollHeight;
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

function openCybertic() {
    document.getElementById("cybertic-overlay").style.display = "flex";
}

function closeCybertic() {
    document.getElementById("cybertic-overlay").style.display = "none";
}

window.openCybertic = openCybertic;
window.closeCybertic = closeCybertic;

function encodeBase64() {
    let input = document.getElementById("cyber-input").value;
    document.getElementById("cyber-output").innerText = btoa(input);
}

function decodeBase64() {
    let input = document.getElementById("cyber-input").value;
    document.getElementById("cyber-output").innerText = atob(input);
}

function urlEncode() {
    let input = document.getElementById("cyber-input").value;
    document.getElementById("cyber-output").innerText =
        encodeURIComponent(input);
}

function generatePassword() {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";

    for (let i = 0; i < 16; i++) {
        password += chars.charAt(
            Math.floor(Math.random() * chars.length)
        );
    }

    document.getElementById("cyber-output").innerText = password;
}

async function generateHash() {
    let input = document.getElementById("cyber-input").value;

    const msgBuffer = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b =>
        b.toString(16).padStart(2, "0")
    ).join("");

    document.getElementById("cyber-output").innerText = hashHex;
}

function getCyberInput() {
    return document.getElementById("cyber-input").value;
}

function setCyberOutput(text) {
    document.getElementById("cyber-output").innerText = text;
}

function reverseText() {
    setCyberOutput(
        getCyberInput().split("").reverse().join("")
    );
}

function textToBinary() {
    const text = getCyberInput();

    const binary = text
        .split("")
        .map(char => char.charCodeAt(0).toString(2))
        .join(" ");

    setCyberOutput(binary);
}

function binaryToText() {
    try {
        const text = getCyberInput()
            .split(" ")
            .map(bin => String.fromCharCode(parseInt(bin, 2)))
            .join("");

        setCyberOutput(text);
    } catch {
        setCyberOutput("Invalid binary");
    }
}

function generateUUID() {
    const uuid = crypto.randomUUID();
    setCyberOutput(uuid);
}

function randomNumber() {
    const num = Math.floor(Math.random() * 1000000);
    setCyberOutput(num.toString());
}

function countWords() {
    const words = getCyberInput()
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

    setCyberOutput("Words: " + words);
}

function removeSpaces() {
    setCyberOutput(
        getCyberInput().replace(/\s+/g, "")
    );
}

function jsonFormatter() {
    try {
        const formatted = JSON.stringify(
            JSON.parse(getCyberInput()),
            null,
            4
        );

        setCyberOutput(formatted);
    } catch {
        setCyberOutput("Invalid JSON");
    }
}

function copyOutput() {
    const output =
        document.getElementById("cyber-output").innerText;

    navigator.clipboard.writeText(output);
    alert("Copied!");
}

function clearCyber() {
    document.getElementById("cyber-input").value = "";
    document.getElementById("cyber-output").innerText = "";
}
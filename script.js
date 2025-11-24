let display = document.getElementById('display');
let currentInput = '';
const clickSound = document.getElementById('click-sound');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const angleModeDisplay = document.getElementById('angle-mode');
const allButtons = document.querySelectorAll('.scientific-grid button');
const programmerOverlay = document.getElementById('programmer-overlay');
const decInput = document.getElementById('dec-input');
const unitConverterOverlay = document.getElementById('unit-converter-overlay');
const inputValue = document.getElementById('input-value');
const inputUnit = document.getElementById('input-unit');
const outputMeters = document.getElementById('output-meters');
const outputFeet = document.getElementById('output-feet');
const outputKilometers = document.getElementById('output-kilometers');
const outputMiles = document.getElementById('output-miles');

let memoryRegister = 0;
let angleMode = 'RAD';

const toggleSwitch = document.getElementById('checkbox');
if (toggleSwitch) {
    toggleSwitch.addEventListener('change', switchTheme);
    const isDark = localStorage.getItem('theme') === 'dark';
    document.body.classList.toggle('light-theme', !isDark);
    toggleSwitch.checked = isDark;
}

loadStateFromURL();
if (currentInput === '') {
    loadHistory();
}

updateAngleModeDisplay();
updateButtonHighlights();

document.addEventListener('click', function(event) {
    const isHistoryButton = document.getElementById('menu-button').contains(event.target);
    const inHistoryPanel = historyPanel.contains(event.target);
    if (historyPanel.classList.contains('open') && !isHistoryButton && !inHistoryPanel) {
        historyPanel.classList.remove('open');
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if(programmerOverlay.style.display === 'flex') {
            closeProgrammerMode();
        } else if (unitConverterOverlay.style.display === 'flex') {
            closeUnitConverter();
        } else {
             if(currentInput !== '') clearDisplay();
        }
    }    

    if(programmerOverlay.style.display === 'flex' || unitConverterOverlay.style.display === 'flex') {
        if(event.key === 'Enter') {
             if(programmerOverlay.style.display === 'flex') convertBases();
             else if (unitConverterOverlay.style.display === 'flex') convertUnits();
        }
        return; 
    }    

    const key = event.key;
    const shift = event.shiftKey;
    if (/[0-9\.\(\)]/.test(key)) {
        appendToDisplay(key);
    } else if (key === '+' || key === '-') {
        appendToDisplay(key);
    } else if (key === '*') {
        appendToDisplay('×');
    } else if (key === '/') {
        appendToDisplay('/');
        event.preventDefault(); 
    } else if (key === 'Enter' || key === '=') {
        calculate();
        event.preventDefault(); 
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (!shift && key === '!') {
        calculateAdvanced('fact');
    } else if (!shift && key === '^') {
        appendToDisplay('^'); 
    } else if (!shift && key === '%') {
        calculateAdvanced('percent');
    }
});

function appendToDisplay(value) {
    if (display.value === 'Error') {
        clearDisplay();
    }
    currentInput += value;
    display.value = currentInput;
    playClickSound();
    updateButtonHighlights();
}

function clearDisplay() {
    currentInput = '';
    display.value = '';
    playClickSound();
    updateButtonHighlights();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
    playClickSound();
    updateButtonHighlights();
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function factorial(n) {
    if (n < 0 || n % 1 !== 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function parseAndExecuteExpression(expression) {
    let safeExpression = expression
        .replace(/π/g, Math.PI)
        .replace(/e/g, Math.E)
        .replace(/×/g, '*')
        .replace(/–/g, '-')
        .replace(/\^/g, '**');

    if (!/^[0-9\.\+\-\*\/\(\)\s\**]+$/.test(safeExpression)) {
        throw new Error('Invalid characters in expression.');
    }    

    const result = new Function('return ' + safeExpression)();
    return result;
}

function calculate() {
    let expressionToSave = currentInput;
    if (currentInput === '') return;
    try {
        let result = parseAndExecuteExpression(currentInput);
        result = parseFloat(result.toFixed(10));
        saveHistory(expressionToSave, result.toString());
        currentInput = result.toString();
        display.value = result;
        
    } catch (e) {
        display.value = 'Error';
        currentInput = '';
    }
    playClickSound();
    updateButtonHighlights();
}

function memoryAction(action) {
    playClickSound();
    let value = parseFloat(currentInput);
    if (action === 'MC') {
        memoryRegister = 0;
    } else if (action === 'MR' && !isNaN(memoryRegister)) {
        currentInput = memoryRegister.toString();
        display.value = currentInput;
    } else if (action === 'M+') {
        if (!isNaN(value)) memoryRegister += value;
        clearDisplay(); 
    } else if (action === 'M-') {
        if (!isNaN(value)) memoryRegister -= value;
        clearDisplay();
    } 
    updateButtonHighlights();
}

function calculateAdvanced(operator) {
    playClickSound();    
    let expression = currentInput;
    let value = parseFloat(expression);
    let result;
    if (operator === 'pi') {
        currentInput += Math.PI.toFixed(15);
    } 
    else if (operator === 'e') {
        currentInput += Math.E.toFixed(15);
    } 
    else if (operator === 'rand') {
        currentInput += Math.random().toString();
    }
    else if (operator === 'pow') {
        currentInput += "^"; 
    }
    else if (!isNaN(value)) {
        let val = angleMode === 'DEG' ? toRadians(value) : value;
        switch(operator) {
            case 'sqrt': result = Math.sqrt(value); break;
            case 'cuberoot': result = Math.cbrt(value); break;
            case 'log': result = Math.log10(value); break;
            case 'ln': result = Math.log(value); break;
            case 'sin': result = Math.sin(val); break;
            case 'cos': result = Math.cos(val); break;
            case 'tan': result = Math.tan(val); break;
            case 'sinh': result = Math.sinh(value); break;
            case 'cosh': result = Math.cosh(value); break;
            case 'tanh': result = Math.tanh(value); break;
            case 'x^2': result = Math.pow(value, 2); break;
            case 'fact': result = factorial(value); break;
            case 'inv': result = 1 / value; break;
            case 'percent': result = value / 100; break;
            default: result = value;
        }
        if (!isNaN(result)) {
            currentInput = result.toFixed(10).replace(/\.?0+$/, '').toString(); 
        } else {
            currentInput = 'Invalid Input';
        }
    } else {
        currentInput += `${operator === 'x^2' ? 'Math.pow(' : `Math.${operator}(`}`;
        if(['fact', 'inv', 'percent'].includes(operator)) {
            currentInput = 'Error';
        }
    }    
    display.value = currentInput;
    updateButtonHighlights();
}

function updateButtonHighlights() {
    allButtons.forEach(btn => btn.classList.remove('active-key'));    

    if (currentInput === '') {
        document.querySelectorAll('.num-btn, .dot-btn, .paren-btn:first-child, .constant-btn, .func-btn, .trig-btn').forEach(btn => btn.classList.add('active-key'));
    } else {
        const lastChar = currentInput.slice(-1);
        const isOperator = ['+', '*', '/', '-', '^', '**'].includes(lastChar);
        const isNumber = /[0-9\.]/.test(lastChar);
        const endsInParen = lastChar === '(';        

        if (isOperator || endsInParen) {
            document.querySelectorAll('.num-btn, .dot-btn, .paren-btn:first-child, .constant-btn, .func-btn, .trig-btn').forEach(btn => btn.classList.add('active-key'));
        } else if (isNumber || lastChar === ')') {
            document.querySelectorAll('.num-btn, .dot-btn, .operator-btn, .paren-btn:last-child, .equal-btn').forEach(btn => btn.classList.add('active-key'));
        }
    }
}

function playClickSound() {
    if(clickSound) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
}

function switchTheme(e) {
    const theme = e.target.checked ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.body.classList.toggle('light-theme', theme === 'light');
}

function toggleAngleMode() {
    angleMode = angleMode === 'RAD' ? 'DEG' : 'RAD';
    updateAngleModeDisplay();
}

function updateAngleModeDisplay() {
    angleModeDisplay.textContent = angleMode;
    if (angleMode === 'DEG') {
        angleModeDisplay.classList.add('deg');
    } else {
        angleModeDisplay.classList.remove('deg');
    }
}

function getHistory() {
    const history = localStorage.getItem('calcHistory');
    return history ? JSON.parse(history) : [];
}

function saveHistory(expression, result) {
    const history = getHistory();
    history.push({ expression: expression, result: result });
    localStorage.setItem('calcHistory', JSON.stringify(history));
    renderHistory();
}

function loadHistory() {
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    const history = getHistory().reverse();    

    if (history.length === 0) {
        historyList.innerHTML = '<li style="color: #ccc;">No history yet.</li>';
        return;
    }

    history.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="history-expression">${item.expression}</div>
            <div class="history-result">= ${item.result}</div>
        `;
        li.onclick = () => {
            currentInput = item.result;
            display.value = currentInput;
            historyPanel.classList.remove('open');
            updateButtonHighlights();
        };
        historyList.appendChild(li);
    });
}

function clearHistoryUI() {
    localStorage.removeItem('calcHistory');
    renderHistory();
}

function toggleHistoryPanel() {
    historyPanel.classList.toggle('open');
    if (historyPanel.classList.contains('open')) {
        renderHistory();
    }
}

function changeBackground() {
    historyPanel.classList.remove('open');
    const newBgUrl = prompt("Enter a Wallpaper URL, or press OK to get a new random image.", "");
    let finalUrl;
    if (newBgUrl && newBgUrl.trim() !== "") {
        finalUrl = newBgUrl;
    } else {
        finalUrl = `https://picsum.photos/1600/900?random=${new Date().getTime()}`;
    }

    const img = new Image();
    img.onload = () => {
        document.body.style.backgroundImage = `url('${finalUrl}')`;
        alert('Wallpaper changed successfully!');
    };
    img.onerror = () => {
        alert('Error: Could not load the image from that URL. Sticking with the current background.');
    };
    img.src = finalUrl;
}

function openProgrammerMode() {
    programmerOverlay.style.display = 'flex';
    decInput.focus();
    const result = parseFloat(currentInput);
    if (!isNaN(result)) {
        decInput.value = Math.floor(result);
        convertBases();
    } else {
        decInput.value = 0;
        convertBases();
    }
    historyPanel.classList.remove('open');
}

function closeProgrammerMode() {
    programmerOverlay.style.display = 'none';
    currentInput = decInput.value;
    display.value = currentInput;
    updateButtonHighlights();
}

function convertBases() {
    const decimal = parseInt(decInput.value, 10);
    const binOutput = document.getElementById('bin-output');
    const hexOutput = document.getElementById('hex-output');    

    if (isNaN(decimal) || decimal < 0) {
        binOutput.textContent = 'Invalid';
        hexOutput.textContent = 'Invalid';
        return;
    }

    binOutput.textContent = decimal.toString(2);
    hexOutput.textContent = '0x' + decimal.toString(16).toUpperCase();
}

function openUnitConverter() {
    unitConverterOverlay.style.display = 'flex';
    const result = parseFloat(currentInput);
    if (!isNaN(result)) {
        inputValue.value = result;
    } else {
        inputValue.value = 1;
    }
    convertUnits();
    historyPanel.classList.remove('open');
}

function closeUnitConverter() {
    unitConverterOverlay.style.display = 'none';
    currentInput = outputMeters.textContent.replace(/[^\d\.]/g, ''); 
    display.value = currentInput;
    updateButtonHighlights();
}

function convertUnits() {
    const inputUnitType = inputUnit.value;
    const value = parseFloat(inputValue.value);

    if (isNaN(value)) {
        outputMeters.textContent = 'Invalid';
        outputFeet.textContent = 'Invalid';
        outputKilometers.textContent = 'Invalid';
        outputMiles.textContent = 'Invalid';
        return;
    }    

    let meters = 0;
    switch(inputUnitType) {
        case 'meters':
            meters = value;
            break;
        case 'feet':
            meters = value * 0.3048;
            break;
        case 'kilometers':
            meters = value * 1000;
            break;
        case 'miles':
            meters = value * 1609.34;
            break;
    }

    const results = {
        meters: meters,
        feet: meters / 0.3048,
        kilometers: meters / 1000,
        miles: meters / 1609.34
    };    

    const format = (num) => parseFloat(num).toFixed(6).replace(/\.?0+$/, '');
    outputMeters.textContent = format(results.meters);
    outputFeet.textContent = format(results.feet);
    outputKilometers.textContent = format(results.kilometers);
    outputMiles.textContent = format(results.miles);
}


const aiChatOverlay = document.getElementById('ai-chat-overlay');
const aiMessagesContainer = document.getElementById('ai-chat-messages');
const aiUserInput = document.getElementById('ai-user-input');

function openAISecurityAssistant() {
    aiChatOverlay.style.display = 'flex';
    historyPanel.classList.remove('open');
    setTimeout(() => aiUserInput.focus(), 100);
}

function closeAIChat() {
    aiChatOverlay.style.display = 'none';
}

function sendAIQuery() {
    const userMessage = aiUserInput.value.trim();
    if (!userMessage) return;

    appendAIMessage(userMessage, 'sent');
    aiUserInput.value = '';

    const typingIndicator = appendAIMessage("...", 'received', true);
    setTimeout(() => {
        typingIndicator.remove(); 
        const aiResponse = getAIGeneralResponse(userMessage);
        appendAIMessage(aiResponse, 'received');
    }, 1000);
}

function appendAIMessage(text, sender, isTyping = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    if (isTyping) messageDiv.id = 'typing-indicator';
    messageDiv.innerHTML = `<strong>${sender === 'sent' ? 'You' : 'VEC AI'}:</strong> ${text}`;
    aiMessagesContainer.appendChild(messageDiv);
    aiMessagesContainer.scrollTop = aiMessagesContainer.scrollHeight;
    return messageDiv;
}

function getAIGeneralResponse(userInput) {
   const lowerInput = userInput.toLowerCase().trim();
   if (/^(hello|hi|hey|greetings)/i.test(lowerInput)) {
       return "Hi there! I’m your multi-functional assistant. Whether it’s answering daily questions or helping secure systems—just tell me what you need!";
   }

   if (/\bwhat is \d+(?:\s*[\+\-\*\/]\s*\d+)+\??/.test(lowerInput)) {
       try {
           const matches = userInput.match(/\d+(?:\s*[\+\-\*\/]\s*\d+)+/);
           const expr = matches?.[0];
           if (expr) {
               const result = eval(expr);
               return `That evaluates to ${result}. 😊`;
           }
       } catch (err) {}
   }


   if (lowerInput.includes("capital of") || lowerInput.includes("population of")) {
       return "I’m happy to help find country facts! Try asking things like ‘What’s the population of Japan?’ or ‘Where is Argentina’s capital?’";
   }

   
   if (
       lowerInput.includes("gravity") ||
       lowerInput.includes("dna") ||
       lowerInput.includes("phoenix") ||
       lowerInput.includes("element")
   ) {
       if (lowerInput.includes("dna")) {
           return "DNA stands for deoxyribonucleic acid. It contains the instructions used in development and functioning of all living organisms.";
       }
       if (lowerInput.includes("gravity")) {
           return "Gravity is the force that attracts two bodies toward each other. On Earth, gravity gives weight to physical objects and causes tides due to the Moon's attraction.";
       }
       if (lowerInput.includes("phoenix")) {
           return "A phoenix is a bird from mythology that dies in flames and rises renewed from ashes, symbolizing rebirth. Used metaphorically often today.";
       }
       if (lowerInput.includes("element")) {
           return "An element is a substance made entirely of one kind of atom. Examples include oxygen, carbon, gold, iron, and silicon.";
       }
   }

   if (lowerInput.includes("python") && lowerInput.includes("loop")) {
       return "Loops in Python allow code blocks to repeat multiple times based on a condition. You can use:\n\n1. `for` loop (for definite iterations)\n2. `while` loop (for indefinite conditions)";
   }

   if (
       lowerInput.includes("penetrat") ||
       lowerInput.includes("hack") ||
       lowerInput.includes("security") ||
       lowerInput.includes("exploit")
   ) {
       return "Gotcha! Want details on payloads, scanners, reverse shells, privilege escalation, XSS, CSRF, or SQLMap syntax? Let me know which aspect!";
   }

   return "I’ve learned quite a bit recently — from science and philosophy to programming tricks and history trivia. Feel free to ask almost anything!";
}


aiUserInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAIQuery();
    }
});


function generateShareLink() {
    const encodedInput = encodeURIComponent(currentInput);
    const encodedMemory = encodeURIComponent(memoryRegister.toString());
    const mode = angleMode;
    const shareUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?input=${encodedInput}&mem=${encodedMemory}&mode=${mode}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share link copied to clipboard!\n' + shareUrl);
    }, () => {
        prompt('Could not copy automatically. Copy this URL:', shareUrl);
    });

    historyPanel.classList.remove('open');
}

function loadStateFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const input = urlParams.get('input');
    const memory = urlParams.get('mem');
    const mode = urlParams.get('mode');

    if (input) {
        currentInput = decodeURIComponent(input);
        display.value = currentInput;
    }

    if (memory && !isNaN(parseFloat(memory))) {
        memoryRegister = parseFloat(decodeURIComponent(memory));
    }

    if (mode === 'DEG' || mode === 'RAD') {
        angleMode = mode;
    }    

    if (input || memory || mode) {
        window.history.pushState({}, document.title, window.location.pathname);
    }
}

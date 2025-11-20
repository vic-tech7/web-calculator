let display = document.getElementById('display');
let currentInput = '';
const clickSound = document.getElementById('click-sound');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const angleModeDisplay = document.getElementById('angle-mode');
const allButtons = document.querySelectorAll('.scientific-grid button');

let memoryRegister = 0;
let angleMode = 'RAD'; 

loadHistory();
updateAngleModeDisplay();

const toggleSwitch = document.getElementById('checkbox');
if (toggleSwitch) {
    toggleSwitch.addEventListener('change', switchTheme);
    document.body.classList.remove('light-theme');
    toggleSwitch.checked = true;
}

document.addEventListener('click', function(event) {
    const isHistoryButton = document.getElementById('menu-button').contains(event.target);
    const inHistoryPanel = historyPanel.contains(event.target);
    
    if (historyPanel.classList.contains('open') && !isHistoryButton && !inHistoryPanel) {
        historyPanel.classList.remove('open');
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
        currentInput += "**"; 
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
        const isOperator = ['+', '*', '/', '-', '**'].includes(lastChar);
        const isNumber = /[0-9\.]/.test(lastChar);
        const endsInParen = lastChar === '(';
        
        if (isOperator || endsInParen) {
            document.querySelectorAll('.num-btn, .dot-btn, .paren-btn:first-child, .constant-btn, .func-btn, .trig-btn').forEach(btn => btn.classList.add('active-key'));
        } else if (isNumber || lastChar === ')') {
            document.querySelectorAll('.num-btn, .dot-btn, .operator-btn, .paren-btn:last-child, .equal-btn').forEach(btn => btn.classList.add('active-key'));
        }
    }
}


function toggleAngleMode() {
    if (angleMode === 'RAD') {
        angleMode = 'DEG';
    } else {
        angleMode = 'RAD';
    }
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
        historyList.innerHTML = '<li>No history yet.</li>';
        return;
    }

    history.forEach((item, index) => {
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

function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
    }
}

function playClickSound() {
    if(clickSound) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (/[0-9\.\+\-\*\/\(\)]/.test(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
        event.preventDefault(); 
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '!') {
        calculateAdvanced('fact');
    } else if (key === '^') {
        appendToDisplay('**'); 
    } else if (key === '%') {
        calculateAdvanced('percent');
    } else if (document.querySelector(`.scientific-grid button:contains("${key}")`)) {
        const button = document.querySelector(`.scientific-grid button:contains("${key}")`);
        if (button) {
            button.click();
        }
    }
});

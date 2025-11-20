let display = document.getElementById('display');
let currentInput = '';
const clickSound = document.getElementById('click-sound');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const angleModeDisplay = document.getElementById('angle-mode');

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
}

function clearDisplay() {
    currentInput = '';
    display.value = '';
    playClickSound();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
    playClickSound();
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

function calculate() {
    let expressionToSave = currentInput;
    try {
        let expression = currentInput.replace(/×/g, '*').replace(/–/g, '-');
        
        let result = eval(expression);
        
        result = parseFloat(result.toFixed(10));
        
        saveHistory(expressionToSave, result.toString());
        currentInput = result.toString();
        display.value = result;
        
    } catch (e) {
        display.value = 'Error';
        currentInput = '';
    }
    playClickSound();
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
        memoryRegister += value;
        clearDisplay(); 
    } else if (action === 'M-') {
        memoryRegister -= value;
        clearDisplay();
    } else if (action === 'MS' && !isNaN(value)) {
        memoryRegister = value;
    }
}


function calculateAdvanced(operator) {
    playClickSound();
    
    let expression = currentInput;

    if (operator === 'pi') {
        currentInput += Math.PI.toFixed(15);
    } 
    else if (operator === 'e') {
        currentInput += Math.E.toFixed(15);
    } 
    else if (operator === 'rand') {
        currentInput = Math.random().toString();
    }
    else if (operator === 'pow') {
            currentInput += "**"; 
    }
    else {
        let value = parseFloat(expression);
        
        if (!isNaN(value)) {
            let result;
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
                default:
                    currentInput += `${operator === 'x^2' ? 'Math.pow(' : `Math.${operator}(`}`;
                    return;
            }

            if (!isNaN(result)) {
                 currentInput = result.toFixed(10).toString(); 
            } else {
                currentInput = 'Invalid Input';
            }
        } else {
             currentInput += `${operator === 'x^2' ? 'Math.pow(' : `Math.${operator}(`}`;
             if(operator === 'fact' || operator === 'inv' || operator === 'percent') {
                 currentInput = 'Error';
             }
        }
    }
    
    display.value = currentInput;
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
    }
});

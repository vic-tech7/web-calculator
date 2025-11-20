let display = document.getElementById('display');
let currentInput = '';
const clickSound = document.getElementById('click-sound');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');

loadHistory();

const toggleSwitch = document.getElementById('checkbox');
if (toggleSwitch) {
    toggleSwitch.addEventListener('change', switchTheme);
    document.body.classList.remove('light-theme');
    toggleSwitch.checked = true;
}

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

function calculateAdvanced(operator) {
    playClickSound();
    
    let expression = currentInput;

    if (operator === 'pi') {
        currentInput += Math.PI.toFixed(10);
    } 
    else if (['sqrt', 'log', 'sin', 'cos', 'tan', 'exp', 'x^2', 'deg'].includes(operator)) {
        let value = parseFloat(expression);
        
        if (!isNaN(value) && expression.trim() === value.toString().trim()) {
            let result;
            switch(operator) {
                case 'sqrt': result = Math.sqrt(value); break;
                case 'log': result = Math.log(value); break;
                case 'sin': result = Math.sin(value); break;
                case 'cos': result = Math.cos(value); break;
                case 'tan': result = Math.tan(value); break;
                case 'exp': result = Math.exp(value); break;
                case 'x^2': result = Math.pow(value, 2); break;
                case 'deg': result = value * (180 / Math.PI); break;
            }
            if (!isNaN(result)) {
                 currentInput = result.toFixed(10).toString(); 
            } else {
                currentInput = 'Invalid Input';
            }
        } else {
             currentInput += `${operator === 'x^2' ? 'Math.pow(' : `Math.${operator}(`}`;
        }
    } 
    else if (operator === 'pow') {
            currentInput += "**"; 
    }
    
    display.value = currentInput;
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

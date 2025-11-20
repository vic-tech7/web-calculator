let display = document.getElementById('display');
let currentInput = '';
const clickSound = document.getElementById('click-sound');

function appendToDisplay(value) {
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
    try {
        let expression = currentInput.replace(/×/g, '*')
                                     .replace(/–/g, '-');
        
        let result = eval(expression);
        
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
    
    let value;
    
    if (operator === 'pi') {
        value = Math.PI;
    } else {
        value = parseFloat(currentInput); 
    }

    switch(operator) {
        case 'pi': 
            currentInput = value.toFixed(8).toString();
            break;
        case 'sqrt':
            if (value >= 0) {
                currentInput = Math.sqrt(value).toString();
            } else {
                currentInput = 'Invalid Input';
            }
            break;
        case 'log':
             if (value > 0) {
                currentInput = Math.log(value).toFixed(4).toString();
            } else {
                 currentInput = 'Invalid Input';
            }
            break;
        case 'sin':
            currentInput = Math.sin(value).toFixed(4).toString();
            break;
        case 'cos':
            currentInput = Math.cos(value).toFixed(4).toString();
            break;
        case 'tan':
            currentInput = Math.tan(value).toFixed(4).toString();
            break;
        case 'exp':
            currentInput = Math.exp(value).toFixed(4).toString();
             break;
        case 'x^2':
            currentInput = Math.pow(value, 2).toString();
            break;
        case 'pow':
            currentInput += "**"; 
            break;
        case 'rad': 
            currentInput = (value * (Math.PI / 180)).toFixed(4).toString();
            break;

        default:
            return;
    }
    
    display.value = currentInput;
}

function playClickSound() {
    if(clickSound) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
}

const toggleSwitch = document.getElementById('checkbox');

function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
    }
}

if (toggleSwitch) {
    toggleSwitch.addEventListener('change', switchTheme);
    document.body.classList.remove('light-theme');
    toggleSwitch.checked = true;
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

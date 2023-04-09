const MAX_SCREEN_SIZE = 15;
let currentFirst = null;
let currentOperator = null;
let currentSecond = null;


function calculate() {
    const first = Number(currentFirst);
    const second = Number(currentSecond);
    switch (currentOperator) {
        case 'add':
            return first + second;
        case 'subtract':
            return first - second;
        case 'multiply':
            return first * second;
        case 'divide':
            return second === 0 ? NaN : first / second;
        case 'modulo':
            return first % second;
    }
}

function tryMakingSmaller(num) {
    if (num.toString().length <= MAX_SCREEN_SIZE) {
        return num.toString();
    }
    return num; // worry about later
    /*if (num.toString().includes('.')) {
        const decimalIndex = num.toString().indexOf('.') + 1;
        const decimalAmount = num.toString().length - decimalIndex;
        const test = 10e1;
    }*/
}

function updateScreen() {
    console.log(`Updating... first: ${currentFirst}, operator: ${currentOperator}, second: ${currentSecond}`)
    setScreen(getCurrentNum());
}

function setScreen(num) {
    const element = document.getElementById('screen');
    if (num == null) {
        element.textContent = '0';
        return;
    }
    if (isNaN(num)) {
        element.textContent = "nice try";
        return;
    }
    num = tryMakingSmaller(num);
    if (num.toString().length > MAX_SCREEN_SIZE) {
        element.textContent = num.toString().substring(0, MAX_SCREEN_SIZE - 1);
        return;
    }
    element.textContent = num.toString();
}

function onNumberClick(num) {
    console.log(`Clicked #${num}`);
    setCurrentNum((getCurrentNum() == null ? '' : getCurrentNum()) + num);
    updateScreen();
}

function onOperatorClick(operator) {
    console.log(`Clicked ${operator}`);
    if (currentOperator != null) {
        solve();
    }
    if (getCurrentNum() == null) return;
    currentOperator = operator;
    document.getElementById(operator).classList.add('operator-select');
}

function solve() {
    if (currentOperator != null) {
        document.getElementById(currentOperator).classList.remove('operator-select');
    }
    if (currentSecond != null) {
        const result = calculate();
        currentSecond = null;
        currentOperator = null;
        setCurrentNum(result);
        updateScreen();
    }
}

function onDecimalPointClick() {
    if (getCurrentNum() == null) setCurrentNum('0');
    if (getCurrentNum().includes('.')) return;
    setCurrentNum(`${getCurrentNum()}.`);
    updateScreen();
}

function clearAll() {
    currentFirst = null;
    currentOperator = null;
    currentSecond = null;
    updateScreen();
}

function toggleNegative() {
    if (getCurrentNum() == null) return;
    const num = Number(getCurrentNum());
    if (isNaN(num) || num === 0.0) return;
    setCurrentNum(getCurrentNum().startsWith('-') ? getCurrentNum().substring(1) : `-${num}`);
    updateScreen();
}

function getCurrentNum() {
    if (currentOperator == null) {
        return currentFirst;
    }
    return currentSecond;
}

function setCurrentNum(num) {
    let result = null;
    if (num != null) {
        result = num.toString().substring(0, MAX_SCREEN_SIZE + num.toString().startsWith('-'));
    }
    if (currentOperator == null) {
        currentFirst = result;
        return;
    }
    currentSecond = result;
}

function operatorToText(operator) {
    switch (operator) {
        case '+':
            return 'add';
        case '-':
            return 'subtract';
        case '*':
            return 'multiply';
        case '/':
            return 'divide';
        case '%':
            return 'modulo';
        default:
            return null;
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === '/') {
        event.preventDefault();
    }
});

addEventListener('keypress', (e) => {
    if (e.code === 'Space') {
        return;
    }
    const num = Number(e.key);
    if (!isNaN(num)) {
        if (num >= 0 && num <= 9) {
            onNumberClick(num);
            return;
        }
    }
    if (e.key === '/') {
        e.preventDefault();
    }
    if (operatorToText(e.key) != null) {
        onOperatorClick(operatorToText(e.key));
        return;
    }
    if (e.key === '.') {
        onDecimalPointClick();
        return;
    }
    if (e.key === '-') {
        toggleNegative();
        return;
    }
    if (e.code === 'Enter') {
        solve();
    }
});

Array.from(document.getElementsByClassName("number")).forEach((e) => {
    e.addEventListener('click', () => onNumberClick(e.textContent));
});

Array.from(document.getElementsByClassName("operator")).forEach((e) => {
    e.addEventListener('click', () => onOperatorClick(e.id));
});

document.getElementById("solve").addEventListener('click', solve);
document.getElementById("decimal").addEventListener('click', onDecimalPointClick);
document.getElementById("clear").addEventListener('click', clearAll);
document.getElementById("negative").addEventListener('click', toggleNegative);

console.log(calculate(999999999999999, "multiply", 999999999999999));
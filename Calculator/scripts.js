var bigdecimal = require("bigdecimal");

const body = document.querySelector('html')
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
const operators = ['+', '-', '*', '/']
var lastPressed = ['', '']
var lastKey = ['', '']

class Calculator{
    constructor(previousOperandTextElement, currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
    }

    clear(){
        this.currentOperand = 0
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
        this.previousOperand = 0
        this.operation = undefined
    }

    delete(){
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    appendNumber(number){
        if(this.currentOperand == undefined) this.currentOperand = ''
        if(number == '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    chooseOperation(operation){
        if(this.currentOperand === '') return
        if(this.previousOperand !== 0){
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    compute(){
        var computation = 0
        if(isNaN(this.previousOperand) || isNaN(this.currentOperand)) return
        this.previousOperand = this.previousOperand.toString()
        const prev = new bigdecimal.BigDecimal(this.previousOperand)
        const current = new bigdecimal.BigDecimal(this.currentOperand)
        switch(this.operation) {
            case '+':
                computation = prev.add(current)
                break
            case '-':
                computation =  prev.subtract(current)
                break
            case '*':
                computation =  prev.multiply(current)
                break
            case '/':
                try{
                    computation = prev.divide(current)
                } catch(e){
                    computation = prev.divide(current, 50, bigdecimal.RoundingMode.DOWN()) 
                    //for long divisions. 50 decimals of precision 
                }
                break
            default:
                return
        }
        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = 0
    }

    formatText(number){
        this.numbers = number.toString().split('.')
        this.numbers[0] = this.numbers[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); //thanks google
        return this.numbers.join(".")
    }

    updateDisplay(){
        this.currentOperandTextElement.innerText = this.formatText(this.currentOperand)
        if(this.operation != null){
            this.previousOperandTextElement.innerText = `${this.formatText(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = ''
        }
    }
}

function move(button){
    lastPressed[0] = lastPressed[1]
    lastPressed[1] = button
}

function moveKey(key){
    if(lastKey[1] == key){
        return
    } else {
        lastKey[0] = lastKey[1]
        lastKey[1] = key
    }
}

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
    button.addEventListener('click', () =>{
        move('number')
        if(lastPressed[0] == 'equals'){
            calculator.clear()
        }
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () =>{
        move('operator')

        calculator.chooseOperation(button.innerHTML)
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener('click', button => {
    move('equals')
    calculator.compute()
    calculator.updateDisplay()
})

allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})

body.addEventListener('keydown', (e) => {
    moveKey(e.key)
    if(numbers.includes(e.key)){
        move('number')
        if(lastPressed[0] == 'equals'){
            calculator.clear()
        }
        calculator.appendNumber(e.key)
        calculator.updateDisplay()
    }
    if(operators.includes(e.key)){
            move('operator')
            calculator.chooseOperation(e.key)
            calculator.updateDisplay()
    }
    if(e.key == 'Enter'){
        move('equals')
        calculator.compute()
        calculator.updateDisplay()
    }
    if(e.key == 'Delete'){
        calculator.delete()
        calculator.updateDisplay()    
    }
    if(e.key == 'v' && lastKey[0] =='Control'){
        navigator.clipboard.readText().then(text => {
            console.log('Pasted content: ', text, 'Pasting numbers doesn\'t work yet. XD');
        })
        .catch(err => {
        console.error(err);
        });
    }
})

body.addEventListener('keyup', (e) => {
    if(e.key == 'Control'){
        lastKey =  ['', '']
    }
})

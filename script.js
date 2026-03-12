let display
let currentInput = ""
let historyPanel
let historyList
let memoryRegister = 0

document.addEventListener("DOMContentLoaded", () => {

display = document.getElementById("display")
historyPanel = document.getElementById("history-panel")
historyList = document.getElementById("history-list")

loadHistory()

})

function appendToDisplay(value){
currentInput += value
display.value = currentInput
}

function clearDisplay(){
currentInput = ""
display.value = ""
}

function deleteLast(){
currentInput = currentInput.slice(0,-1)
display.value = currentInput
}

function calculate(){

if(currentInput === "") return

try{

let expression = currentInput
.replace(/π/g, Math.PI)
.replace(/e/g, Math.E)
.replace(/×/g,"*")
.replace(/\^/g,"**")

let result = eval(expression)

result = parseFloat(result.toFixed(10))

saveHistory(currentInput,result)

currentInput = result.toString()

display.value = currentInput

}catch{

display.value = "Error"

currentInput = ""

}

}

function calculateAdvanced(type){

let value = parseFloat(currentInput)

if(type === "sqrt") currentInput = Math.sqrt(value).toString()

else if(type === "log") currentInput = Math.log10(value).toString()

else if(type === "sin") currentInput = Math.sin(value).toString()

else if(type === "cos") currentInput = Math.cos(value).toString()

else if(type === "tan") currentInput = Math.tan(value).toString()

else if(type === "square") currentInput = Math.pow(value,2).toString()

else if(type === "inverse") currentInput = (1/value).toString()

else if(type === "percent") currentInput = (value/100).toString()

display.value = currentInput

}

function memoryAction(action){

let value = parseFloat(currentInput)

if(action === "MC") memoryRegister = 0

if(action === "MR"){
currentInput = memoryRegister.toString()
display.value = currentInput
}

if(action === "M+") memoryRegister += value

if(action === "M-") memoryRegister -= value

}

function toggleHistoryPanel(){

historyPanel.classList.toggle("open")

loadHistory()

}

function saveHistory(exp,result){

let history = JSON.parse(localStorage.getItem("calcHistory") || "[]")

history.push({exp,result})

localStorage.setItem("calcHistory",JSON.stringify(history))

}

function loadHistory(){

if(!historyList) return

historyList.innerHTML = ""

let history = JSON.parse(localStorage.getItem("calcHistory") || "[]").reverse()

history.forEach(item=>{

let li = document.createElement("li")

li.innerHTML = `
<div>${item.exp}</div>
<div>= ${item.result}</div>
`

li.onclick = ()=>{

currentInput = item.result

display.value = currentInput

historyPanel.classList.remove("open")

}

historyList.appendChild(li)

})

}

function clearHistoryUI(){

localStorage.removeItem("calcHistory")

loadHistory()

}

function openAISecurityAssistant(){

document.getElementById("ai-chat-overlay").style.display = "flex"

}

function closeAIChat(){

document.getElementById("ai-chat-overlay").style.display = "none"

}

function sendAIQuery(){

const input = document.getElementById("ai-user-input")

const messages = document.getElementById("ai-chat-messages")

let text = input.value.trim()

if(!text) return

let userMsg = document.createElement("div")

userMsg.innerHTML = "<b>You:</b> " + text

messages.appendChild(userMsg)

input.value = ""

fetch("/api/chat",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({message:text})
})
.then(r=>r.json())
.then(data=>{

let aiMsg = document.createElement("div")

aiMsg.innerHTML = "<b>VEC AI:</b> " + data.reply

messages.appendChild(aiMsg)

messages.scrollTop = messages.scrollHeight

})
.catch(()=>{

let err = document.createElement("div")

err.innerHTML = "<b>VEC AI:</b> Connection error."

messages.appendChild(err)

})

}

window.appendToDisplay = appendToDisplay
window.calculate = calculate
window.calculateAdvanced = calculateAdvanced
window.clearDisplay = clearDisplay
window.deleteLast = deleteLast
window.memoryAction = memoryAction
window.toggleHistoryPanel = toggleHistoryPanel
window.clearHistoryUI = clearHistoryUI
window.openAISecurityAssistant = openAISecurityAssistant
window.closeAIChat = closeAIChat
window.sendAIQuery = sendAIQuery
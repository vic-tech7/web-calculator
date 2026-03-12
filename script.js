document.addEventListener("DOMContentLoaded", function() {

let display = document.getElementById('display');
let currentInput = '';
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
const menuButton = document.getElementById('menu-button');
if(!menuButton) return;
const isHistoryButton = menuButton.contains(event.target);
const inHistoryPanel = historyPanel.contains(event.target);
if (historyPanel.classList.contains('open') && !isHistoryButton && !inHistoryPanel) {
historyPanel.classList.remove('open');
}
});

document.addEventListener('keydown', function(event) {

if (event.key === 'Escape') {
if(programmerOverlay.style.display === 'flex') closeProgrammerMode();
else if (unitConverterOverlay.style.display === 'flex') closeUnitConverter();
else if(currentInput !== '') clearDisplay();
}

if(programmerOverlay.style.display === 'flex' || unitConverterOverlay.style.display === 'flex') {
if(event.key === 'Enter') {
if(programmerOverlay.style.display === 'flex') convertBases();
else convertUnits();
}
return;
}

const key = event.key;

if(/[0-9\.\(\)]/.test(key)) appendToDisplay(key);
else if(key === '+' || key === '-') appendToDisplay(key);
else if(key === '*') appendToDisplay('×');
else if(key === '/') appendToDisplay('/');
else if(key === 'Enter' || key === '=') calculate();
else if(key === 'Backspace') deleteLast();
});

function appendToDisplay(value){
if(display.value === 'Error') clearDisplay();
currentInput += value;
display.value = currentInput;
playClickSound();
updateButtonHighlights();
}

function clearDisplay(){
currentInput='';
display.value='';
playClickSound();
updateButtonHighlights();
}

function deleteLast(){
currentInput=currentInput.slice(0,-1);
display.value=currentInput;
playClickSound();
updateButtonHighlights();
}

function factorial(n){
if(n<0 || n%1!==0) return NaN;
if(n===0 || n===1) return 1;
let result=1;
for(let i=2;i<=n;i++){result*=i;}
return result;
}

function parseAndExecuteExpression(expression){

let safeExpression = expression
.replace(/π/g,Math.PI)
.replace(/e/g,Math.E)
.replace(/×/g,'*')
.replace(/\^/g,'**');

if(!/^[0-9\.\+\-\*\/\(\)\s\**]+$/.test(safeExpression)){
throw new Error();
}

return new Function('return '+safeExpression)();
}

function calculate(){

if(currentInput==='') return;

try{

let result=parseAndExecuteExpression(currentInput);
result=parseFloat(result.toFixed(10));

saveHistory(currentInput,result.toString());

currentInput=result.toString();
display.value=result;

}catch{

display.value='Error';
currentInput='';
}

playClickSound();
updateButtonHighlights();
}

function memoryAction(action){

playClickSound();

let value=parseFloat(currentInput);

if(action==='MC') memoryRegister=0;

else if(action==='MR' && !isNaN(memoryRegister)){
currentInput=memoryRegister.toString();
display.value=currentInput;
}

else if(action==='M+' && !isNaN(value)){
memoryRegister+=value;
clearDisplay();
}

else if(action==='M-' && !isNaN(value)){
memoryRegister-=value;
clearDisplay();
}

updateButtonHighlights();
}

function calculateAdvanced(operator){

playClickSound();

let value=parseFloat(currentInput);
let result;

if(operator==='pi') currentInput+=Math.PI;
else if(operator==='e') currentInput+=Math.E;
else if(operator==='rand') currentInput+=Math.random();
else if(!isNaN(value)){

switch(operator){

case 'sqrt': result=Math.sqrt(value); break;
case 'cuberoot': result=Math.cbrt(value); break;
case 'log': result=Math.log10(value); break;
case 'sin': result=Math.sin(value); break;
case 'cos': result=Math.cos(value); break;
case 'tan': result=Math.tan(value); break;
case 'x^2': result=Math.pow(value,2); break;
case 'fact': result=factorial(value); break;
case 'inv': result=1/value; break;
case 'percent': result=value/100; break;

default: result=value;
}

if(!isNaN(result)){
currentInput=result.toString();
}else{
currentInput='Invalid Input';
}
}

display.value=currentInput;
updateButtonHighlights();
}

function updateButtonHighlights(){

allButtons.forEach(btn=>btn.classList.remove('active-key'));

if(currentInput===''){
document.querySelectorAll('.num-btn,.dot-btn').forEach(btn=>btn.classList.add('active-key'));
}

else{

const lastChar=currentInput.slice(-1);
const isOperator=['+','-','*','/','^'].includes(lastChar);

if(isOperator){
document.querySelectorAll('.num-btn,.dot-btn').forEach(btn=>btn.classList.add('active-key'));
}

else{
document.querySelectorAll('.operator-btn,.equal-btn').forEach(btn=>btn.classList.add('active-key'));
}
}
}

function playClickSound(){

try{
const audio=new Audio('click.mp3');
audio.play();
}catch{}
}

function switchTheme(e){

const theme=e.target.checked?'dark':'light';

localStorage.setItem('theme',theme);

document.body.classList.toggle('light-theme',theme==='light');
}

function toggleAngleMode(){

angleMode=angleMode==='RAD'?'DEG':'RAD';

updateAngleModeDisplay();
}

function updateAngleModeDisplay(){

angleModeDisplay.textContent=angleMode;

if(angleMode==='DEG') angleModeDisplay.classList.add('deg');
else angleModeDisplay.classList.remove('deg');
}

function getHistory(){

const history=localStorage.getItem('calcHistory');

return history?JSON.parse(history):[];
}

function saveHistory(expression,result){

const history=getHistory();

history.push({expression,result});

localStorage.setItem('calcHistory',JSON.stringify(history));

renderHistory();
}

function loadHistory(){

renderHistory();
}

function renderHistory(){

historyList.innerHTML='';

const history=getHistory().reverse();

if(history.length===0){
historyList.innerHTML='<li style="color:#ccc;">No history yet.</li>';
return;
}

history.forEach(item=>{

const li=document.createElement('li');

li.innerHTML=`
<div class="history-expression">${item.expression}</div>
<div class="history-result">= ${item.result}</div>
`;

li.onclick=()=>{
currentInput=item.result;
display.value=currentInput;
historyPanel.classList.remove('open');
};

historyList.appendChild(li);

});
}

function clearHistoryUI(){

localStorage.removeItem('calcHistory');

renderHistory();
}

function toggleHistoryPanel(){

historyPanel.classList.toggle('open');

if(historyPanel.classList.contains('open')) renderHistory();
}

function openProgrammerMode(){

programmerOverlay.style.display='flex';

decInput.value=parseInt(currentInput)||0;

convertBases();

historyPanel.classList.remove('open');
}

function closeProgrammerMode(){

programmerOverlay.style.display='none';

currentInput=decInput.value;

display.value=currentInput;
}

function convertBases(){

const decimal=parseInt(decInput.value);

const binOutput=document.getElementById('bin-output');

const hexOutput=document.getElementById('hex-output');

if(isNaN(decimal)) return;

binOutput.textContent=decimal.toString(2);

hexOutput.textContent='0x'+decimal.toString(16).toUpperCase();
}

function openUnitConverter(){

unitConverterOverlay.style.display='flex';

inputValue.value=parseFloat(currentInput)||1;

convertUnits();

historyPanel.classList.remove('open');
}

function closeUnitConverter(){

unitConverterOverlay.style.display='none';

currentInput=outputMeters.textContent;

display.value=currentInput;
}

function convertUnits(){

const value=parseFloat(inputValue.value);

if(isNaN(value)) return;

let meters=value;

if(inputUnit.value==='feet') meters=value*0.3048;
if(inputUnit.value==='kilometers') meters=value*1000;
if(inputUnit.value==='miles') meters=value*1609.34;

outputMeters.textContent=meters;
outputFeet.textContent=meters/0.3048;
outputKilometers.textContent=meters/1000;
outputMiles.textContent=meters/1609.34;
}

const aiChatOverlay=document.getElementById('ai-chat-overlay');
const aiMessagesContainer=document.getElementById('ai-chat-messages');
const aiUserInput=document.getElementById('ai-user-input');

function openAISecurityAssistant(){

aiChatOverlay.style.display='flex';

historyPanel.classList.remove('open');

setTimeout(()=>aiUserInput.focus(),100);
}

function closeAIChat(){

aiChatOverlay.style.display='none';
}

function sendAIQuery(){

const userMessage=aiUserInput.value.trim();

if(!userMessage) return;

appendAIMessage(userMessage,'sent');

aiUserInput.value='';

const typingIndicator=appendAIMessage("Thinking...",'received',true);

fetch("/api/chat",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({message:userMessage})
})
.then(res=>res.json())
.then(data=>{
typingIndicator.remove();
appendAIMessage(data.reply,'received');
})
.catch(()=>{
typingIndicator.remove();
appendAIMessage("Connection error with AI server.",'received');
});
}

function appendAIMessage(text,type,isTyping=false){

const messageDiv=document.createElement('div');

messageDiv.className=`message ${type}`;

const strong=document.createElement('strong');

strong.textContent=type==='sent'?'You:':'VEC AI:';

const content=document.createElement('span');

content.textContent=text;

messageDiv.appendChild(strong);

messageDiv.appendChild(document.createTextNode(' '));

messageDiv.appendChild(content);

aiMessagesContainer.appendChild(messageDiv);

aiMessagesContainer.scrollTop=aiMessagesContainer.scrollHeight;

return messageDiv;
}

if(aiUserInput){
aiUserInput.addEventListener('keydown',function(e){
if(e.key==='Enter' && !e.shiftKey){
e.preventDefault();
sendAIQuery();
}
});
}

});
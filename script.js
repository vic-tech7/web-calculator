let display = document.getElementById("display")
let currentInput = ""

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
  if(currentInput==="") return
  try{
    let expression = currentInput
      .replace(/π/g,Math.PI)
      .replace(/e/g,Math.E)
      .replace(/×/g,"*")
      .replace(/\^/g,"**")
    let result = eval(expression)
    result = parseFloat(result.toFixed(10))
    currentInput = result.toString()
    display.value = currentInput
  }catch{
    display.value = "Error"
    currentInput=""
  }
}

function calculateAdvanced(type){
  let value = parseFloat(currentInput)
  if(isNaN(value)) return
  if(type==="sqrt") currentInput=Math.sqrt(value)
  if(type==="square") currentInput=Math.pow(value,2)
  if(type==="sin") currentInput=Math.sin(value)
  if(type==="cos") currentInput=Math.cos(value)
  if(type==="tan") currentInput=Math.tan(value)
  if(type==="log") currentInput=Math.log10(value)
  if(type==="inv") currentInput=1/value
  display.value=currentInput
}

function changeBackground(){
  const images=[
    "https://source.unsplash.com/1600x900/?abstract",
    "https://source.unsplash.com/1600x900/?space",
    "https://source.unsplash.com/1600x900/?technology",
    "https://source.unsplash.com/1600x900/?cyberpunk",
    "https://source.unsplash.com/1600x900/?geometry"
  ]
  const img=images[Math.floor(Math.random()*images.length)]
  document.body.style.backgroundImage=`url(${img})`
  document.body.style.backgroundSize="cover"
}

function generateShareLink(){
  const text = encodeURIComponent(currentInput)
  const url = window.location.origin + "?calc=" + text
  navigator.clipboard.writeText(url)
  alert("Share link copied!")
}

window.onload = function(){
  const params = new URLSearchParams(window.location.search)
  if(params.has("calc")){
    currentInput=params.get("calc")
    display.value=currentInput
  }
}

function openProgrammerMode(){
  const num = parseInt(currentInput)
  if(isNaN(num)) return alert("Enter a number first")
  alert(
    "DEC: "+num+
    "\nHEX: "+num.toString(16).toUpperCase()+
    "\nBIN: "+num.toString(2)
  )
}

function openUnitConverter(){
  let value = parseFloat(currentInput)
  if(isNaN(value)) return alert("Enter a number")
  let meters = value
  let feet = value * 3.28084
  let km = value / 1000
  let miles = value * 0.000621371
  alert(
    value+" meters\n"+
    feet+" feet\n"+
    km+" km\n"+
    miles+" miles"
  )
}

function openAISecurityAssistant(){
  document.getElementById("ai-chat-overlay").style.display="flex"
}

function closeAIChat(){
  document.getElementById("ai-chat-overlay").style.display="none"
}

async function sendAIQuery(){
  const input=document.getElementById("ai-user-input")
  const messages=document.getElementById("ai-chat-messages")
  let msg=input.value.trim()
  if(!msg) return
  let user=document.createElement("div")
  user.className = "message sent"
  user.innerHTML="<b>You:</b> "+msg
  messages.appendChild(user)
  input.value=""
  try{
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    })
    const data = await res.json()
    let ai=document.createElement("div")
    ai.className = "message received"
    ai.innerHTML="<b>VEC AI:</b> "+data.reply
    messages.appendChild(ai)
    messages.scrollTop=messages.scrollHeight
  }catch{
    let err=document.createElement("div")
    err.className = "message received"
    err.innerHTML="<b>VEC AI:</b> Connection error."
    messages.appendChild(err)
  }
}

window.appendToDisplay=appendToDisplay
window.clearDisplay=clearDisplay
window.deleteLast=deleteLast
window.calculate=calculate
window.calculateAdvanced=calculateAdvanced
window.changeBackground=changeBackground
window.generateShareLink=generateShareLink
window.openProgrammerMode=openProgrammerMode
window.openUnitConverter=openUnitConverter
window.openAISecurityAssistant=openAISecurityAssistant
window.closeAIChat=closeAIChat
window.sendAIQuery=sendAIQuery
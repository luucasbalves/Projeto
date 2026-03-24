/* loader dots */
const loader = document.getElementById("loader")
const container = document.querySelector(".container")
const dots = document.getElementById("dots")

let c = 0
const anim = setInterval(() => {
  c++
  dots.textContent = ".".repeat(c % 4)
}, 400)

const cards = document.getElementById("cards")

window.onload = () => {
  setTimeout(() => {
    loader.style.display = "none"
    container.classList.remove("hidden")
    clearInterval(anim)

    showCard(current) // já abre o primeiro card
  }, 2000)
}

//////////////////////////////////////////////////////
///////////////  LÓGICA DE CARROSSEL /////////////////
//////////////////////////////////////////////////////

const allCards = document.querySelectorAll(".card")
let current = 0

function showCard(index){
  allCards.forEach(card => card.classList.remove("open"))
  allCards[index].classList.add("open")
}

// BOTÕES
document.getElementById("next").onclick = () => {
  current = (current + 1) % allCards.length
  showCard(current)
}

document.getElementById("prev").onclick = () => {
  current = (current - 1 + allCards.length) % allCards.length
  showCard(current)
}

// TECLADO
document.addEventListener("keydown", (e)=>{
  if(e.key === "ArrowRight"){
    current = (current + 1) % allCards.length
    showCard(current)
  }
  if(e.key === "ArrowLeft"){
    current = (current - 1 + allCards.length) % allCards.length
    showCard(current)
  }
})

//////////////////////////////////////////////////////
////////////////// particles//////////////////////////
//////////////////////////////////////////////////////

const canvas = document.getElementById("particles")
const ctx = canvas.getContext("2d")

canvas.width = innerWidth
canvas.height = innerHeight

let particles = []

for(let i=0;i<70;i++){
  particles.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    r:Math.random()*2,
    dx:(Math.random()-.5)*.5,
    dy:(Math.random()-.5)*.5
  })
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height)
  particles.forEach(p=>{
    p.x+=p.dx
    p.y+=p.dy
    ctx.beginPath()
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
    ctx.fillStyle=`rgba(0,255,255,${Math.random()})`
    ctx.fill()
  })
  requestAnimationFrame(animate)
}
animate()

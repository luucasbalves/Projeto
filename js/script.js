/* loader dots */
const loader=document.getElementById("loader")
const container=document.querySelector(".container")
const dots=document.getElementById("dots")

let c=0
const anim=setInterval(()=>{
c++
dots.textContent=".".repeat(c%4)
},400)

setTimeout(()=>{
loader.style.display="none"
container.classList.remove("hidden")
clearInterval(anim)
},3000)

/* buttons */
const explore=document.getElementById("mainBtn")
const back=document.getElementById("backBtn")
const cards=document.getElementById("cards")

back.style.display="none"

window.onload = () => {
  setTimeout(() => {
    loader.style.display = "none"
    container.classList.remove("hidden")

    // ABRE AUTOMATICAMENTE O CARD SOBRE
    const firstCard = document.querySelector(".card")
    firstCard.classList.add("open")
    cards.classList.add("hide")
  }, 2000)
}

back.onclick=()=>location.reload()

/* cards */
document.querySelectorAll(".card").forEach(card=>{
const close=card.querySelector(".close")

card.onclick=e=>{
if(e.target.classList.contains("close")) return
document.querySelectorAll(".card").forEach(c=>c.classList.remove("open"))
card.classList.add("open")
cards.classList.add("hide")
}

close.onclick=e=>{
e.stopPropagation()
card.classList.remove("open")
cards.classList.remove("hide")
}
})

/* particles */
const canvas=document.getElementById("particles")
const ctx=canvas.getContext("2d")

canvas.width=innerWidth
canvas.height=innerHeight

let particles=[]

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
ctx.fillStyle="cyan"
ctx.fill()
})
requestAnimationFrame(animate)
}
animate()

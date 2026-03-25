// --- DECLARAÇÕES ÚNICAS ---
const loader = document.getElementById("loader");
const container = document.querySelector(".container");
const mainBtn = document.getElementById("mainBtn");
const backBtn = document.getElementById("backBtn");
const allCards = document.querySelectorAll(".card");
const closeButtons = document.querySelectorAll(".close");

let current = 0;
let typingTimer;
let isTyping = false;
let matrixMode = false;
let currentAudio = 0;
let lastSoundTime = 0;

// --- SISTEMA DE SOM (Pool de Áudio) ---
const audioPool = [];
const poolSize = 5; 
const typingSoundSrc = "https://www.fesliyanstudios.com/play-mp3/6";

for (let i = 0; i < poolSize; i++) {
    audioPool.push(new Audio(typingSoundSrc));
}

let lastSoundTime = 0;

function playTypingSound() {
    const now = Date.now();
    if (now - lastSoundTime < 70) return;

    try {
        const sound = audioPool[currentAudio];
        sound.pause();
        sound.currentTime = 0;
        sound.volume = 0.08;
        sound.play();

        currentAudio = (currentAudio + 1) % poolSize;
        lastSoundTime = now;
    } catch(e){}
}

// --- EFEITO DE DIGITAÇÃO ---
function typeWriter(elemento) {
    clearTimeout(typingTimer);
isTyping = false;
    clearTimeout(typingTimer);
    isTyping = true;
    
    const textoOriginal = elemento.getAttribute('data-text') || elemento.innerHTML;
    if (!elemento.getAttribute('data-text')) elemento.setAttribute('data-text', textoOriginal);

    elemento.innerHTML = '';
    let i = 0;

    function digitar() {
        if (!elemento.isConnected) return;
        if (i < textoOriginal.length) {
            if (textoOriginal.slice(i, i + 4) === '<br>') {
                elemento.innerHTML += '<br>';
                i += 4;
            } else {
                elemento.innerHTML += textoOriginal.charAt(i);
                i++;
                playTypingSound();
            }
            let velocidade = Math.random() * (90 - 40) + 40;
            typingTimer = setTimeout(digitar, velocidade);
        } else {
            isTyping = false;
        }
    }
    digitar();
}

// --- MATRIX RAIN ---
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drops = Array(Math.floor(canvas.width / 16)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(4, 4, 15, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = matrixMode ? "#00ff46" : "#00ffff";
    ctx.font = "16px Orbitron";

    drops.forEach((y, i) => {
        const text = Math.floor(Math.random() * 2);
        ctx.fillText(text, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}

function animate() {
    drawMatrix();
    requestAnimationFrame(animate);
}
animate();

// --- LOGICA DOS CARDS ---
function showCard(index, abrirModal = false) {
    allCards.forEach(card => card.classList.remove("open"));
    if (abrirModal) {
        matrixMode = true;
        container.classList.add("matrix-glitch");
        setTimeout(() => container.classList.remove("matrix-glitch"), 200);
        
        const cardAlvo = allCards[index];
        cardAlvo.classList.add("open");
        
        const paragrafo = cardAlvo.querySelector("p");
        if (paragrafo) typeWriter(paragrafo);
        if (index === 1) skillTerminal();
    }
}

function skillTerminal() {
    const spans = document.querySelectorAll(".skills span");
    spans.forEach((span, index) => {
        span.style.opacity = "0";
        setTimeout(() => {
            span.style.opacity = "1";
            span.style.transition = "0.3s";
        }, 100 * index);
    });
}

// --- EVENTOS E CLIQUES ---
mainBtn.onclick = () => {
    current = 0;
    showCard(0, true);
};

document.getElementById("next").onclick = () => {
    current = (current + 1) % allCards.length;
    showCard(current, true);
};

document.getElementById("prev").onclick = () => {
    current = (current - 1 + allCards.length) % allCards.length;
    showCard(current, true);
};

closeButtons.forEach(btn => {
    btn.onclick = (e) => {
        e.stopPropagation();
        allCards.forEach(c => c.classList.remove("open"));
        matrixMode = false;
    };
});

backBtn.onclick = () => {
    container.classList.add("hidden");
    loader.style.display = "flex";
    loader.style.opacity = "1";
    setTimeout(() => window.location.reload(), 800);
};

// --- LOADER (UNICO) ---
window.onload = () => {
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
            container.classList.remove("hidden");
        }, 500);
    }, 2500);
};

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = Array(Math.floor(canvas.width / 16)).fill(1);
});

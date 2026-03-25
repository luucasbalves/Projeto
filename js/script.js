const loader = document.getElementById("loader");
const container = document.querySelector(".container");
const mainBtn = document.getElementById("mainBtn");
const backBtn = document.getElementById("backBtn");
const allCards = document.querySelectorAll(".card");
const closeButtons = document.querySelectorAll(".close");

const loader = document.getElementById("loader");
const container = document.querySelector(".container");
const mainBtn = document.getElementById("mainBtn");
const allCards = document.querySelectorAll(".card");

// --- SISTEMA DE SOM PROFISSIONAL (Pool de Áudio) ---
const audioPool = [];
const poolSize = 5; // Quantidade de sons simultâneos permitidos
const typingSoundSrc = "https://www.fesliyanstudios.com/play-mp3/6";

for (let i = 0; i < poolSize; i++) {
    audioPool.push(new Audio(typingSoundSrc));
}

let currentAudio = 0;
function playTypingSound() {
    const sound = audioPool[currentAudio];
    sound.volume = 0.15;
    sound.currentTime = 0; // Reinicia o som instantaneamente
    sound.play().catch(() => {});
    currentAudio = (currentAudio + 1) % poolSize;
}

// --- EFEITO DE DIGITAÇÃO ---
let typingTimer;
let isTyping = false;

function typeWriter(elemento) {
    clearTimeout(typingTimer);
    isTyping = true;
    
    const textoOriginal = elemento.getAttribute('data-text') || elemento.innerHTML;
    if (!elemento.getAttribute('data-text')) elemento.setAttribute('data-text', textoOriginal);

    elemento.innerHTML = '';
    let i = 0;

    function digitar() {
        if (i < textoOriginal.length) {
            if (textoOriginal.slice(i, i + 4) === '<br>') {
                elemento.innerHTML += '<br>';
                i += 4;
            } else {
                elemento.innerHTML += textoOriginal.charAt(i);
                i++;
                playTypingSound(); // Chama o pool de som
            }
            // Velocidade variada para parecer humano
            let velocidade = Math.random() * (40 - 15) + 15;
            typingTimer = setTimeout(digitar, velocidade);
        } else {
            isTyping = false;
        }
    }
    digitar();
}

// --- CONTROLE DOS CARDS ---
let matrixMode = false;
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

// --- MATRIX RAIN ---
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const drops = Array(Math.floor(canvas.width / 16)).fill(1);

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

// --- EVENTOS INICIAIS ---
window.onload = () => {
    // O loader fica 2.5 segundos para dar tempo do usuário ver a animação
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
            container.classList.remove("hidden");
        }, 500);
    }, 2500);
};

mainBtn.onclick = () => showCard(0, true);

// Fechar cards
document.querySelectorAll(".close").forEach(btn => {
    btn.onclick = (e) => {
        e.stopPropagation();
        allCards.forEach(c => c.classList.remove("open"));
        matrixMode = false;
    };
});

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

/* EVENTOS */
mainBtn.onclick = () => showCard(0, true);

document.getElementById("next").onclick = () => {
    current = (current + 1) % allCards.length;
    showCard(current, true);
};

document.getElementById("prev").onclick = () => {
    current = (current - 1 + allCards.length) % allCards.length;
    showCard(current, true);
};

backBtn.onclick = () => {
    container.classList.add("hidden");
    loader.style.display = "flex";
    setTimeout(() => window.location.reload(), 800);
};

closeButtons.forEach(btn => {
    btn.onclick = (e) => {
        e.stopPropagation();
        allCards.forEach(c => c.classList.remove("open"));
        matrixMode = false;
    };
});

window.onload = () => {
    setTimeout(() => {
        loader.style.display = "none";
        container.classList.remove("hidden");
    }, 2000);
};

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

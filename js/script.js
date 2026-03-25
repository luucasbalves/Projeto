// --- DECLARAÇÕES ÚNICAS ---
const loader = document.getElementById("loader");
const container = document.querySelector(".container");
const mainBtn = document.getElementById("mainBtn");
const backBtn = document.getElementById("backBtn");
const allCards = document.querySelectorAll(".card");
const closeButtons = document.querySelectorAll(".close");
const swipeSound = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
swipeSound.volume = 0.2;
const openSound = new Audio("https://www.fesliyanstudios.com/play-mp3/6677");
const closeSound = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
openSound.volume = 0.2;
closeSound.volume = 0.2;
const hoverSound = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
hoverSound.volume = 0.05;

let current = 0;
let typingTimer;
let isTyping = false;
let matrixMode = false;
let currentAudio = 0;
let lastSoundTime = 0;
let currentCardIndex = 0;    

// --- SISTEMA DE SOM (Pool de Áudio) ---
const audioPool = [];
const poolSize = 5; 
const typingSoundSrc = "https://www.fesliyanstudios.com/play-mp3/6";

for (let i = 0; i < poolSize; i++) {
    audioPool.push(new Audio(typingSoundSrc));
}

const terminal = document.getElementById("terminal");
const terminalText = document.getElementById("terminalText");
const lines = [
    "> iniciando sistema...",
    "> carregando módulos...",
    "> acessando perfil...",
    "> acesso autorizado ✔",
    "> Seja bem-vindo ao meu mundo!"
];

let lineIndex = 0;
let charIndex = 0;

function typeTerminal() {
    if (!terminal || !terminalText) return;

    if (lineIndex < lines.length) {
        if (charIndex < lines[lineIndex].length) {

            terminalText.innerHTML += lines[lineIndex].charAt(charIndex);
            charIndex++;

            playTypingSound();

            setTimeout(typeTerminal, 30);

        } else {
            terminalText.innerHTML += "<br>";
            lineIndex++;
            charIndex = 0;

            setTimeout(typeTerminal, 400);
        }
    } else {
        setTimeout(() => {
            terminal.style.opacity = "0";
            setTimeout(() => {
                terminal.style.display = "none";
            }, 500);
        }, 800);
    }
}


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

function stopTyping() {
    clearTimeout(typingTimer);
    isTyping = false;

    // para TODOS os áudios
    audioPool.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

// --- EFEITO DE DIGITAÇÃO ---
function typeWriter(elemento) {
    clearTimeout(typingTimer);
    isTyping = true;

    const textoOriginal = elemento.getAttribute('data-text') || elemento.innerHTML;

    if (!elemento.getAttribute('data-text')) {
        elemento.setAttribute('data-text', textoOriginal);
    }

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

            let velocidade = Math.random() * 80 + 20;
            typingTimer = setTimeout(digitar, velocidade);

        } else {
            isTyping = false;
        }
    }

    // 🔥 NOVO: clique para pular animação
    elemento.onclick = () => {
    if (isTyping) {
        stopTyping();
        elemento.innerHTML = textoOriginal;
    }
};

    digitar();
}

// --- MATRIX RAIN ---
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drops = Array(Math.floor(canvas.width / 16)).fill(1);
ctx.font = "16px Orbitron";


function drawMatrix() {
    ctx.fillStyle = "rgba(4, 4, 15, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!matrixMode) {
    ctx.fillStyle = "#00ffff";
} else {
    if (currentCardIndex === 0) ctx.fillStyle = "#00ffff";
    else if (currentCardIndex === 1) ctx.fillStyle = "#00ff88";
    else if (currentCardIndex === 2) ctx.fillStyle = "#ffaa00";
    else ctx.fillStyle = "#00ff46";
}

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
    stopTyping();
    currentCardIndex = index;

    document.body.classList.add("flash");
    setTimeout(() => document.body.classList.remove("flash"), 150);

    swipeSound.currentTime = 0;
    swipeSound.play().catch(()=>{});

    allCards.forEach(card => card.classList.remove("open"));

    if (abrirModal) {
        openSound.currentTime = 0;
        openSound.play().catch(()=>{});

        matrixMode = true;
        container.classList.add("matrix-glitch");

        setTimeout(() => container.classList.remove("matrix-glitch"), 200);

        const cardAlvo = allCards[index];
        cardAlvo.classList.add("open");

        const paragrafo = cardAlvo.querySelector("p");
        if (paragrafo) typeWriter(paragrafo);

        // clicar no card pula digitação
        cardAlvo.addEventListener("click", () => {
            if (isTyping) {
                const p = cardAlvo.querySelector("p");
                if (p) {
                    stopTyping();
                    p.innerHTML = p.getAttribute('data-text');
                }
            }
        }, { once: true });

        // evitar conflito botão fechar
        cardAlvo.querySelector(".close")?.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        if (index === 1) skillTerminal();
    }
}

document.querySelectorAll(".btn, .card").forEach(el => {
    el.addEventListener("mouseenter", () => {
        const now = Date.now();
        if (now - lastHoverTime < 100) return;

        hoverSound.currentTime = 0;
        hoverSound.play().catch(()=>{});
        lastHoverTime = now;
    });
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

        stopTyping();

        closeSound.currentTime = 0;
        closeSound.play().catch(()=>{});

        allCards.forEach(c => c.classList.remove("open"));
        matrixMode = false;
        currentCardIndex = 0;
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
    typeTerminal();
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

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
const ambientSound = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
ambientSound.loop = true;
ambientSound.volume = 0.03;

let current = 0;
let typingTimer;
let isTyping = false;
let matrixMode = false;
let currentAudio = 0;
let lastSoundTime = 0;
let currentCardIndex = 0;   
let lastHoverTime = 0;

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


function playTypingSound(speed = 50) {
    const now = Date.now();
    if (now - lastSoundTime < speed) return;

    try {
        const sound = audioPool[currentAudio];
        sound.pause();
        sound.currentTime = 0;

        // 🔥 volume varia (mais humano)
        sound.volume = Math.random() * 0.05 + 0.05;

        // 🔥 velocidade do áudio acompanha digitação
        sound.playbackRate = speed < 50 ? 1.3 : 0.9;

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
// mapa de proximidade do teclado (simula erro humano real)
const keyboardMap = {
    a: "sqwz",
    b: "vghn",
    c: "xdfv",
    d: "serfcx",
    e: "wsdfr",
    f: "drtgvc",
    g: "ftyhbv",
    h: "gyujnb",
    i: "ujko",
    j: "huikmn",
    k: "jiolm",
    l: "kop",
    m: "njk",
    n: "bhjm",
    o: "iklp",
    p: "ol",
    q: "wa",
    r: "edft",
    s: "awedxz",
    t: "rfgy",
    u: "yhji",
    v: "cfgb",
    w: "qase",
    x: "zsdc",
    y: "tghu",
    z: "asx"
};

// pega uma letra errada baseada na correta
function getTypo(char) {
    const lower = char.toLowerCase();
    if (keyboardMap[lower]) {
        const opcoes = keyboardMap[lower];
        return opcoes[Math.floor(Math.random() * opcoes.length)];
    }
    return char;
}
function typeWriter(elemento) {
    clearTimeout(typingTimer);
    isTyping = true;

    const textoOriginal = elemento.getAttribute('data-text') || elemento.innerHTML;

    if (!elemento.getAttribute('data-text')) {
        elemento.setAttribute('data-text', textoOriginal);
    }

    elemento.innerHTML = '';
    elemento.classList.add("typing");

    let i = 0;

    function digitar() {
        if (!elemento.isConnected) return;

        // 🔥 FINALIZAÇÃO SEGURA
        if (i >= textoOriginal.length) {
            isTyping = false;
            stopTyping();
            elemento.classList.remove("typing");
            return;
        }

        // 🔥 VELOCIDADE HUMANA (ANTES de usar!)
        let progresso = i / textoOriginal.length;
        let velocidade;

        if (progresso < 0.2) {
            velocidade = Math.random() * 80 + 80;
        } else if (progresso < 0.8) {
            velocidade = Math.random() * 40 + 20;
        } else {
            velocidade = Math.random() * 80 + 60;
        }

        if (Math.random() < 0.08) velocidade += 120;

        // 🔥 ERRO HUMANO
        if (
        Math.random() < 0.07 &&
        i > 5 &&
        textoOriginal.slice(i, i + 4) !== '<br>'
        ) {

            const letraCorreta = textoOriginal.charAt(i);
            const letraErrada = getTypo(letraCorreta);

            elemento.innerHTML += letraErrada;
            playTypingSound(velocidade);

            setTimeout(() => {
                elemento.innerHTML = elemento.innerHTML.slice(0, -1);

                setTimeout(() => {
                    elemento.innerHTML += letraCorreta;
                    i++;

                    playTypingSound(velocidade);

                    typingTimer = setTimeout(digitar, velocidade);
                }, 120);

            }, 180);

            return;
        }

        // quebra de linha
        if (textoOriginal.slice(i, i + 4) === '<br>') {
            elemento.innerHTML += '<br>';
            i += 4;
        } else {
            elemento.innerHTML += textoOriginal.charAt(i);
            i++;
            playTypingSound(velocidade);
        }

        typingTimer = setTimeout(digitar, velocidade);
    }

    elemento.onclick = () => {
        if (isTyping) {
            stopTyping();
            elemento.innerHTML = textoOriginal;
            elemento.classList.remove("typing");
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

function startAmbient() {
    if (!ambientSound.paused) return;
    ambientSound.play().catch(()=>{});
    document.removeEventListener("click", startAmbient);
}
document.addEventListener("click", startAmbient);
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
                    p.classList.remove("typing");
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
const scanLine = document.querySelector(".scan-line");

if (scanLine) {
    scanLine.style.opacity = "1";
    setTimeout(() => {
        scanLine.style.opacity = "0.3";
    }, 300);
}

document.querySelectorAll(".btn, .card").forEach(el => {
    el.addEventListener("mouseenter", () => {
        const now = Date.now();
        if (now - lastHoverTime < 200) return;

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

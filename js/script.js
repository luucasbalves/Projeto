/**
 * Lucas Portfolio Core Engine
 * Estruturado para performance e organização.
 */

// --- CONFIGURAÇÃO & ESTADO ---
const CONFIG = {
    audio: {
        typing: "https://www.fesliyanstudios.com/play-mp3/6",
        swipe: "https://www.fesliyanstudios.com/play-mp3/387",
        open: "https://www.fesliyanstudios.com/play-mp3/6677",
        hover: "https://www.fesliyanstudios.com/play-mp3/387",
        poolSize: 6
    },
    terminalLines: [
        "> iniciando sistema...",
        "> carregando módulos de UI...",
        "> acessando perfil: LUCAS_BARBOSA...",
        "> acesso autorizado ✔",
        "> Bem-vindo ao Terminal v2.0"
    ]
};

const state = {
    currentCardIndex: 0,
    isTyping: false,
    matrixMode: false,
    typingTimer: null,
    audioPool: [],
    poolIndex: 0
};

// --- ELEMENTOS DOM ---
const dom = {
    container: document.querySelector(".container"),
    bootScreen: document.getElementById("bootScreen"),
    terminal: document.getElementById("terminal"),
    terminalText: document.getElementById("terminalText"),
    cards: document.querySelectorAll(".card"),
    canvas: document.getElementById("particles"),
    bgMusic: document.getElementById("bgMusic")
};

// --- INICIALIZAÇÃO DE ÁUDIO ---
function initAudio() {
    for (let i = 0; i < CONFIG.audio.poolSize; i++) {
        state.audioPool.push(new Audio(CONFIG.audio.typing));
    }
}

function playSound(type, volume = 0.2) {
    let sound;
    switch(type) {
        case 'typing':
            sound = state.audioPool[state.poolIndex];
            state.poolIndex = (state.poolIndex + 1) % CONFIG.audio.poolSize;
            break;
        case 'open': sound = new Audio(CONFIG.audio.open); break;
        case 'swipe': sound = new Audio(CONFIG.audio.swipe); break;
        case 'hover': sound = new Audio(CONFIG.audio.hover); volume = 0.05; break;
    }
    if (sound) {
        sound.volume = volume;
        sound.play().catch(() => {});
    }
}

// --- EFEITO TYPING (DIGITAÇÃO) ---
function typeWriter(element, textOverride) {
    clearTimeout(state.typingTimer);
    state.isTyping = true;
    
    const text = textOverride || element.getAttribute('data-text') || element.innerHTML;
    if (!element.getAttribute('data-text')) element.setAttribute('data-text', text);
    
    element.innerHTML = '';
    element.classList.add("typing");
    
    let i = 0;
    function type() {
        if (i < text.length) {
            if (text.slice(i, i + 4) === '<br>') {
                element.innerHTML += '<br>';
                i += 4;
            } else {
                element.innerHTML += text.charAt(i);
                i++;
                playSound('typing', 0.08);
            }
            state.typingTimer = setTimeout(type, Math.random() * 30 + 20);
        } else {
            state.isTyping = false;
            element.classList.remove("typing");
        }
    }
    type();
}

// --- TERMINAL DE BOOT ---
function runTerminal() {
    dom.terminal.style.display = "flex";
    let lineIdx = 0;
    
    function nextLine() {
        if (lineIdx < CONFIG.terminalLines.length) {
            const p = document.createElement('p');
            dom.terminalText.appendChild(p);
            
            let charIdx = 0;
            const currentLine = CONFIG.terminalLines[lineIdx];
            
            function typeChar() {
                if (charIdx < currentLine.length) {
                    p.textContent += currentLine[charIdx];
                    charIdx++;
                    playSound('typing', 0.1);
                    setTimeout(typeChar, 20);
                } else {
                    lineIdx++;
                    setTimeout(nextLine, 400);
                }
            }
            typeChar();
        } else {
            setTimeout(() => {
                dom.terminal.style.opacity = "0";
                setTimeout(() => {
                    dom.terminal.style.display = "none";
                    dom.container.classList.remove("hidden");
                }, 500);
            }, 1000);
        }
    }
    nextLine();
}

// --- MATRIX RAIN ---
const ctx = dom.canvas.getContext("2d");
let drops = [];

function initMatrix() {
    dom.canvas.width = window.innerWidth;
    dom.canvas.height = window.innerHeight;
    drops = Array(Math.floor(dom.canvas.width / 16)).fill(1);
}

function drawMatrix() {
    ctx.fillStyle = "rgba(4, 4, 15, 0.1)";
    ctx.fillRect(0, 0, dom.canvas.width, dom.canvas.height);
    
    ctx.fillStyle = state.matrixMode ? "#00ff88" : "#00ffff";
    ctx.font = "16px Orbitron";
    
    drops.forEach((y, i) => {
        const char = Math.random() > 0.5 ? "0" : "1";
        ctx.fillText(char, i * 16, y * 16);
        if (y * 16 > dom.canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}

// --- GERENCIAMENTO DE CARDS ---
function toggleCard(index, open = true) {
    clearTimeout(state.typingTimer);
    
    if (open) {
        playSound('open');
        state.matrixMode = true;
        dom.cards[index].classList.add("open");
        const p = dom.cards[index].querySelector("p");
        if (p) typeWriter(p);
    } else {
        state.matrixMode = false;
        dom.cards.forEach(c => c.classList.remove("open"));
    }
}

// --- EVENTOS ---
function setupEventListeners() {
    // Botão Start
    document.getElementById("startBtn").onclick = () => {
        dom.bootScreen.style.display = "none";
        dom.bgMusic.volume = 0.2;
        dom.bgMusic.play().catch(() => {});
        runTerminal();
    };

    // Cards Click
    dom.cards.forEach((card, idx) => {
        card.addEventListener("click", () => {
            if (!card.classList.contains("open")) toggleCard(idx, true);
        });

        card.addEventListener("mouseenter", () => playSound('hover'));
    });

    // Fechar Cards
    document.querySelectorAll(".close").forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            toggleCard(0, false);
        };
    });

    // Navegação
    document.getElementById("next").onclick = () => {
        state.currentCardIndex = (state.currentCardIndex + 1) % dom.cards.length;
        toggleCard(0, false);
        toggleCard(state.currentCardIndex, true);
    };

    document.getElementById("prev").onclick = () => {
        state.currentCardIndex = (state.currentCardIndex - 1 + dom.cards.length) % dom.cards.length;
        toggleCard(0, false);
        toggleCard(state.currentCardIndex, true);
    };

    // Botão Back (Recarregar)
    document.getElementById("backBtn").onclick = () => location.reload();

    // Resize
    window.onresize = initMatrix;
}

// --- START ---
window.onload = () => {
    initAudio();
    initMatrix();
    setupEventListeners();
    
    function animate() {
        drawMatrix();
        requestAnimationFrame(animate);
    }
    animate();
};

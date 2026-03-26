/**
 * Lucas Portfolio JS - Refatorado para limpeza e semântica
 * Mantendo 100% das funcionalidades originais.
 */

// --- SELETORES ---
const dom = {
    container: document.querySelector(".container"),
    mainBtn: document.getElementById("mainBtn"),
    backBtn: document.getElementById("backBtn"),
    allCards: document.querySelectorAll(".card"),
    closeButtons: document.querySelectorAll(".close"),
    terminal: document.getElementById("terminal"),
    terminalText: document.getElementById("terminalText"),
    startBtn: document.getElementById("startBtn"),
    bootScreen: document.getElementById("bootScreen"),
    bgMusic: document.getElementById("bgMusic"),
    canvas: document.getElementById("particles"),
    nextBtn: document.getElementById("next"),
    prevBtn: document.getElementById("prev"),
    soundControl: document.getElementById("soundControl"),
    navArrows: document.querySelector(".nav-arrows")
};

// --- CONFIGURAÇÃO DE ÁUDIO ---
const sounds = {
    swipe: new Audio("https://www.fesliyanstudios.com/play-mp3/387"),
    open: new Audio("https://www.fesliyanstudios.com/play-mp3/6677"),
    close: new Audio("https://www.fesliyanstudios.com/play-mp3/387"),
    hover: new Audio("https://www.fesliyanstudios.com/play-mp3/387"),
    typingSrc: "https://www.fesliyanstudios.com/play-mp3/6"
};

// Ajuste de Volumes
sounds.swipe.volume = 0.2;
sounds.open.volume = 0.2;
sounds.close.volume = 0.2;
sounds.hover.volume = 0.05;

// Pool de Áudio para digitação (para evitar atrasos/bugs de som)
const audioPool = Array.from({ length: 5 }, () => new Audio(sounds.typingSrc));
let currentPoolIdx = 0;

// --- ESTADO DO APP ---
let state = {
    currentIdx: 0,
    isTyping: false,
    typingTimer: null,
    matrixMode: false,
    lastSoundTime: 0,
    lastHoverTime: 0
};

// --- FUNÇÕES DE ÁUDIO ---
let isMuted = false;
function playTypingSound(speed = 50) {
    const now = Date.now();
    if (now - state.lastSoundTime < speed) return;

    const sound = audioPool[currentPoolIdx];
    sound.pause();
    sound.currentTime = 0;
    sound.volume = Math.random() * 0.05 + 0.05;
    sound.playbackRate = speed < 50 ? 1.3 : 0.9;
    sound.play().catch(() => {});

    currentPoolIdx = (currentPoolIdx + 1) % audioPool.length;
    state.lastSoundTime = now;
}

function stopAllTypingSounds() {
    clearTimeout(state.typingTimer);
    state.isTyping = false;
    audioPool.forEach(s => { s.pause(); s.currentTime = 0; });
}

// --- EFEITO DE DIGITAÇÃO (HUMANIZADO) ---
const keyboardMap = {
    a: "sqwz", b: "vghn", c: "xdfv", d: "serfcx", e: "wsdfr", f: "drtgvc",
    g: "ftyhbv", h: "gyujnb", i: "ujko", j: "huikmn", k: "jiolm", l: "kop",
    m: "njk", n: "bhjm", o: "iklp", p: "ol", q: "wa", r: "edft", s: "awedxz",
    t: "rfgy", u: "yhji", v: "cfgb", w: "qase", x: "zsdc", y: "tghu", z: "asx"
};

function getTypo(char) {
    const lower = char.toLowerCase();
    const options = keyboardMap[lower];
    return options ? options[Math.floor(Math.random() * options.length)] : char;
}

function typeWriter(element) {
    stopAllTypingSounds();
    state.isTyping = true;

    const originalText = element.getAttribute('data-text') || element.innerHTML;
    if (!element.getAttribute('data-text')) element.setAttribute('data-text', originalText);

    element.innerHTML = '';
    element.classList.add("typing");

    let i = 0;
    function type() {
        if (!element.isConnected || i >= originalText.length) {
            state.isTyping = false;
            element.classList.remove("typing");
            return;
        }

        let speed = (i / originalText.length < 0.2) ? Math.random() * 80 + 80 :
                    (i / originalText.length < 0.8) ? Math.random() * 40 + 20 : Math.random() * 80 + 60;
        
        if (Math.random() < 0.08) speed += 120;

        // Erro Humano
        if (Math.random() < 0.07 && i > 5 && originalText.slice(i, i + 4) !== '<br>') {
            const correct = originalText.charAt(i);
            const typo = getTypo(correct);
            element.innerHTML += typo;
            playTypingSound(speed);
            setTimeout(() => {
                element.innerHTML = element.innerHTML.slice(0, -1);
                setTimeout(() => {
                    element.innerHTML += correct;
                    i++;
                    playTypingSound(speed);
                    state.typingTimer = setTimeout(type, speed);
                }, 120);
            }, 180);
            return;
        }

        // Quebra de linha
        if (originalText.slice(i, i + 4) === '<br>') {
            element.innerHTML += '<br>';
            i += 4;
        } else {
            element.innerHTML += originalText.charAt(i);
            i++;
            playTypingSound(speed);
        }
        state.typingTimer = setTimeout(type, speed);
    }

    element.onclick = () => {
        if (state.isTyping) {
            stopAllTypingSounds();
            element.innerHTML = originalText;
            element.classList.remove("typing");
        }
    };
    type();
}

// --- TERMINAL DE BOOT ---
const terminalLines = [
    "> iniciando sistema...",
    "> carregando módulos...",
    "> acessando perfil...",
    "> acesso autorizado ✔",
    "> Seja bem-vindo ao meu mundo!"
];

function typeTerminal() {
    let lineIdx = 0;
    let charIdx = 0;

    function run() {
        if (lineIdx < terminalLines.length) {
            if (charIdx < terminalLines[lineIdx].length) {
                dom.terminalText.innerHTML += terminalLines[lineIdx].charAt(charIdx);
                charIdx++;
                playTypingSound(30);
                setTimeout(run, 30);
            } else {
                dom.terminalText.innerHTML += "<br>";
                lineIdx++;
                charIdx = 0;
                setTimeout(run, 400);
            }
        } else {
            setTimeout(() => {
                dom.terminal.style.opacity = "0";
                setTimeout(() => dom.terminal.style.display = "none", 500);
            }, 800);
        }
    }
    run();
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
    ctx.fillStyle = state.matrixMode ? (state.currentIdx === 1 ? "#00ff88" : "#00ff46") : "#00ffff";
    ctx.font = "16px Orbitron";

    drops.forEach((y, i) => {
        ctx.fillText(Math.floor(Math.random() * 2), i * 16, y * 16);
        if (y * 16 > dom.canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}

// --- LÓGICA DE NAVEGAÇÃO DOS CARDS ---
function showCard(index, openModal = false) {
    stopAllTypingSounds();
    state.currentIdx = index;

    // Efeito Visual
    document.body.classList.add("flash");
    setTimeout(() => document.body.classList.remove("flash"), 150);

    sounds.swipe.currentTime = 0;
    sounds.swipe.play().catch(()=>{});

    // Esconde todos
    dom.allCards.forEach(c => {
        c.classList.remove("active", "open");
    });

    // Ativa o atual
    const target = dom.allCards[index];
    target.classList.add("active");

    if (openModal) {
        dom.navArrows.classList.add("active");
        sounds.open.currentTime = 0;
        sounds.open.play().catch(()=>{});
        state.matrixMode = true;
        dom.container.classList.add("matrix-glitch");
        setTimeout(() => dom.container.classList.remove("matrix-glitch"), 200);

        target.classList.add("open");
        const p = target.querySelector("p");
        if (p) typeWriter(p);

        if (index === 1) { // Skills
            const spans = target.querySelectorAll(".skills span");
            spans.forEach((s, i) => {
                s.style.opacity = "0";
                setTimeout(() => { s.style.opacity = "1"; s.style.transition = "0.3s"; }, 100 * i);
            });
        }
    }
}

// --- LISTENERS ---
function initApp() {
    initMatrix();
    setInterval(drawMatrix, 50);

    dom.startBtn.onclick = () => {
        dom.bgMusic.volume = 0.3;
        dom.bgMusic.play().catch(() => console.log("Audio Blocked"));
        dom.bootScreen.classList.add("boot-glitch");
        setTimeout(() => {
            dom.bootScreen.style.opacity = "0";
            setTimeout(() => {
                dom.bootScreen.style.display = "none";
                dom.container.classList.remove("hidden");
                dom.terminal.style.display = "flex";
                typeTerminal();
            }, 500);
        }, 600);
    };

    dom.mainBtn.onclick = () => showCard(0, true);

    dom.nextBtn.onclick = () => {
        const next = (state.currentIdx + 1) % dom.allCards.length;
        showCard(next, true);
    };

    dom.prevBtn.onclick = () => {
        const prev = (state.currentIdx - 1 + dom.allCards.length) % dom.allCards.length;
        showCard(prev, true);
    };

    dom.closeButtons.forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            stopAllTypingSounds();
            sounds.close.currentTime = 0;
            sounds.close.play().catch(()=>{});
            dom.allCards.forEach(c => c.classList.remove("open", "active"));
            dom.navArrows.classList.remove("active")
            state.matrixMode = false;
        };
    });

    dom.backBtn.onclick = () => {
    dom.overlay.classList.remove("active");
    dom.navArrows.classList.remove("active");

    dom.allCards.forEach(c => c.classList.remove("open", "active"));

    state.currentIdx = 0;
    state.matrixMode = false;

    dom.container.classList.add("hidden");

    dom.bootScreen.style.display = "flex";
    dom.bootScreen.style.opacity = "1";
};

    document.querySelectorAll(".btn, .card").forEach(el => {
        el.addEventListener("mouseenter", () => {
            const now = Date.now();
            if (now - state.lastHoverTime < 200) return;
            sounds.hover.currentTime = 0;
            sounds.hover.play().catch(()=>{});
            state.lastHoverTime = now;
        });
    });
    
    dom.soundControl.onclick = () => {
    isMuted = !isMuted;

    dom.bgMusic.muted = isMuted;

    Object.values(sounds).forEach(s => {
        if (s instanceof Audio) s.muted = isMuted;
    });

    audioPool.forEach(a => a.muted = isMuted);

    dom.soundControl.innerHTML = isMuted ? "🔇" : "🔊";
};
    window.onresize = initMatrix;
document.addEventListener("keydown", (e) => {

    const isOpen = document.querySelector(".card.open");
    if (!isOpen) return;

    if (e.key === "ArrowRight") {
        dom.nextBtn.click();
    }

    if (e.key === "ArrowLeft") {
        dom.prevBtn.click();
    }

    if (e.key === "Escape") {
        dom.overlay.click();
    }

    if (e.key === " ") {
        e.preventDefault();

        const p = document.querySelector(".card.open p");

        if (p && state.isTyping) {
            stopAllTypingSounds();
            p.innerHTML = p.getAttribute("data-text");
            p.classList.remove("typing");
        }
    }
});
}
    dom.navArrows.classList.remove("active");
initApp();

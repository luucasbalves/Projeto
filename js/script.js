/* --- CONFIGURAÇÕES E ELEMENTOS --- */
const loader = document.getElementById("loader");
const container = document.querySelector(".container");
const mainBtn = document.getElementById("mainBtn");
const backBtn = document.getElementById("backBtn");
const allCards = document.querySelectorAll(".card");
const closeButtons = document.querySelectorAll(".close");
const typingSound = document.getElementById("typing-sound");

let current = 0;
let typingTimer;
let isTyping = false;
let matrixMode = false;

// 1. EFEITO DE DIGITAÇÃO MELHORADO (CORRIGE <BR> E PULA ANIMAÇÃO)
function typeWriter(elemento) {
    clearTimeout(typingTimer);
    isTyping = true;
    
    // Pegamos o texto original (com <br>)
    const textoOriginal = elemento.getAttribute('data-text') || elemento.innerHTML;
    if (!elemento.getAttribute('data-text')) {
        elemento.setAttribute('data-text', textoOriginal);
    }

    elemento.innerHTML = '';
    let i = 0;

    function digitar() {
        if (i < textoOriginal.length) {
            // Se encontrar um '<', verifica se é um <br> para pular de uma vez
            if (textoOriginal.slice(i, i + 4) === '<br>') {
                elemento.innerHTML += '<br>';
                i += 4;
            } else {
                elemento.innerHTML += textoOriginal.charAt(i);
                i++;
                
                // SOM POR TECLA: Reseta e toca instantaneamente
                if (typingSound) {
                    const soundClone = typingSound.cloneNode(); // Clone permite sobrepor sons
                    soundClone.volume = 0.2;
                    soundClone.play().catch(() => {});
                }
            }
            typingTimer = setTimeout(digitar, 30); // Acelerado para 30ms
        } else {
            isTyping = false;
        }
    }
    digitar();

    // PULAR ANIMAÇÃO: Se clicar no card enquanto digita, mostra tudo
    elemento.closest('.card').onclick = () => {
        if (isTyping) {
            clearTimeout(typingTimer);
            elemento.innerHTML = textoOriginal;
            isTyping = false;
        }
    };
}

// 2. FUNDO DIGITAL RAIN (0 e 1)
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "01";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    // Fundo semitransparente para criar o rastro
    ctx.fillStyle = "rgba(4, 4, 15, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cor base (Ciano no início, Verde no Matrix Mode)
    ctx.fillStyle = matrixMode ? "#00ff46" : "#00ffff";
    ctx.font = fontSize + "px Orbitron";

    drops.forEach((y, i) => {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    });
}

function animate() {
    drawMatrix();
    requestAnimationFrame(animate);
}
animate();

// 3. LOGICA DOS CARDS
function showCard(index, abrirModal = false) {
    allCards.forEach(card => card.classList.remove("open"));
    if (abrirModal) {
        matrixMode = true; 
        const cardAlvo = allCards[index];
        cardAlvo.classList.add("open");

        if (index === 1) {
            skillTerminal();
        } else {
            const paragrafo = cardAlvo.querySelector("p");
            if (paragrafo) typeWriter(paragrafo);
        }
    }
}

/* --- EVENTOS --- */
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

function skillTerminal() {
    const skillsContainer = document.querySelector(".skills");
    const spans = skillsContainer.querySelectorAll("span");
    spans.forEach(s => s.style.opacity = "0");
    spans.forEach((span, index) => {
        setTimeout(() => {
            span.style.opacity = "1";
            span.style.transition = "0.3s";
        }, 200 * index);
    });
}

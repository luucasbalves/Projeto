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

// 1. EFEITO DE DIGITAÇÃO (SINTAXE CORRIGIDA)
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
        if (i < textoOriginal.length) {
            if (textoOriginal.slice(i, i + 4) === '<br>') {
                elemento.innerHTML += '<br>';
                i += 4;
            } else {
                elemento.innerHTML += textoOriginal.charAt(i);
                i++;
                
                // Som realista
                if (typingSound) {
                    let sound = new Audio(typingSound.src);
                    sound.volume = 0.1;
                    sound.play().catch(() => {});
                }
            }
            
            let velocidade = Math.random() * (50 - 20) + 20; 
            typingTimer = setTimeout(digitar, velocidade);
        } else {
            isTyping = false;
        }
    }
    digitar();

    // Pular animação ao clicar
    const cardPai = elemento.closest('.card');
    cardPai.onclick = () => {
        if (isTyping) {
            clearTimeout(typingTimer);
            elemento.innerHTML = textoOriginal;
            isTyping = false;
        }
    };
}

// 2. MATRIX RAIN
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "01";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(4, 4, 15, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        container.classList.add("matrix-glitch"); 
        setTimeout(() => container.classList.remove("matrix-glitch"), 200);
        
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

function skillTerminal() {
    const spans = document.querySelectorAll(".skills span");
    spans.forEach(s => s.style.opacity = "0");
    spans.forEach((span, index) => {
        setTimeout(() => {
            span.style.opacity = "1";
            span.style.transition = "0.3s";
        }, 150 * index);
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

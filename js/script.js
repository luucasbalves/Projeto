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
let matrixMode = false; // Controle da cor das partículas

// 1. EFEITO DE DIGITAÇÃO REALISTA COM SOM
function typeWriter(elemento) {
    clearTimeout(typingTimer);
    const textoOriginal = elemento.getAttribute('data-text') || elemento.innerHTML;
    
    if (!elemento.getAttribute('data-text')) {
        elemento.setAttribute('data-text', textoOriginal);
    }

    elemento.innerHTML = '';
    let i = 0;
    const caracteres = textoOriginal.split('');

    function digitar() {
        if (i < caracteres.length) {
            elemento.innerHTML += caracteres[i];
            
            // Toca o som de tecla (reseta o tempo para tocar rápido)
            if (typingSound) {
                typingSound.currentTime = 0;
                typingSound.play().catch(() => {}); // Catch evita erro de política de browser
            }

            i++;
            typingTimer = setTimeout(digitar, 60); // Velocidade humana real
        }
    }
    digitar();
}

// 2. EFEITO TERMINAL PARA SKILLS
function skillTerminal() {
    const skillsContainer = document.querySelector(".skills");
    const spans = skillsContainer.querySelectorAll("span");
    
    // Esconde todas primeiro
    spans.forEach(s => s.style.opacity = "0");
    
    spans.forEach((span, index) => {
        setTimeout(() => {
            span.style.opacity = "1";
            span.style.transition = "0.3s";
            // Adiciona um prefixo de terminal "> " temporário
            console.log(`Loading module: ${span.innerText}... OK`);
        }, 300 * index);
    });
}

// MOSTRAR CARD (MODO MATRIX)
function showCard(index, abrirModal = false) {
    allCards.forEach(card => card.classList.remove("open"));

    if (abrirModal) {
        // Ativa o Modo Matrix (Muda cor das partículas)
        matrixMode = true; 
        
        const cardAlvo = allCards[index];
        cardAlvo.classList.add("open");

        // Diferencia se é Skill ou Texto comum
        if (index === 1) { // Card de Skills
            skillTerminal();
        } else {
            const paragrafo = cardAlvo.querySelector("p");
            if (paragrafo) typeWriter(paragrafo);
        }

        if (index === 5) {
            const wppBtn = cardAlvo.querySelector(".wpp");
            if (wppBtn) wppBtn.classList.add("wpp-animation");
        }
    }
}

/* --- EVENTOS --- */

mainBtn.onclick = () => {
    current = 0;
    showCard(current, true);
};

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
        matrixMode = false; // Volta a cor original
    };
});

window.onload = () => {
    setTimeout(() => {
        loader.style.display = "none";
        container.classList.remove("hidden");
    }, 2000);
};

/* --- PARTICULAS COM MUDANÇA DE COR --- */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.8,
        dy: (Math.random() - 0.5) * 0.8
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        
        // Efeito Matrix: Se um card estiver aberto, fica verde. Senão, ciano.
        ctx.fillStyle = matrixMode ? "rgba(0, 255, 70, 0.6)" : "rgba(0, 255, 255, 0.5)";
        
        ctx.fill();
    });
    requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

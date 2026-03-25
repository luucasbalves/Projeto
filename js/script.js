/* --- CONFIGURAÇÕES E ELEMENTOS --- */
const loader = document.getElementById("loader");
const container = document.querySelector(".container");
const mainBtn = document.getElementById("mainBtn");
const allCards = document.querySelectorAll(".card");
const closeButtons = document.querySelectorAll(".close");
let current = 0;

// Função para o efeito de Digitação (Typewriter)
let typingTimer; // Variável para controlar o tempo

function typeWriter(elemento) {
    // Se já tiver uma digitação rolando, a gente para ela antes de começar a nova
    clearTimeout(typingTimer); 
    
    const textoOriginal = elemento.getAttribute('data-text') || elemento.innerHTML;
    // Salva o texto original para não perder as tags HTML (como <br>)
    if (!elemento.getAttribute('data-text')) {
        elemento.setAttribute('data-text', textoOriginal);
    }

    elemento.innerHTML = '';
    const caracteres = textoOriginal.split('');
    
    caracteres.forEach((letra, i) => {
        typingTimer = setTimeout(() => {
            elemento.innerHTML += letra;
        }, 15 * i);
    });
}

// Função Principal de Mostrar Card
function showCard(index, abrirModal = false) {
    allCards.forEach(card => card.classList.remove("active", "open"));
    
    const cardAlvo = allCards[index];
    cardAlvo.classList.add("active");

    if (abrirModal) {
        cardAlvo.classList.add("open");
        const paragrafo = cardAlvo.querySelector("p");
        
        // Se for o card de contato, adiciona animação no botão de Whats
        if (index === 5) { // Index do card de Contato
            const wppBtn = cardAlvo.querySelector(".wpp");
            wppBtn.classList.add("wpp-animation");
        }
        
        // Dispara o efeito de escrever se houver parágrafo
        if (paragrafo) {
            typeWriter(paragrafo);
        }
    }
}

/* --- EVENTOS --- */

// Botão Inicial
mainBtn.addEventListener("click", () => {
    current = 0;
    showCard(current, true);
});

// Botão Próximo
document.getElementById("next").onclick = () => {
    current = (current + 1) % allCards.length;
    showCard(current, true);
};

// Botão Anterior
document.getElementById("prev").onclick = () => {
    current = (current - 1 + allCards.length) % allCards.length;
    showCard(current, true);
};

// Botão Fechar
closeButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.closest(".card").classList.remove("open");
    });
});

// Loader Inicial
window.onload = () => {
    setTimeout(() => {
        loader.style.display = "none";
        container.classList.remove("hidden");
    }, 2000);
};

// Lógica das Partículas (Mantenha o seu código de partículas original aqui embaixo)
/* --- PARTICULAS (BACKGROUND) --- */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 70; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
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
        ctx.fillStyle = `rgba(0, 255, 255, ${0.3 + Math.random() * 0.5})`;
        ctx.fill();
    });
    requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

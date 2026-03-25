/* --- CONFIGURAÇÕES INICIAIS & LOADER --- */
const loader = document.getElementById("loader");
const container = document.querySelector(".container");
const dots = document.getElementById("dots");
const mainBtn = document.getElementById("mainBtn");
const allCards = document.querySelectorAll(".card");
const closeButtons = document.querySelectorAll(".close");

let c = 0;
const anim = setInterval(() => {
    c++;
    dots.textContent = ".".repeat(c % 4);
}, 400);

let current = 0;

window.onload = () => {
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
            container.classList.remove("hidden");
        }, 500);
        clearInterval(anim);
    }, 2000);
};

/* --- LÓGICA DOS CARDS (MODAL & NAVEGAÇÃO) --- */

function showCard(index) {
    // Remove as classes de todo mundo primeiro
    allCards.forEach(card => {
        card.classList.remove("active", "open");
    });
    // Ativa o card atual (para o CSS saber quem mostrar)
    allCards[index].classList.add("active");
}

// Botão principal: Inicia a jornada
mainBtn.addEventListener("click", () => {
    current = 0;
    showCard(current);
    allCards[current].classList.add("open");
});

// Fechar os cards
closeButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation(); // Evita que o clique "vaze" para o card
        const card = btn.closest(".card");
        card.classList.remove("open");
    });
});

// Navegação por Setas (Próximo e Anterior)
document.getElementById("next").onclick = () => {
    current = (current + 1) % allCards.length;
    showCard(current);
    allCards[current].classList.add("open");
};

document.getElementById("prev").onclick = () => {
    current = (current - 1 + allCards.length) % allCards.length;
    showCard(current);
    allCards[current].classList.add("open");
};

// Navegação por Teclado
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") document.getElementById("next").click();
    if (e.key === "ArrowLeft") document.getElementById("prev").click();
    if (e.key === "Escape") {
        allCards.forEach(card => card.classList.remove("open"));
    }
});

// Clique direto no card (caso queira abrir um específico)
allCards.forEach((card, index) => {
    card.addEventListener("click", () => {
        current = index;
        card.classList.add("open");
    });
});

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

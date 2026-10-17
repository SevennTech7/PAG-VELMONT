
/* =========================================
   CONFIGURAÇÕES DO SITE
========================================= */

const CONFIG = {
    // Coloque sua chave Pix entre as aspas.
    // Pode ser CPF/CNPJ, e-mail, telefone,
    // chave aleatória ou código Pix Copia e Cola.
    pixKey: "22ac0e0d-0e89-4be2-827a-f3172a7da75e",

    // Nome exibido no rodapé.
    companyName: "SEVENN TECH"
};


/* =========================================
   CHAVE PIX E BOTÃO DE CÓPIA
========================================= */

const pixDisplay = document.getElementById("pix-display");
const copyButton = document.getElementById("copy-button");
const buttonText = document.getElementById("button-text");
const buttonIcon = document.getElementById("button-icon");
const feedback = document.getElementById("feedback");

const originalIcon = `
    <rect x="8" y="8" width="12" height="12" rx="2"
        stroke="currentColor" stroke-width="1.7"/>
    <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4H5.5A1.5 1.5 0 0 0 4 5.5V14.5A1.5 1.5 0 0 0 5.5 16H8"
        stroke="currentColor" stroke-width="1.7"/>
`;

const successIcon = `
    <path d="M5 12L10 17L20 7"
        stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
`;

function hasConfiguredKey() {
    return (
        CONFIG.pixKey.trim() !== "" &&
        CONFIG.pixKey !== "SUA_CHAVE_PIX_AQUI"
    );
}

function updatePixDisplay() {
    if (hasConfiguredKey()) {
        pixDisplay.textContent = CONFIG.pixKey;
    } else {
        pixDisplay.textContent = "Configure sua chave Pix";
    }
}

async function copyPixKey() {
    if (!hasConfiguredKey()) {
        feedback.textContent = "Configure sua chave Pix no arquivo script.js.";
        return;
    }

    try {
        // Método moderno de cópia.
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(CONFIG.pixKey);
        } else {
            // Alternativa para ambientes sem Clipboard API.
            const textarea = document.createElement("textarea");

            textarea.value = CONFIG.pixKey;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            textarea.style.pointerEvents = "none";

            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, textarea.value.length);

            const copied = document.execCommand("copy");

            textarea.remove();

            if (!copied) {
                throw new Error("Não foi possível copiar.");
            }
        }

        buttonText.textContent = "CHAVE COPIADA!";
        buttonIcon.innerHTML = successIcon;
        copyButton.classList.add("copied");
        feedback.textContent = "Agora cole a chave no aplicativo do seu banco.";

    } catch (error) {
        feedback.textContent =
            "Não foi possível copiar automaticamente. Verifique a configuração do site.";
    }
}

copyButton.addEventListener("click", copyPixKey);

document.getElementById("footer-name").textContent = CONFIG.companyName;
document.getElementById("year").textContent = new Date().getFullYear();

updatePixDisplay();


/* =========================================
   PARTÍCULAS DE DIAMANTE
========================================= */

const canvas = document.getElementById("diamonds");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let particles = [];
let animationFrame = null;

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particleCount = Math.min(
        55,
        Math.max(20, Math.floor((width * height) / 18000))
    );

    particles = Array.from(
        { length: particleCount },
        () => createDiamond(true)
    );

    if (reduceMotion) {
        drawParticles();
    }
}

function createDiamond(randomPosition = false) {
    return {
        x: Math.random() * width,
        y: randomPosition
            ? Math.random() * height
            : height + 20 + Math.random() * 80,

        size: Math.random() * 5 + 2,
        speed: Math.random() * 0.32 + 0.10,
        drift: (Math.random() - 0.5) * 0.35,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        opacity: Math.random() * 0.45 + 0.12,
        twinkle: Math.random() * 0.025 + 0.008,
        phase: Math.random() * Math.PI * 2
    };
}

function drawDiamond(particle) {
    const {
        x, y, size, rotation, opacity
    } = particle;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.globalAlpha = opacity;

    // Silhueta do diamante.
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.7, -size * 0.25);
    ctx.lineTo(size * 0.65, size * 0.35);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.65, size * 0.35);
    ctx.lineTo(-size * 0.7, -size * 0.25);
    ctx.closePath();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Facetas internas.
    ctx.beginPath();
    ctx.moveTo(-size * 0.7, -size * 0.25);
    ctx.lineTo(0, size);
    ctx.lineTo(size * 0.7, -size * 0.25);

    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);

    ctx.moveTo(-size * 0.7, -size * 0.25);
    ctx.lineTo(size * 0.7, -size * 0.25);

    ctx.strokeStyle = "#dddddd";
    ctx.lineWidth = 0.45;
    ctx.stroke();

    // Pequeno brilho central.
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(0.5, size * 0.12), 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.restore();
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
        drawDiamond(particle);
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
        particle.y -= particle.speed;
        particle.x += particle.drift;
        particle.rotation += particle.rotationSpeed;
        particle.phase += particle.twinkle;

        // Brilho oscilante, discreto.
        particle.opacity =
            0.12 + (Math.sin(particle.phase) + 1) * 0.19;

        if (particle.y < -25) {
            Object.assign(particle, createDiamond(false));
        }

        if (particle.x < -25) {
            particle.x = width + 20;
        }

        if (particle.x > width + 25) {
            particle.x = -20;
        }

        drawDiamond(particle);
    });

    animationFrame = requestAnimationFrame(animateParticles);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

if (!reduceMotion) {
    animateParticles();
}

// Pausa a animação quando a aba não está visível.
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    } else if (!reduceMotion && animationFrame === null) {
        animateParticles();
    }
});

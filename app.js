console.log("✅ app.js cargado");

const chatBox = document.getElementById("chatBox");
const closeChat = document.getElementById("closeChat");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");

// Botones que pueden abrir el chat
const desktopButton = document.querySelector(".hero-text button");
const mobileButton = document.getElementById("mobileOpenChat");
const mobileBigButton = document.querySelector(".mobile-btn");

function openChat() {
    console.log("✅ Abriendo chat");
    chatBox.classList.remove("hidden");
    chatInput.focus();
}

if (desktopButton) {
    desktopButton.addEventListener("click", openChat);
}

if (mobileButton) {
    mobileButton.addEventListener("click", openChat);
}

if (mobileBigButton) {
    mobileBigButton.addEventListener("click", openChat);
}

if (closeChat) {
    closeChat.addEventListener("click", () => {
        chatBox.classList.add("hidden");
    });
}

function convertirLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, function(url) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">📍 Abrir Google Maps</a>`;
    });
}

function addMessage(text, type) {
    const message = document.createElement("div");
    message.className = type === "user" ? "user-message" : "bot-message";

    if (type === "bot") {
        message.innerHTML = convertirLinks(text);
    } else {
        message.textContent = text;
    }

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendQuestion() {
    const question = chatInput.value.trim();

    if (!question) return;

    addMessage(question, "user");
    chatInput.value = "";

    const loadingMessage = document.createElement("div");
    loadingMessage.className = "bot-message";
    loadingMessage.textContent = "Bobby está buscando...";
    chatMessages.appendChild(loadingMessage);

    try {
        const response = await fetch("https://perfiles-y-metales-xela-backend.onrender.com/preguntar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        loadingMessage.remove();
        addMessage(data.answer, "bot");

    } catch (error) {
        console.error("❌ Error en fetch:", error);

        loadingMessage.remove();
        addMessage("No pude conectar con Bobby. Revisá que Flask esté corriendo.", "bot");
    }
}

if (sendChat) {
    sendChat.addEventListener("click", sendQuestion);
}

if (chatInput) {
    chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendQuestion();
        }
    });
}

/* Galería del local: el orden se obtiene del HTML para admitir nuevas fotos. */
(() => {
    const items = [...document.querySelectorAll("[data-gallery-item]")];
    const lightbox = document.getElementById("galleryLightbox");

    if (!items.length || !lightbox) return;

    const lightboxImage = lightbox.querySelector(".gallery-lightbox-content img");
    const caption = lightbox.querySelector("figcaption");
    const closeButton = lightbox.querySelector(".gallery-lightbox-close");
    const previousButton = lightbox.querySelector(".gallery-lightbox-prev");
    const nextButton = lightbox.querySelector(".gallery-lightbox-next");
    const focusableControls = [closeButton, previousButton, nextButton];
    let currentIndex = 0;
    let previousFocus = null;
    let pointerStartX = null;

    const showImage = (index) => {
        currentIndex = (index + items.length) % items.length;
        const thumbnail = items[currentIndex].querySelector("img");
        const label = items[currentIndex].querySelector("span");

        lightboxImage.src = thumbnail.currentSrc || thumbnail.src;
        lightboxImage.alt = thumbnail.alt;
        caption.textContent = label ? label.textContent : thumbnail.alt;
    };

    const openLightbox = (index) => {
        previousFocus = document.activeElement;
        showImage(index);
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("gallery-modal-open");
        setTimeout(() => closeButton.focus(), 0);
    };

    const closeLightbox = () => {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("gallery-modal-open");

        if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };

    items.forEach((item, index) => {
        item.addEventListener("click", () => openLightbox(index));
    });

    closeButton.addEventListener("click", closeLightbox);
    previousButton.addEventListener("click", () => showImage(currentIndex - 1));
    nextButton.addEventListener("click", () => showImage(currentIndex + 1));

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowLeft") showImage(currentIndex - 1);
        if (event.key === "ArrowRight") showImage(currentIndex + 1);

        if (event.key === "Tab") {
            const firstControl = focusableControls[0];
            const lastControl = focusableControls[focusableControls.length - 1];

            if (event.shiftKey && document.activeElement === firstControl) {
                event.preventDefault();
                lastControl.focus();
            } else if (!event.shiftKey && document.activeElement === lastControl) {
                event.preventDefault();
                firstControl.focus();
            }
        }
    });

    lightboxImage.addEventListener("pointerdown", (event) => {
        pointerStartX = event.clientX;
        lightboxImage.setPointerCapture?.(event.pointerId);
    });

    lightboxImage.addEventListener("pointerup", (event) => {
        if (pointerStartX === null) return;

        const distance = event.clientX - pointerStartX;
        pointerStartX = null;

        if (Math.abs(distance) < 45) return;
        showImage(currentIndex + (distance < 0 ? 1 : -1));
    });

    lightboxImage.addEventListener("pointercancel", () => {
        pointerStartX = null;
    });
})();

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
        const response = await fetch("/preguntar", {
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
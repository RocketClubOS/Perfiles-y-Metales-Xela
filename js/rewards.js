const API_BASE_URL = "https://perfiles-y-metales-xela-backend.onrender.com";

const clubForm = document.querySelector("#clubForm");
const saldoForm = document.querySelector("#saldoForm");
const clubMessage = document.querySelector("#clubSuccess");
const saldoResult = document.querySelector("#saldoResult");
const welcomePanel = document.querySelector("#welcomePanel");
const welcomeName = document.querySelector("#welcomeName");
const welcomePhone = document.querySelector("#welcomePhone");
const welcomeType = document.querySelector("#welcomeType");
const welcomeCity = document.querySelector("#welcomeCity");
const welcomeBalance = document.querySelector("#welcomeBalance");
const viewBalanceButton = document.querySelector("#viewBalanceButton");

function setMessage(element, message, isError = false) {
    if (!element) return;

    element.textContent = message;
    element.classList.toggle("is-error", isError);
}

function formatCurrency(value) {
    const amount = Number(value || 0);
    return `Q${amount.toFixed(2)}`;
}

async function parseJsonResponse(response) {
    const data = await response.json();

    if (!response.ok || data.ok === false) {
        throw new Error(data.error || data.message || "No se pudo completar la solicitud.");
    }

    return data;
}

if (clubForm) {
    clubForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!clubForm.checkValidity()) {
            clubForm.reportValidity();
            return;
        }

        const formData = new FormData(clubForm);
        const payload = {
            nombre: formData.get("nombre") || "",
            telefono: formData.get("telefono") || "",
            email: formData.get("email") || "",
            ciudad: formData.get("ciudad") || "",
            tipo_cliente: formData.get("tipo_cliente") || "",
            source: "rewards.html",
        };

        try {
            setMessage(clubMessage, "Guardando afiliacion...");

            await parseJsonResponse(await fetch(`${API_BASE_URL}/api/rewards/enroll`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }));

            setMessage(clubMessage, "Afiliacion guardada correctamente.");

            if (welcomePanel) {
                welcomePanel.classList.remove("is-hidden");
            }

            if (welcomeName) welcomeName.textContent = payload.nombre || "-";
            if (welcomePhone) welcomePhone.textContent = payload.telefono || "-";
            if (welcomeType) welcomeType.textContent = payload.tipo_cliente || "-";
            if (welcomeCity) welcomeCity.textContent = payload.ciudad || "-";
            if (welcomeBalance) welcomeBalance.textContent = formatCurrency(5);

            clubForm.reset();
        } catch (error) {
            setMessage(clubMessage, error.message || "No se pudo guardar la afiliacion.", true);
            alert(error.message || "No se pudo guardar la afiliacion.");
        }
    });
}

if (saldoForm) {
    saldoForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!saldoForm.checkValidity()) {
            saldoForm.reportValidity();
            return;
        }

        const formData = new FormData(saldoForm);
        const telefono = String(formData.get("telefono") || "").trim();

        try {
            setMessage(saldoResult, "Consultando saldo...");

            const data = await parseJsonResponse(await fetch(
                `${API_BASE_URL}/api/saldo/${encodeURIComponent(telefono)}`
            ));

            setMessage(
                saldoResult,
                `${data.nombre || "Cliente"} - Saldo disponible: ${formatCurrency(data.saldo)}`
            );
        } catch (error) {
            setMessage(saldoResult, error.message || "No se pudo consultar el saldo.", true);
        }
    });
}

if (viewBalanceButton && saldoForm) {
    viewBalanceButton.addEventListener("click", () => {
        saldoForm.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    });
}

const API_BASE = ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://localhost:5000"
    : "https://perfiles-y-metales-xela-backend.onrender.com";

let selectedCustomer = null;
let programActive = false;

async function api(path, options = {}) {
    let response;
    try {
        response = await fetch(`${API_BASE}${path}`, {
            credentials: "include",
            ...options,
            headers: {"Content-Type": "application/json", ...(options.headers || {})},
        });
    } catch {
        throw new Error("Sin conexión. Verifica internet e intenta nuevamente.");
    }
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
        if (!window.location.pathname.endsWith("/login.html")) {
            window.location.replace("login.html");
        }
        throw new Error("La sesión expiró.");
    }
    if (!response.ok || data.success === false) {
        const error = new Error(data.message || "No fue posible completar la operación.");
        error.code = data.error;
        throw error;
    }
    return data;
}

function message(element, text = "", type = "") {
    if (!element) return;
    element.textContent = text;
    element.className = `message ${type}`.trim();
}

function busy(form, active) {
    form.querySelectorAll("button, input").forEach((control) => {
        control.disabled = active;
    });
}

function operationKey() {
    return crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const loginForm = document.querySelector("#loginForm");
if (loginForm) {
    api("/api/sales/auth/session").then(() => {
        window.location.replace("index.html");
    }).catch(() => {});

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const output = document.querySelector("#loginMessage");
        const values = new FormData(loginForm);
        busy(loginForm, true);
        message(output, "Validando acceso...");
        try {
            await api("/api/sales/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    employee_id: values.get("employee_id"),
                    pin: values.get("pin"),
                }),
            });
            window.location.replace("index.html");
        } catch (error) {
            message(output, error.message, "error");
            busy(loginForm, false);
        }
    });
}

const searchForm = document.querySelector("#searchForm");
if (searchForm) initializeSalesPoint();

async function initializeSalesPoint() {
    try {
        const [sessionData, statusData] = await Promise.all([
            api("/api/sales/auth/session"),
            api("/api/sales/system-status"),
        ]);
        document.querySelector("#employeeName").textContent =
            sessionData.data.employee.name;
        document.querySelector("#employeeId").textContent =
            sessionData.data.employee.employee_id;
        programActive = statusData.data.active;
        const status = document.querySelector("#programStatus");
        status.textContent = programActive
            ? "Programa de recompensas activo"
            : "El programa está temporalmente pausado. Contacta al administrador.";
        status.classList.toggle("paused", !programActive);
        loadHistory();
    } catch (error) {
        if (!error.message.includes("sesión")) {
            document.querySelector("#programStatus").textContent = error.message;
        }
    }
}

document.querySelector("#logoutButton")?.addEventListener("click", async () => {
    await api("/api/sales/auth/logout", {method: "POST"}).catch(() => {});
    window.location.replace("login.html");
});

searchForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const output = document.querySelector("#searchMessage");
    const values = new FormData(searchForm);
    busy(searchForm, true);
    message(output, "Buscando cliente...");
    try {
        const result = await api("/api/sales/customers/search", {
            method: "POST",
            body: JSON.stringify({telefono: values.get("telefono")}),
        });
        selectedCustomer = result.data.customer;
        document.querySelector("#customerName").textContent = selectedCustomer.name;
        document.querySelector("#customerPhone").textContent = selectedCustomer.phone_masked;
        document.querySelector("#customerStatus").textContent = selectedCustomer.status;
        document.querySelector("#customerBalance").textContent =
            `${selectedCustomer.balance} puntos`;
        document.querySelector("#customerCard").classList.remove("is-hidden");
        document.querySelector("#operationSection").classList.toggle(
            "is-disabled", !programActive
        );
        message(output, "Cliente encontrado.", "success");
    } catch (error) {
        selectedCustomer = null;
        document.querySelector("#customerCard").classList.add("is-hidden");
        document.querySelector("#operationSection").classList.add("is-disabled");
        message(output, error.message, "error");
    } finally {
        busy(searchForm, false);
    }
});

document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((item) =>
            item.classList.toggle("is-active", item === tab)
        );
        document.querySelector("#purchaseForm").classList.toggle(
            "is-hidden", tab.dataset.tab !== "purchase"
        );
        document.querySelector("#redeemForm").classList.toggle(
            "is-hidden", tab.dataset.tab !== "redeem"
        );
    });
});

document.querySelector("#previewButton")?.addEventListener("click", async () => {
    const form = document.querySelector("#purchaseForm");
    if (!form.reportValidity() || !selectedCustomer) return;
    const values = new FormData(form);
    const output = document.querySelector("#purchaseMessage");
    busy(form, true);
    message(output, "Calculando puntos...");
    try {
        const result = await api("/api/sales/purchases/preview", {
            method: "POST",
            body: JSON.stringify({
                customer_id: selectedCustomer.customer_id,
                invoice: values.get("invoice"),
                amount: values.get("amount"),
            }),
        });
        const preview = document.querySelector("#purchasePreview");
        preview.textContent =
            `Factura ${result.data.invoice} · Q${Number(result.data.purchase_amount).toFixed(2)} · ` +
            `${result.data.points_to_add} puntos`;
        preview.classList.remove("is-hidden");
        message(output);
    } catch (error) {
        message(output, error.message, "error");
    } finally {
        busy(form, false);
    }
});

document.querySelector("#purchaseForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!selectedCustomer) return;
    const values = new FormData(form);
    const output = document.querySelector("#purchaseMessage");
    busy(form, true);
    message(output, "Guardando compra...");
    try {
        const result = await api("/api/sales/purchases", {
            method: "POST",
            body: JSON.stringify({
                customer_id: selectedCustomer.customer_id,
                invoice: values.get("invoice"),
                amount: values.get("amount"),
                idempotency_key: operationKey(),
            }),
        });
        message(
            output,
            `Compra registrada. Factura ${result.data.invoice}. ` +
            `${result.data.points_added} puntos acreditados. ` +
            `Nuevo saldo: ${result.data.new_balance}.`,
            "success"
        );
        form.reset();
        document.querySelector("#purchasePreview").classList.add("is-hidden");
        selectedCustomer.balance = result.data.new_balance;
        document.querySelector("#customerBalance").textContent =
            `${selectedCustomer.balance} puntos`;
        loadHistory();
    } catch (error) {
        message(output, error.message, "error");
    } finally {
        busy(form, false);
    }
});

document.querySelector("#redeemForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!selectedCustomer) return;
    const values = new FormData(form);
    const output = document.querySelector("#redeemMessage");
    busy(form, true);
    message(output, "Procesando canje...");
    try {
        const result = await api("/api/sales/redeem", {
            method: "POST",
            body: JSON.stringify({
                customer_id: selectedCustomer.customer_id,
                invoice: values.get("invoice"),
                points: values.get("points"),
                idempotency_key: operationKey(),
            }),
        });
        message(
            output,
            `Canje completado. Factura ${result.data.invoice}. ` +
            `${result.data.points_redeemed} puntos canjeados. ` +
            `Nuevo saldo: ${result.data.new_balance}.`,
            "success"
        );
        form.reset();
        selectedCustomer.balance = result.data.new_balance;
        document.querySelector("#customerBalance").textContent =
            `${selectedCustomer.balance} puntos`;
        loadHistory();
    } catch (error) {
        message(output, error.message, "error");
    } finally {
        busy(form, false);
    }
});

async function loadHistory() {
    const list = document.querySelector("#historyList");
    try {
        const result = await api("/api/sales/history");
        const operations = result.data.operations;
        if (!operations.length) {
            list.textContent = "Todavía no tienes operaciones.";
            return;
        }
        list.replaceChildren(...operations.map((operation) => {
            const item = document.createElement("article");
            item.className = "history-item";
            const safeValues = [
                [`${operation.date} ${operation.time}`, "Fecha"],
                [operation.customer || operation.phone_masked, "Cliente"],
                [operation.invoice, operation.type],
                [`${operation.points} puntos`, operation.status],
            ];
            safeValues.forEach(([value, label]) => {
                const cell = document.createElement("div");
                const strong = document.createElement("strong");
                const small = document.createElement("small");
                strong.textContent = value;
                small.textContent = label;
                cell.append(strong, small);
                item.append(cell);
            });
            return item;
        }));
    } catch (error) {
        list.textContent = error.message;
    }
}

document.querySelector("#refreshHistory")?.addEventListener("click", loadHistory);

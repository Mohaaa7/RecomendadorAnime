const API_URL = "http://127.0.0.1:5000";

// Obtener Recomendaciones
document.getElementById("btnRecomendar").addEventListener("click", async () => {
    const animes = document.getElementById("animes").value.trim();
    const ratings = document.getElementById("ratings").value.trim();
    const resultado = document.getElementById("resultado");

    if (!animes || !ratings) {
        resultado.innerHTML = `<p class="text-red-500">Faltan datos.</p>`;
        return;
    }

    resultado.innerHTML = `<p class="text-gray-500">Cargando...</p>`;

    try {
        const res = await fetch(`${API_URL}/obtener-recomendaciones?animes=${animes}&ratings=${ratings}`);
        const data = await res.json();

        if (data.error) {
            resultado.innerHTML = `<p class="text-red-500">${data.error}</p>`;
        } else {
        resultado.innerHTML = `
            <ul class="mt-3 bg-gray-50 border rounded-lg divide-y">
                ${data.recomendaciones.map(r => `<li class="p-2">${r}</li>`).join("")}
            </ul>`;
        }
    } catch (err) {
        resultado.innerHTML = `<p class="text-red-500">Error de conexión con la API.</p>`;
        console.error(err);
    }
});

// Entrenar algoritmo
document.getElementById("btnEntrenar").addEventListener("click", async () => {
    const info = document.getElementById("info");
    info.innerHTML = "Entrenando algoritmo...";
    try {
        const res = await fetch(`${API_URL}/entrenar`, { method: "POST" });
        const data = await res.json();
        info.innerHTML = `${data.message}`;
    } catch (err) {
        info.innerHTML = "Error al entrenar.";
    }
});

// Obtener versión
document.getElementById("btnVersion").addEventListener("click", async () => {
    const info = document.getElementById("info");
    try {
        const res = await fetch(`${API_URL}/version`);
        const data = await res.json();
        info.innerHTML = `Versión actual: <b>${data.version}</b>`;
    } catch (err) {
        info.innerHTML = "Error al obtener versión.";
    }
});

// Testear algoritmo
document.getElementById("btnTest").addEventListener("click", async () => {
    const info = document.getElementById("info");
    try {
        const res = await fetch(`${API_URL}/test`);
        const data = await res.json();
        info.innerHTML = `Test: ${data.message}`;
    } catch (err) {
        info.innerHTML = "Error al testear.";
    }
});

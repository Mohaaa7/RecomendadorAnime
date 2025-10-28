const API_URL = "http://127.0.0.1:5000";

// Utility function para mostrar loading
function showLoading(element, message = "Procesando solicitud...") {
    element.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
            <span class="text-slate-400">${message}</span>
        </div>`;
}

// Utility function para mostrar errores
function showError(element, message) {
    element.innerHTML = `
        <div class="flex items-start space-x-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
                <p class="font-semibold text-red-300 text-sm">Error</p>
                <p class="text-red-200 text-sm mt-1">${message}</p>
            </div>
        </div>`;
}

// Utility function para mostrar advertencias
function showWarning(element, message) {
    element.innerHTML = `
        <div class="flex items-start space-x-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <svg class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <div>
                <p class="font-semibold text-yellow-300 text-sm">Advertencia</p>
                <p class="text-yellow-200 text-sm mt-1">${message}</p>
            </div>
        </div>`;
}

// Utility function para mostrar éxito
function showSuccess(element, title, content) {
    element.innerHTML = `
        <div class="space-y-3">
            <div class="flex items-center space-x-2 text-emerald-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="font-semibold text-sm">${title}</span>
            </div>
            ${content}
        </div>`;
}

// Obtener Recomendaciones
document.getElementById("btnRecomendar").addEventListener("click", async () => {
    const animes = document.getElementById("animes").value.trim();
    const ratings = document.getElementById("ratings").value.trim();
    const resultado = document.getElementById("resultado");

    // Validación de campos vacíos
    if (!animes || !ratings) {
        showError(resultado, "Por favor, completa ambos campos: títulos visualizados y calificaciones.");
        return;
    }

    // Procesamiento de inputs
    const animes_list = animes.split(",").map(a => a.trim());
    const ratings_list = ratings.split(",").map(r => r.trim());

    // Validación de longitud
    if (animes_list.length !== ratings_list.length) {
        showError(resultado, `Se detectaron ${animes_list.length} títulos pero ${ratings_list.length} calificaciones. Ambas cantidades deben coincidir.`);
        return;
    }

    // Validación de ratings
    for (let i = 0; i < ratings_list.length; i++) {
        const value = parseFloat(ratings_list[i]);
        if (isNaN(value) || value < 0 || value > 10) {
            showError(resultado, `Calificación inválida "${ratings_list[i]}" en la posición ${i + 1}. Debe ser un número entre 0 y 10.`);
            return;
        }
    }

    showLoading(resultado, "Analizando preferencias y generando recomendaciones...");

    try {
        const res = await fetch(`${API_URL}/obtener-recomendaciones?animes=${encodeURIComponent(animes)}&ratings=${encodeURIComponent(ratings)}`);
        const data = await res.json();

        if (data.error) {
            showError(resultado, data.error);
            return;
        }

        const recomendaciones = data.recomendaciones || [];

        // Sin recomendaciones
        if (recomendaciones.length === 0) {
            showWarning(resultado, "No se encontraron recomendaciones basadas en tus preferencias. Intenta con otros títulos.");
            return;
        }

        // Con recomendaciones (fallback o normales)
        let headerMessage = "";
        let headerClass = "";
        
        if (data.fallback) {
            headerMessage = data.mensaje || "No se encontraron similitudes exactas. Mostrando títulos populares alternativos";
            headerClass = "text-yellow-400";
        } else {
            headerMessage = `${recomendaciones.length} recomendaciones personalizadas`;
            headerClass = "text-emerald-400";
        }

        const content = `
            <div class="bg-slate-800/30 border border-slate-600/30 rounded-lg p-4 space-y-3">
                <div class="flex items-center justify-between pb-3 border-b border-slate-600/30">
                    <span class="font-semibold ${headerClass} flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        ${headerMessage}
                    </span>
                    <span class="text-xs text-slate-500">${recomendaciones.length} resultado${recomendaciones.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    ${recomendaciones.map((r, index) => `
                        <div class="flex items-center space-x-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700/30 hover:border-indigo-500/30 transition-all group">
                            <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                ${index + 1}
                            </div>
                            <span class="text-slate-200 text-sm group-hover:text-indigo-300 transition-colors">${r}</span>
                        </div>
                    `).join("")}
                </div>
            </div>`;

        showSuccess(resultado, "Recomendaciones Generadas", content);

    } catch (err) {
        showError(resultado, "No se pudo establecer conexión con el servidor. Verifica que la API esté ejecutándose en " + API_URL);
        console.error("Error de conexión:", err);
    }
});

// Entrenar algoritmo
document.getElementById("btnEntrenar").addEventListener("click", async () => {
    const info = document.getElementById("info");
    
    info.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
            <span class="text-slate-300">Entrenando modelo de machine learning...</span>
        </div>`;
    
    try {
        const res = await fetch(`${API_URL}/entrenar`, { method: "POST" });
        const data = await res.json();
        
        info.innerHTML = `
            <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                    <p class="text-emerald-300 font-semibold text-sm">Entrenamiento Completado</p>
                    <p class="text-slate-300 text-sm mt-1">${data.message}</p>
                </div>
            </div>`;
    } catch (err) {
        info.innerHTML = `
            <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <div>
                    <p class="text-red-300 font-semibold text-sm">Error de Entrenamiento</p>
                    <p class="text-slate-300 text-sm mt-1">No se pudo completar el proceso de entrenamiento del modelo.</p>
                </div>
            </div>`;
        console.error("Error:", err);
    }
});

// Obtener versión
document.getElementById("btnVersion").addEventListener("click", async () => {
    const info = document.getElementById("info");
    
    info.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="animate-pulse w-2 h-2 bg-slate-400 rounded-full"></div>
            <span class="text-slate-300">Consultando información del sistema...</span>
        </div>`;
    
    try {
        const res = await fetch(`${API_URL}/version`);
        const data = await res.json();
        
        info.innerHTML = `
            <div class="space-y-2">
                <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-slate-300 font-semibold text-sm">Información del Sistema</span>
                </div>
                <div class="pl-7">
                    <p class="text-slate-400 text-sm">Versión del algoritmo: <span class="text-indigo-300 font-mono font-semibold">${data.version}</span></p>
                </div>
            </div>`;
    } catch (err) {
        info.innerHTML = `
            <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <p class="text-red-300 text-sm">Error al obtener la información del sistema.</p>
            </div>`;
        console.error("Error:", err);
    }
});

// Test del algoritmo
document.getElementById("btnTest").addEventListener("click", async () => {
    const info = document.getElementById("info");
    
    info.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-400"></div>
            <span class="text-slate-300">Ejecutando pruebas de validación...</span>
        </div>`;
    
    try {
        const res = await fetch(`${API_URL}/test`);
        const data = await res.json();
        
        info.innerHTML = `
            <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                    <p class="text-emerald-300 font-semibold text-sm">Validación Exitosa</p>
                    <p class="text-slate-300 text-sm mt-1">${data.message}</p>
                </div>
            </div>`;
    } catch (err) {
        info.innerHTML = `
            <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <div>
                    <p class="text-red-300 font-semibold text-sm">Error en la Validación</p>
                    <p class="text-slate-300 text-sm mt-1">No se pudieron ejecutar las pruebas del sistema.</p>
                </div>
            </div>`;
        console.error("Error:", err);
    }
});
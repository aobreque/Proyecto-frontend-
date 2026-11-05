// Controles de accesibilidad compartidos por las páginas del sitio.
const botonModoOscuro = document.querySelector<HTMLButtonElement>("#btn-modo-oscuro");
const botonLetraMas = document.querySelector<HTMLButtonElement>("#btn-letra-mas");
const botonLetraMenos = document.querySelector<HTMLButtonElement>("#btn-letra-menos");
const botonReducirMovimiento = document.querySelector<HTMLButtonElement>("#btn-reducir-movimiento");
const anuncios = document.querySelector<HTMLElement>("#anuncios");

// Recupera y aplica el modo oscuro guardado en este navegador.
const modoOscuroActivo = localStorage.getItem("modoOscuro") === "true";
document.body.classList.toggle("modo-oscuro", modoOscuroActivo);

function actualizarBotonModoOscuro(activado: boolean): void {
    if (!botonModoOscuro) return;

    botonModoOscuro.setAttribute("aria-pressed", String(activado));
    botonModoOscuro.textContent = activado ? "☀️" : "🌙";
}

actualizarBotonModoOscuro(modoOscuroActivo);

botonModoOscuro?.addEventListener("click", () => {
    const activado = document.body.classList.toggle("modo-oscuro");
    actualizarBotonModoOscuro(activado);
    localStorage.setItem("modoOscuro", String(activado));
    if (anuncios) {
        anuncios.textContent = activado
            ? "Modo oscuro activado"
            : "Modo oscuro desactivado";
    }
});

// Limita el tamaño guardado al rango permitido: de 80 % a 200 %.
const tamanoGuardado = Number.parseInt(localStorage.getItem("tamanoLetra") ?? "100", 10);
let tamanoLetra = Number.isFinite(tamanoGuardado)
    ? Math.min(200, Math.max(80, tamanoGuardado))
    : 100;

function aplicarTamanoLetra(): void {
    document.documentElement.style.fontSize = `${tamanoLetra}%`;
    localStorage.setItem("tamanoLetra", String(tamanoLetra));
    if (anuncios) anuncios.textContent = `Tamaño de letra: ${tamanoLetra}%`;
}

document.documentElement.style.fontSize = `${tamanoLetra}%`;

botonLetraMas?.addEventListener("click", () => {
    if (tamanoLetra < 200) {
        tamanoLetra = Math.min(200, tamanoLetra + 10);
        aplicarTamanoLetra();
    }
});

botonLetraMenos?.addEventListener("click", () => {
    if (tamanoLetra > 80) {
        tamanoLetra = Math.max(80, tamanoLetra - 10);
        aplicarTamanoLetra();
    }
});

// Conserva la preferencia de movimiento reducido si la página ofrece el control.
const claveMovimiento = "reducirMovimiento";

function aplicarPreferenciaMovimiento(reducir: boolean): void {
    document.documentElement.classList.toggle("reducir-movimiento", reducir);

    if (botonReducirMovimiento) {
        botonReducirMovimiento.setAttribute("aria-pressed", String(reducir));
        botonReducirMovimiento.setAttribute(
            "aria-label",
            reducir ? "Activar animaciones y transiciones" : "Reducir animaciones y transiciones"
        );
    }
}

aplicarPreferenciaMovimiento(localStorage.getItem(claveMovimiento) === "true");

botonReducirMovimiento?.addEventListener("click", () => {
    const reducir = !document.documentElement.classList.contains("reducir-movimiento");
    aplicarPreferenciaMovimiento(reducir);
    localStorage.setItem(claveMovimiento, String(reducir));
});

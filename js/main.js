const btnReducirMovimiento = document.getElementById(
    "btn-reducir-movimiento"
);

const claveMovimiento = "reducirMovimiento";

function aplicarPreferenciaMovimiento(reducir) {
    // Activa o desactiva la reducción de movimiento
    document.documentElement.classList.toggle(
        "reducir-movimiento",
        reducir
    );

    // Informa el estado actual del botón
    btnReducirMovimiento.setAttribute(
        "aria-pressed",
        String(reducir)
    );

    // Actualiza la descripción accesible del botón
    btnReducirMovimiento.setAttribute(
        "aria-label",
        reducir
            ? "Activar animaciones y transiciones"
            : "Reducir animaciones y transiciones"
    );
}

const preferenciaGuardada = localStorage.getItem(claveMovimiento);

if (preferenciaGuardada !== null) {
    aplicarPreferenciaMovimiento(
        preferenciaGuardada === "true"
    );
}

btnReducirMovimiento.addEventListener("click", () => {
    const estaActivo =
        document.documentElement.classList.contains(
            "reducir-movimiento"
        );

    const nuevoEstado = !estaActivo;

    aplicarPreferenciaMovimiento(nuevoEstado);

    localStorage.setItem(
        claveMovimiento,
        String(nuevoEstado)
    );
});
const btnReducirMovimiento = document.getElementById(
    "btn-reducir-movimiento"
);

const claveMovimiento = "reducirMovimiento";

function aplicarPreferenciaMovimiento(reducir) {
    document.documentElement.classList.toggle(
        "reducir-movimiento",
        reducir
    );

    btnReducirMovimiento.setAttribute(
        "aria-pressed",
        String(reducir)
    );
}

const preferenciaGuardada = localStorage.getItem(claveMovimiento);

if (preferenciaGuardada !== null) {
    aplicarPreferenciaMovimiento(preferenciaGuardada === "true");
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
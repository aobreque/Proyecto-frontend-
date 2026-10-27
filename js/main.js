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

const btnLetraMas = document.getElementById('btn-letra-mas');
const btnLetraMenos = document.getElementById('btn-letra-menos');
const anuncios = document.getElementById('anuncios');

let tamanoBase = parseInt(localStorage.getItem('tamanoLetra')) || 100;
document.documentElement.style.fontSize = tamanoBase + '%';

function actualizarTamano() {
    document.documentElement.style.fontSize = tamanoBase + '%';
    localStorage.setItem('tamanoLetra', tamanoBase);
    anuncios.textContent = 'Tamaño de letra: ' + tamanoBase + '%';
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

// FORMULARIO DE AGENDA DE RUTA
const formRuta = document.getElementById('form-ruta');

if (formRuta) {
    const campoOrigen = document.getElementById('origen');
    const campoDestino = document.getElementById('destino');
    const campoFecha = document.getElementById('fecha-viaje');
    const campoPasajeros = document.getElementById('pasajeros');
    const resultadoRuta = document.getElementById('resultado-ruta');

    // Impide seleccionar una fecha anterior a hoy.
    const hoy = new Date();
    const fechaLocal = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
    campoFecha.min = fechaLocal;

    formRuta.addEventListener('submit', (evento) => {
        evento.preventDefault();
        resultadoRuta.textContent = '';

        const origen = campoOrigen.value;
        const destino = campoDestino.value;
        const fecha = campoFecha.value;
        const pasajeros = Number(campoPasajeros.value);

        if (!origen || !destino) {
            resultadoRuta.textContent = 'Selecciona una ciudad de origen y una de destino.';
            resultadoRuta.focus();
            return;
        }

        if (origen === destino) {
            resultadoRuta.textContent = 'El origen y el destino deben ser ciudades diferentes.';
            resultadoRuta.focus();
            return;
        }

        if (!Number.isInteger(pasajeros) || pasajeros < 1 || pasajeros > 20) {
            resultadoRuta.textContent = 'Indica entre 1 y 20 pasajeros.';
            resultadoRuta.focus();
            return;
        }

        const fechaTexto = fecha
            ? ` Fecha del viaje: ${fecha}.`
            : '';

        resultadoRuta.textContent = `Búsqueda preparada: ${origen} → ${destino}. Pasajeros: ${pasajeros}.${fechaTexto} Esta demostración no consulta horarios ni disponibilidad reales.`;
        resultadoRuta.focus();
    });
}

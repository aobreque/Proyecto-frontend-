
const btnModoOscuro = document.getElementById('btn-modo-oscuro');
const btnLetraMas = document.getElementById('btn-letra-mas');
const btnLetraMenos = document.getElementById('btn-letra-menos');
const anuncios = document.getElementById('anuncios');

const btnReducirMovimiento = document.getElementById(
    'btn-reducir-movimiento'
);

// ===== Modo oscuro =====
if (localStorage.getItem('modoOscuro') === 'true') {
    document.body.classList.add('modo-oscuro');
    btnModoOscuro.setAttribute('aria-pressed', 'true');
    btnModoOscuro.textContent = '☀';
}

btnModoOscuro.addEventListener('click', () => {
    document.body.classList.toggle('modo-oscuro');

    const activado = document.body.classList.contains('modo-oscuro');

    btnModoOscuro.setAttribute('aria-pressed', String(activado));
    btnModoOscuro.textContent = activado ? '☀' : '🌙';

    anuncios.textContent = activado
        ? 'Modo oscuro activado'
        : 'Modo oscuro desactivado';

    localStorage.setItem('modoOscuro', String(activado));
});

// ===== Tamaño de letra =====
let tamanoBase = parseInt(localStorage.getItem('tamanoLetra'), 10) || 100;

document.documentElement.style.fontSize = tamanoBase + '%';

function actualizarTamano() {
    document.documentElement.style.fontSize = tamanoBase + '%';

    localStorage.setItem('tamanoLetra', tamanoBase);

    anuncios.textContent = 'Tamaño de letra: ' + tamanoBase + '%';
}

btnLetraMas.addEventListener('click', () => {
    if (tamanoBase < 200) {
        tamanoBase += 10;
        actualizarTamano();
    }
});

btnLetraMenos.addEventListener('click', () => {
    if (tamanoBase > 80) {
        tamanoBase -= 10;
        actualizarTamano();
    }
});

// ===== Reducción de movimiento =====
const claveMovimiento = 'reducirMovimiento';

function aplicarPreferenciaMovimiento(reducir) {
    document.documentElement.classList.toggle(
        'reducir-movimiento',
        reducir
    );

    btnReducirMovimiento.setAttribute(
        'aria-pressed',
        String(reducir)
    );

    btnReducirMovimiento.setAttribute(
        'aria-label',
        reducir
            ? 'Activar animaciones y transiciones'
            : 'Reducir animaciones y transiciones'
    );
}

const preferenciaGuardada = localStorage.getItem(claveMovimiento);

aplicarPreferenciaMovimiento(preferenciaGuardada === 'true');

btnReducirMovimiento.addEventListener('click', () => {
    const estaActivo = document.documentElement.classList.contains(
        'reducir-movimiento'
    );

    const nuevoEstado = !estaActivo;

    aplicarPreferenciaMovimiento(nuevoEstado);

    localStorage.setItem(
        claveMovimiento,
        String(nuevoEstado)
    );
});

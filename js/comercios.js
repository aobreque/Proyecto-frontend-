
"use strict";
const API_COMERCIOS =
    "https://6ae15049be3bc8fead98617f.mockapi.io/comercios";

const formulario = document.getElementById("form-comercio");
const mensajeFormulario = document.getElementById("mensaje-formulario");
const botonRegistrar = document.getElementById("btn-registrar");

const campos = [
    "nombre",
    "descripcion",
    "ciudad",
    "direccion",
    "contacto"
];

function obtenerMensajeError(campo) {
    const valor = campo.value.trim();

    if (valor === "") {
        return "Este campo es obligatorio.";
    }

    if (campo.minLength > 0 &&
        valor.length < campo.minLength) {
        return `Debe tener al menos ${campo.minLength} caracteres.`;
    }

    if (campo.maxLength > 0 &&
        valor.length > campo.maxLength) {
        return `No puede superar ${campo.maxLength} caracteres.`;
    }

    if (campo.type === "email" &&
        !campo.validity.valid) {
        return "Ingresa un correo electrónico válido.";
    }

    return "";
}

function validarCampo(campo) {
    const error = obtenerMensajeError(campo);
    const idError = `error-${campo.id}`;

    let mensajeError = document.getElementById(idError);

    if (!mensajeError) {
        mensajeError = document.createElement("span");
        mensajeError.id = idError;
        mensajeError.className = "error-campo";

        campo.insertAdjacentElement("afterend", mensajeError);
    }

    mensajeError.textContent = error;

    campo.classList.toggle("campo-invalido", Boolean(error));
    campo.classList.toggle("campo-valido", !error);

    campo.setAttribute("aria-invalid", String(Boolean(error)));
    campo.setAttribute("aria-describedby", idError);

    return error === "";
}

campos.forEach((id) => {
    const campo = document.getElementById(id);

    campo.addEventListener("blur", () => {
        validarCampo(campo);
    });

    campo.addEventListener("input", () => {
        if (campo.getAttribute("aria-invalid") !== null) {
            validarCampo(campo);
        }
    });
});

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    let formularioValido = true;
    let primerCampoInvalido = null;

    campos.forEach((id) => {
        const campo = document.getElementById(id);
        const valido = validarCampo(campo);

        if (!valido) {
            formularioValido = false;

            if (!primerCampoInvalido) {
                primerCampoInvalido = campo;
            }
        }
    });

    if (!formularioValido) {
        mensajeFormulario.textContent =
            "Revisa los campos marcados antes de continuar.";

        mensajeFormulario.className = "error";
        primerCampoInvalido.focus();
        return;
    }

    const datosComercio = {
        nombre: document.getElementById("nombre").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        ciudad: document.getElementById("ciudad").value.trim(),
        direccion: document.getElementById("direccion").value.trim(),
        contacto: document.getElementById("contacto").value.trim()
    };

    
    botonRegistrar.disabled = true;
    botonRegistrar.textContent = "Registrando...";
    mensajeFormulario.textContent = "Guardando comercio...";
    mensajeFormulario.className = "";

    try {
        const respuesta = await fetch(API_COMERCIOS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosComercio)
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const comercioCreado = await respuesta.json();

        console.log("Comercio registrado:", comercioCreado);

        mensajeFormulario.textContent =
            "¡Comercio registrado correctamente!";
        mensajeFormulario.className = "exito";

        formulario.reset();

        campos.forEach((id) => {
            const campo = document.getElementById(id);
            campo.classList.remove("campo-valido", "campo-invalido");
            campo.removeAttribute("aria-invalid");
            campo.removeAttribute("aria-describedby");

            const error = document.getElementById(`error-${id}`);
            if (error) error.textContent = "";
        });

    } catch (error) {
        console.error("Error al registrar:", error);

        mensajeFormulario.textContent =
            "No se pudo registrar el comercio. Inténtalo nuevamente.";
        mensajeFormulario.className = "error";

    } finally {
        botonRegistrar.disabled = false;
        botonRegistrar.textContent = "Registrar comercio";
    }

});

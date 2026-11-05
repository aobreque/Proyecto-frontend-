import type { Comercio } from "./types.js";

const URL_COMERCIOS = "https://6ae15049be3bc8fead98617f.mockapi.io/comercios";
const formulario = document.querySelector<HTMLFormElement>("#form-comercio");
const mensajeFormulario = document.querySelector<HTMLElement>("#mensaje-formulario");
const botonRegistrar = document.querySelector<HTMLButtonElement>("#btn-registrar");
const idsCampos = ["nombre", "descripcion", "ciudad", "direccion", "contacto"] as const;

type IdCampo = (typeof idsCampos)[number];
type CampoComercio = HTMLInputElement | HTMLTextAreaElement;

function obtenerCampo(id: IdCampo): CampoComercio | null {
    return formulario?.querySelector<CampoComercio>(`#${id}`) ?? null;
}

function esComercio(dato: unknown): dato is Comercio {
    if (typeof dato !== "object" || dato === null) return false;

    const comercio = dato as Record<string, unknown>;
    return ["id", "nombre", "descripcion", "ciudad", "direccion", "contacto"]
        .every((campo) => typeof comercio[campo] === "string");
}

function obtenerMensajeError(campo: CampoComercio): string {
    const valor = campo.value.trim();

    if (valor === "") return "Este campo es obligatorio.";
    if (campo.minLength > 0 && valor.length < campo.minLength) {
        return `Debe tener al menos ${campo.minLength} caracteres.`;
    }
    if (campo.maxLength > 0 && valor.length > campo.maxLength) {
        return `No puede superar ${campo.maxLength} caracteres.`;
    }
    if (campo.type === "email" && !campo.validity.valid) {
        return "Ingresa un correo electrónico válido.";
    }

    return "";
}

function validarCampo(campo: CampoComercio): boolean {
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

if (formulario && mensajeFormulario && botonRegistrar) {
    const campos = idsCampos.map((id) => ({ id, campo: obtenerCampo(id) }));
    const camposValidos = campos.every((item) => item.campo !== null);

    if (camposValidos) {
        campos.forEach(({ campo }) => {
            if (!campo) return;
            campo.addEventListener("blur", () => validarCampo(campo));
            campo.addEventListener("input", () => {
                if (campo.hasAttribute("aria-invalid")) validarCampo(campo);
            });
        });

        formulario.addEventListener("submit", async (evento: SubmitEvent) => {
            evento.preventDefault();

            let primerCampoInvalido: CampoComercio | null = null;
            for (const { campo } of campos) {
                if (campo && !validarCampo(campo) && !primerCampoInvalido) {
                    primerCampoInvalido = campo;
                }
            }

            if (primerCampoInvalido) {
                mensajeFormulario.textContent = "Revisa los campos marcados antes de continuar.";
                mensajeFormulario.className = "error";
                primerCampoInvalido.focus();
                return;
            }

            const datosComercio = {
                nombre: obtenerCampo("nombre")?.value.trim() ?? "",
                descripcion: obtenerCampo("descripcion")?.value.trim() ?? "",
                ciudad: obtenerCampo("ciudad")?.value.trim() ?? "",
                direccion: obtenerCampo("direccion")?.value.trim() ?? "",
                contacto: obtenerCampo("contacto")?.value.trim() ?? ""
            };

            botonRegistrar.disabled = true;
            botonRegistrar.textContent = "Registrando...";
            mensajeFormulario.textContent = "Guardando comercio...";
            mensajeFormulario.className = "";

            try {
                const respuesta = await fetch(URL_COMERCIOS, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datosComercio)
                });

                if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
                const respuestaJson: unknown = await respuesta.json();
                if (!esComercio(respuestaJson)) {
                    throw new Error("La respuesta no contiene un comercio válido.");
                }

                mensajeFormulario.textContent = "¡Comercio registrado correctamente!";
                mensajeFormulario.className = "exito";
                formulario.reset();

                campos.forEach(({ id, campo }) => {
                    campo?.classList.remove("campo-valido", "campo-invalido");
                    campo?.removeAttribute("aria-invalid");
                    campo?.removeAttribute("aria-describedby");
                    const error = document.getElementById(`error-${id}`);
                    if (error) error.textContent = "";
                });
            } catch {
                mensajeFormulario.textContent =
                    "No se pudo registrar el comercio. Inténtalo nuevamente.";
                mensajeFormulario.className = "error";
            } finally {
                botonRegistrar.disabled = false;
                botonRegistrar.textContent = "Registrar comercio";
            }
        });
    }
}

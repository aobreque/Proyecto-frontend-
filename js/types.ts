export interface Ruta {
    id: string;
    createdAt: string;
    nombre: string;
    origen: string;
    destino: string;
    duracion: string;
    transporte: string;
    itinerario: string;
}

export interface Comercio {
    id: string;
    nombre: string;
    descripcion: string;
    ciudad: string;
    direccion: string;
    contacto: string;
}

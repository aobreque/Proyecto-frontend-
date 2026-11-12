

## Integrantes y roles (Sprint actual)

|Angel Obreque|QA/tester|

|Sofia Morales|Scrum Master|

|Alejandro lincoguir|Developer|

|Macarena Melin|Developer|

|Benjamin jara|Product Owner|

## Descripción breve
EcoRuta Temuco es un sitio web enfocado en la promoción del turismo sostenible y consciente en la Región de La Araucanía. 
La plataforma centraliza la búsqueda de rutas turísticas , atractivos locales de la zona y comercios o emprendimientos regionales, ofreciendo a los visitantes una experiencia de navegación accesible e intuitiva.
lo que ayuda a los comercios de la zona a tener mas visibilidad.


## Tecnologías utilizadas

- HTML5, CSS3 y TypeScript compilado a JavaScript.
- TypeScript como única dependencia de desarrollo.

## Cómo ejecutar el proyecto

Instala las dependencias y compila los archivos TypeScript desde la raíz:

```bash
npm install
npm run build
```

Los archivos JavaScript se generan junto a sus archivos TypeScript y se incluyen en el repositorio porque GitHub Pages publica los archivos sin compilarlos. Para trabajar mientras editas, ejecuta `npm run watch` o abre `index.html` con Live Server en Visual Studio Code.

## APIs públicas

EcoRuta usa dos proyectos independientes de MockAPI:

| Funcionalidad | URL base | Recurso y operaciones |
| --- | --- | --- |
| Rutas | `https://6ad9530ff89c5702ed9a864f.mockapi.io/api/v1` | `GET /rutas` |
| Comercios | `https://6ae15049be3bc8fead98617f.mockapi.io/comercios` | `GET` y `POST` sobre la URL base |

El módulo `js/api.ts` centraliza ambas URL base y ofrece las funciones genéricas `obtener<T>` y `enviar<T>`. Las páginas muestran estados de carga, error, lista vacía y resultados cuando consultan los datos.


## Estado del proyecto

- Sprint actual: Sprint 2
- Última actualización: 06/10/2026

## Tablero Kanban

Enlace al tablero: [text](https://trello.com/b/boKgPiYD)

## Enlace de despliegue

(agregar enlace una vez desplegado)

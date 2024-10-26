// Definir la URL de la API
const API_URL = "http://localhost:3001/articulos";

// Función para obtener la lista de artículos
async function listarArticulo() {
    try {
        const conexion = await fetch(API_URL);
        if (!conexion.ok) throw new Error("Error al obtener los artículos");
        return await conexion.json();
    } catch (error) {
        console.error("Error en listarArticulo:", error);
        throw error;
    }
}

// Función para enviar un nuevo artículo
async function enviarArticulo(titulo, precio, imagen) {
    try {
        const conexion = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo, precio, imagen })
        });
        if (!conexion.ok) throw new Error("Error al enviar el artículo");
        return await conexion.json();
    } catch (error) {
        console.error("Error en enviarArticulo:", error);
        throw error;
    }
}

// Función para eliminar un artículo por ID
async function eliminarArticulo(id) {
    try {
        const conexion = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!conexion.ok) throw new Error("Error al eliminar el artículo");
    } catch (error) {
        console.error("Error en eliminarArticulo:", error);
        throw error;
    }
}

// Función para crear una tarjeta de producto
function crearCard(id, titulo, precio, imagen) {
    const articulo = document.createElement("li");
    articulo.className = "producto";
    articulo.innerHTML = `
        <img src="${imagen}" alt="${titulo}">
        <h3>${titulo}</h3>
        <div class="producto__descripcion">
            <p>$${precio}</p>
            <button class="boton eliminar" data-id="${id}">
                <img src="img/trash-icon.png" alt="Eliminar">
            </button>
        </div>`;
    
    // Agregar evento de click al botón de eliminar
    const botonEliminar = articulo.querySelector(".boton.eliminar");
    botonEliminar.addEventListener("click", async () => {
        try {
            await eliminarArticulo(id);
            articulo.remove(); // Elimina el artículo del DOM
            alert("Artículo eliminado correctamente.");
        } catch (error) {
            alert("Error al eliminar el artículo.");
        }
    });

    return articulo;
}

// Función para mostrar artículos en la lista
async function mostrarArticulos() {
    const lista = document.querySelector("[data-lista]");
    try {
        const articulos = await listarArticulo();
        articulos.forEach((articulo) => {
            lista.appendChild(crearCard(articulo.id, articulo.titulo, articulo.precio, articulo.imagen));
        });
    } catch (error) {
        alert("Ha ocurrido un problema con la conexión al cargar los artículos.");
    }
}

// Maneja el envío de artículos desde el formulario
const formulario = document.querySelector("[data-formulario]");
formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const titulo = document.querySelector("[data-titulo]").value;
    const precio = parseFloat(document.querySelector("[data-precio]").value);
    const imagen = document.querySelector("[data-imagen]").value;

    if (!titulo || isNaN(precio) || !imagen) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        await enviarArticulo(titulo, precio, imagen);
        alert("Artículo subido correctamente");
        formulario.reset();
        location.reload(); // Recarga para actualizar la lista
    } catch (error) {
        alert("Error de subida");
    }
});

// Llama a la función para mostrar artículos al cargar la página
mostrarArticulos();

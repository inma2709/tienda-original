URL_API = "http://localhost:3000/api";

async function verJSON() {
    try{
        const respuesta = await fetch (`${URL_API}/productos`);
        const datos = await respuesta.json();
        const salida = document.getElementById("listaProductos");
        salida.textContent = JSON.stringify(datos, null, 2);
    }catch (error){
        console.error("Error al obtener JSON:", error);
    }
    
}

document.addEventListener("DOMContentLoaded", () =>{
    document.getElementById("verJSON").addEventListener("click",verJSON);
})

async function cargarProductos() {
    try{
        //Traemos los datos del back
        const respuesta = await fetch (`${URL_API}/productos`);
        //Convertimos la respuesta a JSON
        const datos = await respuesta.json();
        //Verificamos si fue exitosa la petición
        if(respuesta.ok){
            mostrarProductos(datos.data);
        }
        else{
            console.error ("Error al cargar productos");
        }
    } catch (error){
        console.error("Error de conexión:",error);
    }
}

// Función para mostrar los productos 

function mostrarProductos(lista){
    const contenedor = document.getElementById("productos");

    // Creamos el HTML para cada producto
    contenedor.innerHTML = lista.map(producto=> `
        <div class="product-card">
            <img src="images/foto.png" class="product-image" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p><strong>${producto.precio}€</strong></p>
            <p>Stock: ${producto.stock}</p>
        </div>
        `).join ('');
}

// 🚀 Cuando la página termine de cargar, ejecutamos la función
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});
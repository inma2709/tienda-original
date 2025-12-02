URL_API = "http://localhost:3000/api";

// Estados 
let estado = {
    usuario: null,          // 👤 Información del usuario conectado (null = nadie conectado)
    token: null,           // 🔑 Clave secreta para comunicarse con el servidor
    productos: [],         // 🛍️ Array con todos los productos del catálogo
    carrito: [],          // 🛒 Array con productos que el usuario quiere comprar
    pedidos: [],          // 📦 Array con los pedidos que ha realizado el usuario
    categoria: '',        // 🏷️ Filtro actual de categoría (vacío = todas las categorías)
};

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
    cargarProductos();
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


// Login y tokens

function obtenerCabecerasAuth() {
    return {
        'Content-Type': 'application/json',                    // Enviamos datos en formato JSON
        'Authorization': `Bearer ${estado.token}`             // Incluimos el token del usuario
    };
}

async function iniciarSesion(email, password) {
    try {
        const respuesta = await fetch(`${URL_API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const datos = await respuesta.json();
        
        if (respuesta.ok) {
            guardarSesion(datos.token, datos.usuario);
            await cargarDatosUsuario();
            mostrarInterfaz();
            mostrarAlerta('¡Bienvenido!', `Hola ${datos.usuario.nombre}`);
        } else {
            throw new Error(datos.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('❌ Error login:', error);
        throw error;
    }
}

// Registro usuarios
async function registrarUsuario(nombre, email, password) {
    try {
        console.log('📝 Intentando registrar usuario:', email);
        
        const respuesta = await fetch(`${URL_API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
        });
        
        const datos = await respuesta.json();
        console.log('📡 Respuesta del servidor:', respuesta.status, datos);
        
        if (respuesta.ok) {
            guardarSesion(datos.token, datos.usuario);
            
            // Para usuarios nuevos, no cargar pedidos inmediatamente
            // Solo actualizar la interfaz
            mostrarInterfaz();
            mostrarAlerta('¡Registrado!', `Bienvenido ${datos.usuario.nombre}`);
            console.log('✅ Usuario registrado exitosamente');
        } else {
            throw new Error(datos.message || 'Error al registrarse');
        }
    } catch (error) {
        console.error('❌ Error registro:', error);
        throw error;
    }
}

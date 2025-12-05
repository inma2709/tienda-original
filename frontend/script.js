// ==========================================
// 🌐 CONFIGURACIÓN BÁSICA
// ==========================================
const URL_API = 'http://localhost:3000/api';

// Estado mínimo: usuario + token + carrito + productos
const estado = {
  usuario: null,
  token: null,
  carrito: [],    // 🛒 carrito SOLO en frontend
  productos: []   // 📦 listado de productos cargados del backend
};

// ==========================================
// 📦 PRODUCTOS
// ==========================================

// Ver JSON bruto en el <pre> esto ya lo teniamos
async function verJSON() {
  try {
    const respuesta = await fetch(`${URL_API}/productos`);
    const datos = await respuesta.json();
    const salida = document.getElementById('listaProductos');
    if (salida) {
      salida.textContent = JSON.stringify(datos, null, 2);
    }
  } catch (error) {
    console.error('Error al obtener JSON:', error);
  }
}

// Cargar productos desde la API aqui hace la conexion con el back
async function cargarProductos() {
  try {
    const respuesta = await fetch(`${URL_API}/productos`);
    const datos = await respuesta.json();

    if (respuesta.ok) {
      const lista = datos.data || [];
      estado.productos = lista;        // 🧠 guardamos productos en estado
      mostrarProductos(lista);
    } else {
      console.error('Error al cargar productos:', datos);
    }
  } catch (error) {
    console.error('Error de conexión al cargar productos:', error);
  }
}

// Pintar productos en la página y mostrar si corresponde el boton de comprar
function mostrarProductos(lista) {
  const contenedor = document.getElementById('productos');
  if (!contenedor) return;

  const logged = !!estado.usuario;

  contenedor.innerHTML = lista
    .map(
      (producto) => `
      <div class="product-card">
        <img src="foto.png" class="product-image" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion || ''}</p>
        <p><strong>${producto.precio} €</strong></p>
        <p>Stock: ${producto.stock}</p>
        ${
          logged
            ? `<button onclick="agregarAlCarrito(${producto.id})" class="btn">
                 🛒 Agregar al carrito
               </button>`
            : '<p><em>Inicia sesión para comprar</em></p>'
        }
      </div>
    `
    )
    .join('');
}

// ==========================================
// 🔐 AUTENTICACIÓN (LOGIN / REGISTRO)
// ==========================================

// Guardar sesión en memoria + localStorage
function guardarSesion(token, usuario) {
  estado.token = token;
  estado.usuario = usuario;

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(usuario));

  console.log('💾 Sesión guardada para:', usuario.nombre);
}

// Cargar sesión guardada (si existe)
function cargarSesionGuardada() {
  const tokenGuardado = localStorage.getItem('token');
  const usuarioGuardado = localStorage.getItem('user');
  const carritoGuardado = localStorage.getItem('carrito');

  if (tokenGuardado && usuarioGuardado) {
    try {
      estado.token = tokenGuardado;
      estado.usuario = JSON.parse(usuarioGuardado);
      console.log('👤 Sesión restaurada:', estado.usuario.nombre);
    } catch (err) {
      console.error('❌ Sesión corrupta, limpiando...', err);
      cerrarSesion();
    }
  }

  // 🛒 Restaurar carrito si existe
  if (carritoGuardado) {
    try {
      estado.carrito = JSON.parse(carritoGuardado);
      console.log('🛒 Carrito restaurado:', estado.carrito);
    } catch (err) {
      console.error('❌ Carrito corrupto, limpiando...', err);
      estado.carrito = [];
      localStorage.removeItem('carrito');
    }
  }
}

// Cerrar sesión
function cerrarSesion() {
  estado.token = null;
  estado.usuario = null;
  estado.carrito = [];

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('carrito');

  console.log('👋 Sesión cerrada');
  mostrarInterfaz();
}

// Login
async function iniciarSesion(email, password) {
  try {
    const respuesta = await fetch(`${URL_API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const datos = await respuesta.json();
    console.log('📥 Respuesta login:', respuesta.status, datos);

    if (respuesta.ok) {
      guardarSesion(datos.token, datos.usuario);
      mostrarInterfaz();
      alert(`Bienvenido, ${datos.usuario.nombre}`);
    } else {
      alert(datos.message || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error('❌ Error login:', error);
    alert('No se pudo conectar con el servidor');
  }
}

// Registro
async function registrarUsuario(nombre, email, password) {
  try {
    const respuesta = await fetch(`${URL_API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const datos = await respuesta.json();
    console.log('📥 Respuesta registro:', respuesta.status, datos);

    if (respuesta.ok) {
      guardarSesion(datos.token, datos.usuario);
      mostrarInterfaz();
      alert(`Cuenta creada. Bienvenido, ${datos.usuario.nombre}`);
    } else {
      alert(datos.message || 'Error al registrarse');
    }
  } catch (error) {
    console.error('❌ Error registro:', error);
    alert('No se pudo conectar con el servidor');
  }
}

// Conectar formularios
function configurarEventosLogin() {
  const loginForm = document.getElementById('loginFormElement');
  const registerForm = document.getElementById('registerFormElement');
  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      await iniciarSesion(email, password);
      loginForm.reset();
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('registerNombre').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      await registrarUsuario(nombre, email, password);
      registerForm.reset();
    });
  }

  if (showRegister) {
    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('loginForm')?.classList.add('hidden');
      document.getElementById('registerForm')?.classList.remove('hidden');
    });
  }

  if (showLogin) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('registerForm')?.classList.add('hidden');
      document.getElementById('loginForm')?.classList.remove('hidden');
    });
  }
}

// ==========================================
// 🛒 CARRITO (SOLO FRONTEND)
// ==========================================

// Guardar carrito en localStorage en el estado que nos hemos creado para eso lo vamos a usar
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(estado.carrito));
}

// Agregar producto al carrito (local)
function agregarAlCarrito(producto_id) {
  if (!estado.usuario) {
    alert('Debes iniciar sesión para comprar');
    return;
  }

  const producto = estado.productos.find((p) => p.id === producto_id);
  if (!producto) {
    alert('❌ Producto no encontrado');
    return;
  }

  const existente = estado.carrito.find((item) => item.id === producto.id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    estado.carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  guardarCarrito();
  alert('✅ Producto agregado al carrito (local)');
  console.log('🛒 Carrito actual:', estado.carrito);
}

// Ver carrito (local)
function verCarrito() {
  if (!estado.usuario) {
    alert('Debes iniciar sesión');
    return;
  }

  if (estado.carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  let total = 0;
  let mensaje = '🛒 TU CARRITO (LOCAL):\n\n';

  estado.carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    mensaje += `${item.nombre} - Cantidad: ${item.cantidad} - ${subtotal.toFixed(2)} €\n`;
  });

  mensaje += `\nTOTAL: ${total.toFixed(2)} €`;
  alert(mensaje);
}

// Finalizar compra → enviar carrito al backend como pedido
async function finalizarCompra() {
  if (!estado.token) {
    alert('Debes iniciar sesión');
    return;
  }

  if (estado.carrito.length === 0) {
    alert('El carrito está vacío');
    return;
  }

  if (!confirm('¿Confirmar compra?')) return;

  // Preparamos los datos para el backend
  const productos = estado.carrito.map((item) => ({
    producto_id: item.id,
    cantidad: item.cantidad
  }));

  try {
    const respuesta = await fetch(`${URL_API}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${estado.token}`
      },
      body: JSON.stringify({ productos }) 
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      alert(`✅ ¡Compra realizada! Pedido #${datos.data?.pedido_id || ''}`);
      // Vaciar carrito local
      estado.carrito = [];
      guardarCarrito();
    } else {
      alert('❌ Error: ' + (datos.message || 'No se pudo finalizar la compra'));
    }
  } catch (error) {
    console.error('❌ Error al finalizar compra:', error);
    alert('❌ Error de conexión');
  }
}

// ==========================================
// 🎬 INTERFAZ (MOSTRAR / OCULTAR)
// ==========================================

function mostrarInterfaz() {
  const authSection = document.getElementById('authSection');
  const authNav = document.getElementById('authNav');
  const logged = !!estado.usuario;

  if (authSection) {
    if (logged) authSection.classList.add('hidden');
    else authSection.classList.remove('hidden');
  }

  if (authNav) {
    if (logged) {
      authNav.innerHTML = `
        <span class="user-name">👤 ${estado.usuario.nombre}</span>
        <button onclick="verCarrito()" class="btn">🛒 Ver Carrito</button>
        <button onclick="finalizarCompra()" class="btn btn-success">✅ Comprar</button>
        <button id="logoutButton" class="btn btn-outline">Cerrar sesión</button>
      `;
      document.getElementById('logoutButton')?.addEventListener('click', cerrarSesion);
    } else {
      authNav.innerHTML = `<span>Inicia sesión para comprar</span>`;
    }
  }

  // Cada vez que cambia el login, repinto productos
  cargarProductos();
}

// ==========================================
// 🚀 ARRANQUE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 App lista (login + productos + carrito local)');

  const btnVerJSON = document.getElementById('verJSON');
  if (btnVerJSON) {
    btnVerJSON.addEventListener('click', verJSON);
  }

  cargarSesionGuardada();
  configurarEventosLogin();
  mostrarInterfaz();
});

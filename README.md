# 🛒 Tienda Online Full Stack

Una aplicación completa de e-commerce desarrollada con **Node.js**, **MySQL** y **JavaScript Vanilla**, implementando autenticación JWT y carrito de compras persistente.

## 📋 Descripción del Proyecto

Este proyecto es una tienda online completa que permite a los usuarios registrarse, iniciar sesión, navegar productos y realizar compras. Está dividido en backend (API REST) y frontend (SPA con JavaScript vanilla).

## 🏗️ Arquitectura

### Backend (Node.js + Express + MySQL)
- **Patrón MVC** (Modelo-Vista-Controlador)
- **API REST** con endpoints seguros
- **Autenticación JWT** para proteger rutas
- **Base de datos MySQL** con relaciones
- **Middleware personalizado** para verificación de tokens

### Frontend (HTML + CSS + JavaScript)
- **SPA** (Single Page Application)
- **Estado global** gestionado con JavaScript
- **LocalStorage** para persistencia de sesión y carrito
- **Interfaz responsive** con CSS moderno

## 📦 Funcionalidades Implementadas

### 🔐 Autenticación
- ✅ Registro de usuarios con hash de contraseñas
- ✅ Login con generación de JWT tokens
- ✅ Persistencia de sesión entre recargas
- ✅ Cierre de sesión con limpieza completa
- ✅ Middleware de verificación de tokens

### 🛍️ Gestión de Productos
- ✅ Listado público de productos (sin login)
- ✅ Vista privada con botones de compra (solo usuarios logueados)
- ✅ Carga dinámica desde API
- ✅ Visualización en formato tarjetas

### 🛒 Carrito de Compras
- ✅ Agregar productos al carrito
- ✅ Eliminar productos del carrito
- ✅ Actualización automática de cantidades
- ✅ Cálculo dinámico de totales
- ✅ Persistencia en localStorage

### 📦 Sistema de Pedidos
- ✅ Finalización de compras
- ✅ Creación de pedidos en base de datos
- ✅ Relación pedidos-productos con cantidades
- ✅ Historial de pedidos por cliente

### 🎨 Interfaz de Usuario
- ✅ Diseño responsive
- ✅ Formularios de login/registro intercambiables
- ✅ Navegación condicional según estado de sesión
- ✅ Feedback visual para todas las acciones

## 🛠️ Tecnologías Utilizadas

### Backend
```json
{
  "express": "5.1.0",
  "mysql2": "3.15.3",
  "jsonwebtoken": "9.0.2",
  "bcryptjs": "3.0.3",
  "cors": "2.8.5",
  "dotenv": "17.2.3"
}
```

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos y responsive
- **JavaScript ES6+** - Lógica de aplicación
- **Fetch API** - Comunicación con backend
- **LocalStorage** - Persistencia local

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── db.js                 # Configuración MySQL
├── controllers/
│   ├── auth.controller.js    # Lógica autenticación
│   ├── pedidos.controller.js # Lógica pedidos
│   └── productos.controller.js # Lógica productos
├── middleware/
│   └── auth.middleware.js    # Verificación JWT
├── models/
│   ├── clientes.model.js     # Modelo usuarios
│   ├── pedidos.model.js      # Modelo pedidos
│   └── productos.model.js    # Modelo productos
├── routes/
│   ├── auth.routes.js        # Rutas autenticación
│   ├── pedidos.routes.js     # Rutas pedidos
│   └── productos.routes.js   # Rutas productos
├── .env                      # Variables entorno
├── init.db.js               # Inicialización BBDD
├── package.json
└── server.js                # Servidor principal

frontend/
├── index.html               # Estructura HTML
├── script.js                # Lógica JavaScript
├── styles.css               # Estilos CSS
└── foto.png                 # Imagen placeholder
```

## 🗄️ Base de Datos

### Tablas Principales

#### Clientes
```sql
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Productos
```sql
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  categoria VARCHAR(50) NOT NULL,
  imagen_url VARCHAR(500),
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Pedidos
```sql
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  estado ENUM('pendiente', 'pagado', 'enviado', 'entregado'),
  total DECIMAL(10,2) DEFAULT 0.00,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
```

#### Pedidos_Productos
```sql
CREATE TABLE pedidos_productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT DEFAULT 1,
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone [url-repositorio]
cd tienda-online
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno
Crear archivo `.env` en `/backend/`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tienda
DB_PORT=3306

PORT=3000

JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h
```

### 4. Inicializar Base de Datos
```bash
# Crear base de datos 'tienda' en MySQL
# Luego ejecutar:
node init.db.js
```

### 5. Ejecutar Backend
```bash
npm run dev  # Modo desarrollo con nodemon
# o
npm start    # Modo producción
```

### 6. Abrir Frontend
Abrir `frontend/index.html` en el navegador o usar un servidor local:
```bash
cd frontend
# Con Python:
python -m http.server 8080
# Con Node.js:
npx serve .
```

## 🔑 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Productos
- `GET /api/productos` - Listar productos (público)

### Pedidos (Requieren autenticación)
- `POST /api/pedidos` - Crear pedido
- `GET /api/pedidos/mis-pedidos` - Ver mis pedidos

## 🧪 Datos de Prueba

### Usuario de Prueba
- **Email**: `test@example.com`
- **Password**: `123456`

### Productos Incluidos
- Camiseta Básica - €19.99
- Pantalón Vaquero - €49.99
- Zapatillas Sport - €79.99
- El Quijote - €12.50
- Guía JavaScript - €35.99
- Smartphone Basic - €199.99
- Auriculares - €29.99

## 🔐 Seguridad Implementada

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT con expiración
- ✅ Validación de tokens en rutas protegidas
- ✅ Sanitización de datos de entrada
- ✅ CORS configurado
- ✅ Variables de entorno para datos sensibles

## 📱 Características UX/UI

- ✅ Diseño responsive para móviles y desktop
- ✅ Feedback visual en todas las acciones
- ✅ Persistencia del carrito entre sesiones
- ✅ Navegación intuitiva
- ✅ Estados de carga y error
- ✅ Interfaz limpia y moderna

## 🚧 Próximas Mejoras

- [ ] Paginación de productos
- [ ] Filtros y búsqueda
- [ ] Panel de administración
- [ ] Pasarela de pago
- [ ] Sistema de notificaciones
- [ ] Wishlist/Favoritos
- [ ] Reseñas de productos
- [ ] Dashboard de analytics

## 👥 Contribución

Este proyecto es parte de un curso de desarrollo full stack. Siéntete libre de:

1. Hacer fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Hacer commit de tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🎓 Aprendizaje

Este proyecto cubre conceptos clave como:

- **Backend**: API REST, autenticación JWT, base de datos relacional
- **Frontend**: SPA, gestión de estado, localStorage, fetch API
- **Full Stack**: Comunicación cliente-servidor, seguridad, UX/UI

Perfecto para desarrolladores que quieren entender cómo construir una aplicación completa desde cero.

---

**¡Tienda Online Full Stack - De cero a producción!** 🚀
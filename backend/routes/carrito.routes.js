// routes/carrito.routes.js
import { Router } from 'express';
import * as carritoController from '../controllers/carrito.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * ==========================================
 * 🛒 RUTAS DE CARRITO
 * ==========================================
 */

// Obtener mi carrito
router.get('/', verificarToken, carritoController.obtenerCarrito);

// Agregar producto al carrito
router.post('/agregar', verificarToken, carritoController.agregarProducto);

// Eliminar producto del carrito
router.delete('/eliminar/:producto_id', verificarToken, carritoController.eliminarProducto);

// Vaciar carrito
router.delete('/vaciar', verificarToken, carritoController.vaciarCarrito);

// Finalizar compra
router.post('/finalizar', verificarToken, carritoController.finalizarCompra);

export default router;
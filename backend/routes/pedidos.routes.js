// routes/pedidos.routes.js
import { Router } from 'express';
import * as pedidosController from '../controllers/pedidos.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * ==========================================
 * 🛒 RUTAS DE PEDIDOS
 * ==========================================
 * NOTA: Todas las rutas requieren autenticación
 */

// Crear pedido (protegido)
router.post('/', verificarToken, pedidosController.crearPedido);

// Obtener mis pedidos (protegido)
router.get('/mis-pedidos', verificarToken, pedidosController.getMisPedidos);

export default router;

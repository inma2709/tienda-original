// routes/pedidos.routes.js
import { Router } from 'express';
import * as pedidosController from '../controllers/pedidos.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';


const router = Router();

// 🔐 TODAS las rutas de pedidos necesitan que el usuario esté logueado
router.use(verificarToken);

/**
 * ==========================================
 * 🛒 RUTAS BÁSICAS DE PEDIDOS
 * ==========================================
 */

// 📝 1. CREAR PEDIDO (Finalizar compra)
router.post('/', pedidosController.crearPedido);

// 📋 2. VER MIS PEDIDOS
router.get('/misPedidos', pedidosController.getMisPedidos);





export default router;
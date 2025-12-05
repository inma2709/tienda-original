// controllers/carrito.controller.js
import * as carritoModel from '../models/carrito.model.js';

/**
 * ==========================================
 * 🛒 CONTROLADOR DE CARRITO
 * ==========================================
 */

/**
 * Agregar producto al carrito
 */
export async function agregarProducto(req, res) {
  try {
    const { producto_id, cantidad = 1 } = req.body;
    const cliente_id = req.user.cliente_id;
    
    console.log('🛒 Agregando al carrito:', { cliente_id, producto_id, cantidad });
    
    await carritoModel.agregarProducto(cliente_id, producto_id, cantidad);
    
    res.status(200).json({
      success: true,
      message: 'Producto agregado al carrito'
    });
    
  } catch (error) {
    console.error('❌ Error al agregar al carrito:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
}

/**
 * Obtener carrito del usuario
 */
export async function obtenerCarrito(req, res) {
  try {
    const cliente_id = req.user.cliente_id;
    
    console.log('📋 Obteniendo carrito del cliente:', cliente_id);
    
    const carrito = await carritoModel.obtenerCarrito(cliente_id);
    
    // Calcular total
    const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    
    res.status(200).json({
      success: true,
      data: {
        productos: carrito,
        total: total,
        cantidad_items: carrito.length
      }
    });
    
  } catch (error) {
    console.error('❌ Error al obtener carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}

/**
 * Eliminar producto del carrito
 */
export async function eliminarProducto(req, res) {
  try {
    const { producto_id } = req.params;
    const cliente_id = req.user.cliente_id;
    
    console.log('🗑️ Eliminando del carrito:', { cliente_id, producto_id });
    
    await carritoModel.eliminarProducto(cliente_id, producto_id);
    
    res.status(200).json({
      success: true,
      message: 'Producto eliminado del carrito'
    });
    
  } catch (error) {
    console.error('❌ Error al eliminar del carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}

/**
 * Vaciar carrito
 */
export async function vaciarCarrito(req, res) {
  try {
    const cliente_id = req.user.cliente_id;
    
    console.log('🗑️ Vaciando carrito del cliente:', cliente_id);
    
    await carritoModel.vaciarCarrito(cliente_id);
    
    res.status(200).json({
      success: true,
      message: 'Carrito vaciado'
    });
    
  } catch (error) {
    console.error('❌ Error al vaciar carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}

/**
 * Finalizar compra (confirmar carrito)
 */
export async function finalizarCompra(req, res) {
  try {
    const cliente_id = req.user.cliente_id;
    
    console.log('✅ Finalizando compra del cliente:', cliente_id);
    
    const resultado = await carritoModel.confirmarCarrito(cliente_id);
    
    res.status(200).json({
      success: true,
      message: 'Pedido confirmado exitosamente',
      data: { pedido_id: resultado.pedido_id }
    });
    
  } catch (error) {
    console.error('❌ Error al finalizar compra:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}
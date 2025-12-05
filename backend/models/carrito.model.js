// models/carrito.model.js
import pool from '../config/db.js';

/**
 * ==========================================
 * 🛒 MODELO DE CARRITO (usando tabla pedidos)
 * ==========================================
 */

/**
 * Obtener o crear carrito activo del cliente
 */
async function obtenerCarritoActivo(cliente_id) {
  const connection = await pool.getConnection();
  
  try {
    // Buscar pedido en estado "carrito"
    const [carritos] = await connection.execute(
      'SELECT * FROM pedidos WHERE cliente_id = ? AND estado = "carrito" LIMIT 1',
      [cliente_id]
    );
    
    if (carritos.length > 0) {
      return carritos[0];
    } else {
      // Crear nuevo carrito (pedido en estado carrito)
      const [result] = await connection.execute(
        'INSERT INTO pedidos (cliente_id, estado, fecha) VALUES (?, "carrito", NOW())',
        [cliente_id]
      );
      return { id: result.insertId, cliente_id, estado: 'carrito' };
    }
  } finally {
    connection.release();
  }
}

/**
 * Agregar producto al carrito
 */
export async function agregarProducto(cliente_id, producto_id, cantidad = 1) {
  const connection = await pool.getConnection();
  
  try {
    // Obtener carrito activo
    const carrito = await obtenerCarritoActivo(cliente_id);
    const pedido_id = carrito.id;
    
    // Obtener precio actual del producto
    const [productos] = await connection.execute(
      'SELECT precio FROM productos WHERE id = ?',
      [producto_id]
    );
    
    if (productos.length === 0) {
      throw new Error('Producto no encontrado');
    }
    
    const precio_unitario = productos[0].precio;
    
    // Verificar si el producto ya está en el carrito
    const [existente] = await connection.execute(
      'SELECT * FROM pedidos_productos WHERE pedido_id = ? AND producto_id = ?',
      [pedido_id, producto_id]
    );
    
    if (existente.length > 0) {
      // Si existe, actualizar cantidad
      const [result] = await connection.execute(
        'UPDATE pedidos_productos SET cantidad = cantidad + ? WHERE pedido_id = ? AND producto_id = ?',
        [cantidad, pedido_id, producto_id]
      );
      return result;
    } else {
      // Si no existe, insertar nuevo
      const [result] = await connection.execute(
        'INSERT INTO pedidos_productos (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [pedido_id, producto_id, cantidad, precio_unitario]
      );
      return result;
    }
  } finally {
    connection.release();
  }
}

/**
 * Obtener carrito del cliente con productos
 */
export async function obtenerCarrito(cliente_id) {
  const connection = await pool.getConnection();
  
  try {
    // Obtener carrito activo
    const carrito = await obtenerCarritoActivo(cliente_id);
    const pedido_id = carrito.id;
    
    // Obtener productos del carrito
    const [productos] = await connection.execute(`
      SELECT 
        pp.producto_id,
        pp.cantidad,
        pp.precio_unitario,
        p.nombre,
        p.precio as precio_actual,
        p.stock,
        (pp.cantidad * pp.precio_unitario) as subtotal
      FROM pedidos_productos pp
      INNER JOIN productos p ON pp.producto_id = p.id
      WHERE pp.pedido_id = ?
    `, [pedido_id]);
    
    return productos;
  } finally {
    connection.release();
  }
}

/**
 * Eliminar producto del carrito
 */
export async function eliminarProducto(cliente_id, producto_id) {
  const connection = await pool.getConnection();
  
  try {
    // Obtener carrito activo
    const carrito = await obtenerCarritoActivo(cliente_id);
    const pedido_id = carrito.id;
    
    const [result] = await connection.execute(
      'DELETE FROM pedidos_productos WHERE pedido_id = ? AND producto_id = ?',
      [pedido_id, producto_id]
    );
    return result;
  } finally {
    connection.release();
  }
}

/**
 * Vaciar carrito
 */
export async function vaciarCarrito(cliente_id) {
  const connection = await pool.getConnection();
  
  try {
    // Obtener carrito activo
    const carrito = await obtenerCarritoActivo(cliente_id);
    const pedido_id = carrito.id;
    
    const [result] = await connection.execute(
      'DELETE FROM pedidos_productos WHERE pedido_id = ?',
      [pedido_id]
    );
    return result;
  } finally {
    connection.release();
  }
}

/**
 * Confirmar carrito (cambiar estado a "confirmado")
 */
export async function confirmarCarrito(cliente_id) {
  const connection = await pool.getConnection();
  
  try {
    // Obtener carrito activo
    const carrito = await obtenerCarritoActivo(cliente_id);
    const pedido_id = carrito.id;
    
    // Cambiar estado de "carrito" a "confirmado"
    const [result] = await connection.execute(
      'UPDATE pedidos SET estado = "confirmado", fecha = NOW() WHERE id = ?',
      [pedido_id]
    );
    
    return { pedido_id, result };
  } finally {
    connection.release();
  }
}
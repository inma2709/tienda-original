// Aquí importamos todas las funciones (*) del archivo productos.model.js y lo llamaremos productosModel

import * as productosModel from "../models/productos.model.js"; 
//esta función es la que se encarga de gestionar la petición y respuesta de los productos
//usa la función obtenerTodos del modelo para traer los productos de la base de datos
export async function getProductos(req, res) {
  try {
    console.log('📦 Obteniendo productos...');
   //la variable productos espera la respuesta de la función obtenerTodos del modelo
   //productos va a ser nuestra variable donde se guarden todos los productos que traiga la bbdd

    const productos = await productosModel.obtenerTodos();
   //esta es la respuesta que tiene el back preparada para el front cuando el front le haga una petición
   //esta petición se la hará el front a través de la ruta lanzando una peticion fetch.
   
    res.status(200).json({
      success: true,
      message: `Se encontraron ${productos.length} productos`,
      data: productos
    });
   
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
}

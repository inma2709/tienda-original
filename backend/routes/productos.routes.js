import {Router} from "express";
import * as productosController from "../controllers/productos.controller.js"

const productosRoutes = Router();



//nos creamos una ruta donde se expone a los productos que tiene el controlador preparados para nosotros

productosRoutes.get ("/", productosController.getProductos)

export default productosRoutes;
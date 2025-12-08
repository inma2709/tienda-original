import jwt from 'jsonwebtoken';
export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ 
      mensaje: "Falta cabecera Authorization",
      detalle: "Debes incluir 'Authorization: Bearer <token>' en la petición"
    });
  }

  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ 
      mensaje: "Formato de token no válido",
      detalle: "El formato debe ser: 'Bearer <token>'"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      cliente_id: decoded.cliente_id,
      id: decoded.cliente_id,
      email: decoded.email,
      nombre: decoded.nombre
    };

    next();

  } catch (error) {
    console.error("Error al verificar token:", error.message);
    
    let mensaje = "Token no válido";
    
    if (error.name === "TokenExpiredError") {
      mensaje = "Token expirado";
    } else if (error.name === "JsonWebTokenError") {
      mensaje = "Token malformado";
    } else if (error.name === "NotBeforeError") {
      mensaje = "Token no es válido todavía";
    }

    return res.status(401).json({ 
      mensaje,
      detalle: "Por favor, inicia sesión nuevamente"
    });
  }
}

export const verifyToken = verificarToken;

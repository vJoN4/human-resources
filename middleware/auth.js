const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "debugkey");
    request.user = decoded;
    next();
  } catch (error) {
    console.log("Error -->", error);
    response.status(200).json({ code: 401, message: "No cuentas con los permisos suficientes"});
  }
};
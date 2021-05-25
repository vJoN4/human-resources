const functions = require('../utils/functions');

const express = require('express');
const jwt = require('jsonwebtoken');
const users = express.Router();
const db = require('../config/database');

//CREATING USERS --> 3 REQUIRED FIELDS
users.post("/signup", async (request, response, next) => {
  const bodyReqLength = Object.keys(request.body).length;  
  const { notBlankFields, blankFields } = functions.handleBlankFields(Object.keys(request.body), request);
  if (bodyReqLength == 3 && notBlankFields) {
    const { username, email, user_password } = request.body;
    try{
      let query = `INSERT INTO users VALUES (UUID(), '${username}', '${email}', password('${user_password}'))`;
      let { affectedRows } = await db.query(query);
      response.status( affectedRows ? 201 : 500 ).json( affectedRows ? 
    { code: 201, message: "Usuario creado correctamente" } : { code: 500, message: "Ocurrió un error"}); 
    } catch(e) {
      response.status(400).json({code: 400, message: e.sqlMessage});
    }
  }
  else {
    response.status(400).json({ code:400, message: `Falta(n) ${functions.fieldsToReview(bodyReqLength, blankFields, 3) } campo(s) para insertar correctamente el registro`})
  }
});

//SIGN IN TO USERS
users.post("/login", async (request, response, next) => {
  const bodyReqLength = Object.keys(request.body).length;  
  const { notBlankFields, blankFields } = functions.handleBlankFields(Object.keys(request.body), request);
  if (bodyReqLength == 2 && notBlankFields) {
    const { email, user_password } = request.body;
    const query = `SELECT * FROM users WHERE email = '${email}' AND user_password = PASSWORD('${user_password}')`;
    const result = await db.query(query);
    if (result.length) {
      const { user_id, user_mail } = result[0];
      const token = jwt.sign({
        user_id,
        user_mail
      }, "debugkey");
      response.status(200).json({ code:200, message: token});
    }
    else {
      response.status(401).json({ code:200, message: "Correo y/o contraseña incorrectos" });
    }
  }
  else {
    response.status(400).json({ code:400, message: `Falta(n) ${functions.fieldsToReview(bodyReqLength, blankFields, 2) } campo(s) para loguearse correctamente`})
  }
});

module.exports = users;

// USERS = {
//   USERNAME
//   EMAIL
//   USER_PASSWORD
// }
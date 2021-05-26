const functions = require('../utils/functions');

const express = require('express');
const employees = express.Router();
const db = require('../config/database');

const recordExist = async (id) => {
  let queryToValidate = await db.query(`SELECT COUNT(*) FROM employees WHERE id = '${id}'`);
  return queryToValidate[0]['COUNT(*)'];
};

employees.get("/", async (request, response, next) => {
  const emp = await db.query("SELECT * FROM employees");
  response.status( emp.length ? 200 : 404 ).json( emp.length  ? { code:200, message: emp } : { code: 404, message:"Error contactando a la base de datos" });
});

//ADDING EMPLOYEES --> 5 REQUIRED FIELDS
employees.post("/", async (request, response, next) => {
  const bodyReqLength = Object.keys(request.body).length;  
  const { notBlankFields, blankFields } = functions.handleBlankFields(Object.keys(request.body), request);
  if(bodyReqLength === 5 && notBlankFields) {
    const { first_name, last_name, phone_number, email, address } = request.body;
    try{
      let query = `INSERT INTO employees VALUES (UUID(), '${first_name}', '${last_name}', '${phone_number}', '${email}', '${address}')`;
      let { affectedRows } = await db.query(query);
      response.status( affectedRows ? 201 : 500 ).json( affectedRows ? 
      { code: 201, message: "Empleado insertado correctamente" } : { code: 500, message: "Ha ocurrido un error"});
    } catch (e) {
      response.status(200).json({code: 400, message: e.sqlMessage});
    }
  }
  else {
    response.status(200).json({ code:400, message: `Falta(n) ${functions.fieldsToReview(bodyReqLength, blankFields, 5) } campo(s) para insertar correctamente el registro`})
  }
});

//DELETING EMPLOYEES --> 1 REQUIRED FIELD
employees.delete("/:id", async (request, response, next) => {
  const id = request.params.id;
  if (id) {
    let verification = await db.query(`SELECT * FROM employees WHERE id = '${id}'`);
    const query = `DELETE FROM employees WHERE id = '${id}'`;
    if(verification.length){
      let { affectedRows } = await db.query(query);
      response.status( affectedRows ? 200 : 404 ).json( affectedRows ? 
      { code: 200, message: "Empleado eliminado correctamente" } : { code: 404, message: "Empleado no encontrado"});  
    }
    else {
      response.status(200).json({code: 404, message: "Empleado no encontrado"});
    }
  }
  else{
    response.status(200).json({code: 400, message: "Request vacio"});
  }
});

//UPDATING ALL THE EMPLOYEE RECORD
employees.put("/", async (request, response, next) => {
  const bodyReqLength = Object.keys(request.body).length;  
  const { notBlankFields, blankFields } = functions.handleBlankFields(Object.keys(request.body), request);
  //Here are 6 fields because I0m sending the as a part of the body and not as an parameter in the path
  if(bodyReqLength === 6 && notBlankFields) {
    if (recordExist(request.body.id)) {
      const { first_name, last_name, phone_number, email, address } = request.body;
      try{
        let query = `UPDATE employees SET first_name = '${first_name}', last_name = '${last_name}', phone_number = '${phone_number}', email= '${email}', address = '${address}' WHERE id = '${request.body.id}'`;
        let { affectedRows } = await db.query(query);
        response.status( affectedRows ? 201 : 500 ).json( affectedRows ? 
        { code: 201, message: "Empleado actualizado correctamente" } : { code: 500, message: "Ha ocurrido un error"});
      } catch(e) {
        response.status(400).json({code: 400, message: e.sqlMessage});
      }
    }
    else {
      response.status(400).json({ code:400, message: "El empleado especificado no existe"});
    }
  }
  else {
    response.status(400).json({ code:400, message: `Falta(n) ${functions.fieldsToReview(bodyReqLength, blankFields, 6) } campo(s) para actualizar correctamente TODO el registro`})
  }
});

//UPDATING CERTAIN FIELDS FOR THE EMPLOYEE RECORD
employees.patch("/", async (request, response, next) => {
  const bodyReqLength = Object.keys(request.body).length;  
  if(bodyReqLength !== 1) {
    if(recordExist(request.body.id)) {
      const { first_name, last_name, phone_number, email, address } = request.body;
      let query = "UPDATE employees SET ";
      query += (first_name) ? `first_name='${first_name}',` : "" ;
      query += (last_name) ? `last_name='${last_name}',` : "" ;
      query += (phone_number) ? `phone_number='${phone_number}',` : "" ;
      query += (email) ? `email='${email}',` : "" ;
      query += (address) ? `address='${address}',` : "" ;
      query += `WHERE id = '${request.body.id}'`;
      let position = query.search("WHERE")-1;
      let queryAux = query.split("")
      queryAux[position] = " ";
      query = queryAux.join("")
      try{
        let { affectedRows } = await db.query(query);
        response.status( affectedRows ? 201 : 500 ).json( affectedRows ? 
      { code: 201, message: "Empleado actualizado correctamente" } : { code: 500, message: "Ocurrió un error"});
      } catch(e) {
        response.status(400).json({code: 400, message: e.sqlMessage});
      }
    }
    else {
      response.status(400).json({ code:400, message: "El empleado especificado no existe"});
    }
  }
  else {
    response.status(400).json({ code:400, message: "Se debe actualizar al menos un campo"});
  }
});

module.exports = employees;

// EMPLOYEES = {
//   ID
//   FIRSt_NAME
//   LAST_NAME
//   PHONE_NUMBER UNIQUE
//   EMAIL UNIQUE
//   ADDRESS
// }
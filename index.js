//DEPENDENCIES
const express = require('express');
const morgan = require('morgan');
//ROUTES
const employees = require('./routes/employees');
const user = require('./routes/user');
//MIDDLEWARE
const auth = require('./middleware/auth');
const cors = require('./middleware/cors');

const app = express();
app.use(cors);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", user);
app.use(auth);
app.use("/employees", employees);
//URL NOT FOUND
app.use((request, response, next) => response.status(404).json({ code: 404, message: "URL no encontrada"}));


app.listen(process.env.PORT || 3030, () => {
  console.log("Server is running...");
});

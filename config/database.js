const mysql = require('mysql');
const util = require('util');

// mysql://b57226feba1c8b:2ea57757@us-cdbr-east-03.cleardb.com/heroku_ef0fa8f904bc75b?reconnect=true

// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: localhost',
//   user: 'root',
//   password: '',
//   database: 'human_resources'
// });
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'b57226feba1c8b',
    password: '2ea57757',
    database: 'heroku_ef0fa8f904bc75b'
});
pool.query = util.promisify(pool.query);
module.exports = pool; 
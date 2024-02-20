const mysql = require("mysql")
const con = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sm_database'
  });


module.exports = con

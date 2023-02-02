const mysql  = require('mysql');
const connection  =  mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Durgesh$41084",
    database:"durgeshdb",
})

module.exports = connection;


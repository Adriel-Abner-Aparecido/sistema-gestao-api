const mysql = require('mysql2/promise');
require('dotenv').config();

const connection_ii = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_II
})

module.exports = {
    connection_ii
}
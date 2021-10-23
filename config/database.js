const mysql = require("mysql2/promise");
const { logger } = require("./winston");

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: "13.125.184.176",
    user: "admin",
    port: "3306",
    password: "rootpassword",
    database: "pindergartenDB",
});

module.exports = {
    pool: pool,
};
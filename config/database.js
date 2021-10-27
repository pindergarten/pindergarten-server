const mysql = require("mysql2/promise");
const { logger } = require("./winston");

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: "pindergartendb.cceehevog5dq.ap-northeast-2.rds.amazonaws.com",
    user: "admin",
    port: "3306",
    password: "vlsejrkems",
    database: "pindergartenDB",
});

module.exports = {
    pool: pool,
};
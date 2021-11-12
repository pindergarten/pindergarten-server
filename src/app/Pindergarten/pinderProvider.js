const baseResponse = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const { response, errResponse } = require("../../../config/response");

const pinderDao = require("./pinderDao");

// Provider: Read 비즈니스 로직 처리

exports.retrievePindergartens = async function(userId) {
    const connection = await pool.getConnection(async(conn) => conn);
    const pindergartenListResult = await pinderDao.selectPindergartens(connection);
    connection.release();

    return pindergartenListResult;
}
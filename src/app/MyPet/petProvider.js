const baseResponse = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const { response, errResponse } = require("../../../config/response");

const petDao = require("./petDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveMyPets = async function(userId) {
    const connection = await pool.getConnection(async(conn) => conn);
    const petListResult = await petDao.selectMyPets(connection, userId);
    connection.release();

    return response(baseResponse.SUCCESS, petListResult[0]);
}
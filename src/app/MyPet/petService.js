const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const petProvider = require("./petProvider");
const petDao = require("./petDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리
exports.createPet = async function(userId, name, profile_image, gender, breed, birth, vaccination, neutering) {
    try {
        // //userId 확인
        // const userRows = await userProvider.retrieveUser(userId);
        // if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);

        const insertPetParams = [userId, name, profile_image, gender, breed, birth, vaccination, neutering];
        const connection = await pool.getConnection(async(conn) => conn);

        const petResult = await petDao.insertPet(connection, insertPetParams);
        connection.release();

        return response(baseResponse.SUCCESS, { petId: petResult[0].insertId, });
    } catch (err) {
        logger.error(`APP - ceratePet Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
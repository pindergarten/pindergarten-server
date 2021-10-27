const baseResponseStatus = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.phoneNumberCheck = async function(phone) {
    const connection = await pool.getConnection(async(conn) => conn);
    const phoneNumberCheckResult = await userDao.selectUserPhoneNumber(connection, phone);
    connection.release();

    return phoneNumberCheckResult;
};

exports.nickNameCheck = async function(nickname) {
    const connection = await pool.getConnection(async(conn) => conn);
    const nickNameResult = await userDao.selectUserNickName(connection, nickname)
    connection.release();

    return nickNameResult;
};


exports.retrieveUser = async function(userId) {
    const connection = await pool.getConnection(async(conn) => conn);
    const userResult = await userDao.selectUserId(connection, userId);

    connection.release();

    return userResult[0];
};
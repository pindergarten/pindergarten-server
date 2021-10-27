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

exports.accountCheck = async function(phone) {
    const connection = await pool.getConnection(async(conn) => conn);
    const userAccountResult = await userDao.selectUserAccount(connection, phone)
    connection.release();

    return userAccountResult;
};

exports.retrieveUser = async function(userId) {
    const connection = await pool.getConnection(async(conn) => conn);
    const userResult = await userDao.selectUserId(connection, userId);

    connection.release();

    return userResult[0];
};

exports.passwordCheck = async function(selectUserPasswordParams) {
    const connection = await pool.getConnection(async(conn) => conn);
    const passwordCheckResult = await userDao.selectUserPassword(
        connection,
        selectUserPasswordParams
    );
    connection.release();
    return passwordCheckResult[0];
};

exports.checkJWT = async function(userId) {
    const connection = await pool.getConnection(async(conn) => conn);
    const checkJWTResult = await userDao.selectJwtToken(connection, userId);
    connection.release();

    return checkJWTResult;
};

exports.loginCheck = async function(userId) {
    const connection = await pool.getConnection(async(conn) => conn);
    const loginResult = await userDao.selectLoginUser(connection, userId);
    connection.release();

    return loginResult;
};
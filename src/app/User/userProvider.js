const baseResponseStatus = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function(email) {
    if (!email) {
        const connection = await pool.getConnection(async(conn) => conn);
        const userListResult = await userDao.selectUser(connection);
        connection.release();

        return userListResult;

    } else {
        const connection = await pool.getConnection(async(conn) => conn);
        const userListResult = await userDao.selectUserEmail(connection, email);
        connection.release();

        return userListResult;
    }
};

exports.retrieveUser = async function(userId) {
    const connection = await pool.getConnection(async(conn) => conn);
    const userResult = await userDao.selectUserId(connection, userId);

    connection.release();

    return userResult[0];
};

exports.emailCheck = async function(email) {
    const connection = await pool.getConnection(async(conn) => conn);
    const emailCheckResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return emailCheckResult;
};

exports.naverEmailCheck = async function (email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const emailCheckResult = await userDao.selectNaverUserEmail(
      connection,
      email
    );
    connection.release();
  
    return emailCheckResult;
  };
  exports.emailVerifyCheck = async function (email) {
    const connection = await pool.getConnection(async (conn) => conn);
    connection.release();
  
    return emailCheckResult;
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

exports.accountCheck = async function(email) {
    const connection = await pool.getConnection(async(conn) => conn);
    const userAccountResult = await userDao.selectUserAccount(connection, email);
    connection.release();

    return userAccountResult;
};
exports.loginCheck = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const loginResult = await userDao.selectLoginUser(connection, userId);
    connection.release();
  
    return loginResult;
  };
exports.retrieveLogin = async function(userId) {
    const connection = await pool.getConnection(async(conn) => conn);
    const loginResult = await userDao.selectLoginUser(connection, userId);
    connection.release();

    return loginResult;
};

exports.retrieveUserInfo = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userInfoResult = await userDao.selectUserInfo(connection, userId);
    connection.release();
  
    return userInfoResult[0];
  };
  exports.retrieveUserProfile = async function (userId, userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userInfoResult = await userDao.selectUserProfile(
      connection,
      userId,
      userIdFromJWT
    );
    connection.release();
  
    return userInfoResult[0];
  };
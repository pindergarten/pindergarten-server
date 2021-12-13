const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function(nickname, password, phone) {
    try {
        const connection = await pool.getConnection(async(conn) => conn);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const retrieveUser = await userProvider.accountCheck(phone);

        if (retrieveUser.length > 0 && retrieveUser[0].status == 'DELETED') {
            const updateUserInfo = await userDao.updateUserInfo(connection, nickname, hashedPassword, phone, 'ACTIVATED')

            connection.release();
            return response(baseResponse.SUCCESS, { userId: retrieveUser[0].id, });
        } else {
            // 전화번호 중복 확인
            const phoneNumberRows = await userProvider.phoneNumberCheck(phone);
            if (phoneNumberRows.length > 0) {
                return response(baseResponse.SIGNUP_REDUNDANT_PHONENUMBER);
            }

            const insertUserInfoParams = [nickname, hashedPassword, phone];
            const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
            console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
            connection.release();
            return response(baseResponse.SUCCESS, { userId: userIdResult[0].insertId, });
        }


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.postSignIn = async function(phone, password) {
    try {
        // 핸드폰번호 여부 확인
        const phoneNumberRows = await userProvider.phoneNumberCheck(phone);
        if (phoneNumberRows.length < 1) {
            return errResponse(baseResponse.USER_ID_NOT_EXIST);
        }

        // 비밀번호 확인
        const selectPassword = phoneNumberRows[0].password;
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");


        if (selectPassword !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const selectPhoneNumber = phoneNumberRows[0].phone;
        const userInfoRows = await userProvider.accountCheck(selectPhoneNumber);

        if (userInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }


        console.log(userInfoRows[0].id) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign({
                userId: userInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );
        const loginParams = [token, userInfoRows[0].id];
        const loginRows = await userProvider.loginCheck(userInfoRows[0].id);

        if (loginRows[0].length < 1) {
            //insert
            console.log("insert");
            const connection = await pool.getConnection(async(conn) => conn);
            const loginResult = await userDao.insertLoginUser(
                connection,
                loginParams
            );
            connection.release();
        } else {
            console.log("update");
            //update
            const connection = await pool.getConnection(async(conn) => conn);
            const loginResult = await userDao.updateJwtToken(connection, loginParams);
            connection.release();
        }

        return response(baseResponse.SUCCESS, { 'userId': userInfoRows[0].id, 'jwt': token });


    } catch (err) {
        logger.error(`App - postSingIn Service error\ n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
exports.updateUserInfo = async function(userId, profile_image) {
    try {
        // //userId 확인
        // const userRows = await userProvider.retrieveUser(userId);
        // if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);

        const connection = await pool.getConnection(async(conn) => conn);

        const userResult = await userDao.updateUserImage(connection, userId, profile_image);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`APP - updateUserInfo Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.updatePassword = async function(phone, password) {
    try {
        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const updatePasswordParams = [hashedPassword, phone];

        const connection = await pool.getConnection(async(conn) => conn);

        const userIdResult = await userDao.updatePassword(connection, updatePasswordParams);

        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - updatePassword Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.patchJwtStatus = async function(userId) {
    try {
        // jwt table status update
        const loginUserRows = await userProvider.loginCheck(userId);

        if (loginUserRows[0].length < 1)
            return errResponse(baseResponse.SIGNIN_NOT_EXIST);
        if (loginUserRows[0][0].status === 1)
            return errResponse(baseResponse.SIGNIN_NOT_EXIST);

        const connection = await pool.getConnection(async(conn) => conn);
        const userIdResult = await userDao.updateJwtStatus(connection, userId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - SignOut Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.updateUserStatus = async function(userId) {
    try {
        //userId 확인
        const userRows = await userProvider.retrieveUser(userId);
        if (!userRows || userRows.length < 1)
            return errResponse(baseResponse.USER_ID_NOT_EXIST);

        const connection = await pool.getConnection(async(conn) => conn);
        const userResult = await userDao.updateUserStatus(connection, userId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchUserStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.blockUser = async function(userId, blockUserId) {
    try {
        //userId 확인
        const userRows = await userProvider.retrieveUser(userId);
        if (!userRows || userRows.length < 1)
            return errResponse(baseResponse.USER_ID_NOT_EXIST);

        const blockRows = await userProvider.retrieveBlock(userId, blockUserId);
        if (blockRows.length > 0)
            return errResponse(baseResponse.ALREADY_BLOCK);

        const connection = await pool.getConnection(async(conn) => conn);
        const userResult = await userDao.insertBlock(connection, userId, blockUserId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - blockUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//유저 신고
exports.insertReport = async function(userId, reportUserId, reason, title, content) {
    try {
        const insertReportParams = [userId, reportUserId, reason, title, content];
        const connection = await pool.getConnection(async(conn) => conn);

        const reportResult = await userDao.insertReport(connection, insertReportParams);
        console.log(`신고된 유저 : ${reportResult.insertId}`);
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - Insert Report Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
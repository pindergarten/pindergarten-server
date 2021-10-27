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

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [nickname, hashedPassword, phone];

        const connection = await pool.getConnection(async(conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS, { userId: userIdResult[0].insertId, });


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
            return errResponse(baseResponse.SIGNIN_PHONENUMBER_WRONG);
        }
        const selectPhone = phoneNumberRows[0].phone;

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectPhone, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
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
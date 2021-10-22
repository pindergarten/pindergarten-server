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

exports.createUser = async function(email, password, name, phone) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);


        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [email, hashedPassword, name, phone];

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


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function(email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

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
        console.log(token)

        const loginParams = [token, userInfoRows[0].Id];
        const loginRows = await userProvider.loginCheck(userInfoRows[0].Id);
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
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//자동 로그인
exports.postAutoSignIn = async function(userId) {
    try {
        // 계정 상태 확인
        const userInfoRows = await userProvider.retrieveUser(userId);
        if (userInfoRows.length < 1)
            return errResponse(baseResponse.USER_ID_NOT_EXIST);
        if (userInfoRows.status === 1)
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);

        //로그인 테이블 확인
        const loginRows = await userProvider.retrieveLogin(userId);

        if (loginRows[0].length < 1)
            return errResponse(baseResponse.USER_LOGIN_EMPTY);
        if (loginRows[0][0].status === 1)
            return errResponse(baseResponse.USER_LOGIN_EMPTY);

        //토큰 생성 Service
        let token = await jwt.sign({
                userId: userInfoRows.id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        //로그인 추가
        const loginParams = [token, userId];
        const connection = await pool.getConnection(async(conn) => conn);
        const loginResult = await userDao.updateJwtToken(connection, loginParams);
        connection.release();

        return response(baseResponse.SUCCESS, {
            userId: userInfoRows.id,
            jwt: token,
        });
    } catch (err) {
        logger.error(
            `App - postAutoSignIn Service error\n: ${err.message} \n${JSON.stringify(
          err
        )}`
        );
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 유저 정보 수정
exports.editUser = async function(id, name) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async(conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, name)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


//logout
exports.patchJwtStatus = async function(userId) {
    try {
        // jwt table status update
        const loginUserRows = await userProvider.loginCheck(userId);

        if (loginUserRows[0].length < 1)
            return errResponse(baseResponse.LOGIN_NOT_EXIST);
        if (loginUserRows[0][0].status === 1)
            return errResponse(baseResponse.LOGIN_NOT_EXIST);

        const connection = await pool.getConnection(async(conn) => conn);
        const userIdResult = await userDao.updateJwtStatus(connection, userId);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - Logout Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.createNaverUser = async function(email, nickname, phone) {
    try {
        // 가입여부
        const emailRows = await userProvider.naverEmailCheck(email);
        var userId;
        if (emailRows.length < 1) {
            //소셜 회원가입
            phone = phone.replace(/-/gi, ""); //하이픈 제거
            const insertUserParams = [email, nickname, phone];
            const connection = await pool.getConnection(async(conn) => conn);

            const userIdResult = await userDao.insertNaverUser(
                connection,
                insertUserParams
            );
            connection.release();
            userId = userIdResult[0].insertId;
        } else {
            userId = emailRows[0].Id;
        }
        //토큰 생성 Service
        let token = await jwt.sign({
                userId: userId,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );
        const loginParams = [token, userId];
        const loginRows = await userProvider.loginCheck(userId);
        if (loginRows[0].length < 1) {
            //insert
            const connection = await pool.getConnection(async(conn) => conn);
            const loginResult = await userDao.insertLoginUser(
                connection,
                loginParams
            );
            connection.release();
        } else {
            //update
            const connection = await pool.getConnection(async(conn) => conn);
            const loginResult = await userDao.updateJwtToken(connection, loginParams);
            connection.release();
        }

        return response(baseResponse.SUCCESS, {
            userId: userId,
            jwt: token,
        });
    } catch (err) {
        logger.error(`App - createNaverUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
exports.updateUserNickname = async function(userId, nickname) {
    try {
        //userId 확인
        const userRows = await userProvider.retrieveUser(userId);
        if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);

        const connection = await pool.getConnection(async(conn) => conn);
        const userResult = await userDao.updateUserNickname(
            connection,
            userId,
            nickname
        );
        connection.release();

        return response(baseResponse.SUCCESS, { userId: userId });
    } catch (err) {
        logger.error(`App - patchUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

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
};
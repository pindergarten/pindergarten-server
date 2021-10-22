const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const secret_config = require("../../../config//secret");
const { response, errResponse } = require("../../../config/response");
const request = require("request");
const crypto = require("crypto");
const cache = require("memory-cache");
const jwt = require("jsonwebtoken");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function(req, res) {

    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function(req, res) {

    /**
     * Body: email, password, name, phone
     */
    const {
        email,
        password,
        name,
        password_check,
        phone,
    } = req.body;

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if (!password_check)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_CHECK_EMPTY));
    if (!name) return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    if (password.length < 6 || password.length > 12)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    if (password_check.length < 6 || password_check.length > 12)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    if (name.length < 2)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));

    //비밀번호 일치 확인
    if (password !== password_check)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_NOT_MATCH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    var checkNumber = password.search(/[0-9]/g);
    var checkEnglish = password.search(/[a-z]/gi);

    if (checkNumber < 0 || checkEnglish < 0) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE));
    }
    //번호 정규표현식 체크
    var regPhone = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
    if (!regPhone.test(phone))
        return res.send(response(baseResponse.SIGNUP_PHONE_ERROR_TYPE));



    const signUpResponse = await userService.createUser(
        email,
        password,
        name,
        phone
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function(req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function(req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function(req, res) {
    const { email, password } = req.body;

    // 빈 값 체크
    if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    if (password.length < 6 || password.length > 12) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    }
    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : name
 */
exports.patchUsers = async function(req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const name = req.body.name;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!name) return res.send(errResponse(baseResponse.USER_name_EMPTY));

        const editUserInfo = await userService.editUser(userId, name)
        return res.send(editUserInfo);
    }
};

/**
 * API No.
 * API Name : 네이버 로그인 API
 * [GET] /app/login/naver
 */
exports.naverLogin = async function(req, res) {
    const token = req.body.accessToken;
    const header = "Bearer " + token; //Bearer 다음에 공백 추가
    const api_url = "https://openapi.naver.com/v1/nid/me";
    const options = {
        url: api_url,
        headers: { Authorization: header },
    };
    request.get(options, async function(error, response, body) {
        if (!error && response.statusCode == 200) {
            const obj = JSON.parse(body);
            const email = obj.response.email;
            const phone = obj.response.mobile;
            const name = obj.response.name;

            if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
            if (!name) return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));

            const signUpResponse = await userService.createNaverUser(
                email,
                name,
                phone,
            );

            return res.send(signUpResponse);
        } else {
            if (response != null) {
                res.send(errResponse(baseResponse.NAVER_LOGIN_FAIL));
            }
        }
    });
};
/**
 * API No. 아이디,비밀번호 확인
 * [POST] /app/users/check
 */
exports.postUsersCheck = async function(req, res) {
    /**
     * Body: email, password, password_check
     */
    const { email, password, password_check } = req.body;

    // 빈 값 체크
    if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if (!password_check)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_CHECK_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    if (password.length < 6 || password.length > 12)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    if (password_check.length < 6 || password_check.length > 12)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    //비밀번호 일치 확인
    if (password !== password_check)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_NOT_MATCH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 이메일 중복 확인
    const emailRows = await userProvider.emailCheck(email);
    if (emailRows.length > 0)
        return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL));


    return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 자동로그인
 * [POST] /app/login/auto
 */
exports.autoLogin = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;

    const signInResponse = await userService.postAutoSignIn(userIdFromJWT);

    return res.send(signInResponse);
};



/**
 * API No. 마이페이지 조회
 * [GET] /app/users/:userId
 */
exports.getUser = async function(req, res) {
    const userId = req.params.userId;

    const token = req.headers["x-access-token"] || req.query.token;
    var userIdFromJWT;

    //토큰 받은 경우
    if (token) {
        jwt.verify(token, secret_config.jwtsecret, (err, verifiedToken) => {
            if (verifiedToken) {
                userIdFromJWT = verifiedToken.userId;
            }
        });
        if (!userIdFromJWT) {
            return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
        }
    }
    if (userIdFromJWT == userId) {
        const getUserResponse = await userProvider.retrieveUserInfo(userId);
        return res.send(response(baseResponse.SUCCESS, getUserResponse));
    } else {
        const getUserResponse = await userProvider.retrieveUserProfile(
            userId,
            userIdFromJWT
        );
        return res.send(response(baseResponse.SUCCESS, getUserResponse));
    }
};

/**
 * API No. 로그아웃
 * [PATCH] /app/logout
 */
exports.logout = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;

    const logoutResponse = await userService.patchJwtStatus(userIdFromJWT);

    return res.send(logoutResponse);
};


/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function(req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

/**
 * API No. 인증문자 전송
 * [POST] /app/users/sms-send
 */
exports.postPhoneCheck = async function(req, res) {
    const { userId, phone } = req.body;

    if (!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if (!phone) return res.send(response(baseResponse.USER_PHONE_EMPTY));

    //번호 정규표현식 체크
    var regPhone = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
    if (!regPhone.test(phone))
        return res.send(response(baseResponse.SIGNUP_PHONE_ERROR_TYPE));

    const number = Math.floor(Math.random() * (9999 - 1000)) + 1000;

    cache.del(phone);
    cache.put(phone, number);

    console.log(cache.get(phone));

    const space = " "; // one space
    const newLine = "\n"; // new line
    const method = "POST"; // method
    const serviceId = "ncp:sms:kr:273278440543:findit";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;
    const url2 = `/sms/v2/services/${serviceId}/messages`;
    const timestamp = Date.now().toString();
    let message = [];
    let hmac = crypto.createHmac("sha256", secret_config.SENSAPI_serviceSecret);

    message.push(method);
    message.push(space);
    message.push(url2);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(secret_config.SENSAPI_AccessKeyId);
    const signature = hmac.update(message.join("")).digest("base64");

    try {
        request({
            method: method,
            json: true,
            uri: url,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-ncp-iam-access-key": secret_config.SENSAPI_AccessKeyId,
                "x-ncp-apigw-timestamp": timestamp,
                "x-ncp-apigw-signature-v2": signature.toString(),
            },
            body: {
                type: "SMS",
                contentType: "COMM",
                countryCode: "82",
                from: secret_config.SENSAPI_phone,
                content: `핀딧 인증코드는 [${number}] 입니다.`,
                messages: [{
                    to: `${phone}`,
                }, ],
            },
        }, function(err, res, html) {
            if (err) console.log(err);
            else {
                resultCode = 200;
                console.log(html);
            }
        });
        return res.send(response(baseResponse.SUCCESS));
    } catch (err) {
        cache.del(phone);
        return res.send(response(baseResponse.SUCCESS));
    }
};

/** 인증문자 검증
 * [POST] /app/users/phone-check
 */
exports.phoneCheck = async function(req, res) {
    //const userIdResult = req.verifiedToken.userId;

    const { phone, verifyCode } = req.body;

    if (!phone) return res.send(response(baseResponse.USER_PHONE_EMPTY));
    if (!verifyCode)
        return res.send(response(baseResponse.PHONE_VEFIRY_CODE_EMPTY));
    if (verifyCode >= 10000)
        return res.send(response(baseResponse.PHONE_VEFIRY_CODE_LENGTH));

    //번호 정규표현식 체크
    var regPhone = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
    if (!regPhone.test(phone))
        return res.send(response(baseResponse.SIGNUP_PHONE_ERROR_TYPE));

    const CacheData = cache.get(phone);

    if (!CacheData) {
        return res.send(response(baseResponse.SMS_NOT_MATCH));
    }

    if (CacheData != verifyCode) {
        return res.send(response(baseResponse.SMS_NOT_MATCH));
    }

    return res.send(response(baseResponse.SUCCESS));
};

/**
 * API No. 회원탈퇴 API
 * [PATCH] /app/users/:userId/status
 */
exports.patchUserStatus = async function(req, res) {
    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;

    if (!userId || !userIdFromJWT)
        return res.send(response(baseResponse.USER_USERID_EMPTY));
    if (userId != userIdFromJWT)
        return res.send(response(baseResponse.USER_ID_NOT_MATCH));

    const updateUserStatusResponse = await userService.updateUserStatus(userId);
    return res.send(updateUserStatusResponse);
};
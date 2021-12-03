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
const { emit } = require("nodemon");


/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /api/test
 */
exports.getTest = async function(req, res) {

    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No.1 핸드폰번호 확인 API
 * [POST] /api/users/phone
 */
exports.postPhoneCheck = async function(req, res) {
    const { phone } = req.body;

    if (!phone) return res.send(response(baseResponse.USER_PHONE_EMPTY));

    const retrieveUser = await userProvider.accountCheck(phone);
    if (retrieveUser.length < 1) return res.send(response(baseResponse.SUCCESS));

    if (retrieveUser[0].status == 'ACTIVATED') {
        // 전화번호 중복 확인
        const phoneNumberRows = await userProvider.phoneNumberCheck(phone);
        if (phoneNumberRows.length > 0) {
            return res.send(response(baseResponse.SIGNUP_REDUNDANT_PHONENUMBER));
        }
    }

    return res.send(response(baseResponse.SUCCESS));
}

/**
 * API No.2 인증문자 전송
 * [POST] /api/users/sms-send
 */
exports.postSmsCheck = async function(req, res) {
    const { phone } = req.body;


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
    const serviceId = "ncp:sms:kr:273278444646:pindergarten";
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
                content: `[핀더가든] 인증코드는 [${number}] 입니다.`,
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

/** 
 * API No.3 인증문자 확인
 * [POST] /api/users/sms-verify
 */
exports.smsCheck = async function(req, res) {
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
 * API No.4 닉네임 중복 확인 API
 * [POST] /api/users/nickname
 */
exports.postNickname = async function(req, res) {
    const { nickname } = req.body;

    if (!nickname) return res.send(response(baseResponse.USER_NICKNAME_EMPTY));

    // 닉네임 중복 확인
    const nickNameRows = await userProvider.nickNameCheck(nickname);

    if (nickNameRows.length > 0) {
        return res.send(response(baseResponse.SIGNUP_REDUNDANT_NICKNAME));
    }

    return res.send(baseResponse.SUCCESS);
}

/**
 * API No.5 유저 생성 (회원가입) API
 * [POST] /api/users
 */
exports.postUsers = async function(req, res) {

    /**
     * Body: nickname, password, password_check, phone
     */
    const {
        nickname,
        password,
        password_check,
        phone,
    } = req.body;

    // 빈 값 체크
    if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if (!password_check)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_CHECK_EMPTY));
    if (!nickname) return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
    if (!phone) return res.send(response(baseResponse.SIGNUP_PHONE_EMPTY));

    // 길이 체크
    if (password.length < 8 || password.length > 16)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    if (password_check.length < 8 || password_check.length > 16)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    if (nickname.length < 2)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));
    if (phone.length < 10)
        return res.send(response(baseResponse.SIGNUP_PHONE_ERROR_TYPE))


    //비밀번호 일치 확인
    if (password !== password_check)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_NOT_MATCH));

    // 닉네임 형식 확인
    var checkEnglish = nickname.search(/[a-z]/gi);

    if (checkEnglish < 0)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_ERROR_TYPE));

    //번호 정규표현식 체크
    var regPhone = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
    if (!regPhone.test(phone))
        return res.send(response(baseResponse.SIGNUP_PHONE_ERROR_TYPE));


    const signUpResponse = await userService.createUser(
        nickname,
        password,
        phone
    );

    return res.send(signUpResponse);
};


/**
 * API No.6 유저 로그인
 * [POST] /api/users/sign-in
 */
exports.signIn = async function(req, res) {
    const { phone, password } = req.body;

    // 빈 값 체크
    if (!phone) return res.send(response(baseResponse.SIGNUP_PHONE_EMPTY));
    if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    // 길이 체크
    if (phone.length < 10)
        return res.send(response(baseResponse.SIGNUP_PHONE_LENGTH));
    if (password.length < 8 || password.length > 16) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    }

    //번호 정규표현식 체크
    var regPhone = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
    if (!regPhone.test(phone))
        return res.send(response(baseResponse.SIGNUP_PHONE_ERROR_TYPE));

    const signInResponse = await userService.postSignIn(phone, password);

    return res.send(signInResponse);

}

/**
 * API No.7 비밀번호 재설정
 * [POST] /api/users/find-pw
 */
exports.findPassword = async function(req, res) {
    const { phone, password, password_check } = req.body;

    // 빈 값 체크

    if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if (!password_check)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_CHECK_EMPTY));

    // 길이 체크
    if (password.length < 8 || password.length > 16)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    if (password_check.length < 8 || password_check.length > 16)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    //비밀번호 일치 확인
    if (password !== password_check)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_NOT_MATCH));

    const findPasswordResponse = await userService.updatePassword(
        phone, password
    );

    return res.send(findPasswordResponse);
}

/**
 * API No. 사용자 프로필 조회
 * [GET] /api/users/:userId
 */
exports.getUserInfo = async function(req, res) {
    const userId = req.params.userId;

    if (!userId)
        return res.response(baseResponse.USER_ID_NOT_EXIST)

    const getUserInfoResponse = await userProvider.retrieveUser(userId);

    return res.send(getUserInfoResponse);
}

/**
 * API No. 내 프로필 수정
 * [GET] /api/users/:userId
 */
exports.updateUserInfo = async function(req, res) {
    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;


    if (!userIdFromJWT)
        return res.response(baseResponse.USER_ID_NOT_EXIST)


    if (req.file !== undefined)
        var profile_image = req.file.location;
    else
        var profile_image = 'https://pindergarten.s3.ap-northeast-2.amazonaws.com/no_profile.png';

    // 프로필 수정 
    const postPetResponse = await userService.updateUserInfo(userIdFromJWT, profile_image);

    return res.send(postPetResponse);
}

/**
 * API No. 사용자 게시글 조회
 * [GET] /api/users/:userId/post
 */
exports.getUserPost = async function(req, res) {
    const userId = req.params.userId
    const getUserPostResponse = await userProvider.retrieveUserPost(userId);
    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "posts": getUserPostResponse
    });
}

/**
 * API No. 마이페이지
 * [GET] /api/users/post
 */
exports.getUserPage = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const getUserInfoResponse = await userProvider.retrieveUser(userIdFromJWT);
    const getUserPostResponse = await userProvider.retrieveUserPost(userIdFromJWT);
    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "user": getUserInfoResponse,
        "posts": getUserPostResponse
    });
}


/**
 * API No. 로그아웃
 * [PATCH] /api/users/sign-out
 */
exports.signOut = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;

    const logoutResponse = await userService.patchJwtStatus(userIdFromJWT);

    return res.send(logoutResponse);
};

/**
 * API No. 회원탈퇴 API
 * [PATCH] /app/users/:userId/status
 */
exports.patchUserStatus = async function(req, res) {
    const userId = req.params.userId;
    const userIdFromJWT = req.verifiedToken.userId;

    if (!userId || !userIdFromJWT)
        return res.send(response(baseResponse.USER_ID_NOT_EXIST));
    if (userId != userIdFromJWT)
        return res.send(response(baseResponse.USER_ID_NOT_MATCH));

    const updateUserStatusResponse = await userService.updateUserStatus(userId);
    return res.send(updateUserStatusResponse);
};

/** JWT 토큰 검증 API
 * [GET] /api/users/auto-login
 */
exports.check = async function(req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
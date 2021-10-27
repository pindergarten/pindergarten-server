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
 * [GET] /api/test
 */
exports.getTest = async function(req, res) {

    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No.1 인증문자 전송
 * [POST] /api/users/sms-send
 */
exports.postPhoneCheck = async function(req, res) {
    const { phone } = req.body;

    if (!phone) return res.send(response(baseResponse.USER_PHONE_EMPTY));

    // 전화번호 중복 확인
    const phoneNumberRows = await userProvider.phoneNumberCheck(phone);
    if (phoneNumberRows.length > 0) {
        return res.send(response(baseResponse.SIGNUP_REDUNDANT_PHONENUMBER));
    }

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
 * API No.2 인증문자 확인
 * [POST] /api/users/sms-verify
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
 * API No. 3
 * API Name : 유저 생성 (회원가입) API
 * [POST] /api/users
 */
exports.postUsers = async function(req, res) {

    /**
     * Body: nickname, password,password_check, phone
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

    // 닉네임 중복 확인
    const nickNameRows = await userProvider.nickNameCheck(nickname);
    if (nickNameRows.length > 0) {
        return res.send(response(baseResponse.SIGNUP_REDUNDANT_NICKNAME));
    }
    // 전화번호 중복 확인
    const phoneNumberRows = await userProvider.phoneNumberCheck(phone);
    if (phoneNumberRows.length > 0) {
        return res.send(response(baseResponse.SIGNUP_REDUNDANT_PHONENUMBER));
    }

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




/** JWT 토큰 검증 API
 * [GET] /api/auto-login
 */
exports.check = async function(req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
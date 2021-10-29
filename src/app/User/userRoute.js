module.exports = function(app) {
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/api/test', user.getTest)

    // 1.인증문자 전송
    app.post("/api/users/sms-send", user.postPhoneCheck);

    // 2.인증문자 확인
    app.post("/api/users/sms-verify", user.phoneCheck);

    // 3.닉네임 중복 확인 API
    app.post('/api/users', user.postUsers);

    // 4.유저 생성(회원가입) API
    app.post('/api/users', user.postUsers);

    // 5.로그인 하기 API(JWT 생성)
    app.post('/api/users/sign-in', user.signIn);

    // 6.비밀번호 찾기 API
    app.post('/api/users/find-pw', user.findPassword);

    // JWT 검증 API
    app.get('/api/auto-login', jwtMiddleware, user.check);

};
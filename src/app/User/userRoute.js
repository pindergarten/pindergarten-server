module.exports = function(app) {
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/api/test', user.getTest)

    // 1.인증문자 전송
    app.post("/api/users/sms-send", user.postPhoneCheck);

    // 2.인증문자 확인
    app.post("/api/users/sms-verify", user.phoneCheck);

    // 3.유저 생성(회원가입) API
    app.post('/api/users', user.postUsers);

    // JWT 검증 API
    app.get('/api/auto-login', jwtMiddleware, user.check);

};
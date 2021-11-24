module.exports = function(app) {
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/api/test', user.getTest)

    // 1.핸드폰 번호(ID) 체크 API
    app.post('/api/users/phone', user.postPhoneCheck);

    // 2.인증문자 전송
    app.post("/api/users/sms-send", user.postSmsCheck);

    // 3.인증문자 확인
    app.post("/api/users/sms-verify", user.smsCheck);

    // 4.닉네임 중복 확인 API
    app.post('/api/users/nickname', user.postNickname);

    // 5.유저 생성(회원가입) API
    app.post('/api/users', user.postUsers);

    // 6.로그인 하기 API(JWT 생성)
    app.post('/api/users/sign-in', user.signIn);

    // 7.비밀번호 찾기 API
    app.post('/api/users/find-pw', user.findPassword);

    // // 내 게시글(마이페이지) 조회 API
    // app.get("/api/users/:userId", jwtMiddleware, user.getPindergartenById);

    // // 로그아웃
    // app.get("/api/users/sign-out", jwtMiddleware, user.postPindergartenLike);

    // 회원탈퇴 API
    app.patch("/api/users/:userId/status", jwtMiddleware, user.patchUserStatus);

    // JWT 검증 API
    app.get('/api/auto-login', jwtMiddleware, user.check);

};
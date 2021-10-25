module.exports = function(app) {
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/api/test', user.getTest)

    // 1.유저 생성(회원가입) API
    app.post('/api/users', user.postUsers);

    // 2.유저 조회 API(+검색)
    app.get('/api/users', user.getUsers);

    // 3.특정 유저 조회 API
    app.get('/api/users/:userId', user.getUserById);

    // 4.로그인 하기 API(JWT 생성)
    app.post('/api/login', user.login);

    // 5.회원가입 - 이메일, 비밀번호 확인
    app.post("/api/users/check", user.postUsersCheck);

    // 6.인증문자 전송
    app.post("/api/users/sms-send", user.postPhoneCheck);

    // 7.휴대폰인증
    app.post("/api/users/sms-verify", user.phoneCheck);

    // ---마이페이지---

    // 8.로그아웃
    app.patch("/api/logout", jwtMiddleware, user.logout);

    // 9.사용자 프로필(마이페이지 조회) 조회
    app.get("/api/users/:userId", user.getUser);

    // 10.회원 정보 수정 API(JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/api/users/:userId', jwtMiddleware, user.patchUsers)

    // 11.회원탈퇴 API
    app.patch("/api/users/:userId/status", jwtMiddleware, user.patchUserStatus);

    // JWT 검증 API
    app.get('/api/auto-login', jwtMiddleware, user.check);

};
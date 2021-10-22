module.exports = function(app) {
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 테스트 API
    app.get('/app/test', user.getTest)

    // 유저 생성(회원가입) API
    app.post('/app/users', user.postUsers);

    // 유저 조회 API(+검색)
    app.get('/app/users', user.getUsers);

    // 특정 유저 조회 API
    app.get('/app/users/:userId', user.getUserById);

    // 로그인 하기 API(JWT 생성)
    app.post('/app/login', user.login);

    //회원가입 - 이메일, 비밀번호 확인
    app.post("/app/users/check", user.postUsersCheck);

    //네이버 로그인
    app.post("/app/login/naver", user.naverLogin);

    // 자동로그인
    app.post("app/login/auto", jwtMiddleware, user.autoLogin)

    //로그아웃
    app.patch("/app/logout", jwtMiddleware, user.logout);

    //사용자 프로필(마이페이지 조회) 조회
    app.get("/app/users/:userId", user.getUser);

    //회원 정보 수정 API(JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

    //인증문자 전송
    app.post("/app/users/sms-send", user.postPhoneCheck);
    //휴대폰인증
    app.post("/app/users/sms-verify", user.phoneCheck);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch("/app/users/:userId", jwtMiddleware, user.patchUsers);


    // 회원탈퇴 API
    app.patch("/app/users/:userId/status", jwtMiddleware, user.patchUserStatus);

    // JWT 검증 API
    app.get('/app/auto-login', jwtMiddleware, user.check);

};
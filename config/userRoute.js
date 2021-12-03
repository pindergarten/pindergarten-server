module.exports = function(app) {
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const multer = require('../../../config/multer');

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

    // 자동로그인 
    app.get('/api/users/auto-signin', jwtMiddleware, user.check);

    // 7.비밀번호 찾기 API
    app.post('/api/users/find-pw', user.findPassword);

    // 내 게시글(마이페이지) 조회 API
    app.get("/api/users/post", jwtMiddleware, user.getUserPost);

    // 프로필 조회 API
    app.get("/api/users/:userId", user.getUserInfo);

    // 내 프로필 수정 API
    app.post("/api/users/:userId", jwtMiddleware, multer.upload_profile.single('profile_image'), user.updateUserInfo);

    // 로그아웃
    app.patch("/api/users/sign-out", jwtMiddleware, user.signOut);

    // 회원탈퇴 API
    app.patch("/api/users/:userId/status", jwtMiddleware, user.patchUserStatus);

};
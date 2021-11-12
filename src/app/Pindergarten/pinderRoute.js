module.exports = function(app) {
    const pinder = require('./pinderController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 전체 유치원 조회 API
    app.get("/api/pindergartens", jwtMiddleware, pinder.getPindergartens);

    // // 유치원 검색 API
    // app.get("/api/pindergartens/search", jwtMiddleware, pinder.getSearchPindergartens);

    // // 유치원 정보 상세 조회 API
    // app.get("/api/pindergartens/:pindergartenId", jwtMiddleware, pinder.getPindergartenById);

    // // 유치원 좋아요 등록/해제 API
    // app.post("/api/pindergartens/:pindergartenId/like", jwtMiddleware, pinder.likePindergartens);

    // // 좋아요한 유치원 조회 API
    // app.get("/api/pindergartens/like", jwtMiddleware, pinder.getLikedPindergartens);

    // 네이버 블로그 유치원 검색
    app.post('api/pindergartens/blog', pinder.getBlogReview);

}
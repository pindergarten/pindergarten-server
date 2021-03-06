module.exports = function(app) {
    const pinder = require('./pinderController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 전체 유치원 조회 API
    app.get("/api/pindergartens", jwtMiddleware, pinder.getPindergartens);

    // 마커 기준 10개 유치원 조회 API
    app.get("/api/near/pindergartens", jwtMiddleware, pinder.getNearPindergartens);

    // 유치원 검색 API
    app.get("/api/serch/pindergartens", jwtMiddleware, pinder.searchPindergarten);

    // 유치원 정보 상세 조회 API
    app.get("/api/pindergartens/:pindergartenId", jwtMiddleware, pinder.getPindergartenById);

    // 유치원 좋아요 등록/해제 API
    app.post("/api/pindergartens/:pindergartenId/like", jwtMiddleware, pinder.postPindergartenLike);

    // 좋아요한 유치원 조회 API
    app.get("/api/like/pindergartens", jwtMiddleware, pinder.getLikedPindergartens);

    // 네이버 블로그 유치원 검색
    app.get("/api/pindergartens/:pindergartenId/review", pinder.getBlogReview);
}
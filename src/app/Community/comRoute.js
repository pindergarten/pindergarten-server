module.exports = function(app) {
    const com = require('./comController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 8. 전체 게시글 조회 API
    app.get("/api/posts", com.getPosts);

    // 9. 게시글 상세 조회 API
    app.get("/api/posts/:postId", com.getPostById);

    // // 10. 게시글 작성 API
    // app.post("/api/posts", jwtMiddleware, com.writePost);

    // // 11. 게시글 수정 API
    // app.patch("/api/posts", jwtMiddleware, com.patchPost);

    // // 12. 게시글 삭제 API
    // app.patch("/api/posts", jwtMiddleware, com.patchPostStatus);

    // 13. 게시글 좋아요 API
    app.post("/api/posts/:postId/like", jwtMiddleware, com.postLike);

    // 14. 댓글 조회 API 
    app.get("/api/posts/:postId/comments", com.getPostComments);

    // 15. 댓글 작성 API 
    app.post("/api/posts/:postId/comments", jwtMiddleware, com.postComments);

    // // 16. 댓글 수정 API 
    // app.patch("/api/posts/:postId/comments", jwtMiddleware, com.patchPostComment);

    // // 17. 댓글 삭제 API 
    // app.patch("/api/posts/:postId/comments", jwtMiddleware, com.patchPostCommentStatus);

    // 18. 신고하기 API
    //app.post("/api/posts/:postId/declaration", jwtMiddleware, com.postDeclaration);
}
module.exports = function(app) {
    const com = require('./comController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');


    // 8. 전체 게시글 조회 API
    app.get("/api/posts", jwtMiddleware, com.getPosts);

    // 9. 게시글 상세 조회 API
    app.get("/api/posts/:postId", jwtMiddleware, com.getPostById);

    // // 10. 게시글 작성 API
    // app.post("/api/posts", jwtMiddleware, com.writePost);

    // // 11. 게시글 수정 API
    // app.patch("/api/posts", jwtMiddleware, com.patchPost);

    // 12. 게시글 삭제 API
    app.delete("/api/posts/:postId", jwtMiddleware, com.deletePost);

    // 13. 게시글 좋아요 API
    app.post("/api/posts/:postId/like", jwtMiddleware, com.postLike);

    // 14. 댓글 조회 API 
    app.get("/api/posts/:postId/comments", jwtMiddleware, com.getPostComments);

    // 15. 댓글 작성 API 
    app.post("/api/posts/:postId/comments", jwtMiddleware, com.postComment);

    // // 16. 댓글 수정 API 
    // app.patch("/api/posts/:postId/comments", jwtMiddleware, com.patchComment);

    // 17. 댓글 삭제 API 
    //app.delete("/api/posts/:postId/comments/", jwtMiddleware, com.deleteComment);

    // 18. 신고하기 API
    //app.post("/api/posts/:postId/declaration", jwtMiddleware, com.postDeclaration);
}
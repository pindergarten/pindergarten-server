module.exports = function(app) {
    const event = require('./eventController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 이벤트 조회 API
    app.get("/api/events", event.getEvents);

    // 이벤트 상세 조회 API
    app.get("/api/events/:eventId", jwtMiddleware, event.getEventById);

    // 이벤트 좋아요 API
    app.post("/api/events/:eventId/like", jwtMiddleware, event.postEventLike);

    // 이벤트 댓글 조회 API
    app.get("/api/events/:eventId/comments", jwtMiddleware, event.getEventComments);

    // 이벤트 댓글 작성 API
    app.post("/api/events/:eventId/comments", jwtMiddleware, event.postEventComment);

    // 이벤트 댓글 삭제 API
    app.delete("/api/events/:eventId/comments/:commentId", jwtMiddleware, event.deleteEventComment);


}
const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../User/userProvider");
const eventProvider = require("./eventProvider");
const eventService = require("./eventService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const request = require("request");
const jwt = require("jsonwebtoken");

const { emit } = require("nodemon");

/**
 * API No. 이벤트 전체 조회 
 *[GET] /api/events
 */
exports.getEvents = async function(req, res) {

    const eventResult = await eventProvider.retrieveEvents();

    return res.send(response(baseResponse.SUCCESS, eventResult));
};

/**
 * API No. 이벤트 상세 조회
 * [GET] /api/events/:eventId
 */
exports.getEventById = async function(req, res) {

    /**
     * path variable : eventId
     */

    const eventId = req.params.eventId;

    if (!eventId) return res.send(response(baseResponse.EVENT_NOT_EXIST));

    const eventResult = await eventProvider.retrieveEventById(eventId);

    return res.send(eventResult);
};

/**
 * API No.13
 * API Name : 게시글 좋아요 설정/해제
 * [POST] /api/events/:eventId/like
 */
exports.postEventLike = async function(req, res) {
    /**
     * path variable : eventId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const eventId = req.params.eventId;

    if (!eventId)
        return res.send(response(baseResponse.EVENT_NOT_EXIST));

    //등록/해제
    const postLikeResponse = await eventService.updateLike(
        userIdFromJWT,
        eventId
    );

    return res.send(postLikeResponse);
};

/**
 * API No. 14
 * API Name : 게시글 댓글 조회
 * [GET] /api/events/:eventId/comments
 */
exports.getEventComments = async function(req, res) {

    /**
     * path variable : eventId
     */

    const eventId = req.params.eventId;

    if (!eventId) return res.send(response(baseResponse.EVENT_NOT_EXIST));

    const commentResult = await eventProvider.retrieveComment(eventId);
    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "comments": commentResult
    });
};

/*
    API No. 15
    API Name : 댓글 등록 API
    [POST] /api/events/:eventId/comments
*/
exports.postEventComment = async function(req, res) {
    /*
        Body : content
    */
    var { content } = req.body;
    const eventId = req.params.eventId;
    const userIdFromJWT = req.verifiedToken.userId;


    const commentResponse = await eventService.createComment(eventId, userIdFromJWT, content);

    return res.send(commentResponse);
};

/*
    API No. 17
    API Name : 댓글 삭제 API
    [POST] /api/events/:eventId/comments/:commentId
*/
exports.deleteEventComment = async function(req, res) {
    /**
     * path variable : eventId, commentId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const eventId = req.params.eventId;
    const commentId = req.params.commentId;

    if (!eventId)
        return res.send(response(baseResponse.EVENT_NOT_EXIST));
    if (!commentId)
        return res.send(response(baseResponse.COMMENT_NOT_EXIST));

    //등록/해제
    const deleteCommentResponse = await eventService.deleteComment(
        userIdFromJWT,
        eventId,
        commentId
    );

    return res.send(deleteCommentResponse);

}
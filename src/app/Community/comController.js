const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../User/userProvider");
const comProvider = require("./comProvider");
const comService = require("./comService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const request = require("request");
const jwt = require("jsonwebtoken");

const { emit } = require("nodemon");



/**
 * API No.
 * API Name : 게시글 전체 조회
 * [GET] /api/posts
 */
exports.getPosts = async function(req, res) {

    const postResult = await comProvider.retrievePosts();

    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "allposts": postResult
    });
};

/**
 * API No.
 * API Name : 게시글 상세 조회
 * [GET] /api/posts/:postId
 */
exports.getPostById = async function(req, res) {
    /**
     * path variable : postId
     */

    const postId = req.params.postId;

    if (!postId) return res.send(response(baseResponse.POST_ID_EMPTY));

    const postResult = await comProvider.retrievePostById(
        postId
    );

    return res.send(postResult);
};

/**
 * API No. 13
 * API Name : 게시글 등록 API
 * [POST] /api/posts
 * body : accessToken
 */

exports.writePost = async function(req, res) {
    const userId = req.verifiedToken.userIdx; // 내 아이디
    var {
        image,
        content,
        tag
    } = req.body;

    // 빈 값 체크
    if (!image)
        return res.send(response(baseResponse.POST_IMAGE_EMPTY));
    if (image.length > 12)
        return res.send(response(baseResponse.POST_IMAGE_LENGTH));


    if (tag) {
        if (tag.length > 5)
            return res.send(response(baseResponse.POST_TAG_LENGTH));
    }
    if (content) {
        if (content.length > 2000)
            return res.send(response(baseResponse.POST_CONTENT_LENGTH));
    }

    const postParams = [userId, image, content];

    // 게시글 등록 
    const writeResponse = await comService.createPost(postParams, tag);
    return res.send(writeResponse);
};

/**
 * API No.
 * API Name : 게시글 좋아요 설정/해제
 * [POST] /api/posts/:postId/like
 */
exports.postLike = async function(req, res) {
    /**
     * path variable : postId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const postId = req.params.postId;

    if (!postId)
        return res.send(response(baseResponse.POST_ID_EMPTY));

    //등록/해제
    const postLikeResponse = await comService.updateLike(
        userIdFromJWT,
        postId
    );

    return res.send(postLikeResponse);
};

/**
 * API No.
 * API Name : 게시글 댓글 조회
 * [GET] /api/posts/:postId/comments
 */
exports.getPostComments = async function(req, res) {
    /**
     * path variable : postId
     */

    const postId = req.params.postId;

    if (!postId) return res.send(response(baseResponse.POST_ID_EMPTY));

    const postResult = await comProvider.retrieveComment(postId);
    return res.send(response(baseResponse.SUCCESS, postResult));
};

/*
    API No. 14
    API Name : 댓글 등록 API
    [POST] /api/post/:postId/comments
*/
exports.postComments = async function(req, res) {
    /*
        Body : content
    */
    var { content } = req.body;
    const postId = req.params.postId;
    const userIdFromJWT = req.verifiedToken.userId;


    const commentResponse = await comService.createComment(postId, userIdFromJWT, content);

    return res.send(response(baseResponse.SUCCESS, commentResponse));
};
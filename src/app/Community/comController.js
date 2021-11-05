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
 * API No.8
 * API Name : 게시글 전체 조회
 * [GET] /api/posts
 */
exports.getPosts = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const postResult = await comProvider.retrievePosts(userIdFromJWT);



    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "allposts": postResult

    });
};

/**
 * API No.9
 * API Name : 게시글 상세 조회
 * [GET] /api/posts/:postId
 */
exports.getPostById = async function(req, res) {
    /**
     * path variable : postId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const postId = req.params.postId;

    if (!postId) return res.send(response(baseResponse.POST_ID_EMPTY));

    const postResult = await comProvider.retrievePostById(
        userIdFromJWT,
        postId
    );

    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "post": postResult
    });
};

/**
 * API No. 10
 * API Name : 게시글 등록 API
 * [POST] /api/posts
 * body : accessToken
 */

exports.writePost = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId; // 내 아이디
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
 * API No.13
 * API Name : 게시글 삭제
 * [DELETE] /api/posts/:postId
 */
exports.deletePost = async function(req, res) {
    /**
     * path variable : postId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const postId = req.params.postId;

    if (!postId)
        return res.send(response(baseResponse.POST_NOT_EXIST));


    const deletePostResponse = await comService.deletePost(
        userIdFromJWT,
        postId
    );

    return res.send(deletePostResponse);
}

/**
 * API No.13
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
        return res.send(response(baseResponse.POST_NOT_EXIST));

    //등록/해제
    const postLikeResponse = await comService.updateLike(
        userIdFromJWT,
        postId
    );

    return res.send(postLikeResponse);
};

/**
 * API No. 14
 * API Name : 게시글 댓글 조회
 * [GET] /api/posts/:postId/comments
 */
exports.getPostComments = async function(req, res) {

    /**
     * path variable : postId
     */

    const postId = req.params.postId;

    if (!postId) return res.send(response(baseResponse.POST_NOT_EXIST));

    const commentResult = await comProvider.retrieveComment(postId);
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
    [POST] /api/post/:postId/comments
*/
exports.postComment = async function(req, res) {
    /*
        Body : content
    */
    var { content } = req.body;
    const postId = req.params.postId;
    const userIdFromJWT = req.verifiedToken.userId;


    const commentResponse = await comService.createComment(postId, userIdFromJWT, content);

    return res.send(commentResponse);
};

/*
    API No. 17
    API Name : 댓글 삭제 API
    [POST] /api/post/:postId/comments/:commentId
*/
exports.deleteComment = async function(req, res) {
    /**
     * path variable : postId, commentId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    if (!postId)
        return res.send(response(baseResponse.POST_NOT_EXIST));
    if (!commentId)
        return res.send(response(baseResponse.COMMENT_NOT_EXIST));

    //등록/해제
    const deleteCommentResponse = await comService.deleteComment(
        userIdFromJWT,
        postId,
        commentId
    );

    return res.send(deleteCommentResponse);

}


// /*
//     API No. 18
//     API Name : 게시글 신고하기 API
//     [POST] /api/post/:postId/declaration
// */
// exports.postDeclaration = async function(req, res) {
//     /*
//         path variable : postId
//     */

//     const postId = req.params.postId;
//     const userIdFromJWT = req.verifiedToken.userId;

//     const commentResponse = await comService.(postId, userIdFromJWT);

//     return res.send(commentResponse);
// };
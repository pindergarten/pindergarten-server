const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../User/userProvider");
const comProvider = require("./comProvider");
const comService = require("./comService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");
const request = require("request");
const jwt = require("jsonwebtoken");

const { emit } = require("nodemon");

const DEFAULT_START_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

/**
 * API No.8
 * API Name : 게시글 전체 조회
 * [GET] /api/posts
 */
exports.getPosts = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    var cursor = req.query.cursor;

    if (!cursor || cursor <= 0)
        cursor = 100000;
    const postResult = await comProvider.retrievePosts(userIdFromJWT, cursor);


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
    const images = req.files;
    const content = req.body.content;

    logger.info(images);

    if (images == undefined)
        return res.send(response(baseResponse.FILE_NOT_EXIST));
    if (content) {
        if (content.length > 2000)
            return res.send(response(baseResponse.POST_CONTENT_LENGTH));
    }

    const data = images.map(image => image.location);

    logger.info(data);

    if (data.length < 1)
        return res.send(response(baseResponse.FILE_NOT_EXIST));

    // 게시글 등록 
    const writeResponse = await comService.createPost(userIdFromJWT, data, content);

    return res.send(response(baseResponse.SUCCESS));

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

    if (postId == null)
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
    const userId = req.verifiedToken.userId;

    if (!postId) return res.send(response(baseResponse.POST_NOT_EXIST));

    const commentResult = await comProvider.retrieveComment(postId, userId);
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
    if (!postId) return res.send(response(baseResponse.POST_NOT_EXIST));

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


/**
 * API No. 18 
 * API Name : 신고 API - 해당 글 삭제 + 해당 유저 일주일 정지
 * [POST] /declaration/post/:postId
 * 
 */

exports.postDeclaration = async function(req, res) {
    const userId = req.verifiedToken.userId; // 내 아이디
    const postId = req.params.postId;
    const { type } = req.query;
    const { title, content } = req.body;

    // 유저 체크
    const statusCheck = await userProvider.checkJWT(userId);
    if (statusCheck.length < 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));

    // 공백 체크
    var re = /^ss*$/;

    if (!postId || re.test(postId))
        return res.send(errResponse(baseResponse.POST_NOT_EXIST));



    // 해당 post가 존재하는지
    // const existPost = await comProvider.existPostByPostId(postId);
    // if (existPost.length < 1)
    //     return res.send(errResponse(baseResponse.INVALID_POST));


    // type
    if (!type || re.test(type))
        return res.send(errResponse(baseResponse.TYPE_INPUT_NUMBER));


    var reason = "";
    if (type == 1) {
        reason = "광고성 글";

    } else if (type == 2) {
        reason = "스팸 컨텐츠";

    } else if (type == 3) {
        reason = "욕설/비방/혐오";

    } else if (type == 4) {
        reason = "노골적인 폭력 묘사";

    } else {
        return res.send(errResponse(baseResponse.INPUT_FILTER_WRONG));
    }

    // 신고 제목, 내용 체크 
    if (!content || re.test(content))
        return res.send(errResponse(baseResponse.INPUT_DECLARE_CONTENT));

    if (title.length > 40) {
        return res.send(errResponse(baseResponse.INPUT_FILTER_WRONG));
    }
    if (content.length > 500) {
        return res.send(errResponse(baseResponse.INPUT_FILTER_WRONG));
    }

    // 이미 내가 신고했는지
    const existDeclar = await comProvider.existDeclaration(userId, postId);
    if (existDeclar.exist == 1)
        return res.send(errResponse(baseResponse.ALREADY_DECLAR))

    // 신고안했으면 신고하고
    else {
        const declaration = await comService.insertDeclaration(userId, postId, reason, title, content);
        return res.send(declaration);
    }

};
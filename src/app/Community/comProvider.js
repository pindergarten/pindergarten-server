const baseResponse = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const { response, errResponse } = require("../../../config/response");

const comDao = require("./comDao");

// Provider: Read 비즈니스 로직 처리

exports.retrievePosts = async function(userId) {
    const connection = await pool.getConnection(async(conn) => conn);
    try {
        await connection.beginTransaction();

        const postListResult = await comDao.selectPosts(connection);

        for (post of postListResult) {
            const postLikeResult = await comDao.selectLike(connection, userId, post["id"]);
            if (postLikeResult[0][0] != null)
                post.isLiked = 1;
            else
                post.isLiked = 0;
        }

        await connection.commit();
        connection.release();


        if (postListResult == undefined || postListResult == null)
            return response(baseResponse.POST_NOT_EXIST);

        return postListResult;

    } catch (err) {
        logger.error(`App - retrievePost Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }

};


exports.retrievePostById = async function(userId, postId) {
    const connection = await pool.getConnection(async(conn) => conn);
    try {
        await connection.beginTransaction();

        const postResult = await comDao.selectPostById(connection, postId);
        const post = postResult[0];


        // 이미지 따로 추가
        const imgArray = [];
        const postImgResult = await comDao.selectPostImg(connection, postId);
        for (img of postImgResult) {
            imgArray.push(img);
        }
        post.imgUrls = imgArray;



        // 좋아요 개수 추가
        const likeResult = await comDao.selectLikeByPost(connection, postId);

        // 댓글 개수 추가
        const commentResult = await comDao.selectCommentByPost(connection, postId);

        post.likeCount = likeResult[0][0]['count'];
        post.commentCount = commentResult[0][0]['count'];

        // 유저가 게시글 좋아요했는지 체크 
        const postLikeResult = await comDao.selectLike(connection, userId, postId);
        if (postLikeResult[0][0] != null)
            post.isLiked = 1;
        else
            post.isLiked = 0;
        await connection.commit();

        connection.release();

        if (postResult == undefined || postResult == null)
            return response(baseResponse.POST_NOT_EXIST);


        return postResult[0];
    } catch (err) {
        logger.error(`App - retrievePostById Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }

}

exports.retrieveLike = async function(userId, postId) {
    const connection = await pool.getConnection(async(conn) => conn);
    const likeListResult = await comDao.selectLike(connection, userId, postId);
    connection.release();

    return likeListResult;

}

// 댓글 조회
exports.retrieveComment = async function(postId) {
    const connection = await pool.getConnection(async(conn) => conn);
    const cmtResult = await comDao.selectComment(connection, postId);
    connection.release();

    return cmtResult;
};
const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("../User/userProvider");
const comProvider = require("./comProvider");
const comDao = require("./comDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createPost = async function(userId, images, content) {
    try {

        const insertPostParams = [userId, images[0], content];
        const connection = await pool.getConnection(async(conn) => conn);
        const insertPostResult = await comDao.insertPost(connection, insertPostParams);

        const postId = insertPostResult.insertId;

        // 이미지 따로 추가
        for (img of images)
            var insertpostImageResult = await comDao.insertPostImage(connection, postId, img);

        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - insertPost Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }

}
exports.deletePost = async function(userId, postId) {
    const connection = await pool.getConnection(async(conn) => conn);
    try {

        await connection.beginTransaction() // 트랜잭션 적용 시작

        //userId 확인
        const userRows = await userProvider.retrieveUser(userId);
        if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);

        const deleteAllLike = await comDao.deletePostLike(connection, postId);
        const deleteAllComment = await comDao.deletePostComment(connection, postId);
        const deletePostContent = await comDao.deletePostContent(connection, postId);
        const deletePost = await comDao.deletePost(connection, postId);


        await connection.commit() //  트랜잭션 적용 끝 
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        const connection = await pool.getConnection(async(conn) => conn);
        await connection.rollback()
        connection.release();

        logger.error(`App - Delete Post Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
}

exports.updateLike = async function(userId, postId) {
    try {
        //userId 확인
        const userRows = await userProvider.retrieveUser(userId);
        if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);


        //like 테이블 확인
        const likeRows = await comProvider.retrieveLike(
            userId,
            postId
        );

        if (likeRows[0].length < 1) {
            //insert
            // 등록
            const connection = await pool.getConnection(async(conn) => conn);
            const likeResult = await comDao.insertLike(
                connection,
                userId,
                postId
            );
            connection.release();
            return response(baseResponse.SUCCESS, {
                isSet: 1,
            });
        } else {
            // update
            // var status = likeRows[0].status;
            // 해제
            const connection = await pool.getConnection(async(conn) => conn);
            const likeResult = await comDao.deleteLike(
                connection,
                userId,
                postId,
            );
            connection.release();
            return response(baseResponse.SUCCESS, {
                isSet: 0,
            });
        }
    } catch (err) {
        logger.error(`App - updateLikeStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.createComment = async function(postId, userId, content) {
    try {
        //userId 확인
        const userRows = await userProvider.retrieveUser(userId);
        if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);

        const insertCommentParams = [postId, userId, content];
        const connection = await pool.getConnection(async(conn) => conn);

        const commentResult = await comDao.insertComment(connection, insertCommentParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`APP - createComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteComment = async function(userId, postId, commentId) {
    try {
        //userId 확인
        const userRows = await userProvider.retrieveUser(userId);
        if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);

        const deleteCommentParams = [userId, postId, commentId];
        const connection = await pool.getConnection(async(conn) => conn);

        const deletePostResult = await comDao.deleteComment(connection, deleteCommentParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`APP - deletePost Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}

// 게시글 신고
exports.insertDeclaration = async function(userId, postId, reason, title, content) {
    try {
        const insertDeclarationParams = [userId, postId, reason, title, content];
        const connection = await pool.getConnection(async(conn) => conn);

        const declarationResult = await comDao.insertDeclaration(connection, insertDeclarationParams);
        console.log(`신고된 포스팅 : ${declarationResult.insertId}`);
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - Insert Declaration Service error\n: ${err.message}`);
        return baseResponse.DB_ERROR;
    }
};
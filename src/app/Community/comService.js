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

exports.createPost = async function(userId, postId) {

}

exports.updateLikeStatus = async function(userId, postId) {
    try {
        //userId 확인
        const userRows = await userProvider.retrieveUser(userId);
        if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);

        //postId확인
        const postRows = await comProvider.retrievePostById(
            postId
        );
        if (postRows.length < 1)
            return errResponse(baseResponse.POST_ID_NOT_EXIST);

        //like 테이블 확인
        const likeRows = await comProvider.retrieveLike(
            userId,
            postId
        );
        if (likeRows.length < 1) {
            //insert
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
            //update
            var status = likeRows[0].status;
            //등록/해제
            const connection = await pool.getConnection(async(conn) => conn);
            const starResult = await comDao.updatelikeStatus(
                connection,
                userId,
                postId, !status
            );
            connection.release();
            return response(baseResponse.SUCCESS, { isSet: status });
        }
    } catch (err) {
        logger.error(`App - createStar Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.createComment = async function(postId, userId, content) {
    try {
        const postCheck = await comProvider.postCheck(postId);
        if (postCheck.length < 1) {
            return errResponse(baseResponse.ARTICLE_ARTICLE_NOT_EXIST);
        }

        const insertCommentParams = [postId, userId, content];
        const connection = await pool.getConnection(async(conn) => conn);

        const commentResult = await comDao.insertComment(connection, insertCommentParams);
        connection.release();

        return response(baseResponse.SUCCESS, { "addedComment": commentResult[0].insertId });
    } catch (err) {
        logger.error(`APP - createComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("../User/userProvider");
const eventProvider = require("./eventProvider");
const eventDao = require("./eventDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.updateLike = async function(userId, eventId) {
    try {
        //userId 확인
        const userRows = await userProvider.retrieveUser(userId);
        if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);

        //eventId확인
        const eventRows = await eventProvider.retrieveEventById(eventId);

        if (!eventRows) return errResponse(baseResponse.EVENT_NOT_EXIST);

        //like 테이블 확인
        const likeRows = await eventProvider.retrieveLike(
            userId,
            eventId
        );

        if (likeRows[0].length < 1) {
            //insert
            // 등록
            const connection = await pool.getConnection(async(conn) => conn);
            const likeResult = await eventDao.insertLike(
                connection,
                userId,
                eventId
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
            const likeResult = await eventDao.deleteLike(
                connection,
                userId,
                eventId,
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

exports.createComment = async function(eventId, userId, content) {
    try {
        //userId 확인
        const userRows = await userProvider.retrieveUser(userId);
        if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);

        //eventId 확인
        const eventRows = await eventProvider.retrieveEventById(eventId);
        if (!eventRows) {
            return errResponse(baseResponse.EVENT_NOT_EXIST);
        }

        const insertCommentParams = [eventId, userId, content];
        const connection = await pool.getConnection(async(conn) => conn);

        const commentResult = await eventDao.insertComment(connection, insertCommentParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`APP - createComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteComment = async function(userId, eventId, commentId) {
    try {
        //userId 확인
        const userRows = await userProvider.retrieveUser(userId);
        if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);

        //eventId 확인
        const eventRows = await eventProvider.retrieveEventById(eventId);
        if (!eventRows) {
            return errResponse(baseResponse.EVENT_NOT_EXIST);
        }

        const deleteCommentParams = [userId, eventId, commentId];
        const connection = await pool.getConnection(async(conn) => conn);

        const deleteeventResult = await eventDao.deleteComment(connection, deleteCommentParams);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`APP - deleteComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}
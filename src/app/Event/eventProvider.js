const baseResponse = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const { response, errResponse } = require("../../../config/response");

const eventDao = require("./eventDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveEvents = async function() {
    const connection = await pool.getConnection(async(conn) => conn);
    const eventListResult = await eventDao.selectEvents(connection);
    connection.release();

    return eventListResult;
}

exports.retrieveEventById = async function(eventId) {

    const connection = await pool.getConnection(async(conn) => conn);
    try {
        await connection.beginTransaction();

        const eventResult = await eventDao.selectEventById(connection, eventId);
        const event = eventResult[0];

        // 좋아요 개수 추가
        const likeResult = await eventDao.selectLikeByPost(connection, eventId);

        // 댓글 개수 추가
        const commentResult = await eventDao.selectCommentByPost(connection, eventId);

        event.likeCount = likeResult[0][0]['count'];
        event.commentCount = commentResult[0][0]['count'];


        await connection.commit();

        connection.release();

        if (eventResult == undefined || eventResult == null)
            return response(baseResponse.EVENT_NOT_EXIST);


        return eventResult[0];
    } catch (err) {
        logger.error(`App - retrievePost Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }
}
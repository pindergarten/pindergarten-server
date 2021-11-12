const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("../User/userProvider");
const pinderProvider = require("./pinderProvider");
const pinderDao = require("./pinderDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.updateLike = async function(userId, pindergartenId) {
    try {
        //userId 확인
        const userRows = await userProvider.retrieveUser(userId);
        if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);

        //pindergartenId확인
        const pindergartenRows = await pinderProvider.retrievePindergartenById(pindergartenId);

        if (!pindergartenRows) return errResponse(baseResponse.PINDERGARTEN_NOT_EXIST);

        //like 테이블 확인
        const likeRows = await pinderProvider.retrieveLike(
            userId,
            pindergartenId
        );

        if (likeRows[0].length < 1) {
            //insert
            // 등록
            const connection = await pool.getConnection(async(conn) => conn);
            const likeResult = await pinderDao.insertLike(
                connection,
                userId,
                pindergartenId
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
            const likeResult = await pinderDao.deleteLike(
                connection,
                userId,
                pindergartenId,
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
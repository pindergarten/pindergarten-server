const baseResponse = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const { response, errResponse } = require("../../../config/response");

const pinderDao = require("./pinderDao");

// Provider: Read 비즈니스 로직 처리

exports.retrievePindergartens = async function(userId) {
    const connection = await pool.getConnection(async(conn) => conn);
    try {
        await connection.beginTransaction();

        const pindergartenListResult = await pinderDao.selectPindergartens(connection);

        for (pindergarten of pindergartenListResult) {
            const pindergartenLikeResult = await pinderDao.selectPindergartenLike(connection, userId, pindergarten["id"]);
            if (pindergartenLikeResult[0][0] != null)
                pindergarten.isLiked = 1;
            else
                pindergarten.isLiked = 0;
        }

        await connection.commit();
        connection.release();


        if (pindergartenListResult == undefined || pindergartenListResult == null)
            return response(baseResponse.PINDERGARTEN_NOT_EXIST);

        return pindergartenListResult;

    } catch (err) {
        logger.error(`App - retrievePindergarten Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }

}

exports.retrievePindergartenById = async function(userId, pindergartenId) {
    const connection = await pool.getConnection(async(conn) => conn);
    try {

        await connection.beginTransaction();

        const pindergartenResult = await pinderDao.selectPindergartenById(connection, pindergartenId);
        const pindergarten = pindergartenResult[0];

        if (pindergarten == undefined || pindergarten == null)
            return response(baseResponse.PINDERGARTEN_NOT_EXIST);

        // 이미지 따로 추가
        const imgArray = [];
        const pindergartenImgResult = await pinderDao.selectPindergartenImg(connection, pindergartenId);
        for (img of pindergartenImgResult) {
            imgArray.push(img);
        }
        pindergarten.imgUrls = imgArray;

        if (pindergarten.imgUrls == null)
            return response(baseResponse.PINDERGARTEN_IMAGES_NOT_EXIST);

        // 유저가 게시글 좋아요했는지 체크 
        const pindergartenLikeResult = await pinderDao.selectPindergartenLike(connection, userId, pindergartenId);
        if (pindergartenLikeResult[0][0] != null)
            pindergarten.isLiked = 1;
        else
            pindergarten.isLiked = 0;
        await connection.commit();

        connection.release();

        return pindergarten;

    } catch (err) {
        logger.error(`App - retrievePindergartenById Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }

}

exports.retrieveLike = async function(userId, pindergartenId) {
    const connection = await pool.getConnection(async(conn) => conn);
    const likeListResult = await pinderDao.selectPindergartenLike(connection, userId, pindergartenId);
    connection.release();

    return likeListResult;

}
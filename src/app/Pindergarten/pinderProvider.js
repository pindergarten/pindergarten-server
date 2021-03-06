const baseResponse = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const { response, errResponse } = require("../../../config/response");
const secret_config = require("../../../config//secret");
const pinderDao = require("./pinderDao");

// Provider: Read 비즈니스 로직 처리

exports.retrievePindergartens = async function(userId, latitude, longitude) {
    const connection = await pool.getConnection(async(conn) => conn);
    try {
        await connection.beginTransaction();

        const pindergartenListResult = await pinderDao.selectPindergartens(connection, latitude, longitude);

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
exports.retrieveNearPindergartens = async function(userId, latitude, longitude) {
    const connection = await pool.getConnection(async(conn) => conn);
    try {
        await connection.beginTransaction();

        const pindergartenListResult = await pinderDao.selectNearPindergartens(connection, latitude, longitude);

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
        logger.error(`App - retrieveNearPindergarten Error\n: ${err.message}`);
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
exports.retrieveLikedPindergartens = async function(latitude, longitude, userId) {
    try {
        const connection = await pool.getConnection(async(conn) => conn);
        const likeListResult = await pinderDao.selectLikedPindergarten(connection, userId, latitude, longitude);
        connection.release();

        return likeListResult[0];

    } catch (err) {
        logger.error(`App - retrievePindergarten Error\n: ${err.message}`);
        await connection.rollback();
        connection.release();
        return errResponse(baseResponse.DB_ERROR);
    }

}

exports.serchPindergarten = async function(latitude, longitude, query) {
    const connection = await pool.getConnection(async(conn) => conn);
    try {

        const pindergartenResult = await pinderDao.searchPindergartens(connection, latitude, longitude, query);

        connection.release();
        return pindergartenResult;
    } catch (err) {
        logger.error(`App - searchPindergarten error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
exports.retrieveBlogReviews = async function(pindergartenId) {
    const connection = await pool.getConnection(async(conn) => conn);
    try {

        const pindergartenResult = await pinderDao.selectReviews(connection, pindergartenId);

        connection.release();
        return pindergartenResult[0];
    } catch (err) {
        logger.error(`App - retrieveBlogReviews error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
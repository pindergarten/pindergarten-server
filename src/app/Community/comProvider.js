const baseResponseStatus = require("../../../config/baseResponseStatus");
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const comDao = require("./comDao");

// Provider: Read 비즈니스 로직 처리

exports.retrievePosts = async function() {
    const connection = await pool.getConnection(async(conn) => conn);
    const postListResult = await comDao.selectPosts(connection);
    connection.release();

    return postListResult;
};

exports.retrievePostById = async function(postId) {

    const connection = await pool.getConnection(async(conn) => conn);
    const postListResult = await comDao.selectPostById(connection, postId);
    connection.release();

    return postListResult;

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
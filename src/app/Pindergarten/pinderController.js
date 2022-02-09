const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../User/userProvider");
const pinderProvider = require("./pinderProvider");
const pinderService = require("./pinderService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const secret_config = require("../../../config//secret");
const request = require("request");
const jwt = require("jsonwebtoken");
const pinderDao = require("./pinderDao");
const { emit } = require("nodemon");

const DEFAULT_START_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
/**
 * API No. 유치원 전체 조회 
 *[GET] /api/events
 */
exports.getPindergartens = async function(req, res) {
    /**
     * Query String: lat,long 
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.send(response(baseResponse.GEO_NOT_EXIST));
    }

    const pindergartensResult = await pinderProvider.retrievePindergartens(userIdFromJWT, latitude, longitude);

    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "allpindergartens": pindergartensResult
    });
};

/**
 * API No. 
 * API Name : 마커 기준 가까운 유치원 10개 조회
 * [GET] /api/search/pindergartens
 */
exports.getNearPindergartens = async function(req, res) {
    /**
     * Query String: lat,long 
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const { latitude, longitude } = req.query;
    var pageSize = req.query.size;
    var curPage = req.query.page;

    if (!curPage || curPage <= 0)
        curPage = DEFAULT_START_PAGE
    if (!pageSize || pageSize <= 0)
        pageSize = DEFAULT_PAGE_SIZE

    let offset = (curPage - 1) * Number(pageSize);
    let limit = Number(pageSize);

    if (!latitude || !longitude) {
        return res.send(response(baseResponse.GEO_NOT_EXIST));
    }

    if (!latitude || !longitude) {
        return res.send(response(baseResponse.GEO_NOT_EXIST));
    }
    const pindergartensResult = await pinderProvider.retrieveNearPindergartens(userIdFromJWT, latitude, longitude, offset, limit);
    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "nearPindergartens": pindergartensResult
    })
}

/**
 * API No. 
 * API Name : 유치원 키워드 검색 API
 * [GET] /api/search/pindergartens
 */
exports.searchPindergarten = async function(req, res) {

    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const query = req.query.query;
    const userIdFromJWT = req.verifiedToken.userId;

    if (!latitude || !longitude) {
        return res.send(response(baseResponse.GEO_NOT_EXIST));
    }

    if (!query) {
        return res.send(response(baseResponse.SEARCH_KEYWORD_EMPTY));
    }

    const pindergartensResult = await pinderProvider.serchPindergarten(latitude, longitude, query);

    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "searchPindergartens": pindergartensResult
    });
}


/**
 * API No. 유치원 상세 조회
 * [GET] /api/pindergartens/:pindergartenId
 */
exports.getPindergartenById = async function(req, res) {

    /**
     * path variable : pindergartenId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const pindergartenId = req.params.pindergartenId;

    if (!pindergartenId) return res.send(response(baseResponse.PINDERGARTEN_NOT_EXIST));

    const pindergartenResult = await pinderProvider.retrievePindergartenById(userIdFromJWT, pindergartenId);



    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "pindergarten": pindergartenResult
    });
};

/**
 * API No.13
 * API Name : 게시글 좋아요 설정/해제
 * [POST] /api/pindergartens/:pindergartenId/like
 */
exports.postPindergartenLike = async function(req, res) {
    /**
     * path variable : pindergarten
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const pindergartenId = req.params.pindergartenId;

    if (!pindergartenId)
        return res.send(response(baseResponse.PINDERGARTEN_NOT_EXIST));

    //등록/해제
    const pindergartenLikeResponse = await pinderService.updateLike(
        userIdFromJWT,
        pindergartenId
    );

    return res.send(pindergartenLikeResponse);

};


/**
 * API No.
 * API Name : 좋아요한 유치원 조회 API
 * [POST] /api/pindergartens/like
 */
exports.getLikedPindergartens = async function(req, res) {
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const userIdFromJWT = req.verifiedToken.userId;


    if (!latitude || !longitude) {
        return res.send(response(baseResponse.GEO_NOT_EXIST));
    }

    const pindergartenResult = await pinderProvider.retrieveLikedPindergartens(latitude, longitude, userIdFromJWT);



    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "likedPindergartens": pindergartenResult
    });

}

/**
 * API No.
 * API Name : 유치원 블로그 리뷰 
 * [GET] /api/pindergartens/:pindergartenId/review
 */
exports.getBlogReview = async function(req, res) {

    const pindergartenId = req.params.pindergartenId;

    if (!pindergartenId)
        return res.send(response(baseResponse.PINDERGARTEN_NOT_EXIST));

    const pindergartenResult = await pinderProvider.retrieveBlogReviews(pindergartenId);

    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "blogReviews": pindergartenResult
    });

}
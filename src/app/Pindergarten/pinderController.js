const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../User/userProvider");
const pinderProvider = require("./pinderProvider");
const pinderService = require("./pinderService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const secret_config = require("../../../config//secret");
const request = require("request");
const jwt = require("jsonwebtoken");

const { emit } = require("nodemon");

/**
 * API No. 유치원 전체 조회 
 *[GET] /api/events
 */
exports.getPindergartens = async function(req, res) {
    /**
     * Query String: lat,long 
     */
    const userIdFromJWT = req.verifiedToken.userId;


    const pindergartensResult = await pinderProvider.retrievePindergartens(userIdFromJWT);

    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "allpindergartens": pindergartensResult
    });
};

/**
 * API No. 이벤트 상세 조회
 * [GET] /api/events/:eventId
 */
exports.getEventById = async function(req, res) {

    /**
     * path variable : eventId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const eventId = req.params.eventId;

    if (!eventId) return res.send(response(baseResponse.EVENT_NOT_EXIST));

    const eventResult = await eventProvider.retrieveEventById(userIdFromJWT, eventId);

    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "event": eventResult
    });
};

/**
 * API No.13
 * API Name : 게시글 좋아요 설정/해제
 * [POST] /api/events/:eventId/like
 */
exports.postEventLike = async function(req, res) {
    /**
     * path variable : eventId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const eventId = req.params.eventId;

    if (!eventId)
        return res.send(response(baseResponse.EVENT_NOT_EXIST));

    //등록/해제
    const postLikeResponse = await eventService.updateLike(
        userIdFromJWT,
        eventId
    );

    return res.send(postLikeResponse);

};

/**
 * API No.
 * API Name : 유치원 블로그 리뷰 
 * [POST] /api/pindergartens/blog?query=
 */
exports.getBlogReview = async function(req, res) {
    /**
     * Query String: query
     */
    const query = req.query.query;
    var api_url = `https://openapi.naver.com/v1/search/blog?query=${query}`; // json 결과

    var request = require('request');
    var options = {
        url: api_url,
        headers: { 'X-Naver-Client-Id': secret_config.NAVER_CLIENT_ID, 'X-Naver-Client-Secret': secret_config.NAVER_CLIENT_SECRET }
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body));
        } else {
            console.log("error = " + response.statusCode);
        }
    });
    return res.send(response(baseResponse.SUCCESS));


}
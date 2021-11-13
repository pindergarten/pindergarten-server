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
 * API No. 
 * API Name : 유치원 키워드 검색 API
 * [GET] /api/search/pindergartens
 */
exports.searchPindergarten = async function(req, res) {
    const query = req.query.query;
    const userIdFromJWT = req.verifiedToken.userId;

    if (!query) {
        return res.send(response(baseResponse.SEARCH_KEYWORD_EMPTY));
    }

    const pindergartensResult = await pinderProvider.serchPindergarten(query);

    return res.send(response(baseResponse.SUCCESS, pindergartensResult));
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
        "event": pindergartenResult
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
        return res.send(response(baseResponse.EVENT_NOT_EXIST));

    //등록/해제
    const pindergartenLikeResponse = await pinderService.updateLike(
        userIdFromJWT,
        pindergartenId
    );

    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "allpindergartens": pindergartenLikeResponse
    });

};


/**
 * API No.
 * API Name : 좋아요한 유치원 조회 API
 * [POST] /api/pindergartens/like
 */
exports.getLikedPindergartens = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const pindergartenResult = await pinderProvider.retrieveLikedPindergartens(userIdFromJWT);

    return res.send(response(baseResponse.SUCCESS, pindergartenResult));
}

/**
 * API No.
 * API Name : 유치원 블로그 리뷰 
 * [GET] /api/pindergartens/blog?query=
 */
exports.getBlogReview = async function(req, res) {
    /**
     * Query String: query
     */
    var api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI(req.query.query); // json 결과

    var request = require('request');
    var options = {
        url: api_url,
        headers: {
            'X-Naver-Client-Id': secret_config.NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': secret_config.NAVER_CLIENT_SECRET
        }
    };

    request.get(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.writeHead(200, { 'Content-Type': 'text/json;charset=utf-8' });
            res.end(body);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });

}
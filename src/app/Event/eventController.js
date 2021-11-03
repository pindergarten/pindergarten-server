const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../User/userProvider");
const eventProvider = require("./eventProvider");
const eventService = require("./eventService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const request = require("request");
const jwt = require("jsonwebtoken");

const { emit } = require("nodemon");

/**
 * API No. 이벤트 전체 조회 
 *[GET] /api/events
 */
exports.getEvents = async function(req, res) {

    const eventResult = await eventProvider.retrieveEvents();

    return res.send(response(baseResponse.SUCCESS, eventResult));
};

/**
 * API No. 이벤트 상세 조회
 * [GET] /api/events/:eventId
 */
exports.getEventById = async function(req, res) {

    /**
     * path variable : eventId
     */

    const eventId = req.params.eventId;

    if (!eventId) return res.send(response(baseResponse.EVENT_NOT_EXIST));

    const eventResult = await comProvider.retrieveEventById(eventId);

    return res.send(eventResult);
};
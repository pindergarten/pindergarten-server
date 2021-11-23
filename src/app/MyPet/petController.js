const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../User/userProvider");
const petProvider = require("./petProvider");
const petService = require("./petService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const request = require("request");
const jwt = require("jsonwebtoken");

const { emit } = require("nodemon");

/**
 * API No. 
 * API Name : 나의 펫 조회 API
 * [GET] /api/pets
 */
exports.getPets = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;

    if (!userIdFromJWT)
        return res.response(baseResponse.USER_ID_NOT_EXIST)

    // 펫 조회 
    const getPetsResponse = await petProvider.retrieveMyPets(userIdFromJWT);

    return res.send(getPetsResponse);
}


/**
 * API No. 
 * API Name : 펫 등록 API
 * [POST] /api/pets
 */
exports.postPet = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const {
        name,
        gender,
        breed,
        birth,
        vaccination,
        neutering
    } = req.body;

    if (!userIdFromJWT)
        return res.response(baseResponse.USER_ID_NOT_EXIST)

    if (req.file !== undefined)
        var profile_image = req.file.location;

    // 펫 등록 
    const postPetResponse = await petService.createPet(userIdFromJWT, name, profile_image, gender, breed, birth, vaccination, neutering);

    return res.send(postPetResponse);
}
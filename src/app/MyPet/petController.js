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

    return res.send({
        "isSuccess": true,
        "code": 1000,
        "message": "성공",
        "pets": getPetsResponse
    });
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
    else
        var profile_image = 'https://pindergarten.s3.ap-northeast-2.amazonaws.com/no_profile.png';

    // 펫 등록 
    const postPetResponse = await petService.createPet(userIdFromJWT, name, profile_image, gender, breed, birth, vaccination, neutering);

    return res.send(postPetResponse);
}

/**
 * API No. 
 * API Name : 펫 상세조회 API
 * [GET] /api/pets/:petId
 */

exports.getPet = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const petId = req.params.petId;

    if (!userIdFromJWT)
        return res.response(baseResponse.USER_ID_NOT_EXIST);
    if (!petId)
        return res.response(baseResponse.PET_ID_NOT_EXIST)

    // 펫 조회 
    const getPetResponse = await petProvider.retrievePetById(petId);
    if (getPetResponse.length < 1) return res.send(errResponse(baseResponse.PET_ID_NOT_EXIST));
    else {

        return res.send({
            "isSuccess": true,
            "code": 1000,
            "message": "성공",
            'pet': getPetResponse[0]
        });
    }



}

/**
 * API No. 
 * API Name : 펫 삭제 API
 * [DELETE] /api/pets/:petId
 */
exports.deletePet = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const petId = req.params.petId;

    if (!userIdFromJWT)
        return res.response(baseResponse.USER_ID_NOT_EXIST)

    if (!petId)
        return res.response(baseResponse.PET_ID_NOT_EXIST)

    // 펫 삭제
    const deletePetResponse = await petService.deletePet(userIdFromJWT, petId);

    return res.send(deletePetResponse);

}
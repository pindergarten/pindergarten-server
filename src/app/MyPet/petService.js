const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const petProvider = require("./petProvider");
const petDao = require("./petDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");
const s3 = require('../../../config/s3');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리
exports.createPet = async function(userId, name, profile_image, gender, breed, birth, vaccination, neutering) {
    try {
        // //userId 확인
        // const userRows = await userProvider.retrieveUser(userId);
        // if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);

        const insertPetParams = [userId, name, profile_image, gender, breed, birth, vaccination, neutering];
        const connection = await pool.getConnection(async(conn) => conn);

        const petResult = await petDao.insertPet(connection, insertPetParams);
        connection.release();

        return response(baseResponse.SUCCESS, { petId: petResult[0].insertId, });
    } catch (err) {
        logger.error(`APP - ceratePet Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
exports.deletePet = async function(userId, petId) {
    try {
        // //userId 확인
        // const userRows = await userProvider.retrieveUser(userId);
        // if (userRows.length < 1) return errResponse(baseResponse.USER_ID_NOT_EXIST);

        // 펫 DB에 있는지 조회 
        const petResult = await petProvider.retrievePetById(petId);
        if (petResult.length < 1) return errResponse(baseResponse.PET_ID_NOT_EXIST);
        else {
            const petImage = petResult[0].profile_image.split('/')[4];
            //console.log(petImage);
            const connection = await pool.getConnection(async(conn) => conn);

            const deletePet = await petDao.deletePet(connection, petId);

            s3.deleteObject({
                Bucket: 'pindergarten/pet', // 사용자 버킷 이름
                Key: petImage
            }, function(err, data) {
                if (err) {
                    console.log('aws s3 delete error')
                } else {
                    console.log('aws s3 delete success');
                }
            });
            connection.release();

            return response(baseResponse.SUCCESS);
        }

    } catch (err) {
        logger.error(`APP - deletePet Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
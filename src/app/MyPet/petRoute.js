module.exports = function(app) {
    const pet = require('./petController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const upload = require('../../../config/multer');

    // 나의 펫 조회 API
    app.get("/api/pets", jwtMiddleware, pet.getPets);

    // 펫 등록 API
    app.post("/api/pets", jwtMiddleware, upload.single('profile_image'), pet.postPet);

    // 펫 삭제 API
    app.delete("/api/pets/:petId", jwtMiddleware, pet.deletePet);

}
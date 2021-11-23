// 펫 등록
async function insertPet(connection, insertPetParams) {

    const insertPetQuery = `
    INSERT INTO Pet(userId, name, profile_image, gender, breed, birth, vaccination, neutering)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const PetRows = await connection.query(insertPetQuery, insertPetParams);

    return PetRows;

}

// 내 펫 조회
async function selectMyPets(connection, userId) {
    const selectMyPetsQuery = ` SELECT name, profile_image FROM Pet WHERE userId = ? `;
    const PetRows = await connection.query(selectMyPetsQuery, userId);

    return PetRows;
}

module.exports = {
    insertPet,
    selectMyPets
}
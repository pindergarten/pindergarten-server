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
    const selectMyPetsQuery = `SELECT id, name, profile_image FROM Pet WHERE userId = ?; `;
    const PetRows = await connection.query(selectMyPetsQuery, userId);

    return PetRows;
}

async function selectPetById(connection, petId) {
    const selectPetByIdQuery = `SELECT id, name, profile_image, gender, breed, birth, vaccination, neutering FROM Pet WHERE id = ?; `;
    const PetRows = await connection.query(selectPetByIdQuery, petId);

    return PetRows;
}

async function deletePet(connection, petId) {
    const deletePetQuery = `DELETE FROM Pet WHERE id = ?;`;
    const PetRows = await connection.query(deletePetQuery, petId);

    return PetRows;
}


module.exports = {
    insertPet,
    selectMyPets,
    selectPetById,
    deletePet
}
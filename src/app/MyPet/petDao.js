async function insertPet(connection, insertPetParams) {

    const insertPetQuery = `
    INSERT INTO Pet(userId, name, profile_image, gender, breed, birth, vaccination, neutering)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const PetRows = await connection.query(insertPetQuery, insertPetParams);

    return PetRows;

}

module.exports = {
    insertPet
}
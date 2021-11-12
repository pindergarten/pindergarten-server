// 전체 유치원 조회
async function selectPindergartens(connection) {
    const selectPindergartenQuery = `
    SELECT id, name, address,thumbnail, latitude, longitude, rating FROM Pindergarten;
    `;
    const [PindergartenRows] = await connection.query(selectPindergartenQuery);

    return PindergartenRows;
}
async function selectPindergartenById(connection, pindergartenId) {
    const selectPindergartenQuery = `
    SELECT *
    FROM Pindergarten
    WHERE id = ?;
    `;
    const [PindergartenRows] = await connection.query(selectPindergartenQuery, pindergartenId);

    return PindergartenRows;
}
async function selectPindergartenImg(connection, pindergartenId) {
    const selectPindergartenQuery = `
    SELECT image_url
    FROM Pindergarten_Image
    WHERE pindergartenId = ?;
    `;
    const [PindergartenRows] = await connection.query(selectPindergartenQuery, pindergartenId);

    return PindergartenRows;
}

// 좋아요 조회
async function selectPindergartenLike(connection, userId, pindergartenId) {
    const selectPindergartenLikeQuery = `SELECT * FROM Pindergarten_Like WHERE userId = ? AND pindergartenId = ? ;`;

    const LikeRows = await connection.query(selectPindergartenLikeQuery, [userId, pindergartenId]);
    return LikeRows;
}

module.exports = {
    selectPindergartens,
    selectPindergartenById,
    selectPindergartenImg,
    selectPindergartenLike
}
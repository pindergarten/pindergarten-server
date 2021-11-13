// 전체 유치원 조회
async function selectPindergartens(connection) {
    const selectPindergartenQuery = `
    SELECT id, name, address,thumbnail, latitude, longitude, rating
    INNER JOIN (SELECT idx,
        (6371*acos(cos(radians(?))*cos(radians(latitude))*cos(radians(longitude)
        -radians(?))+sin(radians(?))*sin(radians(latitude)))) AS distance 
    FROM Pindergarten
    HAVING distance <= ?
    ORDER BY distance) dis on dis.idx=S.idx;
    `;
    const [PindergartenRows] = await connection.query(selectPindergartenQuery, );

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


// 좋아요 등록
async function insertLike(connection, userId, pindergartenId) {
    const insertLikeQuery = `INSERT INTO Pindergarten_Like(userId, pindergartenId) VALUES(?, ?);`;

    const LikeRows = await connection.query(insertLikeQuery, [
        userId,
        pindergartenId,
    ]);
    return LikeRows;
}

// 좋아요 해제
async function deleteLike(connection, userId, pindergartenId) {
    const deleteLikeQuery = `DELETE FROM Pindergarten_Like
    WHERE userId = ? AND pindergartenId = ?;`;

    const LikeRows = await connection.query(deleteLikeQuery, [
        userId,
        pindergartenId,
    ]);
    return LikeRows;
}

// 좋아요한 유치원들 조회

async function selectLikedPindergarten(connection, userId) {
    const selectPindergartenQuery = `SELECT pindergartenId FROM Pindergarten_Like WHERE userId = ?;`;
    const LikeRows = await connection.query(selectPindergartenQuery, userId);

    return LikeRows;
}

module.exports = {
    selectPindergartens,
    selectPindergartenById,
    selectPindergartenImg,
    selectPindergartenLike,
    insertLike,
    deleteLike,
    selectLikedPindergarten
}
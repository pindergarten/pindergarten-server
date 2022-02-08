// 전체 유치원 조회
async function selectPindergartens(connection, latitude, longitude, offset, limit) {
    const selectPindergartenQuery = `
    SELECT id, name, address, thumbnail, latitude, longitude, rating,
        (6371*acos(cos(radians(?))*cos(radians(latitude))*cos(radians(longitude)
	    -radians(?))+sin(radians(?))*sin(radians(latitude)))) AS distance
    FROM Pindergarten 
    ORDER BY distance 
    LIMIT ?,?
    `;
    const [PindergartenRows] = await connection.query(selectPindergartenQuery, [latitude, longitude, latitude, offset, limit]);

    return PindergartenRows;
}

async function selectNearPindergartens(connection, latitude, longitude, offset, limit) {
    const selectPindergartenQuery = `
    SELECT id, name, address, thumbnail, latitude, longitude, rating,
        (6371*acos(cos(radians(?))*cos(radians(latitude))*cos(radians(longitude)
	    -radians(?))+sin(radians(?))*sin(radians(latitude)))) AS distance
    FROM Pindergarten 
    ORDER BY distance 
    LIMIT ?,?
    `;
    const [PindergartenRows] = await connection.query(selectPindergartenQuery, [latitude, longitude, latitude, offset, limit]);

    return PindergartenRows;
}

async function selectPindergartenById(connection, pindergartenId) {
    const selectPindergartenQuery = `
    SELECT * 
    FROM Pindergarten
    WHERE id = ?;
    `;
    const [PindergartenRows] = await connection.query(selectPindergartenQuery, [pindergartenId]);

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
    const selectPindergartenLikeQuery = `SELECT userId, pindergartenId FROM Pindergarten_Like WHERE userId = ? AND pindergartenId = ? ;`;

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

async function selectLikedPindergarten(connection, userId, latitude, longitude) {
    const selectPindergartenQuery = `SELECT P.id, P.name, P.address, P.thumbnail, P.rating,
    (6371 * acos(cos(radians( ? )) * cos(radians(P.latitude)) * cos(radians(P.longitude) -
        radians( ? )) + sin(radians( ? )) * sin(radians(P.latitude)))) AS distance
    FROM Pindergarten_Like L
    INNER JOIN Pindergarten P on P.id = L.pindergartenId
    WHERE userId = ?
    ORDER BY distance
    ;`;
    const LikeRows = await connection.query(selectPindergartenQuery, [latitude, longitude, latitude, userId]);

    return LikeRows;
}

// 유치원 키워드 검색
async function searchPindergartens(connection, latitude, longitude, query) {

    const pindergartenSearchQuery = `
    SELECT id, name,address,  thumbnail, latitude, longitude, opening_hours, access_guide,ifnull(rating,"") as rating, ifnull(website,"") as website, ifnull(phone,"") as phone, 
     (6371 * acos(cos(radians( ? )) * cos(radians(latitude)) * cos(radians(longitude) -
        radians( ? )) + sin(radians( ? )) * sin(radians(latitude)))) AS distance
    FROM Pindergarten
    WHERE name like concat('%', ? , '%')
    ORDER BY distance;
    `;
    const [pindergartenRows] = await connection.query(pindergartenSearchQuery, [latitude, longitude, latitude, query]);
    return pindergartenRows;

}
// 리뷰 조회 

async function selectReviews(connection, pindergartenId, offset, limit) {
    const selectPindergartenQuery = `SELECT title,content,date,link
    FROM Pindergarten_Review 
    WHERE pindergartenId = ?
    LIMIT ?,?;`;
    const LikeRows = await connection.query(selectPindergartenQuery, [pindergartenId, offset, limit]);

    return LikeRows;
}


module.exports = {
    selectPindergartens,
    selectNearPindergartens,
    selectPindergartenById,
    selectPindergartenImg,
    selectPindergartenLike,
    insertLike,
    deleteLike,
    selectLikedPindergarten,
    searchPindergartens,
    selectReviews
}
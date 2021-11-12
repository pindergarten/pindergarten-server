// 전체 유치원 조회
async function selectPindergartens(connection) {
    const selectPindergartenQuery = `
    SELECT name, address,thumbnail, latitude, longitude, rating FROM Pindergarten;
    `;
    const [PindergartenRows] = await connection.query(selectPindergartenQuery);

    return PindergartenRows;
}

module.exports = {
    selectPindergartens,
}
// 전체 글 검색
async function selectEvents(connection) {
    const selectEventQuery = `
    SELECT id,title, thumbnail, DATE_FORMAT(expired_at, "%Y.%m.%d") AS date FROM Event;
    `;
    const [EventRows] = await connection.query(selectEventQuery);

    return EventRows;
}
module.exports = {
    selectEvents
}
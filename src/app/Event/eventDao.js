// 전체 글 검색
async function selectEvents(connection) {
    const selectEventQuery = `
    SELECT id,title, thumbnail, DATE_FORMAT(expired_at, "%Y.%m.%d") AS expired_at ,DATE_FORMAT(created_at, "%Y.%m.%d") AS created_at FROM Event;
    `;
    const [EventRows] = await connection.query(selectEventQuery);

    return EventRows;
}

// 아이디로 글 검색
async function selectEventById(connection, eventId) {
    const selectListQuery = `
    SELECT id, title, thumbnail, DATE_FORMAT(expired_at, "%Y.%m.%d") AS expired_at ,DATE_FORMAT(created_at, "%Y.%m.%d") AS created_at FROM Event WHERE id = ?
    `;
    const [selectListRows] = await connection.query(selectListQuery, [eventId]);
    return selectListRows;
}

// 좋아요 개수 조회
async function selectLikeByEvent(connection, eventId) {
    const selectLikeQuery = `SELECT count(*) AS count FROM Event_Like WHERE eventId = ? ;`;
    const LikeRows = await connection.query(selectLikeQuery, [eventId]);

    return LikeRows;
}

// 좋아요 조회
async function selectLike(connection, userId, eventId) {
    const selectLikeQuery = `SELECT * FROM Event_Like WHERE userId = ? AND eventId = ? ;`;

    const LikeRows = await connection.query(selectLikeQuery, [
        userId,
        eventId
    ]);
    return LikeRows;
}

// 좋아요 등록
async function insertLike(connection, userId, eventId) {
    const insertLikeQuery = `INSERT INTO Event_Like(userId, eventId) VALUES(?, ?);`;

    const LikeRows = await connection.query(insertLikeQuery, [
        userId,
        eventId,
    ]);
    return LikeRows;
}

// 좋아요 해제
async function deleteLike(connection, userId, eventId) {
    const deleteLikeQuery = `DELETE FROM Event_Like
    WHERE userId = ? AND eventId = ?;`;

    const LikeRows = await connection.query(deleteLikeQuery, [
        userId,
        eventId,
    ]);
    return LikeRows;
}
// 댓글 개수 조회
async function selectCommentByEvent(connection, eventId) {
    const selectCommentQuery = `SELECT count(*) AS count FROM Event_Comment WHERE eventId = ? ;`;
    const CommentRows = await connection.query(selectCommentQuery, [eventId]);

    return CommentRows;
}

// 댓글 등록
async function insertComment(connection, insertCommentParams) {

    const insertCommentQuery = `
    INSERT INTO Event_Comment(eventId, userId, content)
    VALUES(?, ?, ?);
    `;

    const CommentRows = await connection.query(insertCommentQuery, insertCommentParams);

    return CommentRows;
}


// 댓글 조회
async function selectComment(connection, eventId) {
    const selectCommentQuery = `
    SELECT 
    C.id,
    U.nickname,
    U.profile_img,
    DATE_FORMAT(C.created_at, "%Y.%m.%d %H:%i") AS date,
    C.content
   
      FROM Event_Comment C
      INNER JOIN User U on C.userId = U.id
      WHERE eventId = ? 
      ORDER BY date;

    `;
    const [selectCommentRows] = await connection.query(selectCommentQuery, eventId);

    return selectCommentRows;
}

// 댓글 삭제
async function deleteComment(connection, deleteCommentParams) {
    const deletePostQuery = `DELETE FROM Event_Comment WHERE userId = ? AND eventId = ? AND id = ? ;`;
    const postRows = await connection.query(deletePostQuery, deleteCommentParams);

    return postRows;
}

module.exports = {
    selectEvents,
    selectEventById,
    selectLikeByEvent,
    insertLike,
    selectLike,
    deleteLike,
    selectComment,
    selectCommentByEvent,
    insertComment,
    deleteComment
}
// 글 포스팅
async function insertPost(connection, userId, title, category, postImgUrl1) {
    const insertListQuery = `
    INSERT INTO Post(userId, image,  content) 
    VALUES (?, ?, ?);
    `;
    const [insertListRows] = await connection.query(insertListQuery, [userId, title, category, postImgUrl1]);
    return insertListRows;
}

// 전체 글 검색
async function selectPosts(connection) {
    const selectListQuery = `
    SELECT * FROM Post;
    `;
    const [selectListRows] = await connection.query(selectListQuery);
    console.log(selectListRows)

    return selectListRows;
}

// 아이디로 글 검색
async function selectPostById(connection, postId) {
    const selectListQuery = `
    SELECT * FROM Post WHERE  id = ? ORDER BY created_at DESC;
    `;
    const [selectListRows] = await connection.query(selectListQuery, [postId]);
    console.log(selectListRows)

    return selectListRows;
}

// 좋아요 조회
async function selectLike(connection, userId, postId) {
    const selectStarQuery = `select id, status from Like where userId=? AND postId=?;`;

    const LikeRows = await connection.query(selectStarQuery, [
        userId,
        postId
    ]);
    return LikeRows;
}

// 좋아요 등록
async function insertLike(connection, userId, postId) {
    const insertStarQuery = `INSERT INTO Like(userId, postId) VALUES(?, ?);`;

    const LikeRows = await connection.query(insertStarQuery, [
        userId,
        postId,
    ]);
    return LikeRows;
}

// 댓글 등록
async function insertComment(connection, postId, userId, content) {
    const insertCommentParams = [postId, userId, content];
    const insertCommentQuery = `
    INSERT INTO Comment(postId, userId, content)
    VALUES(?, ?, ?);
    `;
    const insertCommentRow = await connection.query(insertCommentQuery, insertCommentParams);

    return insertCommentRow;
}

async function selectComment(connection, postId) {
    const selectListQuery = `
    SELECT id,
    nickname,
    profileImg,
     (CASE
         WHEN TIMESTAMPDIFF(MINUTE, C.createAt, now()) <= 0 THEN '방금 전'
         WHEN TIMESTAMPDIFF(MINUTE, C.createAt, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, C.createAt, NOW()), '분 전')
         WHEN TIMESTAMPDIFF(HOUR, C.createAt, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, C.createAt, NOW()), '시간 전')
         ELSE DATE_FORMAT(C.createAt, "%Y.%m.%d")
     END) AS date,
    content,
   
      FROM Comment C
      INNER JOIN User U on C.userId = U.id
      WHERE postId = ? ;
    `;
    const [selectListRows] = await connection.query(selectListQuery, postId);
    return selectListRows;
}

module.exports = {
    insertPost,
    selectPosts,
    selectPostById,
    insertLike,
    selectLike,
    insertComment,
    selectComment
}
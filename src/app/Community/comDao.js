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
    SELECT 
    P.id,
    P.content,
    P.thumbnail,
    U.nickname,
    U.profile_img
    
      FROM Post P
      INNER JOIN User U on P.userId = U.id
      ORDER BY P.created_at DESC;
    ;
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

//게시글 이미지들 검색
async function selectPostImg(connection, postId) {
    const selectPostImgQuery = `
                SELECT postImageUrl
                FROM PostImg
                WHERE postId = ?;
                `;
    const [postImgRows] = await connection.query(selectPostImgQuery, postId);

    return postImgRows;
};

// 좋아요 조회
async function selectLike(connection, userId, postId) {
    const selectStarQuery = `SELECT * FROM LikedPost WHERE userId = ? AND postId = ? ;`;

    const LikeRows = await connection.query(selectStarQuery, [
        userId,
        postId
    ]);
    return LikeRows;
}

// 좋아요 등록
async function insertLike(connection, userId, postId) {
    const insertLikeQuery = `INSERT INTO LikedPost(userId, postId) VALUES(?, ?);`;

    const LikeRows = await connection.query(insertLikeQuery, [
        userId,
        postId,
    ]);
    return LikeRows;
}

// 좋아요 해제
async function deleteLike(connection, userId, postId) {
    const deleteLikeQuery = `DELETE FROM LikedPost
    WHERE userId = ? AND postId = ?;`;

    const LikeRows = await connection.query(deleteLikeQuery, [
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
    VALUES('?', '?', '?');
    `;

    const insertCommentRow = await connection.query(insertCommentQuery, [postId, userId, content]);

    return insertCommentRow;
}

async function selectComment(connection, postId) {
    const selectCommentQuery = `
    SELECT C.id,
    U.nickname,
    U.profile_img,
     (CASE
         WHEN TIMESTAMPDIFF(MINUTE, C.created_at, now()) <= 0 THEN '방금 전'
         WHEN TIMESTAMPDIFF(MINUTE, C.created_at, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, C.created_at, NOW()), '분 전')
         WHEN TIMESTAMPDIFF(HOUR, C.created_at, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, C.created_at, NOW()), '시간 전')
         ELSE DATE_FORMAT(C.created_at, "%Y.%m.%d")
     END) AS date,
    C.content
   
      FROM Comment C
      INNER JOIN User U on C.userId = U.id
      WHERE postId = ? ;

    `;
    const [selectCommentRows] = await connection.query(selectCommentQuery, postId);

    return selectCommentRows;
}

module.exports = {
    insertPost,
    selectPosts,
    selectPostById,
    selectPostImg,
    insertLike,
    deleteLike,
    selectLike,
    insertComment,
    selectComment
}
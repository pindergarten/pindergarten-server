// 글 포스팅
async function insertPost(connection, insertPostParams) {
    const insertListQuery = `
    INSERT INTO Post(userId, thumbnail, content) 
    VALUES (?, ?, ?);
    `;
    const [insertListRows] = await connection.query(insertListQuery, insertPostParams);
    return insertListRows;
}

async function insertPostImage(connection, postId, image) {
    const insertListQuery = `
    INSERT INTO Post_Image(postId, postImageUrl) 
    VALUES (?, ?);
    `;
    const [insertListRows] = await connection.query(insertListQuery, [postId, image]);
    return insertListRows;

}

// 전체 글 검색
async function selectPosts(connection, userId, cursor) {
    const selectListQuery = `
    SELECT 
    P.id,
    P.content,
    P.thumbnail,
    P.userId,
    U.nickname,
    U.profile_img
    FROM Post P 
    INNER JOIN User U on P.userId = U.id
    WHERE P.id NOT IN (SELECT postId FROM Declaration WHERE userId = ?)
    AND P.userId NOT IN (SELECT blockUserId FROM Block WHERE userId = ?)
    AND P.id <= ?
    ORDER BY P.created_at DESC, P.id DESC
    LIMIT 10;
    ;
    `;
    const [selectListRows] = await connection.query(selectListQuery, [userId, userId, cursor]);
    console.log(selectListRows)

    return selectListRows;
}

// 아이디로 글 검색
async function selectPostById(connection, postId) {
    const selectListQuery = `
    SELECT P.id, P.content, DATE_FORMAT(P.created_at, "%Y.%m.%d") AS date, U.id AS userId, U.nickname, U.profile_img
    FROM Post P  
    INNER JOIN User U ON P.userId = U.id AND P.id = ?
    `;
    const [selectListRows] = await connection.query(selectListQuery, [postId]);
    return selectListRows;
}

// 게시글 이미지들 검색
async function selectPostImg(connection, postId) {
    const selectPostImgQuery = `
                SELECT postImageUrl
                FROM Post_Image
                WHERE postId = ?;
                `;
    const [postImgRows] = await connection.query(selectPostImgQuery, postId);

    return postImgRows;
};

//게시글 삭제
async function deletePost(connection, deletePostParams) {
    const deletePostQuery = `DELETE FROM Post WHERE id = ? ;`;
    const postRows = await connection.query(deletePostQuery, deletePostParams);

    return postRows;
}

// 게시글 좋아요 삭제
async function deletePostLike(connection, postId) {
    const deletePostQuery = `DELETE FROM Post_Like WHERE postId = ? ;`;
    const postRows = await connection.query(deletePostQuery, postId);

    return postRows;

}
// 게시글 댓글 삭제
async function deletePostComment(connection, postId) {
    const deletePostQuery = `DELETE FROM Post_Comment WHERE postId = ? ;`;
    const postRows = await connection.query(deletePostQuery, postId);

    return postRows;

}

async function deletePostContent(connection, postId) {
    const deleteListQuery = `
    DELETE FROM Post_Image
    WHERE postId = ? ;
  `;
    const [deleteListRows] = await connection.query(deleteListQuery, postId);
    return deleteListRows;
}

// 좋아요 개수 조회
async function selectLikeByPost(connection, postId) {
    const selectLikeQuery = `SELECT count(*) AS count FROM Post_Like WHERE postId = ? ;`;
    const LikeRows = await connection.query(selectLikeQuery, [postId]);

    return LikeRows;
}

// 좋아요 조회
async function selectLike(connection, userId, postId) {
    const selectLikeQuery = `SELECT * FROM Post_Like WHERE userId = ? AND postId = ? ;`;

    const LikeRows = await connection.query(selectLikeQuery, [
        userId,
        postId
    ]);
    return LikeRows;
}

// 좋아요 등록
async function insertLike(connection, userId, postId) {
    const insertLikeQuery = `INSERT INTO Post_Like(userId, postId) VALUES(?, ?);`;

    const LikeRows = await connection.query(insertLikeQuery, [
        userId,
        postId,
    ]);
    return LikeRows;
}

// 좋아요 해제
async function deleteLike(connection, userId, postId) {
    const deleteLikeQuery = `DELETE FROM Post_Like
    WHERE userId = ? AND postId = ?;`;

    const LikeRows = await connection.query(deleteLikeQuery, [
        userId,
        postId,
    ]);
    return LikeRows;
}
// 댓글 개수 조회
async function selectCommentByPost(connection, postId) {
    const selectCommentQuery = `SELECT count(*) AS count FROM Post_Comment WHERE postId = ? ;`;
    const CommentRows = await connection.query(selectCommentQuery, [postId]);

    return CommentRows;
}

// 댓글 등록
async function insertComment(connection, insertCommentParams) {

    const insertCommentQuery = `
    INSERT INTO Post_Comment(postId, userId, content)
    VALUES(?, ?, ?);
    `;

    const CommentRows = await connection.query(insertCommentQuery, insertCommentParams);

    return CommentRows;
}


// 댓글 조회
async function selectComment(connection, postId, userId) {
    const selectCommentQuery = `
    SELECT 
    C.id,
    C.userId,
    U.nickname,
    U.profile_img,
    DATE_FORMAT(C.created_at, "%Y.%m.%d %H:%i") AS date,
    C.content
   
    FROM Post_Comment C
    INNER JOIN User U on C.userId = U.id
    WHERE postId = ?
    AND C.userId NOT IN (SELECT blockUserId FROM Block WHERE userId = ?)
    ORDER BY date;

    `;
    const [selectCommentRows] = await connection.query(selectCommentQuery, [postId, userId]);

    return selectCommentRows;
}

// 댓글 삭제
async function deleteComment(connection, deleteCommentParams) {
    const deletePostQuery = `DELETE FROM Post_Comment WHERE userId = ? AND postId = ? AND id = ? ;`;
    const postRows = await connection.query(deletePostQuery, deleteCommentParams);

    return postRows;
}

// 내가 신고했는지
async function existDeclaration(connection, userId, postId) {
    const selectListQuery = `
    SELECT EXISTS(
      SELECT *
      FROM Declaration
      WHERE postId = ${postId} AND userId = ${userId}
    ) AS exist;
    `;
    const [selectListRows] = await connection.query(selectListQuery);
    return selectListRows;
}
// 게시글 신고
async function insertDeclaration(connection, insertDeclarationParams) {
    const insertListQuery = `
    INSERT INTO Declaration(userId, postId, reason, title, content) 
    VALUES (?, ?, ?, ?, ?);
    `;
    const [insertListRows] = await connection.query(insertListQuery, insertDeclarationParams);
    return insertListRows;
}

module.exports = {
    insertPost,
    insertPostImage,
    selectPosts,
    selectPostById,
    selectPostImg,
    deletePost,
    deletePostContent,
    deletePostLike,
    deletePostComment,
    selectLikeByPost,
    insertLike,
    deleteLike,
    selectLike,
    selectCommentByPost,
    insertComment,
    selectComment,
    deleteComment,
    existDeclaration,
    insertDeclaration
}
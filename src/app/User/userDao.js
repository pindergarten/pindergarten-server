// 모든 유저 조회
async function selectUser(connection) {
    const selectUserListQuery = `
                  SELECT email, name 
                  FROM USER;
                  `;
    const [userRows] = await connection.query(selectUserListQuery);
    return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
    const selectUserEmailQuery = `
                  SELECT email, name 
                  FROM USER 
                  WHERE email = ?;
                  `;
    const [emailRows] = await connection.query(selectUserEmailQuery, email);
    return emailRows;
}



// userId 회원 조회
async function selectUserId(connection, userId) {
    const selectUserIdQuery = `
                   SELECT id, email, name 
                   FROM USER 
                   WHERE id = ?;
                   `;
    const [userRow] = await connection.query(selectUserIdQuery, userId);
    return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
    const insertUserInfoQuery = `
          INSERT INTO USER(email, password, name, phone)
          VALUES (?, ?, ?,?);
      `;
    const insertUserInfoRow = await connection.query(
        insertUserInfoQuery,
        insertUserInfoParams
    );

    return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
    const selectUserPasswordQuery = `
          SELECT email, name, password
          FROM USER 
          WHERE email = ? AND password = ?;`;
    const selectUserPasswordRow = await connection.query(
        selectUserPasswordQuery,
        selectUserPasswordParams
    );

    return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
    const selectUserAccountQuery = `
          SELECT id
          FROM USER 
          WHERE email = ?;`;
    const selectUserAccountRow = await connection.query(
        selectUserAccountQuery,
        email
    );
    return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, name) {
    const updateUserQuery = `
    UPDATE USER 
    SET name = ?
    WHERE id = ?;`;
    const updateUserRow = await connection.query(updateUserQuery, [name, id]);
    return updateUserRow[0];
}
async function updateEmailVerify(connection, email) {
    const updateEmailQuery = `
    UPDATE EmailCheck
    SET isVerified = 1
    WHERE email = ?;`;
    const updateEmailRow = await connection.query(updateEmailQuery, email);
    return updateEmailRow[0];
}


//네이버 로그인
async function insertNaverUser(connection, insertUserParams) {
    const insertEmailQuery = `
    INSERT INTO USER(userEmail, name, phone, profileImg, loginType)
    VALUES(?, ?, ?, ?, 1);
    `;
    const insertEmailRow = await connection.query(
        insertEmailQuery,
        insertUserParams
    );
    return insertEmailRow;
}

//jwt status 업데이트
async function updateJwtStatus(connection, userIdx) {
    const updateJwtStatusQuery = `
UPDATE JWT SET status=1 where userId='?'
`;
    const updateJwtStatusRow = await connection.query(
        updateJwtStatusQuery,
        userIdx
    );
    return updateJwtStatusRow;
}


//login user 조회
async function selectLoginUser(connection, userId) {
    const selectJwtQuery = `
    SELECT userId, status FROM JWT WHERE userId='?';
    `;
    const selectJwtRow = await connection.query(selectJwtQuery, userId);
    return selectJwtRow;
}

//login 추가
async function insertLoginUser(connection, updateJwtTokenParams) {
    const insertJwtQuery = `
    INSERT INTO JWT(token, userId) VALUES(?,'?');
    `;
    const insertJwtRow = await connection.query(
        insertJwtQuery,
        updateJwtTokenParams
    );
    return insertJwtRow;
}

//회원정보수정 - 닉네임
async function updateUserNickname(connection, userId, nickname) {
    const updateUserNicknameQuery = `UPDATE USER SET name=? where Id=?;
                  `;
    const [userRows] = await connection.query(updateUserNicknameQuery, [
        nickname,
        userId,
    ]);
    return userRows;
}

//회원정보수정 - 이메일
async function updateUserEmail(connection, userId, email) {
    const updateUserEmailQuery = `UPDATE USER SET userEmail=? where Id=?;
                  `;
    const [userRows] = await connection.query(updateUserEmailQuery, [
        email,
        userId,
    ]);
    return userRows;
}

//회원탈퇴
async function updateUserStatus(connection, userId) {
    const updateUserStatusQuery = `UPDATE USER SET status=1 WHERE Id=?;
                  `;
    const [userRows] = await connection.query(updateUserStatusQuery, [userId]);
    return userRows;
}

//jwt token 업데이트
async function updateJwtToken(connection, updateJwtTokenParams) {
    const updateJwtTokenQuery = `
  UPDATE JWT SET token=?, status=0 where id=?
  `;
    const updateJwtTokenRow = await connection.query(
        updateJwtTokenQuery,
        updateJwtTokenParams
    );
    return updateJwtTokenRow;
}



module.exports = {
    selectUser,
    selectUserEmail,
    selectUserId,
    insertUserInfo,
    insertLoginUser,
    selectUserPassword,
    selectUserAccount,
    updateUserInfo,
    updateEmailVerify,
    updateUserEmail,
    updateUserNickname,
    updateUserStatus,
    selectUserEmail,
    insertNaverUser,
    selectLoginUser,
    updateJwtToken,
    updateJwtStatus
};
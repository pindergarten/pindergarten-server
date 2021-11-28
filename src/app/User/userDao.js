// 전화번호로 회원 조회
async function selectUserPhoneNumber(connection, phone) {
    const selectUserPhoneNumberQuery = `
                SELECT id, nickname, phone, password
                FROM User
                WHERE phone = ?;
                `;
    const [phoneNumberRows] = await connection.query(selectUserPhoneNumberQuery, phone);
    return phoneNumberRows;
};

// 닉네임으로 회원 조회
async function selectUserNickName(connection, nickName) {
    const selectUserNickNameQuery = `
                SELECT id, nickname, phone
                FROM User
                WHERE nickname = ?;
                `;
    const [nickNameRows] = await connection.query(selectUserNickNameQuery, nickName);
    return nickNameRows;
};

// userId 회원 조회
async function selectUserId(connection, userId) {
    const selectUserIdQuery = `
                   SELECT id, nickname, phone, profile_img
                   FROM User 
                   WHERE id = ?;
                   `;
    const [userRow] = await connection.query(selectUserIdQuery, userId);
    return userRow;
}

// 유저 게시글 조회
async function selectUserPost(connection, userId) {
    const selectUserPostQuery = `SELECT id, thumbnail FROM Post WHERE userId = ?
    ORDER BY created_at DESC;`;
    const [userPostRow] = await connection.query(selectUserPostQuery, userId);
    return userPostRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
    const insertUserInfoQuery = `
          INSERT INTO User(nickname, password, phone)
          VALUES (?, ?, ?);
      `;
    const insertUserInfoRow = await connection.query(
        insertUserInfoQuery,
        insertUserInfoParams
    );

    return insertUserInfoRow;
}

// 유저 수정
async function updateUserInfo(connection, nickname, hashedPassword, phone, status) {
    const insertUserInfoQuery = `
    UPDATE User SET nickname = ?, password = ?, status = ? WHERE phone= ? ;
`;
    const UserInfoRow = await connection.query(insertUserInfoQuery, [nickname, hashedPassword, status, phone]);

    return UserInfoRow;
}

// 유저 프로필사진 수정
async function updateUserImage(connection, userId, profile_image) {
    const insertUserInfoQuery = `
    UPDATE User SET profile_img= ? WHERE id= ? ;
`;
    const UserInfoRow = await connection.query(insertUserInfoQuery, [profile_image, userId]);

    return UserInfoRow;
}

// 유저 계정 상태 체크
async function selectUserAccount(connection, phone) {
    const selectUserAccountQuery = `
                SELECT status, id
                FROM User
                WHERE phone = ?;
                `;
    const selectUserAccountRow = await connection.query(selectUserAccountQuery, phone);

    return selectUserAccountRow[0];
};

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
    const selectUserPasswordQuery = `
          SELECT phone, nickname, password
          FROM User 
          WHERE phone = ? AND password = ?;`;
    const selectUserPasswordRow = await connection.query(
        selectUserPasswordQuery,
        selectUserPasswordParams
    );

    return selectUserPasswordRow;
}

//login user 조회
async function selectLoginUser(connection, userId) {
    const selectJwtQuery = `
    SELECT userId FROM Token WHERE userId=?;
    `;
    const selectJwtRow = await connection.query(selectJwtQuery, userId);
    return selectJwtRow;
}

//login 추가
async function insertLoginUser(connection, updateJwtTokenParams) {
    const insertJwtQuery = `
    INSERT INTO Token(jwt, userId, status) VALUES(?,?,'ACTIVATED');
    `;
    const insertJwtRow = await connection.query(
        insertJwtQuery,
        updateJwtTokenParams
    );
    return insertJwtRow;
}


//jwt 조회
async function selectJwtToken(connection, userId) {
    const selectJWTQuery = `
                SELECT jwt, userId
                FROM Token
                WHERE userId =?;
                `;
    const [selectJWTRow] = await connection.query(selectJWTQuery, userId);

    return selectJWTRow;
};

//jwt token 업데이트
async function updateJwtToken(connection, updateJwtTokenParams) {
    const updateJwtTokenQuery = `
  UPDATE Token SET jwt= ?, status='ACTIVATED' where userId=?
  `;
    const updateJwtTokenRow = await connection.query(
        updateJwtTokenQuery,
        updateJwtTokenParams
    );
    return updateJwtTokenRow;
}


// 비밀번호 업데이트
async function updatePassword(connection, updatePasswordParams) {
    const updatePasswordQuery = `
  UPDATE User SET password=? where phone=?
  `;
    const updatePasswordRow = await connection.query(
        updatePasswordQuery,
        updatePasswordParams
    );
    return updatePasswordRow;
}

async function updateJwtStatus(connection, userId) {
    const updateJwtStatusQuery = `
    UPDATE Token SET status='INACTIVATED' where userId=?
    `;
    const updateJwtStatusRow = await connection.query(updateJwtStatusQuery, userId);
    return updateJwtStatusRow;

}

async function updateUserStatus(connection, userId) {
    const updateUserStatusQuery = `UPDATE User SET status='DELETED' WHERE id= ? ;
                `;
    const [userRows] = await connection.query(updateUserStatusQuery, userId);
    return userRows;
}




module.exports = {
    selectUserPhoneNumber,
    selectUserNickName,
    selectUserId,
    insertUserInfo,
    selectUserAccount,
    selectUserPost,
    selectUserPassword,
    selectLoginUser,
    insertLoginUser,
    selectJwtToken,
    updateJwtToken,
    updatePassword,
    updateJwtStatus,
    updateUserStatus,
    updateUserInfo,
    updateUserImage
}
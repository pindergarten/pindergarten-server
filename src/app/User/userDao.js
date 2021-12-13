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

// 유저 펫 조회

async function selectUserPet(connection, userId) {
    const selectUserPostQuery = `SELECT id, userId, name, profile_image, gender, breed, birth, vaccination, neutering FROM Pet WHERE userId = ?;`;
    const [userPostRow] = await connection.query(selectUserPostQuery, userId);
    return userPostRow;
}

// 유저 게시글 조회
async function selectUserPost(connection, userId, userIdFromJWT) {
    const selectUserPostQuery = `SELECT id, userId, thumbnail 
    FROM Post 
    WHERE userId = ?
    AND id NOT IN (SELECT postId FROM Declaration WHERE userId = ?)
    ORDER BY created_at DESC;`;
    const [userPostRow] = await connection.query(selectUserPostQuery, [userId, userIdFromJWT]);
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
    const updateUserStatusQuery = `UPDATE User SET status='DELETED', nickname = '' WHERE id= ? ;
                `;
    const [userRows] = await connection.query(updateUserStatusQuery, userId);
    return userRows;
}


async function selectBlockList(connection, userId) {
    const selectBlockQuery = `
    SELECT B.blockUserId, U.nickname, U.profile_img, DATE_FORMAT(B.created_at, "%Y.%m.%d") AS date
    FROM Block B
    INNER JOIN User U ON U.id = B.blockUserId
    WHERE userId=?;
    `;
    const selectBlockRow = await connection.query(selectBlockQuery, [userId]);
    return selectBlockRow;
}

async function selectBlock(connection, userId, blockUserId) {
    const selectBlockQuery = `
    SELECT userId, blockUserId FROM Block WHERE userId=? AND blockUserId = ?;
    `;
    const selectBlockRow = await connection.query(selectBlockQuery, [userId, blockUserId]);
    return selectBlockRow;
}

async function insertBlock(connection, userId, blockUserId) {
    const updateUserStatusQuery = `INSERT INTO Block(userId, blockUserId) VALUES (?,?) ;
                `;
    const [userRows] = await connection.query(updateUserStatusQuery, [userId, blockUserId]);
    return userRows;
}

async function selectReport(connection, userId, reportUserId) {
    const selectBlockQuery = `
    SELECT EXISTS(
        SELECT *
        FROM Report_User
        WHERE userId = ? AND reportUserId = ? 
      ) AS exist;
    `;
    const selectBlockRow = await connection.query(selectBlockQuery, [userId, reportUserId]);
    return selectBlockRow;
}

async function insertReport(connection, insertReportParams) {
    const updateUserStatusQuery = `INSERT INTO Report_User(userId, reportUserId, reason, title, content) VALUES (?,?,?,?,?) ;
    `;
    const [userRows] = await connection.query(updateUserStatusQuery, insertReportParams);
    return userRows;
}

module.exports = {
    selectUserPhoneNumber,
    selectUserNickName,
    selectUserId,
    insertUserInfo,
    selectUserAccount,
    selectUserPost,
    selectUserPet,
    selectUserPassword,
    selectLoginUser,
    insertLoginUser,
    selectJwtToken,
    updateJwtToken,
    updatePassword,
    updateJwtStatus,
    updateUserStatus,
    updateUserInfo,
    updateUserImage,
    selectBlockList,
    selectBlock,
    insertBlock,
    selectReport,
    insertReport,
}
// 전화번호로 회원 조회
async function selectUserPhoneNumber(connection, phone) {
    const selectUserPhoneNumberQuery = `
                SELECT nickname, phone, id
                FROM User
                WHERE phone = ?;
                `;
    const [phoneNumberRows] = await connection.query(selectUserPhoneNumberQuery, phone);
    return phoneNumberRows;
};

// 닉네임으로 회원 조회
async function selectUserNickName(connection, nickName) {
    const selectUserNickNameQuery = `
                SELECT nickname
                FROM User
                WHERE nickname = ?;
                `;
    const [nickNameRows] = await connection.query(selectUserNickNameQuery, nickName);
    return nickNameRows;
};


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
          INSERT INTO User(nickname, password, phone)
          VALUES (?, ?, ?);
      `;
    const insertUserInfoRow = await connection.query(
        insertUserInfoQuery,
        insertUserInfoParams
    );

    return insertUserInfoRow;
}










module.exports = {
    selectUserPhoneNumber,
    selectUserNickName,
    selectUserId,
    insertUserInfo,

};
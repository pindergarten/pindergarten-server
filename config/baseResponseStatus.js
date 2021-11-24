module.exports = {
    // Success
    SUCCESS: { isSuccess: true, code: 1000, message: "성공" },

    // Common
    TOKEN_EMPTY: {
        isSuccess: false,
        code: 2000,
        message: "JWT 토큰을 입력해주세요.",
    },
    TOKEN_VERIFICATION_FAILURE: {
        isSuccess: false,
        code: 3000,
        message: "JWT 토큰 검증 실패",
    },
    TOKEN_VERIFICATION_SUCCESS: {
        isSuccess: true,
        code: 1001,
        message: "JWT 토큰 검증 성공",
    },

    //Request error
    SIGNUP_PHONE_EMPTY: {
        isSuccess: false,
        code: 2001,
        message: "핸드폰 번호를 입력해주세요",
    },
    SIGNUP_PHONE_ERROR_TYPE: {
        isSuccess: false,
        code: 2002,
        message: "핸드폰 번호 형식을 정확하게 입력해주세요.",
    },
    SIGNUP_REDUNDANT_PHONENUMBER: {
        isSuccess: false,
        code: 2003,
        message: "중복된 핸드폰 번호입니다.",
    },
    SMS_NOT_MATCH: {
        isSuccess: false,
        code: 2004,
        message: "인증코드가 일치하지 않습니다",
    },
    PHONE_VEFIRY_CODE_EMPTY: {
        isSuccess: false,
        code: 2005,
        message: "인증코드를 입력해주세요",
    },
    PHONE_VEFIRY_CODE_LENGTH: {
        isSuccess: false,
        code: 2006,
        message: "인증코드는 4자리로 입력해주세요",
    },
    SIGNUP_PASSWORD_EMPTY: {
        isSuccess: false,
        code: 2007,
        message: "비밀번호를 입력 해주세요.",
    },
    SIGNUP_PASSWORD_LENGTH: {
        isSuccess: false,
        code: 2008,
        message: "비밀번호는 8~16자리를 입력해주세요.",
    },
    SIGNUP_PASSWORD_CHECK_EMPTY: {
        isSuccess: false,
        code: 2009,
        message: "비밀번호 확인을 입력해주세요",
    },
    SIGNUP_PASSWORD_NOT_MATCH: {
        isSuccess: false,
        code: 2010,
        message: "비밀번호가 일치하지 않습니다",
    },
    SIGNUP_NICKNAME_EMPTY: {
        isSuccess: false,
        code: 2011,
        message: "닉네임을 입력 해주세요.",
    },
    SIGNUP_NICKNAME_LENGTH: {
        isSuccess: false,
        code: 2013,
        message: "닉네임은 2자리 이상으로 입력해주세요.",
    },
    SIGNUP_NICKNAME_ERROR_TYPE: {
        isSuccess: false,
        code: 2014,
        message: "닉네임 형식에 맞지 않습니다.",
    },
    SIGNUP_REDUNDANT_NICKNAME: {
        isSuccess: false,
        code: 2015,
        message: "중복된 닉네임입니다.",
    },
    SIGNIN_PHONENUMBER_WRONG: {
        isSuccess: false,
        code: 2016,
        message: "휴대폰 번호가 잘못되었습니다.",
    },
    SIGNIN_INACTIVE_ACCOUNT: {
        isSuccess: false,
        code: 2017,
        message: "비활성화 계정입니다.",
    },
    SIGNIN_NOT_EXIST: {
        isSuccess: false,
        code: 2017,
        message: "로그인하지 않은 계정입니다.",
    },
    SIGNIN_WITHDRAWAL_ACCOUNT: {

        isSuccess: false,
        code: 2018,
        message: "휴대폰 번호가 잘못되었습니다.",
    },
    ALREADY_LOGIN: {
        isSuccess: false,
        code: 2019,
        message: "이미 로그인 되었습니다.",

    },
    SIGNIN_PASSWORD_WRONG: {

        isSuccess: false,
        code: 2020,
        message: "비밀번호가 틀렸습니다.",
    },
    USER_ID_NOT_MATCH: {
        isSuccess: false,
        code: 2020,
        message: "userId를 확인해주세요.",
    },
    USER_ID_NOT_EXIST: {
        isSuccess: false,
        code: 2020,
        message: "user가 존재하지 않습니다.",
    },
    FILE_NOT_EXIST: {
        isSuccess: false,
        code: 2020,
        message: "게시글 등록 시 1개 이상의 사진이 필요합니다.",
    },
    POST_CONTENT_LENGTH: {
        isSuccess: false,
        code: 2020,
        message: "본문은 최대 2000자입니다.",
    },
    POST_NOT_EXIST: {
        isSuccess: false,
        code: 2020,
        message: "해당 게시글이 없습니다.",
    },

    COMMENT_NOT_EXIST: {
        isSuccess: false,
        code: 2020,
        message: "해당 댓글이 없습니다.",

    },
    EVENT_NOT_EXIST: {
        isSuccess: false,
        code: 2020,
        message: "해당 이벤트가 없습니다.",

    },
    ALREADY_DECLAR: {
        isSuccess: false,
        code: 2020,
        message: "이미 신고한 게시물입니다.",
    },
    PINDERGARTEN_NOT_EXIST: {
        isSuccess: false,
        code: 2020,
        message: "존재하지 않는 유치원입니다."
    },
    SEARCH_KEYWORD_EMPTY: {
        isSuccess: false,
        code: 2020,
        message: "검색어를 입력해주세요."
    },
    GEO_NOT_EXIST: {
        isSuccess: false,
        code: 2020,
        message: "현위치(위도,경도)를 입력해주세요."
    },
    PET_ID_NOT_EXIST: {
        isSuccess: false,
        code: 2020,
        message: "존재하지 않는 펫입니다."
    },


    //Connection, Transaction 등의 서버 오류
    DB_ERROR: { isSuccess: false, code: 4000, message: "데이터 베이스 에러" },
    SERVER_ERROR: { isSuccess: false, code: 4001, message: "서버 에러" },
    SMS_ERROR: {
        isSuccess: false,
        code: 4003,
        message: "인증문자 발송에 실패했습니다",
    },
};
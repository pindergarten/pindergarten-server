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
    SIGNUP_EMAIL_EMPTY: {
        isSuccess: false,
        code: 2001,
        message: "이메일을 입력해주세요",
    },
    SIGNUP_EMAIL_LENGTH: {
        isSuccess: false,
        code: 2002,
        message: "이메일은 30자리 미만으로 입력해주세요.",
    },
    SIGNUP_EMAIL_ERROR_TYPE: {
        isSuccess: false,
        code: 2003,
        message: "이메일 형식을 정확하게 입력해주세요.",
    },
    SIGNUP_PASSWORD_EMPTY: {
        isSuccess: false,
        code: 2004,
        message: "비밀번호를 입력 해주세요.",
    },
    SIGNUP_PASSWORD_LENGTH: {
        isSuccess: false,
        code: 2005,
        message: "비밀번호는 6~12자리를 입력해주세요.",
    },
    SIGNUP_NICKNAME_EMPTY: {
        isSuccess: false,
        code: 2006,
        message: "닉네임을 입력 해주세요.",
    },
    SIGNUP_NICKNAME_LENGTH: {
        isSuccess: false,
        code: 2007,
        message: "닉네임은 2자리 이상으로 입력해주세요.",
    },

    SIGNIN_EMAIL_EMPTY: {
        isSuccess: false,
        code: 2008,
        message: "이메일을 입력해주세요",
    },
    SIGNIN_EMAIL_LENGTH: {
        isSuccess: false,
        code: 2009,
        message: "이메일은 30자리 미만으로 입력해주세요.",
    },
    SIGNIN_EMAIL_ERROR_TYPE: {
        isSuccess: false,
        code: 2010,
        message: "이메일을 형식을 정확하게 입력해주세요.",
    },
    SIGNIN_PASSWORD_EMPTY: {
        isSuccess: false,
        code: 2011,
        message: "비밀번호를 입력 해주세요.",
    },

    USER_USERID_EMPTY: {
        isSuccess: false,
        code: 2012,
        message: "userId를 입력해주세요.",
    },
    USER_USERID_NOT_EXIST: {
        isSuccess: false,
        code: 2013,
        message: "해당 회원이 존재하지 않습니다.",
    },

    USER_USEREMAIL_EMPTY: {
        isSuccess: false,
        code: 2014,
        message: "이메일을 입력해주세요.",
    },
    USER_USEREMAIL_NOT_EXIST: {
        isSuccess: false,
        code: 2015,
        message: "해당 이메일을 가진 회원이 존재하지 않습니다.",
    },
    USER_ID_NOT_MATCH: {
        isSuccess: false,
        code: 2016,
        message: "로그인유저의 userIdx와 일치하지 않습니다",
    },
    USER_NICKNAME_EMPTY: {
        isSuccess: false,
        code: 2017,
        message: "변경할 닉네임 값을 입력해주세요",
    },

    USER_STATUS_EMPTY: {
        isSuccess: false,
        code: 2018,
        message: "회원 상태값을 입력해주세요",
    },
    SIGNUP_PHONE_ERROR_TYPE: {
        isSuccess: false,
        code: 2019,
        message: "휴대폰번호 형식을 확인해주세요",
    },
    SIGNUP_PASSWORD_CHECK_EMPTY: {
        isSuccess: false,
        code: 2020,
        message: "비밀번호 확인을 입력해주세요",
    },
    SIGNUP_PASSWORD_NOT_MATCH: {
        isSuccess: false,
        code: 2021,
        message: "비밀번호가 일치하지 않습니다",
    },
    SIGNUP_PASSWORD_ERROR_TYPE: {
        isSuccess: false,
        code: 2022,
        message: "비밀번호는 영문,숫자 조합이어야 합니다",
    },
    SIGNUP_SENDEMAIL_FAIL: {
        isSuccess: false,
        code: 2023,
        message: "이메일 전송 실패",
    },
    NAVER_LOGIN_FAIL: {
        isSuccess: false,
        code: 2024,
        message: "네이버 로그인 실패",
    },
    RESTAURANT_SORT_ERROR_TYPE: {
        isSuccess: false,
        code: 2025,
        message: "정렬기준이 잘못되었습니다",
    },
    RESTAURANT_CATEGORY_ERROR_TYPE: {
        isSuccess: false,
        code: 2026,
        message: "카테고리 값이 잘못되었습니다",
    },
    RESTAURANT_PARKING_ERROR_TYPE: {
        isSuccess: false,
        code: 2027,
        message: "주차장여부 값이 잘못되었습니다",
    },
    RESTAURANT_FOOD_ERROR_TYPE: {
        isSuccess: false,
        code: 2028,
        message: "음식종류가 잘못되었습니다",
    },
    RESTAURANT_PRICE_ERROR_TYPE: {
        isSuccess: false,
        code: 2029,
        message: "가격범위 값이 잘못되었습니다",
    },
    LOCATION_FAIL: {
        isSuccess: false,
        code: 2030,
        message: "현재 위치의 지역정보를 받아오는데 실패했습니다",
    },
    RESTAURANT_ID_EMPTY: {
        isSuccess: false,
        code: 2031,
        message: "맛집 식별자를 입력해주세요",
    },
    RESTAURANT_DISTANCE_ERROR_TYPE: {
        isSuccess: false,
        code: 2032,
        message: "검색반경 값이 잘못되었습니다",
    },
    VISITED_ID_EMPTY: {
        isSuccess: false,
        code: 2033,
        message: "가봤어요 식별자를 입력해주세요",
    },
    REVIEW_ID_EMPTY: {
        isSuccess: false,
        code: 2034,
        message: "리뷰 식별자를 입력해주세요",
    },
    REVIEW_CONTENTS_EMPTY: {
        isSuccess: false,
        code: 2035,
        message: "리뷰 내용을 입력해주세요",
    },
    REVIEW_SCORE_ERROR_TYPE: {
        isSuccess: false,
        code: 2036,
        message: "만족도 값이 잘못되었습니다",
    },
    REVIEW_CONTENTS_LENGTH: {
        isSuccess: false,
        code: 2037,
        message: "리뷰는 최대 10000자 입니다",
    },
    REVIEW_IMAGE_LENGTH: {
        isSuccess: false,
        code: 2038,
        message: "리뷰이미지는 최대 30장입니다",
    },
    STATUS_ERROR_TYPE: {
        isSuccess: false,
        code: 2039,
        message: "status값이 잘못되었습니다",
    },
    COMMENT_CONTENTS_EMPTY: {
        isSuccess: false,
        code: 2040,
        message: "댓글 내용을 입력해주세요",
    },
    COMMENT_CONTENTS_LENGTH: {
        isSuccess: false,
        code: 2041,
        message: "댓글길이는 최대 100자입니다",
    },
    COMMENT_ID_EMPTY: {
        isSuccess: false,
        code: 2042,
        message: "댓글 식별자를 입력해주세요",
    },
    REVIEW_CATEGORY_ERROR_TYPE: {
        isSuccess: false,
        code: 2043,
        message: "카테고리 값이 잘못되었습니다",
    },
    REVIEW_SCORE_EMPTY: {
        isSuccess: false,
        code: 2044,
        message: "만족도 값을 최소 1개이상 선택해주세요",
    },
    EATDEAL_ID_EMPTY: {
        isSuccess: false,
        code: 2045,
        message: "잇딜식별자를 입력해주세요",
    },
    DISTANCE_NEED_LOCATION: {
        isSuccess: false,
        code: 2046,
        message: "거리정보는 위치정보가 필요합니다",
    },
    RESTAURANT_SCORE_ERROR_TYPE: {
        isSuccess: false,
        code: 2047,
        message: "만족도 값이 잘못되었습니다",
    },
    IMAGE_URL_ERROR_TYPE: {
        isSuccess: false,
        code: 2048,
        message: "이미지 url형식을 확인해주세요",
    },
    USER_PHONE_EMPTY: {
        isSuccess: false,
        code: 2049,
        message: "휴대폰번호를 입력해주세요",
    },
    SMS_NOT_MATCH: {
        isSuccess: false,
        code: 2050,
        message: "인증코드가 일치하지 않습니다",
    },
    PHONE_VEFIRY_CODE_EMPTY: {
        isSuccess: false,
        code: 2051,
        message: "인증코드를 입력해주세요",
    },
    PHONE_VEFIRY_CODE_LENGTH: {
        isSuccess: false,
        code: 2052,
        message: "인증코드는 4자리로 입력해주세요",
    },
    SEARCH_QUERY_EMPTY: {
        isSuccess: false,
        code: 2053,
        message: "검색 키워드를 입력해주세요",
    },
    RESTAURANT_NAME_EMPTY: {
        isSuccess: false,
        code: 2054,
        message: "식당 이름을 입력해주세요",
    },
    RESTAURANT_LOCATION_EMPTY: {
        isSuccess: false,
        code: 2055,
        message: "식당 위치를 입력해주세요",
    },
    PHONE_ERROR_TYPE: {
        isSuccess: false,
        code: 2056,
        message: "전화번호 형식을 확인해주세요",
    },
    USER_UPDATE_PARAMETER_EMPTY: {
        isSuccess: false,
        code: 2057,
        message: "수정할 값을 입력해주세요",
    },
    USER_EMAIL_UPDATE_ERROR: {
        isSuccess: false,
        code: 2058,
        message: "소셜로그인 회원만 이메일 수정이 가능합니다",
    },
    USER_FOLLOW_ERROR_TYPE: {
        isSuccess: false,
        code: 2059,
        message: "본인을 팔로우할 수 없습니다",
    },
    IMAGE_ID_EMPTY: {
        isSuccess: false,
        code: 2060,
        message: "imgIdx를 입력해주세요",
    },

    // Response error
    SIGNUP_REDUNDANT_EMAIL: {
        isSuccess: false,
        code: 3001,
        message: "중복된 이메일입니다.",
    },
    SIGNUP_REDUNDANT_NICKNAME: {
        isSuccess: false,
        code: 3002,
        message: "중복된 닉네임입니다.",
    },
    SIGNIN_EMAIL_WRONG: {
        isSuccess: false,
        code: 3003,
        message: "이메일이 잘못 되었습니다.",
    },
    SIGNIN_PASSWORD_WRONG: {
        isSuccess: false,
        code: 3004,
        message: "비밀번호가 잘못 되었습니다.",
    },
    SIGNIN_INACTIVE_ACCOUNT: {
        isSuccess: false,
        code: 3005,
        message: "비활성화 된 계정입니다. 고객센터에 문의해주세요.",
    },
    SIGNIN_WITHDRAWAL_ACCOUNT: {
        isSuccess: false,
        code: 3006,
        message: "탈퇴된 계정입니다",
    },
    SIGNUP_EMAIL_NOT_VERIFIED: {
        isSuccess: false,
        code: 3007,
        message: "이메일 인증이 완료되지 않았습니다",
    },
    USER_ID_NOT_EXIST: {
        isSuccess: false,
        code: 3008,
        message: "존재하지 않는 userIdx 입니다",
    },
    LOGIN_NOT_EXIST: {
        isSuccess: false,
        code: 3009,
        message: "로그인 되어있지 않습니다",
    },
    RESTAURANT_ID_NOT_EXIST: {
        isSuccess: false,
        code: 3010,
        message: "존재하지 않는 restaurantIdx입니다",
    },
    VISITED_LIMIT_EXCEEDED: {
        isSuccess: false,
        code: 3011,
        message: "같은식당은 하루 한번만 등록가능합니다",
    },
    VISITED_ID_NOT_EXIST: {
        isSuccess: false,
        code: 3012,
        message: "존재하지 않는 visitedIdx 입니다",
    },
    VISITED_USER_NOT_MATCH: {
        isSuccess: false,
        code: 3013,
        message: "해당유저의 가봤어요가 아닙니다",
    },
    REVIEW_ID_NOT_EXIST: {
        isSuccess: false,
        code: 3014,
        message: "존재하지 않는 reviewIdx입니다",
    },
    REVIEW_USER_NOT_MATCH: {
        isSuccess: false,
        code: 3015,
        message: "리뷰 작성자 idx와 로그인유저의 idx가 일치하지 않습니다",
    },
    COMMENT_ID_NOT_EXIST: {
        isSuccess: false,
        code: 3016,
        message: "존재하지 않는 commentIdx입니다",
    },
    COMMENT_USER_NOT_MATCH: {
        isSuccess: false,
        code: 3017,
        message: "댓글 작성자 idx와 로그인유저의 idx가 일치하지 않습니다",
    },
    USER_LOGIN_EMPTY: {
        isSuccess: false,
        code: 3018,
        message: "로그인 상태가 아닙니다",
    },
    STAR_NOT_EXIST: {
        isSuccess: false,
        code: 3019,
        message: "등록된 가고싶다가 아닙니다",
    },
    ORDERNO_NOT_EXIST: {
        isSuccess: false,
        code: 3020,
        message: "존재하지 않는 주문번호입니다",
    },
    EatDeal_ID_NOT_EXIST: {
        isSuccess: false,
        code: 3021,
        message: "존재하지 않는 eatDealIdx입니다",
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
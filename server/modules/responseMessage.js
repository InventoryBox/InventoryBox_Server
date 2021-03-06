module.exports = {
    // 재고량 추이
    GRAPH_NO_DATA: "해당 날짜에 입력된 데이터가 존재하지 않습니다.",
    GRAPH_SAME_DATE: "첫번째와 동일한 날짜를 선택하실 수 없습니다.",
    GRAPH_HOME_SUCCESS: "전체 아이템에 대한 한달 그래프 정보 전달 성공",
    GRAPH_DOUBLE_SUCCESS: "한 아이템에 대한 두 주의 그래프 정보 전달 성공",
    GRAPH_SINGLE_SUCCESS: "한 아이템에 대한 한 달 그래프 정보 전달 성공",
    GRAPH_UPDATE_SUCCESS: "아이템 기본 설정 변경 성공",
    NULL_VALUE: '필요한 값이 없습니다',

    // 위치 관련 정보
    ADD_LOC_SUCCESS: '유저에 위치관련정보 업데이트 성공',
    NO_LOC_INFO: '유저 사업장 위치 정보 없음',
    NO_POSTS: '등록된 게시글 없음',
    POSTS_BY_DISTANCE_SUCCESS: '거리순 게시글 전달 성공',
    OUT_OF_VALUE: '파라미터 값이 잘못되었습니다',

    // 유저 ( Auth )
    AUTH_UPDATE_PW_SUCCESS:"패스워드 업데이트 성공",
    AUTH_EMAIL_SUCCESS:'이메일 보내기 성공',
    AUTH_EMAIL_FAIL:'이메일 보내기 실패',
    AUTH_CREATED_USER: '회원 가입 성공',
    AUTH_SIGNUP_EMAIL_AND_PASSWORD_SUCCESS:"이메일 패스워드 등록 성공",
    AUTH_GET_ALL_NICK_NAME_SUCCESS:'모든 유저 닉네임 가져오기 성공',
    AUTH_SIGNUP_PERSONAL_INFO_SUCCESS:'개인정보 등록 성공',
    AUTH_SIGNUP_PROFILE_INFO_SUCCESS:'프로필 등록 성공',
    AUTH_SIGNUP_ASSIGN_SUCCESS:'회원 승인 성공',
    AUTH_USER_IDX_NULL:"유저 인덱스가 올바르지 않습니다",
    AUTH_DUPLICATED_NICKNAME:'닉네임이 중복됐습니다',
    AUTH_DUPLICATED_EMAIL:'이메일이 중복됐습니다',
    AUTH_UPDATE_PROFILE_SUCCESS:'유저 프로필 업데이트 성공',
    AUTH_UPDATE_PERSONAL_INFO_SUCCESS:'개인정보 업데이트 성공',
    AUTH_UPLOAD_PROFILE_IMG_SUCCESS:'프로필 이미지 등록 성공',
    AUTH_TYPE_ERROR:'이미지 타입 에러',
    AUTH_CHECK_NICKNAME_SUCCESS:"닉네임이 중복되지 않았습니다",
    AUTH_CHECK_NICKNAME_FAIL:"닉네임이 중복됐습니다",
    AUTH_GET_USER_SUCCESS: '유저 조회 성공',
    AUTH_GET_USER_POST_SUCCESS:'유저가 쓴 게시글 가져오기 성공',
    AUTH_NOT_EXIST:"존재하지 않는 계정입니다",
    
    DELETE_USER: '회원 탈퇴 성공',
    ALREADY_ID: '이미 사용중인 아이디입니다.',
    AUTH_DUPLICATED_EMAIL: '이메일이 중복됐습니다',

    POST_SUCCESS: '게시글 조회 성공',
    SALT_PASSWORD_SUCCESS: '비밀번호 및 SALT값 넣기 성공',

    //아이템
    ITEM_NULL_USER_IDX:"유저 인덱스가 올바르지 않습니다",
    ITEM_NULL_VALUE:"필요한 값이 없습니다",
    ITEM_UPDATE_MEMO_COUNT_SUCCESS: '재고 메모 업데이트 성공',
    ITEM_GET_ITEM_INFO_SUCCESS: '아이템 정보 가져오기 성공',
    ITEM_PUSH_FLAG_SUCCESS: 'flag 업데이트 성공',
    DUMMY:'재고창고 화이팅',

    // 로그인
    LOGIN_SUCCESS: '로그인 성공',
    LOGIN_FAIL: '로그인 실패',
    NO_USER: '존재하지 않는 회원입니다.',
    MISS_MATCH_PW: '비밀번호가 맞지 않습니다.',

    // 인증
    EMPTY_TOKEN: '토큰 값이 없습니다.',
    EXPIRED_TOKEN: '토큰 값이 만료되었습니다.',
    INVALID_TOKEN: '유효하지 않은 토큰값입니다.',
    AUTH_SUCCESS: '인증에 성공했습니다.',
    ISSUE_SUCCESS: '새로운 토큰이 생성되었습니다.',
    FIND_EMAIL_SUCCESS: '가입된 이메일을 성공적으로 찾았습니다',
    NICKNAME_AND_PICTURE_SUCCESS: '닉네임과 사진 가져오기 성공',
    DELETE_SUCCESS: '유저 삭제 성공',
    

    // 프로필 조회
    READ_PROFILE_SUCCESS: '프로필 조회 성공',
    GET_FIVE_DAYS_SUCCESS: '5일간 정보 가져오기 성공',
    DB_ERROR: 'DB 오류',

    //재고기록
    RECORD_HOME_SUCCESS: '재고기록 홈화면 조회 성공',
    RECORD_ITEMADD_VIEW_SUCCESS: "재료추가 화면 조회 성공",
    RECORD_ITEMADD_DB_SUCCESS: "재료추가 저장 성공",
    RECORD_SEARCH_CATEGORY_SUCCESS: "카테고리 정보 조회 성공",
    RECORD_TODAY_VIEW_SUCCESS: "오늘 재고 기록하기 화면 조회 성공",
    RECORD_MODIFY_ITEM_SUCCESS: "재료 재고량 변경 성공",
    RECORD_DELETE_ITEM_SUCCESS: "재료 삭제 성공",
    RECORD_ADD_CATEGORY_SUCCESS: "카테고리 추가 성공",
    RECORD_MODIFY_VIEW_SUCCESS: "기록수정 화면 조회 성공",
    RECORD_DELETE_CATEGORY_SUCCESS : "카테고리 삭제 성공",
    RECORD_MOVE_CATEGORY_SUCCESS : "카테고리 이동 성공",

    //재고교환
    //성공
    EXCHANGE_HOME_SUCCESS: "재고교환 홈 성공",
    EXCHANGE_POST_VIEW_SUCCESS: "게시글 조회 성공",
    EXCHANGE_USER_INFO_SUCCESS: "사용자 정보 조회 성공",
    EXCHANGE_POST_SAVE_SUCCESS: "게시글 등록 성공",
    EXCHANGE_MODIFY_ISSOLD_SUCCESS: "판매여부 변경 완료",
    EXCHANGE_MODIFY_LIKE_SUCCESS: "좋아요 여부 변경 완료",
    EXCHANGE_POST_SEARCH_SUCCESS: "게시글 검색 완료",
    EXCHANGE_SEARCH_USER_LIKE_POST_SUCCESS: "사용자 찜목록 조회 완료",
    RECORD_NULL_VALUES: '파라미터 값이 없습니다.',
    EXCHANGE_POST_MODIFY_SUCCESS : "게시글 수정 완료",
    EXCHANGE_SEARCH_USER_POST_SUCCESS : "사용자 작성 게시글 조회 완료",
    EXCHANGE_DELETE_POST_SUCCESS : "게시글 삭제 완료",
    EXCHANGE_MODIFY_POST_SUCCESS : "게시글 수정화면 조회 완료",

    //실패
    EXCHANGE_POST_NULL : "해당 게시글이 없습니다.",
};
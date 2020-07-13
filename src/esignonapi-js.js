// const domain = "http://localhost:8080";
const domain = "https://docs.esignon.net";
/** Start : 유틸정의 Utils ### ########################################### [TK Yoon 2020-06-23 16:23:46] */
/* #################################################################################################### */
//null 이예요?
const isNull = function(str) {
    if(str !== "" && str !== "undefined" && str !== undefined && str !== null && str !== 'null') {
        return false;

    } else {
        return true;

    }
}

//null이 아니예요?
const isNotNull = function(str) {
    return !isNull(str);
}
/* ################################################################################################## */
/** End : 유틸정의 Utils ### ########################################### [TK Yoon 2020-06-23 16:23:46] */


/** Start : Request 객체 생성, Create Request Object ##################### [TK Yoon 2020-06-23 16:23:46] */
/* #################################################################################################### */
const RequestHeader = function(accessToken) {
    this['Content-Type'] = "application/json";
    if(isNotNull(accessToken)) {
        this.Authorization = `esignon ${accessToken}`;
    }
};

const EsignonRequest = function(header, body) {
	this.header = header;
    this.body = body;
};

const EsignonRequestHeader = function(reqeustCode, version) {
	this.request_code = reqeustCode;

    //버전정보
	if(version == null || version == undefined || version == "" || version == "null" ) {
		this.version = "9.9.99";

	} else {
		this.version = version;

	}
}
/* ################################################################################################## */
/** End : Request 객체 생성, Create Request Object ##################### [TK Yoon 2020-06-23 16:23:46] */


/** Strat : 인증토큰 발급 : https://api.esignon.net/issued/token ####### [TK Yoon 2020-06-24 08:37:21] */
/* ################################################################################################## */
//Request body 생성, Create Request body
const RequestBodyAccessToken = function(email, password) {
    this.memb_email = email;
    this.memb_pwd = password;
}

/** 인증토큰 발급
 * @param companyId 회사아이디 : 이싸이온 설정 > 회사프로필 메뉴에서 확인할 수 있습니다.(회사 개설한 사람-리더직책만 가능)
 * @param email 사용자 가입 이메일 : 로그인할때 사용하는 이메일
 * @param password 사용자 비밀번호 
 * @param language API Response.header.result_msg를 선택언어로 표시
 * [TK Yoon 2020-06-23 13:43:57] */
const getAccessToken = async function(companyId, email, password, language) {
    if(isNull(companyId)) {
        throw 'getAccessToken.companyId value is required.';
    }

    if(isNull(email)) {
        throw 'getAccessToken.email value is required.';
    }

    if(isNull(password)) {
        throw 'getAccessToken.password value is required.';
    }

    if(isNull(language)) {
        language = 'ko';

    } else {
        language = language.substring(0, 2);

    }

    let requestJson = new EsignonRequest(new EsignonRequestHeader("1001Q"), new RequestBodyAccessToken(email, password));

    //API호출
    let response = await axios({
        url         : `${domain}/api/${companyId}/login?lang=${language}`,
        method      : "POST",
        headers     : new RequestHeader(),
        data        : requestJson
    });

    response.res = response.data
    response.req = requestJson;
    return response;
};
/* ################################################################################################## */
/** End : 인증토큰 발급 : https://api.esignon.net/issued/token ######### [TK Yoon 2020-06-24 08:37:21] */


/** Strat : 비대면 계약 시작 : https://api.esignon.net/workflow/start/nonfacestart [TK Yoon 2020-06-24 08:37:21] */
/* ############################################################################################################ */
/** 비대면 계약 시작 Reqeust.Body.body [TK Yoon 2020-06-23 14:58:28] */
const RequestBodyStartSimple = function(senderEmail, workflowName, docId, playerList, comment, fieldList, customerList, exportApiInfo, language) {
    this.memb_email = senderEmail;          //필수 : 보내는사람 이메일
    this.biz_id = "0";                      //자동 : 부서아이디(초기값 : 0(회사))
    this.workflow_name = workflowName;      //필수 : 문서명
    this.doc_id = docId;                    //필수 : 서식아이디
    this.player_list = playerList;          //필수 : 받는사람
    this.comment = comment;                 //옵션 : 전달할 메시지
    this.field_list = fieldList;            //옵션 : 박스에 기본값을 입력할 경우 
    this.customer_list = customerList;      //옵션 : 참조자
    //this.export_api_info = exportApiInfo;   //옵션 : 단계별 Response 받고자 할 경우
    this.language = language;               //옵션 : 언어(한국어:ko-KR, English:en, 日本語:ja)
}

/** 작성할 사람 설정 [TK Yoon 2020-06-23 16:00:40] */
const SetPlayer = function(emailOrMobileNo, name, language) {
    if(isNull(emailOrMobileNo)){
        throw 'SetPlayer.emailOrMobileNo value is required.';
    }

    if(isNull(name)){
        throw 'SetPlayer.name value is required.';
    }

    if(isNull(language)){
        language = "ko-KR";
    }

    this.field_owner = "1"                                  //자동 : 작성순서(1부터 숫자로 입력)
    this.email = emailOrMobileNo;                           //필수 : 받는사람 이메일 또는 휴대폰 번호
    this.name = name;                                       //필수 : 받는 사람 이름
    this.language = language;                               //옵션 : 이메일 발송 언어(한국어:ko-KR, English:en-US, 日本語:ja-JP)
}

/** 작성할 사람 설정 - 휴대폰인증 [TK Yoon 2020-06-25 13:21:19] */
const SetPlayerCertMobile = function(emailOrMobileNo, name, certMobileNumber, language) {
    if(isNull(emailOrMobileNo)){
        throw 'SetPlayerCertMobile.emailOrMobileNo value is required.';
    }

    if(isNull(name)){
        throw 'SetPlayerCertMobile.name value is required.';
    }

    if(isNull(certMobileNumber)){
        throw 'SetPlayerCertMobile.certMobileNumber value is required.';
    }

    if(isNull(language)){
        language = "ko-KR";
    }

    this.field_owner = "1"                                  //자동 : 작성순서(1부터 숫자로 입력)
    this.email = emailOrMobileNo;                           //필수 : 받는사람 이메일 또는 휴대폰 번호
    this.name = name;                                       //필수 : 받는 사람 이름
    this.mobile_number = certMobileNumber;                  //옵션 : 휴대폰 본인인증 휴대폰 번호
    this.language = language;                               //옵션 : 이메일 발송 언어(한국어:ko-KR, English:en-US, 日本語:ja-JP)
}

/** 작성할 사람 설정 - 비밀번호인증 [TK Yoon 2020-06-25 13:21:19] */
const SetPlayerCertPassword = function(emailOrMobileNo, name, certPassword, certPasswordHint, language) {
    if(isNull(emailOrMobileNo)){
        throw 'SetPlayerCertPassword.emailOrMobileNo value is required.';
    }

    if(isNull(name)){
        throw 'SetPlayerCertPassword.name value is required.';
    }

    if(isNull(certPassword)){
        throw 'SetPlayerCertPassword.certPassword value is required.';
    }

    if(isNull(language)){
        language = "ko-KR";
    }

    this.field_owner = "1"                                  //자동 : 작성순서(1부터 숫자로 입력)
    this.email = emailOrMobileNo;                           //필수 : 받는사람 이메일 또는 휴대폰 번호
    this.name = name;                                       //필수 : 받는 사람 이름
    this.password = certPassword;                           //옵션 : 비밀번호 인증 비밀번호
    this.password_hint = certPasswordHint;                  //옵션 : 비밀번호 인증 힌트
    this.language = language;                               //옵션 : 이메일 발송 언어(한국어:ko-KR, English:en-US, 日本語:ja-JP)
}

/** 작성할 사람 설정 - 휴대폰인증 + 비밀번호인증 [TK Yoon 2020-06-25 13:21:19] */
const SetPlayerCertMobilePassword = function(emailOrMobileNo, name, certMobileNumber, certPassword, certPasswordHint, language) {
    if(isNull(emailOrMobileNo)) {
        throw 'SetPlayerCertMobilePassword.emailOrMobileNo value is required.';
    }

    if(isNull(name)){
        throw 'SetPlayerCertMobilePassword.name value is required.';
    }

    if(isNull(certMobileNumber)){
        throw 'SetPlayerCertMobilePassword.certMobileNumber value is required.';
    }

    if(isNull(certPassword)){
        throw 'SetPlayerCertMobilePassword.certPassword value is required.'
    }

    if(isNull(language)){
        language = "ko-KR";
    }

    this.field_owner = "1"                                  //자동 : 작성순서(1부터 숫자로 입력)
    this.email = emailOrMobileNo;                           //필수 : 받는사람 이메일 또는 휴대폰 번호
    this.name = name;                                       //필수 : 받는 사람 이름
    this.mobile_number = certMobileNumber;                  //옵션 : 휴대폰 본인인증 휴대폰 번호
    this.password = certPassword;                           //옵션 : 비밀번호 인증 비밀번호
    this.password_hint = certPasswordHint;                  //옵션 : 비밀번호 인증 힌트
    this.language = language;                               //옵션 : 이메일 발송 언어(한국어:ko-KR, English:en-US, 日本語:ja-JP)
}

/** 박스값을 입력하여 발송 [TK Yoon 2020-07-07 15:37:56] */
const SetFieldList = function(fieldName, fieldValue) {
    if(isNull(fieldName)){
        throw 'SetFieldList.fieldName value is required.';
    }

    if(isNull(fieldValue)){
        throw 'SetFieldList.fieldValue value is required.';
    }

    this.field_name = fieldName;                            //필수 : 박스이름
    this.field_value = fieldValue;                          //필수 : 박스값
}

/** 참조자 설정 [TK Yoon 2020-07-10 14:45:58] */
const SetCustomerList = function(email, name, language) {
    if(isNull(email)){
        throw 'SetCustomerList.email value is required.';
    }

    if(isNull(name)){
        throw 'SetCustomerList.name value is required.';
    }

    if(isNull(language)){
        language = "ko-KR";
    }

    this.email = email;                                       //필수 : 이메일
    this.name = name;                                         //필수 : 이름
    this.language = language;                                 //옵션 : 이메일 발송 언어(한국어:ko-KR, English:en-US, 日本語:ja-JP)
}

/** 
 * 비대면 계약을 전송합니다.
 * @param accessToken 인증토큰 getAccessToken함수를 이용하여 발급받은 토큰
 * @param companyId 회사아이디 회사아이디 : 이싸이온 설정 > 회사프로필 메뉴에서 확인할 수 있습니다.(회사 개설한 사람-리더직책만 가능)
 * @param senderEmail 보내는 사람 이메일
 * @param workflowName 보내는 문서(계약서) 제목
 * @param docId 서식아이디
 * @param language msg 표시 언어
 * @param playerList (Array) 작성하는 사람들
 *  [TK Yoon 2020-06-24 08:22:23] */
const startNonfaceWorkflow = async function(accessToken, companyId, senderEmail, workflowName, docId, playerList, comment, fieldList, customerList, language) {
    if(isNull(accessToken)) {
        throw 'startNonfaceWorkflow.accessToken value is required.';
    }

    if(isNull(companyId)) {
        throw 'startNonfaceWorkflow.companyId value is required.';
    }

    if(isNull(senderEmail)) {
        throw 'startNonfaceWorkflow.senderEmail value is required.';
    }

    if(isNull(workflowName)) {
        throw 'startNonfaceWorkflow.workflowName value is required.';
    }

    if(isNull(docId)) {
        throw 'startNonfaceWorkflow.docId value is required.';
    }

    if(isNull(playerList)) {
        throw 'startNonfaceWorkflow.playerList value is required.';
    }

    if(isNull(language)) {
        language = 'ko-KR';
    }

    //작성자 순서 자동 등록
    for (let index = 0; index < playerList.length; index++) {
        playerList[index].field_owner = (index + 1);
    }

    const requestJson = new EsignonRequest(new EsignonRequestHeader("5005Q"), new RequestBodyStartSimple(senderEmail, workflowName, docId, playerList, comment, fieldList, customerList, "", language));

    //spring locale
    language = language.substring(0, 2);

    //API호출
    const response = await axios({
        url         : `${domain}/api/${companyId}/startsimple?lang=${language}`,
        method      : "POST",
        headers     : new RequestHeader(accessToken),
        data        : requestJson
    });

    response.res = response.data
    response.req = requestJson;
    return response;
};
/** End : 비대면 계약 시작 : https://api.esignon.net/workflow/start/nonfacestart [TK Yoon 2020-06-24 08:37:21] */
/* ########################################################################################################## */

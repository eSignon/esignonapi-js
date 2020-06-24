const domain = "http://localhost:8080";
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
const RequestBodyAccessToken = function(clientId, email, password) {
    this.client_id = clientId;
    this.memb_email = email;
    this.memb_pwd = password;
}

/** 인증토큰 발급
 * @param clientId 클라이언트 아이디(발급요청 카카오톡 http://pf.kakao.com/_WKXeT/chat, 전화 02-6299-5926)
 * @param companyId 회사아이디 : 이싸이온 설정 > 회사프로필 메뉴에서 확인할 수 있습니다.(회사 개설한 사람-리더직책만 가능)
 * @param email 사용자 가입 이메일 : 로그인할때 사용하는 이메일
 * @param password 사용자 비밀번호 
 * [TK Yoon 2020-06-23 13:43:57] */
const getAccessToken = async function(clientId, companyId, email, password) {
    if(isNull(clientId)) {
        alert('clientId value is required.');
        return;
    }

    if(isNull(companyId)) {
        alert('companyId value is required.');
        return;
    }

    if(isNull(email)) {
        alert('email value is required.');
        return;
    }

    if(isNull(password)) {
        alert('password value is required.');
        return;
    }

    //API호출
    const response = await axios({
        url         : `${domain}/api/${companyId}/login`,
        method      : "POST",
        headers     : new RequestHeader(),
        data        : new EsignonRequest(new EsignonRequestHeader("1001Q"), new RequestBodyAccessToken(clientId, email, password))
    });
    return response.data;
};
/* ################################################################################################## */
/** End : 인증토큰 발급 : https://api.esignon.net/issued/token ######### [TK Yoon 2020-06-24 08:37:21] */


/** Strat : 비대면 계약 시작 : https://api.esignon.net/workflow/start/nonfacestart [TK Yoon 2020-06-24 08:37:21] */
/* ############################################################################################################ */
/** 비대면 계약 시작 Reqeust.Body.body [TK Yoon 2020-06-23 14:58:28] */
const RequestBodyStartSimple = function(clientId, companyId, email, workflowName, docId, playerList, comment, language, fieldList, customerList, exportApiInfo) {
    this.client_id = clientId;              //필수 : 클라이언트 아이디
    this.comp_id = companyId;               //필수 : 회사 아이디
    this.biz_id = "0";                      //자동 : 부서아이디(초기값 : 0(회사))
    this.memb_email = email;                //필수 : 받는사람 이메일(휴대폰번호)
    this.workflow_name = workflowName;      //필수 : 문서명
    this.doc_id = docId;                    //필수 : 서식아이디
    this.player_list = playerList;          //필수 : 받는사람
    this.language = language;               //옵션 : 언어(초기값 : ko-KR(한글))
    this.comment = comment;                 //옵션 : 전달할 메시지
    this.field_list = fieldList;            //옵션 : 박스에 기본값을 입력할 경우 
    this.customer_list = customerList;      //옵션 : 참조자
    this.export_api_info = exportApiInfo;   //옵션 : 단계별 Response 받고자 할 경우
}

/** 작성할 사람 설정 [TK Yoon 2020-06-23 16:00:40] */
const StartSimplePlayer = function(emailOrMobileNo, name, certMobileNumber, certPassword, certPasswordHint, language) {
    this.field_owner = "1"                                  //자동 : 작성순서(1부터 숫자로 입력)
    this.email = emailOrMobileNo;                           //필수 : 받는사람 이메일 또는 휴대폰 번호
    this.name = name;                                       //필수 : 받는 사람 이름
    this.mobile_number = certMobileNumber;                  //옵션 : 휴대폰 본인인증 휴대폰 번호
    this.password = certPassword;                           //옵션 : 비밀번호 인증 비밀번호
    this.password_hint = certPasswordHint;                  //옵션 : 비밀번호 인증 힌트
    this.language = language;                               //옵션 : 언어(초기값 : ko-KR(한글))
}

/** 
 * 비대면 계약을 전송합니다.
 * @param accessToken 인증토큰 getAccessToken함수를 이용하여 발급받은 토큰
 * @param companyId 회사아이디 회사아이디 : 이싸이온 설정 > 회사프로필 메뉴에서 확인할 수 있습니다.(회사 개설한 사람-리더직책만 가능)
 * @param clientId 클라이언트 아이디(발급요청 카카오톡 http://pf.kakao.com/_WKXeT/chat, 전화 02-6299-5926)
 * @param email 보내는 사람 이메일
 * @param workflowName 보내는 문서(계약서) 제목
 * @param docId 서식아이디
 * @param playerList (Array) 작성하는 사람들
 *  [TK Yoon 2020-06-24 08:22:23] */
const startContract = async function(accessToken, clientId, companyId, email, workflowName, docId, playerList) {
    if(isNull(accessToken)) {
        alert('accessToken value is required.');
        return;
    }

    if(isNull(clientId)) {
        alert('clientId value is required.');
        return;
    }

    if(isNull(companyId)) {
        alert('companyId value is required.');
        return;
    }

    if(isNull(email)) {
        alert('email value is required.');
        return;
    }

    if(isNull(workflowName)) {
        alert('workflowName value is required.');
        return;
    }

    if(isNull(docId)) {
        alert('docId value is required.');
        return;
    }

    if(isNull(playerList)) {
        alert('playerList value is required.');
        return;
    }

    //작성자 순서 자동 등록
    for (let index = 0; index < playerList.length; index++) {
        playerList[index].field_owner = (index + 1);
    }

    //API호출
    const response = await axios({
        url         : `${domain}/api/${companyId}/startsimple`,
        method      : "POST",
        headers     : new RequestHeader(accessToken),
        data        : new EsignonRequest(new EsignonRequestHeader("5005Q"), new RequestBodyStartSimple(clientId, companyId, email, workflowName, docId, playerList))
    });

    return response.data;
};
/** End : 비대면 계약 시작 : https://api.esignon.net/workflow/start/nonfacestart [TK Yoon 2020-06-24 08:37:21] */
/* ########################################################################################################## */


const StartSimpleField = function() {
    // this.email = "";
    // this.memb_id_type = "";
    // this.name = "";
    // this.language = "ko-KR"
}

const StartSimpleCustomer = function() {
    // this.field_owner = "1"
    // this.email = "";
    // this.memb_id_type = "";
    // this.name = "";
    // this.language = "ko-KR"
    // this.enable_mobile_cert = "false";
    // this.mobile_number = ""
    // this.enable_password_cert = "false";
    // this.password_hint = "";
    // this.password = "";
}

const StartSimpleExportApi = function() {
    // this.field_owner = "1"
    // this.email = "";
    // this.memb_id_type = "";
    // this.name = "";
    // this.language = "ko-KR"
    // this.enable_mobile_cert = "false";
    // this.mobile_number = ""
    // this.enable_password_cert = "false";
    // this.password_hint = "";
    // this.password = "";
}
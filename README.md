# esignonapi-js.js

> eSignon API JavaScript Library는 eSignon Rest API를 더욱 쉽게 사용하기 위해 제공하는 자바스크립트 라이브러리입니다.


- [eSignon Homepage](https://esignon.net)
- [eSignon Service Website](https://docs.esignon.net)
- [eSignon API Website](https://api.esignon.net)


## Main

```text
src/
└── esignonapi-js.js (CommonJS, default)
```

## Getting started

### Installation

In browser:

```html

<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js"></script>
<script src="/path/to/esignonapi-js.min.js"></script>
```

### Usage

#### 0. 임시회원가입
API를 이용하기에 앞서 이싸인온 멤버에 가입해야 합니다.  
이미 API 요금제에 가입된 회원은 다음단계로 진행하세요.  
가입하지 않은 고객은 testapi회사 테스트계정에 멤버로 가입하기 위해 아래 링크를 클릭해주세요.  
<a href="https://docs.esignon.net/testapi/invite" target="_blank">멤버가입하기</a>  
> 링크를 통해 가입하셨다면 로그인할때 회사이름에 `testapi`를 입력해주세요.

***

#### 1. 인증토큰 발급
API를 이용하기 위한 사용자 인증 토큰을 발행합니다.  
인증토큰은 인증토큰 발행 API를 제외한 모든 API를 호출할때 Request header.Authoriaztion에 넣어줘야만 합니다.  
[인증토큰 발급 REST API 문서 확인](https://api.esignon.net/issued/token)

```js
getAccessToken(:companyId, :email, :password, :language);
```

- **companyId (필수)**
  - Type: `String`
  - 회사 아이디
  - `(결제전 테스트 고객)` testapi

- **email (필수)**
  - Type: `String`
  - 이싸인온 가입 이메일(아이디)

- **password (필수)**
  - Type: `String`
  - 이싸인온 아이디 비밀번호

- **language (옵션)**
  - Type: `String`
  - 언어(한국어:ko-KR, English:en-US, 日本語:ja-JP)
  - API Response.header.result_msg를 선택한 언어로 표시합니다.

#### Example

```js
async function getEsignonAccessToken() {

  try {
    
    //Call API
    const retData = await getAccessToken(
      "testapi"                //companyId
      , "guide@esignon.net"    //email
      , "guide12345*"          //password
      , "ko-KR"                //language(한국어:ko-KR, English:en-JS, 日本語:ja-JP)
    );

    //Request
    console.log('req', retData.req);

    //Response
    console.log('res', retData.res);

    //Success
    if(retData.res.header.result_code == '00') {
      accessToken = retData.res.body.access_token;        //access token
      console.log('accessToken', accessToken);

    //Fail
    } else {
      //Do Something
      alert(retData.res.header.result_msg);

    }

  } catch (error) {
    console.log(error);
    alert(error);

  }
    
}
```

#### Demo
[인증토큰 발행 Demo](https://rawcdn.githack.com/eSignon/esignonapi-js/5fed9986e1452716bd14b9f5fcc8f8c0e246633f/demo/demo_access_token.html)


***

#### 2. 비대면 계약 시작
문서(계약)를 작성해야 하는 사람에게 이메일 또는 카카오톡(SMS)으로 계약을 보냅니다.  
인증토큰을 발행한 사람이 보내는 사람으로 설정됩니다.  
[비대면 계약 시작 REST API 문서 확인](https://api.esignon.net/workflow/start/nonfacestart)

```js
startNonfaceWorkflow(:accessToken, :companyId, :workflowName, :docId, :playerList, :comment, :fieldList, :customerList, :language);
```
- **accessToken (필수)**
  - Type: `String`
  - 인증토큰

- **companyId (필수)**
  - Type: `String`
  - 회사 아이디
  - `(결제전 테스트 고객)` testapi

- **senderEmail (필수)**
  - Type: `String`
  - 보내는 사람 이메일(이싸인온 가입자)

- **workflowName (필수)**
  - Type: `String`
  - 보내는 문서(계약)명

- **docId (필수)**
  - Type: `String`
  - 서식아이디
  - [이싸인온](https://docs.esignon.net)에 로그인 후 서식메뉴에서 서식을 생성하거나, 목록에서 서식아이디를 확인할 수 있습니다.
  - [비대면 서식만드는 방법 동영상 확인](https://youtu.be/Hwngs2Fqy3E)

- **playerList (필수)**
  - Type: `Array`
  - 문서 작성자
  - 작성자가 여러명인 경우 배열에 앞선 사람이 먼저 작성하게 됩니다.
  - 작성자수는 서식의 문서작성자 수와 일치해야 하며 서식의 문서작성자 수는 서식메뉴 목록에서 확인할 수 있습니다.
  - 1명이 작성할 경우
    ```js
      let playerList = new Array();
      playerList.push(new SetPlayer(
          :emailOrMobileNo, //이메일주소 또는 휴대폰번호
          :name             //작성자 이름
      ));
    ```  
  - 2명이 작성할 경우
    ```js
      let playerList = new Array();
      playerList.push(new SetPlayer(:emailOrMobileNo, :name)); //첫번째 작성자
      playerList.push(new SetPlayer(:emailOrMobileNo, :name)); //두번째 작성자
    ```  
  - 작성자에게 휴대폰 본인 인증을 요청하는 경우
    ```js
      let playerList = new Array();
      playerList.push(new SetPlayerCertMobile(
        :emailOrMobileNo,   //이메일주소 또는 휴대폰번호
        :name,              //작성자 이름
        :certMobileNumber   //휴대폰본인인증 - 휴대폰번호
      ));
    ```  
  - 작성자에게 비밀번호 인증을 요청하는 경우
    ```js
      let playerList = new Array();
      playerList.push(new SetPlayerCertPassword(
        :emailOrMobileNo,   //이메일주소 또는 휴대폰번호
        :name,              //작성자 이름
        :certPassword,      //비밀번호인증 - 비밀번호
        :certPasswordHint   //비밀번호인증 - 힌트
      ));
    ```  
  - 작성자에게 휴대폰 본인 인증과, 비밀번호 인증을 요청하는 경우
    ```js
      let playerList = new Array();
      playerList.push(new SetPlayerCertMobilePassword(
        :emailOrMobileNo,   //이메일주소 또는 휴대폰번호
        :name,              //작성자 이름
        :certMobileNumber,  //휴대폰본인인증 - 휴대폰번호
        :certPassword,      //비밀번호인증 - 비밀번호
        :certPasswordHint   //비밀번호인증 - 힌트
      ));
    ```  

- **comment (옵션)**
  - Type: `String`
  - 전달메시지
  - 작성자들에게 전달할 메시지를 입력합니다.

- **fieldList (옵션)**
  - Type: `Array`
  - 초기 입력값
  - 서식에 생성된 라디오박스, 체크박스, 텍스트박스, 라벨박스의 값을 입력합니다.
  - 라디오박스, 체크박스의 경우 체크할 경우 fieldValue에 Y로 입력합니다.
  ```js
      let fieldList = new Array();
      fieldList.push(new SetFieldList(
        :fieldName,     //박스이름
        :fieldValue,    //박스에 입력할 값
      ));
  ```
- **customerList (옵션)**
  - Type: `Array`
  - 참조할 사람
  - 문서를 참조할 사람을 여려명 지정할 수 있습니다.
  ```js
      let customerList = new Array();
      fieldList.push(new SetCustomerList(
        :email,       //이메일주소
        :name,        //받는 사람 이름
      ));
  ```
- **language (옵션)**
  - Type: `String`
  - 언어(한국어:ko-KR, English:en-US, 日本語:ja-JP)
  - 선택한 언어로 이메일을 발송합니다.
  - API Response.header.result_msg를 선택한 언어로 표시합니다.


#### Example) 3명이 작성하는 문서를 보내는 경우
> 두번째 작성자는 휴대폰본인인증을 요청, 세번째 작성자는 비밀번호인증을 요청
```js
async function startEsignonContract() {
    
    try {

      //작성할 사람 설정
      let playerList = new Array();

      //첫번째 작성자(이메일로 전달받음)
      playerList.push(new SetPlayer('guide@esignon.net', '이싸인온'); 

      //두번째 작성자(카카오톡으로 전달받음) - 휴대폰본인인증 요청
      playerList.push(new SetPlayerCertMobile('0101231234', '홍길동', '0101231234')); 

      //세번째 작성자(이메일로 전달받음) - 비밀번호인증 요청
      playerList.push(new SetPlayerCertPassword('tkyoon@jcone.co.kr', 'TK Yoon', '19991024', '생년월일 6자리'));

      //계약(문서) 전송
      const retData = await startNonfaceWorkflow(
        accessToken,                   //인증토큰
        'testapi',                     //회사아이디
        'tkyoon@jcone.co.kr',          //보내는 사람 이메일
        '2020년 근로계약서_홍길동',     //문서(계약)명
        '1',                           //서식아이디
        playerList                     //문서작성자
      );

      //Request
      console.log('Request', retData.req);

      //Response
      console.log('Response', retData.res);
      
      //Success
      if(retData.res.header.result_code == '00') {
        //Do Something
          

      //Fail
      } else {
        //Do Something
        alert(retData.res.header.result_msg);

      }

    } catch (error) {
      console.log(error);
      alert(error);

    }
    
}
```

#### Example) 1명이 작성하는 문서에 이름이라는 텍스트박스에 미리 홍길동이라고 입력하여, 참조자 1명을 추가하여 보내는 경우
> 작성자(홍길동)가 계약서를 받았을 경우 이름 입력란에는 이미 홍길동이 입력되어 계약서를 받습니다.
```js
async function startEsignonContract() {
    
    try {

      //작성할 사람 설정
      let playerList = new Array();

      //첫번째 작성자(이메일로 전달받음)
      playerList.push(new SetPlayer('guide@esignon.net', '홍길동'); 

      //초기 입력값 설정
      let fieldList = new Array();
      fieldList.push(new SetFieldList('이름', '홍길동'));

      //참조자 1명 추가
      let customerList = new Array();
      customerList.push(new SetCustomerList('jc1@jcone.co.kr', '제이씨원'));

      //계약(문서) 전송
      const retData = await startNonfaceWorkflow(
        accessToken,                    //인증토큰
        'testapi',                      //회사아이디
        'tkyoon@jcone.co.kr',           //보내는 사람 이메일
        '2020년 근로계약서_홍길동',       //문서(계약)명
        '1',                            //서식아이디
        playerList,                     //문서작성자
        '서명요청드려요',                //전달 메시지
        '',                             //초기 입력값
        customerList                    //참조자
      );

      //Request
      console.log('Request', retData.req);

      //Response
      console.log('Response', retData.res);
      
      //Success
      if(retData.res.header.result_code == '00') {
        //Do Something

      //Fail
      } else {
        //Do Something
        alert(retData.res.header.result_msg);

      }

    } catch (error) {
      console.log(error);
      alert(error);

    }
    
}
```

#### Demo
[비대면 계약 시작 Demo](https://rawcdn.githack.com/eSignon/esignonapi-js/5fed9986e1452716bd14b9f5fcc8f8c0e246633f/demo/start_nonface_workflow.html)

***

## License

[MIT](https://opensource.org/licenses/MIT)

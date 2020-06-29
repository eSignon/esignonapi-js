# esignonapi-js.js

> eSignon API JavaScript Library는 eSignon Rest API를 더욱 쉽게 사용하기 위해 제공하는 자바스크립트 라이브러리입니다.


- [eSignon Homepage](https://esignon.net)
- [eSignon Service Website](https://docs.esignon.net)
- [eSignon API Website](https://api.esignon.net)


## Main

```text
dist/
├── esignonapi-js.min.js   (compressed)
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
[인증토큰 발급 REST API 문서 확인](https://app.gitbook.com/@jc1jedoc/s/esignon/issued/token)

```js
getAccessToken(:companyId, :email, :password, :language);
```

- **companyId**
  - Type: `String`
  - 회사 아이디
  - `(결제전 테스트 고객)` testapi

- **email**
  - Type: `String`
  - 이싸인온 가입 이메일(아이디)

- **password**
  - Type: `String`
  - 이싸인온 아이디 비밀번호

- **language**
  - Type: `String`
  - 언어(한국어:ko, English:en, 日本語:ja)
  - API Response.header.result_msg를 선택한 언어로 표시합니다.

#### Example

```js
async function getEsignonAccessToken() {

  try {
    
    //Call API
    const res = await getAccessToken(
      "testapi"                //companyId
      , "guide@esignon.net"    //email
      , "guide12345*"          //password
      , "ko"                   //language(한국어:ko, English:en, 日本語:ja)
    );

    //Response
    console.log('res', res);

    //Success
    if(res.header.result_code == '00') {
      accessToken = res.body.access_token;        //access token
      console.log('accessToken', accessToken);

    //Fail
    } else {
      //TODO Something
      alert(res.header.result_msg);

    }

  } catch (error) {
    console.log(error);
    alert(error);

  }
    
}
```

#### Demo
[인증토큰 발행 Demo](https://raw.githack.com/eSignon/esignonapi-js/master/demo/demo_access_token.html)


***

#### 2. 비대면 계약 시작
문서(계약)를 작성해야 하는 사람에게 이메일 또는 카카오톡(SMS)으로 보냅니다.  
인증토큰을 발행한 사람이 보내는 사람으로 설정됩니다.  
[비대면 계약 시작 REST API 문서 확인](https://app.gitbook.com/@jc1jedoc/s/esignon/workflow/start/nonfacestart)

```js
startNonfaceWorkflow(:accessToken, :companyId, :workflowName, :docId, :playerList);
```
- **accessToken**
  - Type: `String`
  - 인증토큰

- **companyId**
  - Type: `String`
  - 회사 아이디
  - `(결제전 테스트 고객)` testapi

- **workflowName**
  - Type: `String`
  - 보내는 문서(계약)명

- **docId**
  - Type: `String`
  - 서식아이디
  - [이싸인온](https://docs.esignon.net)에 로그인 후 서식메뉴에서 서식을 생성하거나, 목록에서 서식아이디를 확인할 수 있습니다.
  - [비대면 서식만드는 방법 동영상 확인](https://youtu.be/Hwngs2Fqy3E)

- **language**
  - Type: `String`
  - 언어(한국어:ko, English:en, 日本語:ja)
  - 선택한 언어로 이메일을 발송합니다.
  - API Response.header.result_msg를 선택한 언어로 표시합니다.

- **playerList**
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
      const res = await startNonfaceWorkflow(
        accessToken,                   //인증토큰
        'testapi',                     //회사아이디
        '2020년 근로계약서_홍길동',     //문서(계약)명
        '1',                           //서식아이디
        playerList                     //문서작성자
      );

      //결과값
      console.log('res', res);
      
      //Success
      if(res.header.result_code == '00') {
        //TODO Something
          

      //Fail
      } else {
        //TODO Something
        alert(res.header.result_msg);

      }

    } catch (error) {
      console.log(error);
      alert(error);

    }
    
}
```

#### Demo
[비대면 계약 시작 Demo](https://raw.githack.com/eSignon/esignonapi-js/master/demo/start_nonface_workflow.html)

***

## License

[MIT](https://opensource.org/licenses/MIT)

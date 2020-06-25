# esignonapi-js.js

> eSignon API JavaScript Library

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
이미 가입된 회원은 다음단계로 진행하세요.  
가입하지 않은 고객은 testapi 회사에 멤버로 가입하기 위해 아래 링크를 클릭해주세요.  
<a href="https://docs.esignon.net/testapi/invite" target="_blank">멤버가입하기</a>

#### 1. 인증토큰발행
API를 이용하기 위한 사용자 인증 토큰을 발행합니다.

```js
getAccessToken(:clientId, :companyId, :email, :password);
```

- **clientId**
  - Type: `String`
  - 클라이언트 아이디
  - `(결제전 테스트 고객)` *C9E7513F88CF918AC0C393B3CF14F9CF26F70017
  - `(API요금제를 결제한 고객)` 발급요청 카카오톡 http://pf.kakao.com/_WKXeT/chat 또는 전화 02-6299-5926

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

#### Example

```js
async function getEsignonAccessToken() {
    let res = await getAccessToken(
        "*C9E7513F88CF918AC0C393B3CF14F9CF26F70017" //cliendId
      , "testapi"                                   //companyId
      , "guide@esignon.net"                         //email
      , "guide12345*"                               //password
    );
    console.log('res', res);

    //Success
    if(res.header.result_code == '00') {
        accessToken = res.body.access_token;
        console.log('accessToken', accessToken);

    //Fail
    } else {
        //TODO Something
        alert(res.header.result_msg);

    }
}
```

#### 2. 비대면 계약 시작
API를 이용하기 위한 사용자 인증 토큰을 발행합니다.

```js
getAccessToken(:clientId, :companyId, :email, :password);
```

- **clientId**
  - Type: `String`
  - 클라이언트 아이디
  - `(결제전 테스트 고객)` *C9E7513F88CF918AC0C393B3CF14F9CF26F70017
  - `(API요금제를 결제한 고객)` 발급요청 카카오톡 http://pf.kakao.com/_WKXeT/chat 또는 전화 02-6299-5926

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

#### Example

```js
async function getEsignonAccessToken() {
    let res = await getAccessToken(
        "*C9E7513F88CF918AC0C393B3CF14F9CF26F70017" //cliendId
      , "testapi"                                   //companyId
      , "guide@esignon.net"                         //email
      , "guide12345*"                               //password
    );
    console.log('res', res);

    //Success
    if(res.header.result_code == '00') {
        accessToken = res.body.access_token;
        console.log('accessToken', accessToken);

    //Fail
    } else {
        //TODO Something
        alert(res.header.result_msg);

    }
}
```

## License

[MIT](https://opensource.org/licenses/MIT)

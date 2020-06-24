# esignonapi-js.js

> JavaScript eSignon API Library

- [eSignon Homepage](https://esignon.net)
- [eSignon Service Website](https://docs.esignon.net)
- [eSignon API Website](https://api.esignon.net)


## Main

```text
dist/
├── esignonapi-js.min.js   (compressed)
├── esignonapi-js.js (CommonJS, default)
```

## Getting started

### Installation

In browser:

```html

<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js"></script>
<script src="/path/to/esignonapi-js.min.js"></script>
```

### Usage

#### 1. 인증토큰발행
API를 이용하기 위한 사용자 인증 토큰을 발행합니다.

```js
getAccessToken(:clientId, :companyId, :email, :password);
```

- **cliendId**
  - Type: `String`
  - 클라이언트 아이디

- **companyId**
  - Type: `String`
  - 회사 아이디

- **email**
  - Type: `String`
  - 이싸인온 가입 이메일(아이디)

- **password**
  - Type: `String`
  - 이싸인온 아이디 비밀번호

#### Example

```js
async function getEsignonAccessToken() {
    let res = await getAccessToken(:clientId, :companyId, :email, :password);
    console.log('res', res);

    //Success
    if(res.header.result_code == '00') {
        accessToken = res.body.access_token;
        console.log('accessToken', accessToken);
        startEsignonContract();

    //Fail
    } else {
        //TODO Something
        alert(res.header.result_msg);

    }
}
```


## License

[MIT](https://opensource.org/licenses/MIT)

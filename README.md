# 고인물테스트 프론트엔드
고인물테스트의 프론트엔드입니다.

## 빌드방법
1. node.js를 설치한다.
1. (최초 혹은 의존성에 변화가 있을 때에만) `npm i`를 실행한다.
1. `npm run build-api-client -- -p (OpenAPI 파일 주소)`를 실행한다.
    - 참고: 백엔드 서버가 꺼져있을 시 오류가 발생한다.
    - OpenAPI 파일 주소 예시: `http://127.0.0.1:1234/v3/api-docs`
1. `Main/src/api/api_http_client/http-client.ts` 파일에서 `credentials: "same-origin"`을 `credentials: "include"`로 수정한다.
1. `build.env` 파일을 후술된 **`dev.env`/`build.env` 내용** 문단을 참고하여 적절하게 수정한다.
1. `npm run build`을 실행한다.
1. 끝

## watch하는 방법
1. node.js를 설치한다.
1. (최초 혹은 의존성에 변화가 있을 때에만) `npm i`를 실행한다.
1. `npm run build-api-client -- -p (OpenAPI파일 주소)`를 실행한다.
    - 참고: 백엔드 서버가 꺼져있을 시 오류가 발생한다.
    - OpenAPI 파일 주소 예시: `http://127.0.0.1:1234/v3/api-docs`
1. `Main/src/api/api_http_client/http-client.ts` 파일에서 `credentials: "same-origin"`을 `credentials: "include"`로 수정한다.
1. `dev.env` 파일을 후술된 **`dev.env`/`build.env` 내용** 문단을 참고하여 적절하게 수정한다.
1. `npm run dev`을 실행한다.
1. 끝

## `dev.env`/`build.env` 내용
- `KAKAO_API_KEY`: 카카오 개발자 API 키
- `BACKEND_URL`: 백엔드 서버 주소 (예시: `http://api.example.com`)

### 예시
```
KAKAO_API_KEY=abcd0123abcd0123abcd0123abcd0123
BACKEND_URL=http://backend.example.com
```

## 빌드 결과
빌드된 결과물은 `Main/dist` 디렉토리에 생성된다.

## 저작권
### 욕설/비속어 데이터
- [korean-bad-words](https://github.com/doublems/korean-bad-words) by Doublem.org, Licensed under MIT License
- [badwords-ko](https://github.com/yoonheyjung/badwords-ko) By Michael Price, Licensed under MIT License
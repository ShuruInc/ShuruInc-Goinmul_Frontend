# 고인물테스트 프론트엔드
고인물테스트의 프론트엔드입니다.

## 빌드방법
1. node.js를 설치한다.
1. (최초 혹은 의존성에 변화가 있을 때에만) `npm i`를 실행한다.
1. `npm run build-api-client (OpenAPI 파일 주소)`를 실행한다.
    - 참고: 백엔드 서버가 꺼져있을 시 오류가 발생한다.
    - Windows에서는 PowerShell이 설치되어 있어야 한다.
    - OpenAPI 파일 주소 예시: `http://127.0.0.1:1234/v3/api-docs`
1. `build.env` 파일을 후술된 **`dev.env`/`build.env` 내용** 문단을 참고하여 적절하게 수정한다.
1. `npm run build`을 실행한다.
1. 끝

## watch하는 방법
watch를 하면 파일 내용이 바뀔 때 자동으로 재컴파일되므로 개발에 편리하다.
1. node.js를 설치한다.
1. (최초 혹은 의존성에 변화가 있을 때에만) `npm i`를 실행한다.
1. `npm run build-api-client (OpenAPI파일 주소)`를 실행한다.
    - 참고: 백엔드 서버가 꺼져있을 시 오류가 발생한다.
    - Windows에서는 PowerShell이 설치되어 있어야 한다.
    - OpenAPI 파일 주소 예시: `http://127.0.0.1:1234/v3/api-docs`
1. `dev.env` 파일을 후술된 **`dev.env`/`build.env` 내용** 문단을 참고하여 적절하게 수정한다.
1. `npm run dev`을 실행한다.
1. 끝

## `dev.env`/`build.env` 내용
- `KAKAO_API_KEY`: 카카오 개발자 API 키
- `BACKEND_URL`: 백엔드 서버 주소 (예시: `http://api.example.com`)
- `DEBUG_NERD_TEST_EXIT_FEAT`: `true` 혹은 `false` 값, 디버깅을 위해 존재하는 옵션으로, 프로덕션에서는 `false`로 하면 된다. `true`일 시 고인물 테스트 중 `exitNerdTest` 함수를 브라우저 내에서 호출하여 남은 시간 및 남은 문제의 갯수와 상관없이 고인물 테스트를 종료할 수 있다.
- `DEBUG_RANDOM_MEDAL`: `true` 혹은 `false` 값, `true`일시 고인물 테스트 결과에서 메달이 무작위로 뜹니다.
- `DEBUG_ALWAYS_DISPLAY_1ST_WINNER_EMAIL_INPUT_MODAL`: `true` 혹은 `false` 값, `true`일시 고인물 테스트 결과에서 1등 이메일 입력 모달창이 표시됩니다.
- `DEBUG_ALWAYS_DISPLAY_COMBO`: `true` 혹은 `false` 값, `true`일시 0연속 콤보도 표시됩니다.
- `NODE_ENV`: 배포면 `production`, 개발이면 `development`입니다.

### 예시
```
KAKAO_API_KEY=abcd0123abcd0123abcd0123abcd0123
BACKEND_URL=http://backend.example.com
DEBUG_NERD_TEST_EXIT_FEAT=false
DEBUG_RANDOM_MEDAL=false
DEBUG_ALWAYS_DISPLAY_1ST_WINNER_EMAIL_INPUT_MODAL=false
DEBUG_ALWAYS_DISPLAY_COMBO=false
NODE_ENV=production
```

## 빌드 결과
빌드된 결과물은 `Main/dist` 디렉토리에 생성된다.

## 저작권
### 욕설/비속어 데이터
- [korean-bad-words](https://github.com/doublems/korean-bad-words) by Doublem.org, Licensed under MIT License
- [badwords-ko](https://github.com/yoonheyjung/badwords-ko) By Michael Price, Licensed under MIT License

### 이미지
 - 카카오톡 로고 이미지 By 카카오
 - [Handmade paper - seamless texture](https://www.deviantart.com/strapaca/art/Handmade-paper-seamless-texture-782082592) By Strapaca, Licensed under CC BY 3.0
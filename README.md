# 빌드방법
1. node.js를 설치한다.
1. (최초 혹은 의존성에 변화가 있을 때에만) `npm i`를 실행한다.
1. `npm run build-api-client -- -p (API 백엔드 주소)`를 실행한다.
    - API 백엔드 주소 예시: `http://127.0.0.1:1234/v3/api-docs`
1. `npm run build`을 실행한다.
1. 끝

## watch하는 방법
1. node.js를 설치한다.
1. (최초 혹은 의존성에 변화가 있을 때에만) `npm i`를 실행한다.
1. `npm run build-api-client -- -p (API 백엔드 주소)/v3/api-docs`를 실행한다.
1. `npm run dev`을 실행한다.
1. 끝

# 서버 열때 참고사항
서버 열때 `Main/dist` 디렉토리가 서버루트가 되게 열어주세요.
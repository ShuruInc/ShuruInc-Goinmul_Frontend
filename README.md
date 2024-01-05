# Sass 파일 컴파일 방법
1. [Sass 공식홈페이지](https://sass-lang.com/install/)에 나온 방법에 따라 Sass를 설치합니다. (라이브러리 설치하는 거 아님! Command Line 프로그램을 설치하세요.)
1. 레포의 루트 폴더에서 `sass --watch Main/styles:Main/dist/assets/css`를 실행합니다. (`-style=compressed` 매개변수를 같이 주면 css 압축도 같이 해줍니다.)
1. 이제 scss파일이 수정되면 자동으로 컴파일됩니다. 끝!
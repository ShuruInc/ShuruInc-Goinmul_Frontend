import { QuizResult } from "../api/quiz_session";

type GetResultShareDataParameters = {
    url: string;
    isNerdTest: boolean;
    result: QuizResult;
    imageFile: File;
};

const getResultShareData = ({
    url,
    isNerdTest,
    result,
    imageFile,
}: GetResultShareDataParameters) => ({
    webShare: {
        url,
        title: `[${result.category}] ${
            isNerdTest ? "고인물 테스트" : "모의고사"
        }`,
        text: `내 성적표 등장 ‼\n⬇ 풀어... 보시겠어요? ⬇`,
        files: [imageFile],
    },
    kakao: {
        title: `[${result.category}] ${
            isNerdTest ? "고인물 테스트" : "모의고사"
        }`,
        content: `내 성적표 등장 ‼\n⬇ 풀어... 보시겠어요? ⬇`,
        buttonText: "나도 풀어보기",
        url,
    },
    twitter: {
        text: `[${result.title}] ${isNerdTest ? "고인물 테스트" : "모의고사"}

내 성적표 등장 ‼
내 성적표 등장 ‼
내 성적표 등장 ‼
내 성적표 등장 ‼
내 성적표 등장 ‼
내 성적표 등장 ‼

⬇ 풀어... 보시겠어요? ⬇
🔗 ${url}
#고인물테스트 #슈르네`,
    },
    image: imageFile,
});

export default getResultShareData;

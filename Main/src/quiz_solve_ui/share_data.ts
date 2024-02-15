import { QuizSessionInfo } from "../api/quiz_session";

export default function createShareData(sessionInfo: QuizSessionInfo) {
    const quizUrl = `https://example.com/quiz/solve.html?id=${sessionInfo.quizId}`;
    return {
        twitter: {
            text: `[${sessionInfo.category}] ${
                sessionInfo.isNerdTest ? "고인물 테스트" : "모의고사"
            }

모르겠어요... 도와주세요 🚨
모르겠어요... 도와주세요 🚨
모르겠어요... 도와주세요 🚨
모르겠어요... 도와주세요 🚨
모르겠어요... 도와주세요 🚨
모르겠어요... 도와주세요 🚨

🔗 ${quizUrl}
#고인물테스트 #슈르네`,
        },
        kakao: {
            title: `[${sessionInfo.category}] ${
                sessionInfo.isNerdTest ? "고인물 테스트" : "모의고사"
            }`,
            content: "모르겠어요... 도와주세요 🚨\n⬇⬇⬇⬇⬇",
            buttonText: "나도 풀어보기",
            url: quizUrl,
        },
        webShare: {
            url: quizUrl,
            title: `[${sessionInfo.category}] ${
                sessionInfo.isNerdTest ? "고인물 테스트" : "모의고사"
            }`,
            text: "모르겠어요... 도와주세요 🚨",
        },
        image: new File(
            [new Blob([""], { type: "iamge/png" })],
            "problem.png",
            {
                type: "image/png",
            },
        ),
    };
}

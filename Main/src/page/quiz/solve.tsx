import { useState } from "react";
import PostBoardApiClient from "../../api/posts";
import { QuizApiClient } from "../../api/quiz";
import { QuizSession } from "../../api/quiz_session";
import NerdTestEntryPageView from "../../nerd_test_entry_ui/page";
import SolvePage from "../../quiz_solve_ui/solve_page";
import { createRoot } from "react-dom/client";

const params = new URLSearchParams(location.search);
const quizId = params.get("id");
const sessionId = params.get("session");

const root = createRoot(document.body);

type NerdTestEntryPageProp = { quizId: string; title: string };

function NerdTestEntryPage({ quizId, title }: NerdTestEntryPageProp) {
    const [session, setSession] = useState<QuizSession | null>(null);

    return session ? (
        <SolvePage
            session={session}
            onResultPageRequest={() => {
                location.href =
                    "/quiz/solve.html?session=" + session.getSessionId();
            }}
        ></SolvePage>
    ) : (
        <NerdTestEntryPageView
            title={title}
            onEnterButtonClick={async (nickname, age, gender) => {
                await QuizApiClient.sendStatistics(gender ?? null, age ?? null);
                setSession(
                    await QuizApiClient.startNerdQuiz(
                        quizId,
                        await {
                            nickname,
                            email: "example@example.com",
                        },
                    ),
                );
            }}
        ></NerdTestEntryPageView>
    );
}

const initByQuizId = async (quizId: string) => {
    await PostBoardApiClient.hit(quizId);
    const isNerdTest = await QuizApiClient.isNerdTest(quizId);
    const title = await QuizApiClient.getQuizTitle(quizId);

    if (isNerdTest) {
        root.render(
            <NerdTestEntryPage
                title={title}
                quizId={quizId}
            ></NerdTestEntryPage>,
        );
    } else {
        initSolvePage(await QuizApiClient.startQuiz(quizId));
    }
};

const initSolvePage = (session: QuizSession) => {
    root.render(
        <SolvePage
            session={session}
            onResultPageRequest={() => {
                location.href =
                    "/quiz/solve.html?session=" + session.getSessionId();
            }}
        ></SolvePage>,
    );
};

if (quizId === null) {
    location.href = "/";
} else if (sessionId !== null) {
    const session = new QuizSession(sessionId);
    session.sessionInfo().then((info) => {
        if (info.isNerdTest) {
            initByQuizId(quizId!);
        } else {
            // (모의고사) 세션 id가 주어졌다면 바로 퀴즈를 시작한다.
            initSolvePage(session);
        }
    });
} else {
    initByQuizId(quizId!);
}

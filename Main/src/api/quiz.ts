import { QuizProblem } from "../quiz-solve-ui";
import {
    getDummyProblemData,
    initDummyProblemData,
} from "./dummy_data/problems";

type QuizSessionId = string;

type QuizResult = {
    quizId: string;
    points: number;
    title: string;
    ranking?: number;
    percentage?: number;
} & (
    | {
          ranking: number;
      }
    | {
          percentage: number;
      }
);

type QuizSessionInfo = {
    isNerdTest: boolean;
    totalProblemCount?: number;
    startedAt?: Date;
};

type QuizSessionInternalDummyData = {
    quizId: string;
    problemIndex: number;
    points: number;
    nerdTest: boolean;
    email: string;
    nickname: string;
    startedAt: number;
};

export class QuizSession {
    private sessionId: string = "";
    constructor(sessionId: QuizSessionId) {
        this.sessionId = sessionId;
    }
    private getDummyInteralSession(): QuizSessionInternalDummyData {
        return JSON.parse(
            localStorage.getItem(`session-${this.sessionId}`) ?? "{}"
        );
    }
    private saveDummyInternalSession(session: QuizSessionInternalDummyData) {
        localStorage.setItem(
            `session-${this.sessionId}`,
            JSON.stringify(session)
        );
    }
    private dummyProblems() {
        return getDummyProblemData(this.getDummyInteralSession().quizId);
    }
    private ended() {
        return (
            this.getDummyInteralSession().problemIndex >=
                this.dummyProblems().length ||
            (this.getDummyInteralSession().nerdTest &&
                Date.now() - this.getDummyInteralSession().startedAt >
                    1000 * 60 * 5)
        );
    }
    async sessionInfo(): Promise<QuizSessionInfo> {
        return {
            isNerdTest: this.getDummyInteralSession().nerdTest,
            startedAt: new Date(this.getDummyInteralSession().startedAt),
            totalProblemCount: this.getDummyInteralSession().nerdTest
                ? undefined
                : this.dummyProblems().length,
        };
    }
    async currentProblem(): Promise<(QuizProblem & { index: number }) | null> {
        return this.ended()
            ? null
            : {
                  ...this.dummyProblems()[
                      this.getDummyInteralSession().problemIndex
                  ],
                  index: this.getDummyInteralSession().problemIndex + 1,
              };
    }
    async submit(answer: string): Promise<boolean> {
        console.log(answer);
        console.log(
            this.dummyProblems()[this.getDummyInteralSession().problemIndex]
        );
        let correct =
            this.dummyProblems()[this.getDummyInteralSession().problemIndex]
                .answer === answer;

        let newProblemIndex = this.getDummyInteralSession().problemIndex + 1;
        let newPoints =
            this.getDummyInteralSession().points + (correct ? 10 : 0);
        this.saveDummyInternalSession({
            ...this.getDummyInteralSession(),
            problemIndex: newProblemIndex,
            points: newPoints,
        });

        return correct;
    }
    async result(): Promise<QuizResult | null> {
        return this.ended()
            ? {
                  points: this.getDummyInteralSession().points,
                  title: "어 쩌 구 저 쩌 구 고사",
                  quizId: this.getDummyInteralSession().quizId,
                  ...(this.getDummyInteralSession().nerdTest
                      ? { ranking: Math.ceil(Math.random() * 10) }
                      : {
                            percentage: Math.round(Math.random() * 100),
                        }),
              }
            : null;
    }
    getSessionId(): string {
        return this.sessionId;
    }
}

export class QuizApiClient {
    static async isNerdTest(id: string): Promise<boolean> {
        return id.includes("nerd");
    }

    static async startQuiz(id: string): Promise<QuizSession> {
        initDummyProblemData(id);
        const sessionId = Date.now() + "-" + Math.floor(Math.random() * 5000);
        localStorage.setItem(
            `session-${sessionId}`,
            JSON.stringify({
                quizId: id,
                problemIndex: 0,
                points: 0,
                nerdTest: false,
                email: "",
                nickname: "",
                startedAt: Date.now(),
            })
        );

        return new QuizSession(sessionId);
    }
    static async startNerdQuiz(
        id: string,
        info: { nickname: string; email: string }
    ): Promise<QuizSession> {
        initDummyProblemData(id);
        const sessionId = Date.now() + "-" + Math.floor(Math.random() * 5000);
        localStorage.setItem(
            `session-${sessionId}`,
            JSON.stringify({
                quizId: id,
                problemIndex: 0,
                points: 0,
                nerdTest: true,
                ...info,
                startedAt: Date.now(),
            })
        );

        return new QuizSession(sessionId);
    }
}

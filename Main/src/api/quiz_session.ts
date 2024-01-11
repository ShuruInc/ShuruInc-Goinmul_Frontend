import { QuizProblem } from "../quiz-solve-ui";
import { getDummyProblemData } from "./dummy_data/problems";
import StopWatch from "../stopwatch";

type QuizSessionId = string;

type QuizResult = {
    quizId: string;
    points: number;
    title: string;
    hashtag?: string;
    nickname?: string;
    ranking?: number;
    percentage?: number;
} & (
    | {
          ranking: number;
          hashtag: string;
          nickname: string;
      }
    | {
          percentage: number;
      }
);

type QuizSessionInfo = {
    isNerdTest: boolean;
    totalProblemCount?: number;
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
    private stopwatch: StopWatch;
    constructor(sessionId: QuizSessionId) {
        this.sessionId = sessionId;
        this.stopwatch = new StopWatch(sessionId);
        this.stopwatch.start();
    }
    getStopWatch() {
        return this.stopwatch;
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
            this.dummyProblems().length
        );
    }
    async sessionInfo(): Promise<QuizSessionInfo> {
        return {
            isNerdTest: this.getDummyInteralSession().nerdTest,
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
        return this.ended() || this.getDummyInteralSession().nerdTest
            ? {
                  points: this.getDummyInteralSession().points,
                  title: "어 쩌 구 저 쩌 구 고사",
                  quizId: this.getDummyInteralSession().quizId,
                  ...(this.getDummyInteralSession().nerdTest
                      ? {
                            ranking: Math.ceil(Math.random() * 10),
                            hashtag: Math.round(
                                Math.random() * 9999
                            ).toString(),
                            nickname: this.getDummyInteralSession().nickname,
                        }
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

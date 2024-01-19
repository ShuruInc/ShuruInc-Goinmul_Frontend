import { backendUrl } from "../env";
import { QuizProblem } from "../quiz_solve_ui";
import StopWatch from "../stopwatch";
import { Api } from "./api_http_client/ApiHttpClient";

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
    quizId: string;
    title: string;
};

export type QuizInternalSessionData = {
    quizId: string;
    title: string;
    problemIndex: number;
    points: number;
    nerdTest: boolean;
    email: string;
    nickname: string;
    startedAt: number;
};

const apiClient = new Api({ baseUrl: backendUrl });

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
    private getLocalSession(): QuizInternalSessionData {
        return JSON.parse(
            localStorage.getItem(`session-${this.sessionId}`) ?? "{}",
        );
    }
    private saveLocalSession(session: QuizInternalSessionData) {
        localStorage.setItem(
            `session-${this.sessionId}`,
            JSON.stringify(session),
        );
    }
    private problems() {
        return JSON.parse(
            localStorage.getItem(`problems-${this.getLocalSession().quizId}`) ??
                "[]",
        ) as QuizProblem[];
    }
    private ended() {
        return this.getLocalSession().problemIndex >= this.problems().length;
    }
    async sessionInfo(): Promise<QuizSessionInfo> {
        return {
            isNerdTest: this.getLocalSession().nerdTest,
            totalProblemCount: this.getLocalSession().nerdTest
                ? undefined
                : this.problems().length,
            quizId: this.getLocalSession().quizId,
            title: this.getLocalSession().title,
        };
    }
    async currentProblem(): Promise<(QuizProblem & { index: number }) | null> {
        return this.ended()
            ? null
            : {
                  ...this.problems()[this.getLocalSession().problemIndex],
                  index: this.getLocalSession().problemIndex + 1,
              };
    }
    async submit(answer: string): Promise<boolean> {
        let correct = (
            await apiClient.api.getAnswers((await this.currentProblem())!.id!, {
                answer,
            })
        ).data.result!.correct!;

        let newProblemIndex = this.getLocalSession().problemIndex + 1;
        let newPoints = this.getLocalSession().points + (correct ? 10 : 0);
        this.saveLocalSession({
            ...this.getLocalSession(),
            problemIndex: newProblemIndex,
            points: newPoints,
        });

        return correct;
    }
    async result(): Promise<QuizResult | null> {
        return this.ended() || this.getLocalSession().nerdTest
            ? {
                  points: this.getLocalSession().points,
                  title: this.getLocalSession().title,
                  quizId: this.getLocalSession().quizId,
                  ...(this.getLocalSession().nerdTest
                      ? {
                            ranking: Math.ceil(Math.random() * 10),
                            hashtag: Math.round(
                                Math.random() * 9999,
                            ).toString(),
                            nickname: this.getLocalSession().nickname,
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

import { backendUrl } from "../env";
import { QuizProblem } from "../quiz_solve_ui";
import StopWatch from "../stopwatch";
import { Api } from "./api_http_client/Api";

type QuizSessionId = string;

type QuizResult = {
    quizId: string;
    points: number;
    title: string;
    hashtag?: string;
    nickname?: string;
    ranking?: number;
    percentage?: number;
    category: string;
    comment: string;
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
    category: string;
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
    postedRank: boolean;
    hashtag: string;
    category: string;
    ranking: {
        comment: string;
        percentage: number;
        rank: number;
    } | null;
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
        return (
            this.getLocalSession().problemIndex >= this.problems().length ||
            (this.getLocalSession().nerdTest &&
                this.stopwatch.elapsed() >= 1000 * 60 * 5)
        );
    }
    async sessionInfo(): Promise<QuizSessionInfo> {
        return {
            isNerdTest: this.getLocalSession().nerdTest,
            totalProblemCount: this.getLocalSession().nerdTest
                ? undefined
                : this.problems().length,
            quizId: this.getLocalSession().quizId,
            title: this.getLocalSession().title,
            category: this.getLocalSession().category,
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
    async submit(answer: string, subjective: boolean): Promise<boolean> {
        let correct = (
            await apiClient.getAnswers((await this.currentProblem())!.id!, {
                answer,
                problemType: subjective ? "SUBJECTIVE" : "MULTIPLE_CHOICE",
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
    async postRank(): Promise<void> {
        const localSession = this.getLocalSession();
        if (localSession.postedRank) return;

        const result = await apiClient.postRank({
            articleId: parseInt(localSession.quizId),
            articleType: localSession.nerdTest ? "NERD" : "NORMAL",
            score: localSession.points,
        });

        this.saveLocalSession({
            ...localSession,
            postedRank: true,
            hashtag: result.data!.result!.nicknameHashtag!,
            ranking: {
                comment: result.data!.result!.comment!,
                percentage: result.data!.result!.percentile!,
                rank: result.data!.result!.rank!,
            },
        });
    }
    async getImageLinks(): Promise<string[]> {
        return this.problems()
            .filter((i) => i.figureType === "image")
            .map((i) => i.figure);
    }
    async result(): Promise<QuizResult | null> {
        const ended = this.ended();
        if (ended) {
            await this.postRank();
            return {
                points: this.getLocalSession().points,
                title: this.getLocalSession().title,
                quizId: this.getLocalSession().quizId,
                category: this.getLocalSession().category,
                comment: this.getLocalSession().ranking!.comment ?? "",
                ...(this.getLocalSession().nerdTest
                    ? {
                          ranking: this.getLocalSession().ranking!.rank,
                          hashtag: this.getLocalSession().hashtag,
                          nickname: this.getLocalSession().nickname,
                      }
                    : {
                          percentage:
                              this.getLocalSession().ranking!.percentage,
                      }),
            };
        } else {
            return null;
        }
    }
    getSessionId(): string {
        return this.sessionId;
    }
}

type TimerInternalState = Partial<{
    /**
     * 스톱워치가 시작한 타임스탬프
     */
    startedAt: number;
    /**
     * 스톱워치가 흐른 시간에서 빼야하는 값 (밀리초)
     */
    negativeDelta: number;
    /**
     * 스톱워치가 일시정지한 타임스탬프
     */
    pausedAt: number;
    /**
     * 스톱워치가 정지한 타임스탬프
     */
    stoppedAt: number;
}>;

/**
 * 브라우저 내장 스토리지를 이용한 간단한 스톱워치
 */
export default class StopWatch {
    private id: string;
    constructor(id: string) {
        this.id = id;
    }

    private getInternalState(): TimerInternalState {
        return JSON.parse(localStorage.getItem(`stopwatch-${this.id}`) ?? "{}");
    }
    private setInternalState(state: TimerInternalState) {
        localStorage.setItem(`stopwatch-${this.id}`, JSON.stringify(state));
    }

    start() {
        if (typeof this.getInternalState().startedAt === "undefined")
            this.setInternalState({
                ...this.getInternalState(),
                startedAt: Date.now(),
            });
    }
    pause() {
        this.setInternalState({
            ...this.getInternalState(),
            pausedAt: Date.now(),
        });
    }
    resume() {
        let state = this.getInternalState();
        if (typeof state.pausedAt === "undefined") return;

        // 스톱워치가 일시정지된 시간동안 negativeDelta가 늘어난다.
        state.negativeDelta =
            (state.negativeDelta ?? 0) + (Date.now() - state.pausedAt);
        delete state.pausedAt;

        this.setInternalState(state);
    }
    stop() {
        this.setInternalState({
            ...this.getInternalState(),
            stoppedAt: Date.now(),
        });
    }
    elapsed() {
        /**
         * 동작중이라면: 지금 시각 - 시작한 시각 - negativeDelta
         * 정지했다면: 정지한 시각 - 시작한 시각 - negativeDelta
         * 일시정지했다면: 일지정지한 시각 - 시작한 시각 - negativeDelta
         *   (일시정지하는 동안 시간은 흘러가지 않으므로!)
         */
        const state = this.getInternalState(),
            now = Date.now();
        return (
            (state.stoppedAt ?? state.pausedAt ?? now) -
            (state.startedAt ?? now) -
            (state.negativeDelta ?? 0)
        );
    }
}

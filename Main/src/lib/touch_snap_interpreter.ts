type TouchVelocityCalculatorEventType =
    /**
     * 터치 드래그가 시작됨
     */
    | "dragstart"
    /**
     * 터치 드래그가 진행중임
     */
    | "dragmove"
    /**
     * 터치 드래그가 종료됨
     */
    | "dragend";

function isIgnorable(elem: Element) {
    let now: HTMLElement | null =
        elem.nodeType === elem.ELEMENT_NODE
            ? (elem as HTMLElement)
            : elem.parentElement;
    while (now !== null) {
        if (
            (now.classList.contains("portfrait") &&
                now.classList.contains("post-table")) ||
            now.classList.contains("more")
        )
            return true;
        now = now.parentElement;
    }
    return false;
}

/**
 * 가로 방향 터치의 속도를 계산해줍니다.
 */
export default class TouchVelocityCalculator {
    private element: HTMLElement;
    private velocity: number | null = null;
    private dragging = false;
    private startingPos: [number, number] | null = null;
    private referenceXpos: number | null = null;
    private referenceTimestamp: number | null = null;
    private currentXpos: number | null = null;
    private currentYpos: number | null = null; // 가로방향 터치여부 판단에 이용된다.
    private intervalId: NodeJS.Timeout | null = null;
    private horizontal: boolean | null = null;
    private listeners: {
        [key in TouchVelocityCalculatorEventType]: Function[];
    } & {
        dragstart: (() => void)[];
        dragmove: ((deltaX: number) => void)[];
        dragend: ((speed: number) => void)[];
    } = {
        dragend: [],
        dragmove: [],
        dragstart: [],
    };
    private ignore = false;

    constructor(element: HTMLElement) {
        this.element = element;

        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.calculateVelocity = this.calculateVelocity.bind(this);

        this.element.addEventListener("touchstart", this.onTouchStart);
        this.element.addEventListener("touchmove", this.onTouchMove);
        this.element.addEventListener("touchend", this.onTouchEnd);
        this.element.addEventListener("touchcancel", this.onTouchEnd);
    }

    addEventListner(
        type: TouchVelocityCalculatorEventType,
        listener: Function,
    ) {
        this.listeners[type].push(listener);
    }

    private onTouchStart(evt: TouchEvent) {
        if (this.ignore || isIgnorable(evt.target as Element) || this.dragging)
            return;
        this.dragging = true;
        this.referenceXpos = evt.targetTouches[0].screenX;
        this.referenceTimestamp = Date.now();
        this.currentXpos = null;
        this.currentYpos = null;
        this.velocity = 0;
        this.horizontal = null;
        this.startingPos = [
            evt.targetTouches[0].screenX,
            evt.targetTouches[0].screenY,
        ];

        if (this.intervalId !== null && !this.ignore)
            clearInterval(this.intervalId);

        this.intervalId = setInterval(this.calculateVelocity, 100);
    }

    private calculateVelocity() {
        let timestampNow = Date.now();
        if (!this.dragging) return;
        if (
            this.horizontal === null &&
            this.currentXpos !== null &&
            this.currentYpos !== null
        ) {
            this.horizontal = this.isAngleHorizontal(
                this.currentXpos - this.startingPos![0],
                this.currentYpos - this.startingPos![1],
            );
            if (this.horizontal) {
                this.listeners.dragstart.forEach((i) => i());
            }
        }

        if (this.dragging && this.horizontal) {
            let currentXpos = this.currentXpos;
            let delta =
                (currentXpos ?? this.referenceXpos!) - this.referenceXpos!;
            let v =
                (delta / (1 + (timestampNow - this.referenceTimestamp!))) * 100;
            this.velocity = 0.8 * v + 0.2 * (this.velocity ?? 0);
            this.referenceTimestamp = timestampNow;
            this.referenceXpos = currentXpos;
            if (delta !== 0 && !this.ignore)
                this.listeners.dragmove.forEach((i) => i(delta));
        }
    }

    private onTouchMove(evt: TouchEvent) {
        if (evt.target)
            if (this.dragging && this.horizontal) evt.preventDefault();
        this.currentXpos = evt.targetTouches[0].screenX;
        this.currentYpos = evt.targetTouches[0].screenY;
    }

    private onTouchEnd(evt: TouchEvent) {
        if (evt.targetTouches.length !== 0) return;
        if (this.dragging && this.horizontal) evt.preventDefault();
        if (!this.ignore && this.dragging && this.horizontal)
            this.listeners.dragend.forEach((i) => i(this.velocity));
        this.dragging = false;
    }

    private isAngleHorizontal(deltaX: number, deltaY: number) {
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 180;
        console.log(angle);
        return !(
            (angle >= 240 && angle <= 300) ||
            (angle >= 60 && angle <= 120)
        );
    }
}

/**
 * 이벤트 핸들러에 전달되는 정보
 * @typedef {Object} HorizontalTouchEventArgs 가로 터치에 관한 정보
 * @property {number} delta 변화한 좌표값 (참고: current - start랑 다른 개념임!)
 * @property {number} start 시작 좌표값
 * @property {number} current 현재 좌표값
 */

/**
 * 가로 터치만을 감지하는 핸들러입니다.
 */
class HorizontalTouchInterpreter {
    #preventDefault = true;
    #isDragReady = false;
    #isDragging = false;
    #isVerticalDrag = false;
    #isHorizontalDrag = false;
    #isInitialDrag = true;
    /**
     * @type {number}
     */
    #startX;
    /**
     * @type {number}
     */
    #startY;

    /**
     * @type {((args: HorizontalTouchEventArgs) => void)[]}
     */
    #startListeners = [];
    /**
     * @type {((args: HorizontalTouchEventArgs) => void)[]}
     */
    #progreessListeners = [];
    /**
     * @type {(() => void)[]}
     */
    #endListeners = [];

    /**
     * 새로운 인스턴스를 생성하고 가로 터치 감지를 시작합니다.
     * @param {HTMLElement | Window} element 가로 터치를 감지할 HTML 요소나 윈도우
     * @param {boolean} preventDefault 가로 터치 감지시 preventDefault할 지의 여부
     */
    constructor(element, preventDefault = true) {
        this.#cancelDrag = this.#cancelDrag.bind(this);
        this.#startDrag = this.#startDrag.bind(this);
        this.#processDrag = this.#processDrag.bind(this);

        element.addEventListener("touchend", this.#cancelDrag);
        element.addEventListener("touchcancel", this.#cancelDrag);
        element.addEventListener("touchstart", this.#startDrag);
        element.addEventListener("touchmove", this.#processDrag);
        this.#preventDefault = preventDefault;
    }

    /**
     * 이벤트 핸들러를 추가합니다.
     * @param {'start' | 'end' | 'progress'} eventType 이벤트 유형
     * @param {((delta: number) => void) | (() => void)} handler 이벤트 핸들러
     */
    addEventListener(eventType, handler) {
        switch (eventType) {
            case "start":
                this.#startListeners.push(handler);
                break;
            case "progress":
                this.#progreessListeners.push(handler);
                break;
            case "end":
                this.#endListeners.push(handler);
                break;
        }
    }

    #cancelDrag = () => {
        if (this.#isDragging && this.#isHorizontalDrag)
            this.#endListeners.forEach((i) => setTimeout(i, 0));

        this.#isDragReady = false;
        this.#isDragging = false;
        this.#isVerticalDrag = false;
        this.#isHorizontalDrag = false;
        this.#isInitialDrag = true;
    };

    #startDrag = (e) => {
        this.#isDragReady = true;
        this.#startX = e.clientX ?? e.touches[0].clientX;
        this.#startY = e.clientY ?? e.touches[0].clientY;
    };

    #processDrag = (e) => {
        const currentX = e.clientX ?? e.touches[0].clientX;
        const currentY = e.clientY ?? e.touches[0].clientY;

        const deltaX = currentX - this.#startX;
        const deltaY = currentY - this.#startY;

        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 180;
        let isMovementHorizontal =
            (angle >= 240 && angle <= 300) || (angle >= 60 && angle <= 120);
        let dragCondition = this.#isInitialDrag && this.#isDragReady;

        let firstDrag = this.#isInitialDrag;

        if (isMovementHorizontal && dragCondition) {
            this.#isDragging = true;
            this.#isVerticalDrag = true;
            this.#isHorizontalDrag = false;
            this.#isInitialDrag = false;
        } else if (dragCondition) {
            this.#isDragging = true;
            this.#isHorizontalDrag = true;
            this.#isVerticalDrag = false;
            this.#isInitialDrag = false;
        }

        if (this.#isDragging && this.#isHorizontalDrag) {
            if (this.#preventDefault) e.preventDefault();
            if (firstDrag) {
                this.#startListeners.forEach((i) =>
                    setTimeout(
                        () =>
                            i({
                                delta: deltaX,
                                start: this.#startX,
                                current: currentX,
                            }),
                        0
                    )
                );
            } else {
                this.#progreessListeners.forEach((i) =>
                    setTimeout(
                        () =>
                            i({
                                delta: deltaX,
                                start: this.#startX,
                                current: currentX,
                            }),
                        0
                    )
                );
            }
        }
    };
}

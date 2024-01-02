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
    _preventDefault = true;
    _isDragReady = false;
    _isDragging = false;
    _isVerticalDrag = false;
    _isHorizontalDrag = false;
    _isInitialDrag = true;
    /**
     * @type {number}
     */
    _startX;
    /**
     * @type {number}
     */
    _startY;

    /**
     * @type {((args: HorizontalTouchEventArgs) => void)[]}
     */
    _startListeners = [];
    /**
     * @type {((args: HorizontalTouchEventArgs) => void)[]}
     */
    _progreessListeners = [];
    /**
     * @type {(() => void)[]}
     */
    _endListeners = [];

    /**
     * 새로운 인스턴스를 생성하고 가로 터치 감지를 시작합니다.
     * @param {HTMLElement | Window} element 가로 터치를 감지할 HTML 요소나 윈도우
     * @param {boolean} preventDefault 가로 터치 감지시 preventDefault할 지의 여부
     */
    constructor(element, preventDefault = true) {
        this._cancelDrag = this._cancelDrag.bind(this);
        this._startDrag = this._startDrag.bind(this);
        this._processDrag = this._processDrag.bind(this);

        element.addEventListener("touchend", this._cancelDrag);
        element.addEventListener("touchcancel", this._cancelDrag);
        element.addEventListener("touchstart", this._startDrag);
        element.addEventListener("touchmove", this._processDrag);
        this._preventDefault = preventDefault;
    }

    /**
     * 이벤트 핸들러를 추가합니다.
     * @param {'start' | 'end' | 'progress'} eventType 이벤트 유형
     * @param {((delta: number) => void) | (() => void)} handler 이벤트 핸들러
     */
    addEventListener(eventType, handler) {
        switch (eventType) {
            case "start":
                this._startListeners.push(handler);
                break;
            case "progress":
                this._progreessListeners.push(handler);
                break;
            case "end":
                this._endListeners.push(handler);
                break;
        }
    }

    _cancelDrag = () => {
        if (this._isDragging && this._isHorizontalDrag)
            this._endListeners.forEach((i) => setTimeout(i, 0));

        this._isDragReady = false;
        this._isDragging = false;
        this._isVerticalDrag = false;
        this._isHorizontalDrag = false;
        this._isInitialDrag = true;
    };

    _startDrag = (e) => {
        this._isDragReady = true;
        this._startX = e.clientX ?? e.touches[0].clientX;
        this._startY = e.clientY ?? e.touches[0].clientY;
    };

    _processDrag = (e) => {
        const currentX = e.clientX ?? e.touches[0].clientX;
        const currentY = e.clientY ?? e.touches[0].clientY;

        const deltaX = currentX - this._startX;
        const deltaY = currentY - this._startY;

        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 180;
        let isMovementHorizontal =
            (angle >= 240 && angle <= 300) || (angle >= 60 && angle <= 120);
        let dragCondition = this._isInitialDrag && this._isDragReady;

        let firstDrag = this._isInitialDrag;

        if (isMovementHorizontal && dragCondition) {
            this._isDragging = true;
            this._isVerticalDrag = true;
            this._isHorizontalDrag = false;
            this._isInitialDrag = false;
        } else if (dragCondition) {
            this._isDragging = true;
            this._isHorizontalDrag = true;
            this._isVerticalDrag = false;
            this._isInitialDrag = false;
        }

        if (this._isDragging && this._isHorizontalDrag) {
            if (this._preventDefault) e.preventDefault();
            if (firstDrag) {
                this._startListeners.forEach((i) =>
                    setTimeout(
                        () =>
                            i({
                                delta: deltaX,
                                start: this._startX,
                                current: currentX,
                            }),
                        0
                    )
                );
            } else {
                this._progreessListeners.forEach((i) =>
                    setTimeout(
                        () =>
                            i({
                                delta: deltaX,
                                start: this._startX,
                                current: currentX,
                            }),
                        0
                    )
                );
            }
        }
    };
}

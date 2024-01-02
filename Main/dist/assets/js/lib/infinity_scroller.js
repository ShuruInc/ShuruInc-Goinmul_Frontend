/**
 * HorizontalInfinityScroller 옵션
 * @typedef {Object} HorizontalInfinityScrollerOptions 옵션
 * @property {boolean} everyChildrenWidthAreEqualAndNeverChange 모든 자식 요소는 너비가 항상 동일하고 변하지 않는다.
 * @property {boolean} childrenNeverChange 자식이 추가되거나 삭제되지 않음
 */

/**
 * 무한반복되는 스크롤을 구현한다.
 *
 * 다음과 같은 경우만이 고려되었다.
 *  1) root의 직계자손들은 가로방향으로 정렬된다.
 *  2) 각 요소의 중앙에서 scroll에서 snap된다.
 *  3) 각 요소의 너비는 동일하다.
 */
class HorizontalInfinityScroller {
    /** @type {HTMLElement} */
    _rootElement;
    /** @type {HorizontalTouchInterpreter} */
    _touchListener;

    // 스크롤 구현
    /** @type {number} */
    _childOnCenterIdx = 2;
    /** @type {number} */
    _scrollOffsetOfChildOnCenter = 0;

    // 옵션 및 캐싱
    /** @type {HorizontalInfinityScrollerOptions} */
    _options;
    /** @type {number} */
    _childWidthCache;
    /** @type {HTMLElement[]} */
    _childrenCache;

    // 터치 핸들링에 쓰인다.
    _touchStartPos = 0;
    _touchCurrentPos = 0;
    _touchStartTime = 0;

    // easing용
    _easing = false;
    _easingStartTime = null;
    _easingStartOffset = null;
    _easingDuration = 0;
    _easingTarget = 0;
    _easingEndOffset = 0;

    /**
     * @param {HTMLElement} root
     * @param {HorizontalInfinityScrollerOptions} options
     */
    constructor(root, options = {}) {
        this._addScrollOffset = this.addScrollOffset.bind(this);
        this._childOnCenter = this._childOnCenter.bind(this);
        this._childWidth = this._childWidth.bind(this);
        this._children = this._children.bind(this);
        this._interpolate = this._interpolate.bind(this);
        this._render = this._render.bind(this);
        this._rootWidth = this._rootWidth.bind(this);
        this._doEasing = this._doEasing.bind(this);

        this._options = {
            everyChildrenWidthAreEqualAndNeverChange: true,
            childrenNeverChange: true,
            ...options,
        };

        this._rootElement = root;
        this._childWidthCache =
            root.firstElementChild.getBoundingClientRect().width;
        //this.#touchListener = new HorizontalTouchInterpreter(root, false);
        //this.#touchListener.addEventListener("start", this.#touchStart);
        //this.#touchListener.addEventListener("progress", this.#touchMove);
        //this.#touchListener.addEventListener("end", this.#touchEnd);

        if (this._options.childrenNeverChange)
            this._childrenCache = this._children(true);
        if (this._options.everyChildrenWidthAreEqualAndNeverChange)
            this._childWidthCache = this._childWidth(this._children()[0], true);

        window.requestAnimationFrame(this._render);
    }

    _doEasing(timestamp) {
        if (!this._easing) return;

        if (
            this._easingStartTime === null ||
            this._easingStartOffset === null
        ) {
            this._easingStartOffset = this._scrollOffsetOfChildOnCenter;
            this._easingStartTime = timestamp;
        }
        if (timestamp - this._easingStartTime > this._easingDuration) {
            this._easing = false;
            this._easingStartOffset = null;
            return (this._scrollOffsetOfChildOnCenter = this._easingEndOffset);
        }

        this._scrollOffsetOfChildOnCenter = this._easingFunction(
            this._easingStartOffset,
            this._easingEndOffset,
            (timestamp - this._easingStartTime) / this._easingDuration
        );
    }

    _render(timestamp) {
        this._scrollOffsetOfChildOnCenter %= this._childWidthSum();

        const translates = this._translateValues();
        const children = this._children();

        this._doEasing(timestamp);

        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let translate = translates[i];
            if (translate === null) {
                child.style.display = "none";
            } else {
                child.style.display = "";
                child.style.transform = `translateX(calc(${translate}px - 50%))`;
            }
        }

        window.requestAnimationFrame(this._render);
    }

    _rootWidth() {
        return this._rootElement.getBoundingClientRect().width;
    }

    _children(ignoreCache = false) {
        return this._options.childrenNeverChange && !ignoreCache
            ? this._childrenCache
            : [...this._rootElement.children];
    }

    _childOnCenter() {
        return this._children()[this._childOnCenterIdx];
    }

    _childWidth(
        element /* 일단 각 자식 요소의 너비가 다른 경우도 대비할 수 있도록 매개변수 추가 */,
        ignoreCache
    ) {
        return this._options.everyChildrenWidthAreEqualAndNeverChange &&
            !ignoreCache
            ? this._childWidthCache
            : element.getBoundingClientRect().width;
    }

    /**
     * offset만큼 스크롤한다.
     * @param {number} offset 변화값
     */
    addScrollOffset(offset) {
        this._scrollOffsetOfChildOnCenter += offset;
        return;
    }

    /**
     * 각 자식 요소의 translateX(calc(a - 50%))에서 a의 값을 반환합니다.
     * (참고: 모든 자식 요소는 display: absolute; left: 0;임)
     * 예시를 들어, a = 0인 자식 요소는 정중앙에 위치합니다.
     *
     * null은 display: none을 의미합니다.
     */
    _translateValues(noNormalize = false) {
        //if (!noNormalize) this._normalize();
        // console.log(`offset=${this._scrollOffsetOfChildOnCenter}`);

        const rootWidth = this._rootWidth();
        let translates = [];
        for (let i = 0; i < this._children().length; i++) translates.push(null);

        const childOnCenterWidth = this._childWidth(this._childOnCenter());
        let remaningRootWidth = {
            left:
                rootWidth / 2 -
                childOnCenterWidth / 2 +
                this._scrollOffsetOfChildOnCenter,
            right:
                rootWidth / 2 -
                childOnCenterWidth / 2 -
                this._scrollOffsetOfChildOnCenter,
        };
        translates[this._childOnCenterIdx] =
            rootWidth / 2 + this._scrollOffsetOfChildOnCenter;

        for (let i = 1; remaningRootWidth.left > 0; i++) {
            const childIdx = this._childOnCenterIdx - i,
                childWidth = this._childWidth(this._children()[childIdx]);
            if (childIdx < 0) {
                i = this._childOnCenterIdx - this._children().length; // 다음 loop에서 마지막 요소의 index가 됨.
                continue;
            }
            translates[childIdx] = remaningRootWidth.left - childWidth / 2;
            remaningRootWidth.left -= childWidth;
        }

        for (let i = 1; remaningRootWidth.right > 0; i++) {
            const childIdx = this._childOnCenterIdx + i,
                childWidth = this._childWidth(this._children()[childIdx]);
            if (childIdx >= this._children().length) {
                i = -this._childOnCenterIdx - 1; // 다음 loop에서 i = 0이 됨.
                continue;
            }
            translates[childIdx] =
                rootWidth - remaningRootWidth.right + childWidth / 2;
            remaningRootWidth.right -= childWidth;
        }

        return translates;
    }

    _childWidthSum() {
        let sum = 0;
        for (const i of this._children()) {
            sum += this._childWidth(i);
        }

        return sum;
    }

    calculateOffsetDeltaToCenterOf(target) {
        let indexOfCenter = this._childOnCenterIdx;
        let indexOfTarget = this._children().indexOf(target);

        let tmp,
            offsetOnRightDirection = -this._scrollOffsetOfChildOnCenter,
            offsetOnLeftDirection = -this._scrollOffsetOfChildOnCenter;

        tmp = indexOfCenter;
        while (tmp != indexOfTarget) {
            offsetOnRightDirection += this._childWidth(this._children()[tmp]);
            tmp--;
            while (tmp < 0) tmp += this._children().length;
            tmp = tmp % this._children().length;
        }

        tmp = indexOfCenter;
        while (tmp != indexOfTarget) {
            offsetOnLeftDirection -= this._childWidth(this._children()[tmp]);
            tmp = (tmp + 1) % this._children().length;
        }

        offsetOnLeftDirection %= this._childWidthSum();
        offsetOnRightDirection %= this._childWidthSum();

        while (offsetOnLeftDirection > 0) {
            offsetOnLeftDirection -= this._childWidthSum();
        }
        while (offsetOnRightDirection < 0) {
            offsetOnRightDirection += this._childWidthSum();
        }

        return Math.abs(offsetOnRightDirection) >
            Math.abs(offsetOnLeftDirection)
            ? offsetOnLeftDirection
            : offsetOnRightDirection;
    }

    /**
     * 중앙에 해당 요소를 표시합니다.
     * @param {HTMLElement} target 중앙에 보일 요소
     * @param {boolean} smooth 부드럽게 스크롤할 지의 여부
     */
    scrollIntoCenterView(target, smooth = true) {
        if (smooth) {
            this._easingStartTime = null;
            this._easingEndOffset =
                this._scrollOffsetOfChildOnCenter +
                this.calculateOffsetDeltaToCenterOf(target);
            this._easingDuration = 300;
            this._easing = true;
        } else {
            this._childOnCenterIdx = this._children().indexOf(target);
            this._scrollOffsetOfChildOnCenter = 0;
        }
    }

    _easingFunction(from, to, progress) {
        return progress === 1 ? to : from + (to - from) * progress;
    }

    _interpolate() {}

    _touchStart(evt) {
        this._rootElement.classList.add("horizontal-scrolling");
        this._touchStartPos = evt.start;
        this._touchStartTime = Date.now();
    }

    _touchMove(evt) {
        this._touchCurrentPos = evt.current;
    }

    _touchEnd() {
        this._rootElement.classList.remove("horizontal-scrolling");
    }
}

const scroller = new HorizontalInfinityScroller(
    document.querySelector(".post-board-columns")
);

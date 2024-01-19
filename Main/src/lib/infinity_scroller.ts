import TouchVelocityCalculator from "./touch_snap_interpreter";

/**
 * HorizontalInfinityScroller 옵션
 */
type HorizontalInfinityScrollerOptions = {
    /** 모든 자식 요소는 너비가 항상 동일하고 변하지 않는다. */
    everyChildrenWidthAreEqualAndNeverChange: boolean;
    /** 자식이 추가되거나 삭제되지 않음 */
    childrenNeverChange: boolean;
};

function positiveModular(val: number, maxExcluding: number) {
    while (val < 0) val += maxExcluding;
    return val % maxExcluding;
}

/**
 * 무한반복되는 스크롤을 구현한다.
 *
 * 다음과 같은 경우만이 고려되었다.
 *  1) root의 직계자손들은 가로방향으로 정렬된다.
 *  2) 각 요소의 중앙에서 scroll에서 snap된다.
 *  3) 각 요소의 너비는 동일하며 부모 요소의 너비와 동일하다.
 */
export class HorizontalInfinityScroller {
    _rootElement: HTMLElement;

    /**
     * 기준이 되는 요소
     * */
    _basisChildIdx = 0;
    /**
     * 기준이 되는 요소의 중앙와 부모의 중앙간의 거리
     * 예시: 값이 2면 기준 요소의 중앙은 부모의 중앙으로부터 오른쪽으로 2만큼 떨어진다.
     */
    _basisChildOffsetFromCenter = 0; // basisChild중앙과 부모의 중앙간의 거리

    // 이벤트 리스너용
    _scrollListeners: (() => void)[] = [];
    _touchDragListeners: ((key: string, direction: 1 | -1) => void)[] = [];

    // 옵션 및 캐싱
    _options: HorizontalInfinityScrollerOptions;
    _childrenCache: HTMLElement[];

    // easing용
    _easing = false;
    _easingStartTime: number | null = null;
    _easingStartOffset: number | null = null;
    _easingDuration = 0;
    _easingTarget = 0;
    _easingEndOffset = 0;

    // 가로 스크롤 해석용
    _horizontalScrollVelocityCalculator: TouchVelocityCalculator;
    _origianlOffsetBeforeDragging = 0;
    _dragging = false;

    constructor(
        root: HTMLElement,
        options: Partial<HorizontalInfinityScroller> = {},
    ) {
        // 함수 bind (setInterval이나 setTimeout으로 인한 버그 해결)
        this.addScrollOffset = this.addScrollOffset.bind(this);
        this._basisChild = this._basisChild.bind(this);
        this._children = this._children.bind(this);
        this._render = this._render.bind(this);
        this._rootWidth = this._rootWidth.bind(this);
        this._doEasing = this._doEasing.bind(this);
        this._onHorizontalTouchEnd = this._onHorizontalTouchEnd.bind(this);
        this._onHorizontalTouchMove = this._onHorizontalTouchMove.bind(this);
        this._onHorizontalTouchStart = this._onHorizontalTouchStart.bind(this);
        this.calculateOffsetDeltaToCenterOf =
            this.calculateOffsetDeltaToCenterOf.bind(this);

        // 모바일에서 터치 드래그로 좌우 스크롤할 수 있도록 관련 클래스 변수 초기화
        this._horizontalScrollVelocityCalculator = new TouchVelocityCalculator(
            root,
        );
        this._horizontalScrollVelocityCalculator.addEventListner(
            "dragstart",
            this._onHorizontalTouchStart,
        );
        this._horizontalScrollVelocityCalculator.addEventListner(
            "dragmove",
            this._onHorizontalTouchMove,
        );
        this._horizontalScrollVelocityCalculator.addEventListner(
            "dragend",
            this._onHorizontalTouchEnd,
        );

        // 생성자의 매개변수로 받은 options 저장
        // 매개변수에서 지정되지 않은 경우 기본값을 저장한다.
        this._options = {
            everyChildrenWidthAreEqualAndNeverChange: true,
            childrenNeverChange: true,
            ...options,
        };

        // 루트 저장
        this._rootElement = root;

        // 캐싱
        this._childrenCache = this._children(true);

        // 렌더링 시작
        window.requestAnimationFrame(this._render);
    }

    _onHorizontalTouchStart() {
        if (this._easing) {
            this._easing = false;
        }
        this._dragging = true;
        this._origianlOffsetBeforeDragging = this._basisChildOffsetFromCenter;
        this._rootElement.classList.add("y-scroll-hidden");
    }

    _onHorizontalTouchMove(delta: number) {
        let newOffset = this._basisChildOffsetFromCenter + delta;
        if (Math.abs(newOffset) > this._rootWidth()) {
            return;
        } else {
            this._basisChildOffsetFromCenter = newOffset;
        }
    }

    _onHorizontalTouchEnd(speed: number) {
        this._dragging = false;
        const scrolledEnough =
            Math.abs(this._basisChildOffsetFromCenter) >
            this._rootWidth() * 0.5;
        if (Math.abs(speed) > 5 || scrolledEnough) {
            let sign = Math.sign(this._basisChildOffsetFromCenter) as -1 | 1;
            const targetChild = scrolledEnough
                ? this.getCurrentlyMostVisibleChild()!
                : this._children()[
                      positiveModular(
                          this._basisChildIdx - sign,
                          this._children().length,
                      )
                  ];
            this.scrollIntoCenterView(targetChild, true, sign);
            this._touchDragListeners.forEach((i) =>
                i(targetChild.dataset.key as string, sign),
            );
        } else {
            this.scrollIntoCenterView(this._basisChild());
        }
        this._rootElement.classList.remove("y-scroll-hidden");
    }

    /**
     * easing하도록 되어있다면(this._easing === true라면)
     * _basisOffsetFromCenter를 _easingEndOffset으로
     * _easingDuration(millisecond)동안 easing하며 설정한다.
     * @param timestamp requestAnimationFrame에 의해 전달받은 timestamp
     * @returns Easing한다
     */
    _doEasing(timestamp: number) {
        // easing중이 아니라면 return
        if (!this._easing) return;

        // 첫 easing 호출이라면 시작시간과 시작 offset를 설정
        if (
            this._easingStartTime === null ||
            this._easingStartOffset === null
        ) {
            this._easingStartOffset = this._basisChildOffsetFromCenter;
            this._easingStartTime = timestamp;
        }

        if (timestamp - this._easingStartTime > this._easingDuration) {
            // easing 시간이 다 지났다면 easing 변수를 초기화하고
            // _basisOffsetFromCenter를 목표값으로 설정한 뒤 return
            this._easing = false;
            this._easingStartOffset = null;
            this._basisChildOffsetFromCenter = this._easingEndOffset;
        } else {
            // easing한다
            this._basisChildOffsetFromCenter = this._easingFunction(
                this._easingStartOffset,
                this._easingEndOffset,
                (timestamp - this._easingStartTime) / this._easingDuration,
            );
        }

        // 스크롤 이벤트 핸들러 호출
        this._scrollListeners.forEach((i) => i());
    }

    /**
     * 렌더링한다.
     * @param timestamp requestAnimationFrame에 의해 전달되는 timestamp
     */
    _render(timestamp: number) {
        // offset 정규화
        if (!this._easing && !this._dragging)
            this._basisChildOffsetFromCenter %= this._childWidthSum();

        // easing해야 한다면 easing한다.
        this._doEasing(timestamp);

        // translate 값 설정
        const translates = this._translateValues();
        const children = this._children();
        for (let i = 0; i < children.length; i++) {
            let child = children[i] as HTMLElement;
            let translate = translates[i];
            if (translate === null) {
                child.style.display = "none";
            } else {
                child.style.display = "";
                child.style.transform = `translateX(calc(${translate}px - 50%))`;
            }
        }

        // offset 한 번 더 정규화
        if (!this._easing && !this._dragging) {
            const nearestToCenter = translates
                .map((i, idx) => ({ offset: i, index: idx }))
                .filter((i) => i.offset !== null)
                .sort((a, b) => Math.abs(a.offset!) - Math.abs(b.offset!))[0];
            if (this._basisChildIdx !== nearestToCenter.index) {
                this._basisChildOffsetFromCenter = nearestToCenter.offset!;
                this._basisChildIdx = nearestToCenter.index;
            }
        }

        // 무한루프
        window.requestAnimationFrame(this._render);
    }

    /**
     * 루트 요소의 너비를 반환한다.
     * @returns 루트 요소의 너비
     */
    _rootWidth() {
        return this._rootElement.getBoundingClientRect().width;
    }

    /**
     * 자식 요소들을 가져온다.
     * @param ignoreCache 캐시 무시 여부 (기본값: false)
     */
    _children(ignoreCache = false) {
        return this._options.childrenNeverChange && !ignoreCache
            ? this._childrenCache
            : ([...this._rootElement.children] as HTMLElement[]);
    }

    /**
     * 기준이 되는 요소를 가져온다.
     * @returns 기준 요소
     */
    _basisChild() {
        return this._children()[this._basisChildIdx];
    }
    /**
     * offset만큼 스크롤한다.
     * @param offset 변화값
     */
    addScrollOffset(offset: number) {
        this._basisChildOffsetFromCenter += offset;
        this._scrollListeners.forEach((i) => i());
        return;
    }

    /**
     * 각 자식 요소의 translateX(calc(a - 50%))에서 a의 값을 반환한다.
     * (참고: 모든 자식 요소는 display: absolute; left: 50%;임)
     * 예시를 들어, a = 0인 자식 요소는 정중앙에 위치한다.
     *
     * null은 display: none을 의미한다.
     */
    _translateValues() {
        /**
         * 2개의 예시로 알아보는 translate값 계산 알고리즘
         * 참고: 모든 예시에서 root의 너비=child를 가정함.
         *
         * 첫번째 예시
         *           ________________
         * 1. 위와 같이 너비 16px의 root가 있다고 가정한다.
         *
         *           __AAAAAAAAAAAAAA(AA) ※ 괄호안은 root 영역의 바깥에 있으므로 보이지 않는다.
         * 2. basisChildOffset=2, basisChildIndex=(A의 index)라고 가정하고
         *    basisChild의 translate값을 2로 설정한다.
         *
         * 3. root 영역을 보자. root 영역의 왼쪽에는 2px의 여백이 있으며 오른쪽에는 여백이 없다.
         *
         *           (BBBBBBBBBBBBBB)BBAAAAAAAAAAAAAA(AA) ※ 괄호안은 root 영역의 바깥에 있으므로 보이지 않는다.
         * 4. 왼쪽 여백을 채우기 위해 A의 왼쪽에 B가 나타나도록 B의 translate값을 설정한다.
         *
         *           BBAAAAAAAAAAAAAA
         * 5, 끝!
         *
         * 두번째 예시
         *          ________
         * `1. 위와 같이 너비 8px의 root가 있고, 3개의 child A, B, C가 있다고 가정한다.
         *
         *          ________                                (AAAAAAAA) ※ 괄호안은 root 영역의 바깥에 있으므로 보이지 않는다.
         *  2. basisChildOffset=36, basisChildIndex=(A의 offset)라고 가정하고
         *     basisChild의 translate값을 40으로 설정한다.
         *
         *  3. root 영역이 비어있다.
         *
         *          ________                        (CCCCCCCCAAAAAAAA) ※ 괄호안은 root 영역의 바깥에 있으므로 보이지 않는다.
         *          ________                (BBBBBBBBCCCCCCCCAAAAAAAA)
         *          ________        (AAAAAAAABBBBBBBBCCCCCCCC)
         *          ________(CCCCCCCCAAAAAAAABBBBBBBB)
         *          BBBBBBBB(CCCCCCCCAAAAAAAA)
         *  4. 위와 같이 루프를 돌면서 root영역을 채운다.
         *
         *          BBBBBBBB
         * 5. 끝!
         */

        // 배열 초기화
        const rootWidth = this._rootWidth();
        let translates = [];
        for (let i = 0; i < this._children().length; i++) translates.push(null);

        // 기준 요소를 배치하고 기준 요소의 좌우에 남은 여백
        const childOnCenterWidth = this._rootWidth();
        let remaningRootWidth = {
            left:
                rootWidth / 2 -
                childOnCenterWidth / 2 +
                this._basisChildOffsetFromCenter,
            right:
                rootWidth / 2 -
                childOnCenterWidth / 2 -
                this._basisChildOffsetFromCenter,
        };
        translates[this._basisChildIdx] = this._basisChildOffsetFromCenter;

        // 왼쪽 여백을 채운다.
        for (let i = 1; remaningRootWidth.left > 0; i++) {
            const childIdx = this._basisChildIdx - i,
                childWidth = this._rootWidth();
            if (childIdx < 0) {
                i = this._basisChildIdx - this._children().length; // 다음 loop에서 마지막 요소의 index가 됨.
                continue;
            }
            translates[childIdx] =
                remaningRootWidth.left - childWidth / 2 - rootWidth / 2;
            remaningRootWidth.left -= childWidth;
        }

        // 오른족 여백을 채운다.
        for (let i = 1; remaningRootWidth.right > 0; i++) {
            const childIdx = this._basisChildIdx + i,
                childWidth = this._rootWidth();
            if (childIdx >= this._children().length) {
                i = -this._basisChildIdx - 1; // 다음 loop에서 i = 0이 됨.
                continue;
            }
            translates[childIdx] =
                rootWidth -
                remaningRootWidth.right +
                childWidth / 2 -
                rootWidth / 2;
            remaningRootWidth.right -= childWidth;
        }

        return translates;
    }

    /**
     * 자식 요소들의 너비의 총합을 구한다.
     * @returns 자식 요소들의 너비의 총합
     */
    _childWidthSum() {
        return this._rootWidth() * this._children().length;
    }

    /**
     * 대상 요소 target이 중앙에 오려면 offset이 현재값으로부터 얼마나 변해야 하는 지를 계산한다.
     * @param target 대상 요소
     * @param direction 방향 (아무 방향이나 상관 없으면 null)
     * @returns offset의 변화값
     */
    calculateOffsetDeltaToCenterOf(
        target: HTMLElement,
        direction: -1 | 1 | null,
    ) {
        let indexOfCenter = this._basisChildIdx;
        let indexOfTarget = this._children().indexOf(target);

        let tmp,
            offsetOnRightDirection = -this._basisChildOffsetFromCenter,
            offsetOnLeftDirection = -this._basisChildOffsetFromCenter;

        // 오른쪽 방향으로 이동할 때의 변화값을 계산
        tmp = indexOfCenter;
        while (tmp != indexOfTarget) {
            offsetOnRightDirection += this._rootWidth();
            tmp--;
            while (tmp < 0) tmp += this._children().length;
            tmp = tmp % this._children().length;
        }

        // 왼쪽 방향으로 이동할 때의 변화값을 계산
        tmp = indexOfCenter;
        while (tmp != indexOfTarget) {
            offsetOnLeftDirection -= this._rootWidth();
            tmp = (tmp + 1) % this._children().length;
        }

        // 방향 강제
        while (offsetOnLeftDirection > 0) {
            offsetOnLeftDirection -= this._childWidthSum();
        }
        while (offsetOnRightDirection < 0) {
            offsetOnRightDirection += this._childWidthSum();
        }

        // 정규화
        offsetOnLeftDirection %= this._childWidthSum();
        offsetOnRightDirection %= this._childWidthSum();

        switch (direction) {
            case null:
                // 가장 거리가 짧은 방향의 변화값을 반환
                return Math.abs(offsetOnRightDirection) >
                    Math.abs(offsetOnLeftDirection)
                    ? offsetOnLeftDirection
                    : offsetOnRightDirection;
            case 1:
                return offsetOnRightDirection;
            case -1:
                return offsetOnLeftDirection;
        }
    }

    /**
     * 중앙에 해당 요소를 표시합니다.
     * @param target 중앙에 보일 요소
     * @param smooth 부드럽게 스크롤할 지의 여부
     * @param direction 방향 (아무 방향이나 상관없으면 null)
     * @returns 이동한 방향 (+1(오른쪽), -1(왼쪽), 혹은 0)
     */
    scrollIntoCenterView(
        target: HTMLElement,
        smooth = true,
        direction: -1 | 1 | null = null,
    ) {
        if (smooth) {
            let delta = this.calculateOffsetDeltaToCenterOf(target, direction);
            if (delta === 0) return 0;

            this._easingStartTime = null;
            this._easingEndOffset = this._basisChildOffsetFromCenter + delta;
            this._easingDuration = 300;
            this._easing = true;
            return Math.sign(delta);
        } else {
            this._basisChildIdx = this._children().indexOf(target);
            this._basisChildOffsetFromCenter = 0;
            this._scrollListeners.forEach((i) => i());
            return 0;
        }
    }

    /**
     * 가장 잘(많이) 보이는 요소를 반환합니다.
     * @param fullyVisible 완전히 보이는 경우에만 요소를 반환합니다. 완전히 보이지 않는다면 null을 반환합니다.
     * @returns 가장 잘 보이는 요소
     */
    getCurrentlyMostVisibleChild(fullyVisible = false) {
        const translates = this._translateValues();
        const result = translates
            .map((i, idx) => ({
                translate: i,
                child: this._children()[idx],
            }))
            .filter((i) => i.translate !== null)
            .sort((a, b) => Math.abs(a.translate!) - Math.abs(b.translate!))[0];
        return (result.translate === 0.0 && !this._easing) || !fullyVisible
            ? result.child
            : null;
    }

    /**
     * easing 함수를 적용한다.
     * @param from 시작값
     * @param to 끝값
     * @param progress 0이상 1이하의 진행도
     * @returns easing 함수가 적용된 [Math.min(from, to), Math.max(from, to)] 이내의 값
     */
    _easingFunction(from: number, to: number, progress: number) {
        const easing = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        return progress === 1 ? to : from + (to - from) * easing;
    }

    // cccv from lib.dom.ts
    addEventListenerToChildren<K extends keyof HTMLElementEventMap>(
        type: K,
        listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions,
    ) {
        this._children().forEach((i) =>
            i.addEventListener(type, listener, options),
        );
    }

    addScrollEventListener(listener: () => void) {
        this._scrollListeners.push(listener);
    }

    addTouchDragScrollEventListener(
        listener: (key: string, direction: 1 | -1) => void,
    ) {
        this._touchDragListeners.push(listener);
    }
}

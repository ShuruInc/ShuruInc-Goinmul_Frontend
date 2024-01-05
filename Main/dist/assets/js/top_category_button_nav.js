// x를 [0, max) 내의 정수로 정규화한다.
function normalizeIntoRange(x, maxExcluding) {
    while (x < 0) x += maxExcluding;
    return x % maxExcluding;
}

class TopCategoryButtonNav {
    /**
     * 상단 카테고리 버튼의 데이터
     * @typedef {Object} TopCategoryButtonData
     * @property {string} label 표시되는 텍스트
     * @property {string} key 고유 식별자
     */

    /** @type {TopCategoryButtonData} */
    _data = [];
    /** @type {HTMLElement} */
    _root = null;

    /**
     * 상단 카테고리 버튼 네비게이션 클래스를 생성합니다.
     * @param {TopCategoryButtonData[]} data 상단 카테고리 버튼 데이터
     * @param {HTMLElement} root 상단 카테고리 버튼들이 있는 HTML 루트
     */
    constructor(data, root) {
        this._data = data;
        this._root = root;

        // 함수 bind (setInterval이나 setTimeout으로 호출할 때의 버그 해결)
        this.scrollToCenter = this.scrollToCenter.bind(this);
        this._handleTopButtonNavClick =
            this._handleTopButtonNavClick.bind(this);
        this._createButtonByKey = this._createButtonByKey.bind(this);
        this._getIndexOfButtonKey = this._getIndexOfButtonKey.bind(this);
        this._keyIndexToKey = this._keyIndexToKey.bind(this);
        this._getButtonElements = this._getButtonElements.bind(this);
        this._getActiveButton = this._getActiveButton.bind(this);

        // active된 버튼을 중앙에 정렬 (창 크기가 바뀌었을 때도!)
        this.scrollToCenter(this._getActiveButton(), false);
        window.addEventListener("resize", (evt) => {
            this.scrollToCenter(this._getActiveButton(), false);
        });

        // 이벤트 핸들러 추가
        this._getButtonElements().forEach((i) =>
            i.addEventListener("click", this._handleTopButtonNavClick)
        );
    }

    /**
     * 주어진 카테고리 버튼이 정중앙에 위치합니다.
     * @param {HTMLElement} element 정중앙으로 스크롤할 상단 카테고리 버튼
     * @param {boolean} smooth smooth하게 스크롤할 지의 여부
     */
    scrollToCenter(element, smooth = true) {
        element.scrollIntoView({
            behavior: smooth ? "smooth" : "instant",
            inline: "center",
        });
    }

    /**
     * 새로운 상단 카테고리 버튼을 생성합니다.
     * @param {string} key 버튼 데이터의 고유 식별자
     * @returns {HTMLElement} 셍상된 상단 카테고리 버튼
     */
    _createButtonByKey(key) {
        const data = this._data.filter((i) => i.key === key)[0];
        const button = document.createElement("button");
        button.dataset.key = data.key;
        button.innerHTML = data.label;
        button.addEventListener("click", this._handleTopButtonNavClick);

        return button;
    }

    /**
     * 해당 고유 식별자를 가진 버튼 데이터가 버튼 데이터 배열 내에서 몇번째에 있는지 반환합니다.
     * @param {string} key 고유식별자
     * @returns {number} 해당 고유 식별자의 버튼 데이터 배열 내에서의 index
     */
    _getIndexOfButtonKey(key) {
        return this._data.findIndex((i) => i.key === key);
    }

    /**
     * 주어진 index에 있는 버튼 데이터의 고유 식별자를 반환합니다.
     * @param {number} keyIdx 버튼 데이터의 index
     * @returns {string} 고유 식별자
     */
    _keyIndexToKey(keyIdx) {
        return this._data[keyIdx].key;
    }

    /**
     * 현재 존재하는 상단 카테고리 버튼의 DOM 객체들을 반환합니다.
     * @returns {HTMLButtonElement[]} 상단 카테고리 버튼
     */
    _getButtonElements() {
        return [...this._root.querySelectorAll("button")];
    }

    /**
     * 현재 활성화된 상단 카테고리 버튼을 반환합니다.
     * @returns {HTMLButtonElement} 현재 활성화된 상단 카테고리 버튼
     */
    _getActiveButton() {
        return this._root.querySelector("button.active");
    }

    /**
     * 해당 key를 가진 카테고리 버튼들 중 현재 활성화된 버튼과 가장 가까운 버튼을 반환한다.
     * @param {string} key 카테고리 버튼 키
     * @returns 카테고리 버튼 Element object
     */
    getCategoryButtonByKey(key) {
        const buttonsWithDistance = this._getButtonElements()
            .filter((i) => i.dataset.key === key)
            .map((i) => ({
                button: i,
                distance: Math.abs(
                    this._getButtonElements().indexOf(i) -
                        this._getButtonElements().indexOf(
                            this._getActiveButton()
                        )
                ),
            }))
            .sort((a, b) => a.distance - b.distance);

        return buttonsWithDistance[0].button;
    }

    /**
     * 주어진 카테고리 버튼 주변에 버튼 생성이 필요한 경우 생성한다.
     * @param {HTMLElement} target 카테고리 버튼
     */
    _createRequiredButtonAround(target) {
        const activeNow = this._getActiveButton();

        // nav 너비 계산
        const navWidth = this._root.getBoundingClientRect().width;

        // 위에서 구한 vw를 이용해 좌우에 필요한 버튼 개수 계산
        const buttonWidth = parseInt(
            getComputedStyle(document.querySelector("nav.top-category-buttons"))
                .getPropertyValue("--button-width")
                .replace("px", "")
        );
        const neededButtonOnOneSide = Math.ceil(
            (navWidth / buttonWidth - 1) / 2
        );

        // 좌우에 실제로 있는 버튼 개수 (좀 무식한 방법으로...)
        const buttons = this._getButtonElements();
        const leftButtonCount = buttons.indexOf(target);
        const rightButtonCount = buttons.length - leftButtonCount - 1;

        // 추가하거나 제거할 버튼 개수 계산
        // 버튼 너무 많으면 성능에 안 좋을 수 있으니 제거하는 게 좋다. (삭제 안해도 기능상 문제는 없음)
        const leftButtonCountDiff = neededButtonOnOneSide - leftButtonCount;
        const rightButtonCountDiff = neededButtonOnOneSide - rightButtonCount;

        // 왼쪽 버튼 추가 또는 삭제
        if (leftButtonCountDiff < 0) {
            /* for (let i = leftButtonCountDiff; i < 0; i++)
                this._root.removeChild(buttons[i - leftButtonCountDiff]);  */
        } else if (leftButtonCountDiff > 0) {
            for (let i = 0; i < leftButtonCountDiff; i++) {
                // TIP: 첫번째 요소로 자식 추가하는 방법: elem.insertBefore(something, elem.firstNode)
                this._root.insertBefore(
                    this._createButtonByKey(
                        this._keyIndexToKey(
                            normalizeIntoRange(
                                this._getIndexOfButtonKey(
                                    this._root.firstElementChild.dataset.key
                                ) - 1,
                                buttonData.length
                            )
                        )
                    ),
                    this._root.firstElementChild
                );
                this.scrollToCenter(activeNow, false); // 버그 방지
            }
        }

        // 오른쪽 버튼 추가 또는 삭제
        if (rightButtonCountDiff < 0) {
            /* for (let i = rightButtonCountDiff; i < 0; i++)
                this._root.removeChild(
                    buttons[buttons.length - (i - rightButtonCountDiff) - 1]
                ); */
        } else if (rightButtonCountDiff > 0) {
            for (let i = 0; i < rightButtonCountDiff; i++)
                this._root.appendChild(
                    this._createButtonByKey(
                        this._keyIndexToKey(
                            normalizeIntoRange(
                                this._getIndexOfButtonKey(
                                    this._root.lastElementChild.dataset.key
                                ) + 1,
                                buttonData.length
                            )
                        )
                    )
                );
        }
    }

    /**
     * 카테고리 버튼을 활성화한다.
     * @param {HTMLElement} element 활성화할 카테고리 버튼
     * @param {boolean} smooth smooth하게 스크로리할 지의 여부
     */
    activateButton(element, smooth = true) {
        // target 좌우에 버튼 생성
        this._createRequiredButtonAround(element);

        // 스크롤링
        this.scrollToCenter(element, smooth);

        // 버튼 활성화
        this._getActiveButton().classList.remove("active");
        element.classList.add("active");
    }

    /**
     * 상단 카테고리 버튼의 click 이벤트를 처리합니다.
     * @param {MouseEvent} evt 이벤트 매개변수
     */
    _handleTopButtonNavClick(evt) {
        //
        if (scroller.getCurrentlyMostVisibleChild(true) === null) return;

        this.activateButton(evt.target);
        scroller.scrollIntoCenterView(
            scroller
                ._children()
                .filter((i) => i.dataset.key === evt.target.dataset.key)[0]
        );
    }
}

// 네브 데이터
const buttonData = [
    {
        label: "K-POP",
        key: "article-board-0",
    },
    {
        label: "J-POP",
        key: "article-board-1",
    },
    {
        label: "C-POP",
        key: "article-board-2",
    },
];

const topCategoryNav = new TopCategoryButtonNav(
    buttonData,
    document.querySelector("nav.top-category-buttons")
);

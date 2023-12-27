// 스크롤링 함수
function scrollToCenter(element, smooth = true) {
    const parentRect = element.parentNode.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const parentCenter = (parentRect.left + parentRect.right) / 2;
    const elemCenter = elementRect.left + elementRect.width / 2;
    const xScrollDiff = elemCenter - parentCenter;

    element.parentNode.scrollBy({
        top: 0,
        left: xScrollDiff,
        behavior: smooth ? "smooth" : "instant",
    });
}

// active된 버튼을 중앙에 정렬 (창 크기가 바뀌었을 때도!)
scrollToCenter(getActiveCategoryButton(), false);
window.addEventListener("resize", (evt) => {
    scrollToCenter(getActiveCategoryButton(), false);
});

// 네브 데이터
const buttonData = [
    {
        label: "K-POP",
        key: "kpop",
    },
    {
        label: "J-POP",
        key: "jpop",
    },
    {
        label: "C-POP",
        key: "cpop",
    },
];

function createButtonByKey(key) {
    const data = buttonData.filter((i) => i.key === key)[0];
    const button = document.createElement("button");
    button.dataset.key = data.key;
    button.innerHTML = data.label;
    button.addEventListener("click", handleTopButtonNavClick);

    return button;
}
function getIndexOfButtonKey(key) {
    return buttonData.findIndex((i) => i.key === key);
}
function keyIndexToKey(keyIdx) {
    return buttonData[keyIdx].key;
}

// x를 [0, max) 내의 정수로 정규화한다.
function normalizeIntoRange(x, maxExcluding) {
    while (x < 0) x += maxExcluding;
    return x % maxExcluding;
}

// 활성화된 버튼을 가져온다.
function getActiveCategoryButton() {
    return document.querySelector("nav.top-category-buttons > button.active");
}

// 이벤트 핸들러 추가
[...document.querySelectorAll("nav.top-category-buttons > button")].forEach(
    (i) => i.addEventListener("click", handleTopButtonNavClick)
);
function handleTopButtonNavClick(evt) {
    const activeNow = getActiveCategoryButton();

    // nav 너비 계산
    const topButtons = document.querySelector("nav.top-category-buttons");
    const navWidth = topButtons.getBoundingClientRect().width;

    // 위에서 구한 vw를 이용해 좌우에 필요한 버튼 개수 계산
    const buttonWidth = parseInt(
        getComputedStyle(document.querySelector("nav.top-category-buttons"))
            .getPropertyValue("--button-width")
            .replace("px", "")
    );
    const neededButtonOnOneSide = Math.ceil((navWidth / buttonWidth - 1) / 2);

    // 좌우에 실제로 있는 버튼 개수 (좀 무식한 방법으로...)
    const buttons = [
        ...document.querySelectorAll("nav.top-category-buttons > button"),
    ];
    const leftButtonCount = buttons.indexOf(evt.target);
    const rightButtonCount = buttons.length - leftButtonCount - 1;

    // 추가하거나 제거할 버튼 개수 계산
    // 버튼 너무 많으면 성능에 안 좋을 수 있으니 제거하는 게 좋다. (삭제 안해도 기능상 문제는 없음)
    const leftButtonCountDiff = neededButtonOnOneSide - leftButtonCount;
    const rightButtonCountDiff = neededButtonOnOneSide - rightButtonCount;

    // 왼쪽 버튼 추가 또는 삭제
    if (leftButtonCountDiff < 0) {
        /* for (let i = leftButtonCountDiff; i < 0; i++)
            topButtons.removeChild(buttons[i - leftButtonCountDiff]);  */
    } else if (leftButtonCountDiff > 0) {
        for (let i = 0; i < leftButtonCountDiff; i++) {
            // TIP: 첫번째 요소로 자식 추가하는 방법: elem.insertBefore(something, elem.firstNode)
            topButtons.insertBefore(
                createButtonByKey(
                    keyIndexToKey(
                        normalizeIntoRange(
                            getIndexOfButtonKey(
                                topButtons.firstElementChild.dataset.key
                            ) - 1,
                            buttonData.length
                        )
                    )
                ),
                topButtons.firstElementChild
            );
            scrollToCenter(activeNow, false); // 버그 방지
        }
    }

    // 오른쪽 버튼 추가 또는 삭제
    if (rightButtonCountDiff < 0) {
        /* for (let i = rightButtonCountDiff; i < 0; i++)
            topButtons.removeChild(
                buttons[buttons.length - (i - rightButtonCountDiff) - 1]
            ); */
    } else if (rightButtonCountDiff > 0) {
        for (let i = 0; i < rightButtonCountDiff; i++)
            topButtons.appendChild(
                createButtonByKey(
                    keyIndexToKey(
                        normalizeIntoRange(
                            getIndexOfButtonKey(
                                topButtons.lastElementChild.dataset.key
                            ) + 1,
                            buttonData.length
                        )
                    )
                )
            );
    }

    // 스크롤링
    scrollToCenter(evt.target);
    getActiveCategoryButton().classList.remove("active");
    evt.target.classList.add("active");
}

let isCategoryButtonColumnSynchronizationEnabled = true;
function scrollPostBoardColumnIntoView(target, smooth = true) {
    const parent = document.querySelector(".post-board-columns");
    const parentRect = parent.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    let scrollDelta =
        targetRect.left +
        targetRect.width / 2 -
        (parentRect.left + parentRect.right) / 2;
    parent.scrollBy({
        left: scrollDelta,
        behavior: smooth ? "smooth" : "instant",
    });
}

function getMostShownPostBoardColumn() {
    const columns = [...document.querySelectorAll("article.column")];

    // 얼마나 보이는 지 확인
    const parent = document.querySelector(".post-board-columns");
    const parentWidth = parent.getBoundingClientRect().width;
    const records = columns.map((i) => {
        return {
            target: i,
            intersectionRatio:
                (Math.min(
                    i.getBoundingClientRect().right,
                    parent.getBoundingClientRect().right
                ) -
                    Math.max(
                        i.getBoundingClientRect().left,
                        parent.getBoundingClientRect().left
                    )) /
                parentWidth,
        };
    });

    // 가장 잘 보이는 애 가져오기
    const mostlyShown = records.sort(
        (a, b) => b.intersectionRatio - a.intersectionRatio
    )[0];

    return mostlyShown;
}

{
    let timeoutIdx = null;

    /**
     * 현재 활성화된 카테고리 버튼의 왼쪽에 있는 버튼을 가져온다. (post-board column의 무한 스크롤 구현에 쓰임)
     */
    function getLeftOfActiveCategoryButton() {
        const buttons = [
            ...document.querySelectorAll("nav.top-category-buttons > button"),
        ];
        return buttons[buttons.indexOf(getActiveCategoryButton()) - 1];
    }

    /**
     * 현재 활성화된 카테고리 버튼의 오른쪽에 있는 버튼을 가져온다. (post-board column의 무한 스크롤 구현에 쓰임)
     */
    function getRightOfActiveCategoryButton() {
        const buttons = [
            ...document.querySelectorAll("nav.top-category-buttons > button"),
        ];
        return buttons[buttons.indexOf(getActiveCategoryButton()) + 1];
    }

    /**
     * 현재 보고 있는 post-board column이 변경됐을 시
     * 그에 걸맞는 category button을 활성화시킨다.
     */
    function syncCategoryButtonAndColumn() {
        const activeButton = getActiveCategoryButton();
        const shownColumn = getMostShownPostBoardColumn().target;
        if (
            activeButton.dataset.key !== shownColumn.dataset.key && // 보여지고 있는 post-board column과 활성화된 버튼이 불일치하고
            isCategoryButtonColumnSynchronizationEnabled // 동기화가 활성화되어 있다면
        ) {
            prepareChangeActiveButton(
                getCategoryButtonByKey(shownColumn.dataset.key)
            ); // 필요한 버튼들을 생성하고
            changeActiveButton(getCategoryButtonByKey(shownColumn.dataset.key)); // 알맞은 버튼을 활성화한다.
        }
    }
    listenHorizontalDragEnd(() => {
        if (timeoutIdx !== null) clearTimeout(timeoutIdx);

        timeoutIdx = setTimeout(fixChromeSnapBug, 1000);
        // Q. 왜 for 문을 쓰나요?
        // A. 버그 방지...
        for (let i = 0; i < 3; i++) {
            setTimeout(syncCategoryButtonAndColumn, 50 + i * 50);
        }
    });

    /**
     * 크롬에서 scroll-snap css의 구현이 달라 생기는 버그 해결 (완벽하진 않으나 높은 확률로 해결된다!)
     */
    function fixChromeSnapBug() {
        // 가장 잘 보이는 애 가져오기
        const mostShown = getMostShownPostBoardColumn();

        // 덜 스크롤됐으면 끝까지 스크롤
        if (mostShown.intersectionRatio < 0.99) {
            scrollPostBoardColumnIntoView(mostShown.target);
        }
    }
}

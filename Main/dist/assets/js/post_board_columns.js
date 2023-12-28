let isCategoryButtonColumnSynchronizationEnabled = true;

function scrollPostBoardColumnIntoView(target, smooth = true) {
    const parent = document.querySelector(".post-board-columns");
    const parentRect = parent.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    let scrollDelta =
        targetRect.left +
        targetRect.width / 2 -
        (parentRect.left + parentRect.right) / 2;

    // Safari 버그
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        smooth = false;
    }

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

    /**
     * 무한 루프 구현
     */
    function infinitePostColumnLoop() {
        // column
        const activeColumn = getMostShownPostBoardColumn();
        const columnParent = document.querySelector(".post-board-columns");
        let columns = [...document.querySelectorAll("article.column")];
        let activeColumnIdx = columns.indexOf(activeColumn.target);
        const columnIdxCenter = (columns.length - 1) / 2;

        // column이 덜 보이거나 굳이 좌우를 바꿀 필요가 없으면 skip
        if (
            activeColumn.intersectionRatio < 1 ||
            columnIdxCenter === activeColumnIdx
        )
            return;

        // scrollTop 저장
        columns.forEach((i) => (i.dataset.scrollTop = i.scrollTop));

        // 셔플링
        while (columnIdxCenter !== activeColumnIdx) {
            if (columnIdxCenter > activeColumnIdx) {
                columnParent.insertBefore(
                    columnParent.lastElementChild,
                    columnParent.firstChild
                );
            } else if (columnIdxCenter < activeColumnIdx) {
                columnParent.appendChild(columnParent.firstChild);
            }
            changed = true;
            columns = [...document.querySelectorAll("article.column")];
            activeColumnIdx = columns.indexOf(activeColumn.target);
        }

        // scrollTop 복원
        if (changed) {
            scrollPostBoardColumnIntoView(activeColumn.target, false);
            columns.forEach((i) => (i.scrollTop = i.dataset.scrollTop));
        }
    }
    document
        .querySelector(".post-board-columns")
        .addEventListener("scroll", () => {
            const width = document
                    .querySelector("article.column")
                    .getBoundingClientRect().width,
                left =
                    document.querySelector(".post-board-columns").scrollWidth /
                        2 -
                    width * 1.5 -
                    2,
                right = left + width * 2 + 2;

            console.log(
                `${left} ${
                    document.querySelector(".post-board-columns").scrollLeft
                } ${right}`
            );

            let reached = true;
            if (document.querySelector(".post-board-columns").scrollLeft < left)
                document
                    .querySelector(".post-board-columns")
                    .scrollTo({ left, behavior: "instant" });
            else if (
                document.querySelector(".post-board-columns").scrollLeft > right
            )
                document
                    .querySelector(".post-board-columns")
                    .scrollTo({ left: right, behavior: "instant" });
            else reached = false;

            if (reached) {
                infinitePostColumnLoop();
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

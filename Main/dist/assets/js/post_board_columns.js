{
    /**
     * 활성화된 상단 카테고리 버튼과 활성화된 post column을 post column을 기준으로 동기화합니다.
     */
    function synchronizePostBoardColumnAndTopCategoryButtons() {
        const currentActivePostColumn = scroller.getCurrentlyMostVisibleChild();
        topCategoryNav.activateButton(
            topCategoryNav.getCategoryButtonByKey(
                currentActivePostColumn.dataset.key
            ),
            true
        );
    }

    setInterval(synchronizePostBoardColumnAndTopCategoryButtons, 250);
}

import "../styles/index.scss";
import { HorizontalInfinityScroller } from "./lib/infinity_scroller";
import { TopCategoryButtonNav } from "./top_category_button_nav";
import handleOutsideScroll from "./handle_outside_scroll";
import SmoothScrollbar from "smooth-scrollbar";

type Column = {
    id: string;
    label: string;
    prepare: (container: HTMLElement) => void;
};

export default function PrepareHorizontalInfiniteScrollLayout(
    columns: Column[],
) {
    const buttonData = columns.map((column) => {
        const article = document.createElement("article");
        article.className = "column";
        article.dataset.key = column.id;
        document.querySelector(".post-board-columns")?.appendChild(article);

        column.prepare(article);

        return {
            label: column.label,
            key: column.id,
        };
    });

    // Post board column의 좌우 스크롤
    const scroller = new HorizontalInfinityScroller(
        document.querySelector(".post-board-columns")!,
    );

    // 상단 카테고리 버튼 nav의 좌우 스크롤
    const categoryNav = new TopCategoryButtonNav(
        buttonData,
        document.querySelector("nav.top-category-buttons")!,
        scroller,
    );

    scroller.addScrollEventListener(() => {
        const basis = scroller.centerEnsuredBasis();
        categoryNav.activateWithMarginToBasis(
            scroller._children()[basis.basisIndex].dataset.key as string,
            basis.offset! / scroller._rootWidth(),
        );
    });

    // Post board column이 좌우 스크롤됐다면 상단 카테고리 버튼도 변경하낟.
    scroller.addTouchDragScrollEventListener((key, direction) => {
        if (categoryNav._getActiveButton().dataset.key !== key)
            /**
             * 방향(direction)을 주는 이유:
             * Post board column의 스크롤 방향과 상단 카테고리 버튼의 스크롤 방향을
             * 동일하게 하려고
             */
            categoryNav.activateButtonByKey(key, true, direction);
    });

    // container 밖에서 스크롤해도 container가 스크롤되도록 설정
    handleOutsideScroll(
        (delta, wheel) => {
            const scrollBar = SmoothScrollbar.get(
                scroller
                    .getCurrentlyMostVisibleChild()!
                    .querySelector("[data-scrollbar]")!,
            )!;
            if (wheel) {
                scrollBar.addMomentum(0, delta);
            } else {
                scrollBar.setMomentum(0, delta * 1.5);
            }
        },
        () =>
            scroller
                .getCurrentlyMostVisibleChild()
                ?.querySelector("[data-scrollbar]") ?? null,
    );

    return { scroller, categoryNav };
}

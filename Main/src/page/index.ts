import PostBoardApiClient from "../api/posts";
import createFloatingButton, {
    addFloatingButonListener,
} from "../floating_button";
import { displayMainPostBoard } from "../home_post_board";
import { setupPostBoard } from "../post_board";
import { InitTopNav } from "../top_logo_navbar";
import PrepareHorizontalInfiniteScrollLayout from "../prepare_horizontal_infinite_scroll_layout";

createFloatingButton("home");

(async () => {
    return {
        mainBoard: await PostBoardApiClient.getMainBoard(),
        postBoards: await PostBoardApiClient.getPostBoards(),
    };
})()
    .then((data) => {
        return [
            {
                label: "HOME",
                id: "home",
                prepare(element: HTMLElement) {
                    element.classList.add("main");

                    displayMainPostBoard(element, data.mainBoard);
                },
            },
            ...data.postBoards.map((i) => ({
                label: i.title,
                id: i.id,
                prepare(element: HTMLElement) {
                    setupPostBoard(element, i.fetchNextSection);
                },
            })),
        ];
    })
    .then(PrepareHorizontalInfiniteScrollLayout)
    .then(({ scroller }) => {
        // Post board column의 좌우 스크롤
        // 상하 스크롤시 플로팅버튼을 변경한다.
        scroller.addEventListenerToChildren("scroll", (evt) => {
            const target = evt.target as HTMLElement;
            if (target.scrollTop !== 0) createFloatingButton("up");
            else createFloatingButton("home");
        });

        //let _contentScrollerScrollingByUserDrag = false;
        // 좌우 스크롤시 플로팅버튼을 변경한다.
        scroller.addScrollEventListener(() => {
            if (
                scroller.getCurrentlyMostVisibleChild(false)?.dataset?.key !==
                "home"
            ) {
                createFloatingButton("home");
            } else {
                createFloatingButton(
                    document.querySelector(".column.main")?.scrollTop === 0
                        ? "home"
                        : "up",
                );
            }
        });

        // 플로팅 버튼 동작 설정
        addFloatingButonListener(() => {
            const currentVisibleChild =
                scroller.getCurrentlyMostVisibleChild(true);
            if (currentVisibleChild === null) return;

            if (currentVisibleChild.scrollTop !== 0)
                currentVisibleChild.scrollTo({ top: 0, behavior: "smooth" });
            else if (currentVisibleChild.dataset.key !== "home")
                scroller.scrollIntoCenterView(
                    document.querySelector(".column.main")!,
                    true,
                );
        });

        InitTopNav(true);
    });

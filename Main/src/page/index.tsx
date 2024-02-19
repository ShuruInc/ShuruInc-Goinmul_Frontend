import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/index.scss";
import PostBoardApiClient, { PostBoardData } from "../api/posts";
import FloatingButton from "../floating_button";
import TopNavbar from "../top_navbar/top_navbar";
import { HomePostBoard, HomePostBoardProp } from "../post_board/home_section";
import PostBoard from "../post_board/post_board";
import { TopCategoryButtonNav } from "../top_category_button_nav";
import { HorizontalInfinityScroller } from "../lib/infinity_scroller";
import ReactTopCategoryButtonNav from "../lib_react_wrapper/top-category-nav";
import SmoothScrollbar from "smooth-scrollbar";
import { rankingSection as rankingSectionClassName } from "../../styles/index_page/ranking-section.module.scss";
import handleOutsideScroll from "../handle_outside_scroll";
import { createRoot } from "react-dom/client";

function MainPage() {
    const [data, setData] = useState<{
        home: HomePostBoardProp;
        boards: PostBoardData[];
    } | null>(null);
    const topCategoryNavRef = useRef<TopCategoryButtonNav>(null);
    const scrollerDivRef = useRef<HTMLDivElement>(null);
    const [floatingButtonType, setFloatingButtonType] = useState<"home" | "up">(
        "home",
    );
    const [scroller, setScroller] = useState<HorizontalInfinityScroller | null>(
        null,
    );
    const mainColumnRef = useRef<HTMLDivElement>(null);

    const menuData = useMemo(
        () =>
            [
                {
                    label: "HOME",
                    key: "home",
                },
            ].concat(
                data?.boards.map((i) => ({
                    label: i.title,
                    key: i.id,
                })) ?? [],
            ),
        [data?.boards],
    );

    useEffect(() => {
        if (data === null)
            (async () => {
                return {
                    home: await PostBoardApiClient.getMainBoard(),
                    boards: await PostBoardApiClient.getPostBoards(),
                };
            })().then(setData);
    }, [data]);

    useEffect(() => {
        if (scrollerDivRef.current !== null) {
            setScroller(new HorizontalInfinityScroller(scrollerDivRef.current));
        }
    }, []);

    useEffect(() => {
        if (
            scroller !== null &&
            topCategoryNavRef.current !== null &&
            data !== null
        ) {
            // 상하 스크롤시 플로팅버튼을 변경한다.
            scroller.addEventListenerToChildren("scroll", (evt) => {
                const target = evt.target as HTMLElement;
                if (target.scrollTop !== 0) setFloatingButtonType("up");
                else setFloatingButtonType("home");
            });

            //let _contentScrollerScrollingByUserDrag = false;
            // 좌우 스크롤시 플로팅버튼을 변경한다.
            scroller.addScrollEventListener(() => {
                if (
                    scroller.getCurrentlyMostVisibleChild(false)?.dataset
                        ?.key !== "home"
                ) {
                    setFloatingButtonType("home");
                } else {
                    setFloatingButtonType(
                        mainColumnRef.current?.scrollTop === 0 ? "home" : "up",
                    );
                }

                //_contentScrollerScrollingByUserDrag = byUserDrag;
                const basis = scroller.centerEnsuredBasis();
                topCategoryNavRef.current?.activateWithMarginToBasis(
                    scroller._children()[basis.basisIndex].dataset
                        .key as string,
                    basis.offset! / scroller._rootWidth(),
                );
            });

            // Post board column이 좌우 스크롤됐다면 상단 카테고리 버튼도 변경하낟.
            scroller.addTouchDragScrollEventListener((key, direction) => {
                if (
                    topCategoryNavRef.current?._getActiveButton().dataset
                        .key !== key
                )
                    /**
                     * 방향(direction)을 주는 이유:
                     * Post board column의 스크롤 방향과 상단 카테고리 버튼의 스크롤 방향을
                     * 동일하게 하려고
                     */
                    topCategoryNavRef.current?.activateButtonByKey(
                        key,
                        true,
                        direction,
                    );
            });

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
        }
    }, [scroller, data]);

    // 플로팅 버튼 동작 설정
    const floatingButtonClickHandler = () => {
        if (scroller === null) return;

        const currentVisibleChild = scroller.getCurrentlyMostVisibleChild(true);
        if (currentVisibleChild === null) return;

        if (currentVisibleChild.scrollTop !== 0)
            currentVisibleChild.scrollTo({ top: 0, behavior: "smooth" });
        else if (currentVisibleChild.dataset.key !== "home")
            scroller.scrollIntoCenterView(mainColumnRef.current!, true);
    };

    const goToRankings = () => {
        if (scroller === null || topCategoryNavRef.current === null) return;

        if (
            scroller.getCurrentlyMostVisibleChild(true)?.dataset?.key !== "home"
        ) {
            let sign = scroller.scrollIntoCenterView(
                mainColumnRef.current!,
                true,
            );
            topCategoryNavRef.current.activateButtonByKey("home", true, sign);
        }
        const tryScroll: () => void = () => {
            const scrollBar = SmoothScrollbar.get(
                mainColumnRef.current!.querySelector("[data-scrollbar]")!,
            );

            const h2 = document.querySelector(
                `${rankingSectionClassName} h2`,
            ) as HTMLElement;
            const rect = h2?.getBoundingClientRect()!;
            if (rect.width === 0 || rect.height === 0)
                return setTimeout(tryScroll, 1);

            // 여백(150)을 안 주면 viewport 맨 위에 딱 맞아서 상단 로고 nav에 가려진다
            scrollBar?.scrollIntoView(h2, { offsetTop: 150 });
        };
        // Q. 왜 400ms인가요?
        // A. 너무 짧으면 상단 카테고리 버튼 스크롤링이 중간에 멈추는 버그가 발생한다.
        setTimeout(tryScroll, 400);
    };

    useEffect(() => {
        if (location.hash.includes("ranking")) goToRankings();
    }, []);

    return (
        <>
            <TopNavbar type="normal" onRankingClick={goToRankings}></TopNavbar>
            <ReactTopCategoryButtonNav
                buttonData={menuData}
                getScroller={() => scroller!}
            ></ReactTopCategoryButtonNav>
            <div id="mainContainer" className="main-container">
                <div className="post-board-columns" ref={scrollerDivRef}>
                    <div className="column">
                        <HomePostBoard
                            popularTests={data!.home.popularTests}
                            rankings={data!.home.rankings}
                        ></HomePostBoard>
                    </div>
                    {data?.boards.map((i) => (
                        <PostBoard
                            getNextSection={i.fetchNextSection}
                            key={i.id}
                        ></PostBoard>
                    ))}
                </div>
            </div>
            <FloatingButton
                type={floatingButtonType}
                onClick={floatingButtonClickHandler}
            ></FloatingButton>
        </>
    );
}

const root = createRoot(document.body);
root.render(<MainPage></MainPage>);

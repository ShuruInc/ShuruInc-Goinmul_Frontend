import "tippy.js/dist/tippy.css";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import TopNavbarContent from "./top_navbar_content";
import { createClickBugFixHandler } from "./top_navbar_click_bug_fix";
import logoImages from "./logo_Images";
import { setupTopNavbarAnimationOnScroll } from "./animation";
import classNames from "classnames";
import "../../styles/common/_top-logo-nav.scss";

export type TopNavbarProgressColor = "yellow" | "red";
export type TopNavbarType =
    /** 일반 */
    | "normal"
    /** 퀴즈 풀이중 */
    | "quiz"
    /** 검색중 */
    | "search";

type TopNavbarProp = {
    /** 네브바 유형 */
    type: TopNavbarType;
    /** 랭킹 버튼 클릭시 핸들러 */
    onRankingClick?: () => void;
    /** 애니메이션 유무 */
    animated?: boolean;
    /** 진행바 정보 */
    progress?: {
        /** 진행 텍스트 */
        text: string;
        /** 진행률 */
        value: number;
        /** 진행바/진행 텍스트 색깔 */
        color?: TopNavbarProgressColor;
    };
    /** 시험 제목 */
    testTitle?: string;
    /** 검색 관련 핸들러 */
    search?: {
        onInput: (value: string) => void;
        value: string;
    };
    /** 검색 아이콘 왼쪽 버블 텍스트 */
    searchBubbleText?: string;
};

export default function TopNavbar(props: TopNavbarProp) {
    let [logoImgIndex, setLogoImgIndex] = useState<number>(0);
    const navbarRef = useRef<HTMLDivElement>(null);
    const logoImgSrc = useMemo(() => logoImages[logoImgIndex], [logoImgIndex]);
    const onRankingClick =
        props.onRankingClick ??
        (() => {
            location.href = "/#ranking";
        });
    const onGoBackClick = () => {
        history.back();
    };

    // TO-DO: tippy

    let content: ReactNode;
    switch (props.type) {
        case "normal":
            content = TopNavbarContent({
                type: "normal",
                logoImgSrc,
                onRankingClick,
                onSearchClick: () => {
                    location.href = "/search.html";
                },
                tippyText: props.searchBubbleText,
            });
            break;
        case "quiz":
            content = TopNavbarContent({
                type: "quiz",
                onGoBackClick,
                title: props.testTitle ?? "고인물 테스트",
                progress: props.progress ?? {},
            });
            break;
        case "search":
            content = TopNavbarContent({
                type: "search",
                onGoBackClick,
                ...props.search!,
            });
    }

    let isHiddenState = useState<boolean>(false);
    let logoChangeAllowedState = useState<boolean>(true);
    let firstLoadState = useState<boolean>(true);
    let lastScrollTopState = useState<number>(0);
    useEffect(() => {
        if (props.animated) {
            console.log(`${firstLoadState[0]} ${lastScrollTopState[0]}`);
            return setupTopNavbarAnimationOnScroll(
                [logoImgIndex, setLogoImgIndex],
                isHiddenState,
                logoChangeAllowedState,
                firstLoadState,
                lastScrollTopState,
            );
        }
    }, [
        props.animated,
        logoImgIndex,
        isHiddenState[0],
        logoChangeAllowedState[0],
        firstLoadState[0],
        lastScrollTopState[0],
    ]);

    return (
        <div
            id="topFixedBar"
            className={classNames(
                "top-fixed-bar",
                isHiddenState[0] && "is-hidden",
                props.type === "search" && "search",
            )}
            ref={navbarRef}
            onClick={createClickBugFixHandler(navbarRef)}
            style={{
                transform: `translateX(-50%) translateY(${
                    isHiddenState[0] ? "-30%" : "0%"
                })`,
            }}
        >
            {content}
            <div className="progress-container">
                <div
                    className="progress"
                    style={{ width: `${props.progress?.value ?? 0}%` }}
                ></div>
            </div>
        </div>
    );
}

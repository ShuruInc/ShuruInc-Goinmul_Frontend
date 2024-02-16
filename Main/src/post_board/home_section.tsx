import Footer from "../footer";
import { Post } from "./types";
import SmoothScrollbar from "smooth-scrollbar";
import { Scrollbar as ReactSmoothScrollbar } from "smooth-scrollbar-react";
import "../smooth-scrollbar-scroll-lock-plugin";
import { RankingItem, RankingSection } from "./ranking_section";
import { useEffect, useRef } from "react";
import PostSection from "./post_section";

/**
 * 홈 post board에서 표시될 데이터
 */
export type HomePostBoardProp = {
    /** 인기 BEST 테스트 데이터 */
    popularTests: Post[];
    /** 명예의 전당 데이터 */
    rankings: { [key: string]: RankingItem[] };
};

/**
 * 홈 post board입니다.
 */
export function displayMainPostBoard({
    popularTests,
    rankings,
}: HomePostBoardProp) {
    const scrollbarRef = useRef<SmoothScrollbar>(null);
    useEffect(() => {
        if (scrollbarRef.current)
            scrollbarRef.current.track.yAxis.element.remove();
    }, []);

    return (
        <ReactSmoothScrollbar ref={scrollbarRef} style={{ height: "100vh" }}>
            <PostSection
                title="인기 BEST"
                landscape={popularTests[0]}
                portraits={popularTests.slice(1)}
            ></PostSection>
            {Object.entries(rankings).map(([title, i]) => (
                <RankingSection
                    data={i}
                    title={title}
                    key={title}
                ></RankingSection>
            ))}
            <Footer></Footer>
        </ReactSmoothScrollbar>
    );
}

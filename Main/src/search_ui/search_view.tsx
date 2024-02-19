import { icon } from "@fortawesome/fontawesome-svg-core";
import { faSearch, faFaceSadTear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState, CSSProperties, useEffect } from "react";
import FloatingButton from "../floating_button";
import TopNavbar from "../top_navbar/top_navbar";
import PopularQueries from "./popular_queries";
import KeywordBubbles from "./keyword_bubbles";
import { Post } from "../post_board/types";
import PostSection from "../post_board/post_section";

type SearchViewProp = {
    result?: Post[];
    similar?: Post[];
    recommendedPosts?: Post[];
    popularQueries?: string[];
    recommendedQueries?: string[];
    onSearchInputValueChanged: (newInput: string) => void;
    onRequestClick: () => void;
    searchInputValue: string;
};

export default function SearchView({
    result,
    similar,
    recommendedPosts,
    popularQueries,
    recommendedQueries,
    onSearchInputValueChanged,
    onRequestClick,
    searchInputValue,
}: SearchViewProp) {
    const [requested, setRequested] = useState<boolean>(false);
    const searchIcon = useMemo(
        () =>
            `url("data:image/svg+xml;,${encodeURIComponent(
                icon(faSearch, { styles: { opacity: "0.5" } }).html[0],
            )}")`,
        [],
    );
    const activeSearchIcon = useMemo(
        () =>
            `url("data:image/svg+xml;,${encodeURIComponent(
                icon(faSearch).html[0],
            )}")`,
        [],
    );

    useEffect(() => setRequested(false), [searchInputValue]);

    return (
        <div
            style={
                {
                    "--search-icon": searchIcon,
                    "--search-icon-active": activeSearchIcon,
                } as CSSProperties
            }
        >
            <TopNavbar type="search"></TopNavbar>
            <div className="main-container">
                <article>
                    {popularQueries && (
                        <PopularQueries
                            queries={popularQueries}
                        ></PopularQueries>
                    )}
                    {recommendedQueries && (
                        <KeywordBubbles
                            bubbles={recommendedQueries}
                            onBubbleClick={(text) =>
                                onSearchInputValueChanged(text)
                            }
                        ></KeywordBubbles>
                    )}
                    {result && result.length > 0 ? (
                        <PostSection
                            title={`총 ${result.length}건의 검색 결과가 있습니다.`}
                            portraits={result}
                        ></PostSection>
                    ) : (
                        <section className="no-results display-none">
                            <FontAwesomeIcon
                                icon={faFaceSadTear}
                            ></FontAwesomeIcon>
                            <div className="text">
                                <h2>검색 결과가 없습니다 ㅠ^ㅠ</h2>
                                <p>
                                    아직 문제가 출제되지 않았어요.
                                    <br />
                                    아래 버튼을 눌러 출제를 요청하실 수
                                    있습니다.
                                </p>
                            </div>
                            {requested ? (
                                <button
                                    className="request requested"
                                    disabled
                                    onClick={onRequestClick}
                                >
                                    요청되었습니다.
                                </button>
                            ) : (
                                <button
                                    className="request"
                                    onClick={onRequestClick}
                                >
                                    출제 요청하기
                                </button>
                            )}
                        </section>
                    )}
                    {similar && similar.length > 0 && (
                        <PostSection
                            title="연관된 모의고사"
                            portraits={similar}
                        ></PostSection>
                    )}
                    {recommendedPosts && recommendedPosts.length > 0 && (
                        <PostSection
                            title="추천 모의고사"
                            portraits={recommendedPosts}
                        ></PostSection>
                    )}
                </article>
            </div>
            <FloatingButton
                onClick={() => (location.href = "/")}
            ></FloatingButton>
        </div>
    );
}

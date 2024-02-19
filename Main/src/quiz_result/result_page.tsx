import TopNavbar from "../top_navbar/top_navbar";
import styles from "../../styles/quiz/result.module.scss";
import shareBtnStyles from "../../styles/common/share-buttons.module.scss";
import { ReactNode, useEffect, useRef, useState } from "react";
import ResultBox from "./result_box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRankingStar } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import PostSection from "../post_board/post_section";
import FloatingButton from "../floating_button";
import SearchApiClient from "../api/search";
import { Post } from "../post_board/types";
import { QuizResult, QuizSession, QuizSessionInfo } from "../api/quiz_session";
import PostBoardApiClient from "../api/posts";
import initShare, { ShareDatas } from "../init_share";
import html2canvas from "html2canvas";
import addPadding from "../util/add_padding_to_canvas";
import getResultShareData from "./share_template";

type ResultPage = {
    sessionId?: string;
};

type CombinedResultData = {
    result: QuizResult | null;
    nerdTest: Post | null;
    topCategory: { name: string; id: number } | null;
    sessionInfo: QuizSessionInfo | null;
};

export default function ResultPage(props: ResultPage) {
    const sessionId =
        props.sessionId ??
        new URLSearchParams(location.search).get("session") ??
        "";
    const session = new QuizSession(sessionId);

    const [loading, setLoading] = useState<boolean>(false);
    const [{ result, nerdTest, topCategory, sessionInfo }, setResult] =
        useState<CombinedResultData>({
            result: null,
            nerdTest: null,
            topCategory: null,
            sessionInfo: null,
        });
    const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
    const [shareData, setShareData] = useState<ShareDatas | null>(null);
    const isNerdTest = Boolean(result?.nickname && result.hashtag);
    const resultBoxRef = useRef<HTMLDivElement>(null);
    const url = "http://example.com";

    useEffect(() => {
        const loadTime = Date.now();

        SearchApiClient.recommend(8)
            .then((posts) => {
                setRecommendedPosts(posts);
            })

            .then(async () => {
                const topCategory = await session.firstCategory();
                return {
                    topCategory,
                    result: await session.result(),
                    nerdTest: await PostBoardApiClient.getNerdTestOf(
                        topCategory.id,
                    ),
                    sessionInfo: await session.sessionInfo(),
                };
            })
            .then((combinedResult) => {
                if (combinedResult.result === null) {
                    return alert("시험이 아직 다 안 끝났습니다!");
                }
                setResult(combinedResult);
                setTimeout(
                    () => {
                        setLoading(false);
                    },
                    Math.max(1, 1000 - (Date.now() - loadTime)),
                );
            });
    }, []);

    useEffect(() => {
        if (
            result !== null &&
            shareData === null &&
            resultBoxRef.current !== null
        ) {
            html2canvas(resultBoxRef.current)
                .then(addPadding)
                .then(
                    (blob) =>
                        new File([blob], "result.png", { type: "image/png" }),
                )
                .then((imageFile) =>
                    setShareData(
                        getResultShareData({
                            url,
                            isNerdTest,
                            result,
                            imageFile,
                        }),
                    ),
                );
        }
    }, [result]);

    let shareButtons: ReactNode = null;
    if (shareData !== null) {
        const handlers = initShare({ content: shareData });

        shareButtons = handlers.webShareAvailable ? (
            <button
                className={classNames(shareBtnStyles.webShare, styles.shareBtn)}
                onClick={handlers.doWebShare}
            >
                친구한테 자랑하기
            </button>
        ) : (
            <>
                <button
                    className={classNames(
                        shareBtnStyles.twitter,
                        styles.shareBtn,
                    )}
                    onClick={handlers.doTwitterShare}
                >
                    트친한테 자랑하기
                </button>
                <button
                    className={classNames(
                        shareBtnStyles.kakao,
                        styles.shareBtn,
                    )}
                    onClick={handlers.doKakaoShare}
                >
                    실친한테 자랑하기
                </button>
            </>
        );
    }

    return (
        <div>
            <TopNavbar
                type="normal"
                progress={{ value: 100, text: "" }}
            ></TopNavbar>
            <div>
                {loading ? (
                    <article className={styles.loading}></article>
                ) : (
                    <article className={styles.withResult}>
                        {isNerdTest && (
                            <button className={styles.rankingsAd}>
                                <FontAwesomeIcon
                                    icon={faRankingStar}
                                ></FontAwesomeIcon>
                                {result!.nickname}#{result!.hashtag} 랭킹 보러
                                가기
                            </button>
                        )}
                        {isNerdTest ? (
                            <ResultBox
                                nerd
                                ref={resultBoxRef}
                                date={new Date()}
                                hashtag={result!.hashtag!}
                                points={result!.points!}
                                nickname={result!.nickname!}
                                ranking={result!.ranking!}
                                topCategory={topCategory!.name}
                            ></ResultBox>
                        ) : (
                            <ResultBox
                                nerd={false}
                                ref={resultBoxRef}
                                date={new Date()}
                                percentage={result!.percentage!}
                                points={result!.points}
                                lowCategory={sessionInfo!.title}
                                middleCategory={sessionInfo!.category}
                                link={{
                                    href: nerdTest!.href,
                                    text: nerdTest!.title,
                                }}
                            ></ResultBox>
                        )}
                        <button
                            className={styles.continue}
                            onClick={(evt) => {
                                evt.preventDefault();

                                location.href =
                                    "/quiz/solve.html?id=" +
                                    encodeURIComponent(result!.quizId);
                            }}
                        >
                            재응시
                        </button>
                        <PostSection
                            title="다른 모의고사 풀기"
                            portraits={recommendedPosts}
                            className={styles.postSection}
                        ></PostSection>
                    </article>
                )}
            </div>
            <FloatingButton
                onClick={() => (location.href = "/")}
            ></FloatingButton>
        </div>
    );
}

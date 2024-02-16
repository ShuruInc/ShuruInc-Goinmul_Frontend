import { createPodiumImageUrl } from "../podium";
import setHorizontalDragScrollOnDesktop from "../util/horizontal_drag_to_scroll_on_desktop";
import "../smooth-scrollbar-scroll-lock-plugin";
import styles from "../../styles/index_page/ranking-section.module.scss";
import { useEffect, useMemo, useRef } from "react";

/**
 * 랭킹 아이템
 */
export type RankingItem = {
    nickname: string;
    hashtag: string;
    score: number;
};

type RankingSectionProp = {
    title: string;
    data: RankingItem[];
};

/**
 * 랭킹을 표시하는 section입니다.
 */
export function RankingSection({ title, data }: RankingSectionProp) {
    const nicknameAndHashtag = (data: RankingItem) =>
        `${data.nickname}#${data.hashtag}`;

    const podium = useMemo(
        () =>
            createPodiumImageUrl(
                data.length < 1 ? "" : nicknameAndHashtag(data[0]),
                data.length < 2 ? "" : nicknameAndHashtag(data[1]),
                data.length < 3 ? "" : nicknameAndHashtag(data[2]),
            ),
        data.slice(0, 3),
    );
    data.splice(0, 3);

    const moreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (moreRef.current) setHorizontalDragScrollOnDesktop(moreRef.current);
    }, []);

    const mores = data
        .slice(3)
        .reduce((pv, cv) => {
            if (pv.length === 0 || pv[pv.length - 1].length >= 3) pv.push([]);

            pv[pv.length - 1].push(cv);
            return pv;
        }, [] as RankingItem[][])
        .map((three, idx) => {
            const start = 4 + idx * 3;

            return (
                <div className={styles.moreColumn}>
                    <ol start={start}>
                        {three.map((i, idx) => (
                            <li>
                                <div className={styles.marker}>
                                    {start + idx}
                                </div>
                                <div>
                                    {i.nickname}
                                    <span className={styles.hashtag}>
                                        #{i.hashtag}
                                    </span>
                                    &nbsp; (#{i.score}점)
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            );
        });

    return (
        <section className={styles.rankingSection}>
            <h2>{title}</h2>
            <img className={styles.podium} src={podium} />
            <div className={styles.more} ref={moreRef}>
                {mores}
            </div>
        </section>
    );
}

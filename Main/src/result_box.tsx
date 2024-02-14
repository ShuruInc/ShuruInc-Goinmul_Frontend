import { faRankingStar } from "@fortawesome/free-solid-svg-icons";
import { encode } from "html-entities";
import goldMedal from "../assets/medal/gold.png";
import silverMedal from "../assets/medal/silver.png";
import cooperMedal from "../assets/medal/cooper.png";
import { randomMedalEnabled } from "./env";
import styles from "../styles/quiz/result_box.module.scss";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type NerdTestResultElementContent = {
    nerd: true;
    hashtag: string;
    nickname: string;
    points: number;
    ranking: number;
    topCategory: string;
};

type NonNerdTestResultElementContent = {
    nerd: false;
    points: number;
    percentage: number;
    middleCategory: string;
    lowCategory: string;
    link: {
        text: string;
        href: string;
    };
};

type ResultElementContent = {
    nerd: boolean;
    date: Date;
} & (NerdTestResultElementContent | NonNerdTestResultElementContent);

function createTwoRowTable(headers: string[], data: string[]) {
    return (
        <table>
            <tr>
                {headers.map((i) => (
                    <th>{i}</th>
                ))}
            </tr>
            <tr>
                {data.map((i) => (
                    <td>{i}</td>
                ))}
            </tr>
        </table>
    );
}

export default function createResultElement(data: ResultElementContent) {
    let medal = null;
    switch (
        randomMedalEnabled
            ? Math.floor(Math.random() * 3) + 1
            : data.nerd
            ? data.ranking
            : 0
    ) {
        case 1:
            medal = goldMedal;
            break;
        case 2:
            medal = silverMedal;
            break;
        case 3:
            medal = cooperMedal;
            break;
    }

    const tableData = data.nerd
        ? [
              "수험번호",
              "성명",
              "점수",
              "랭킹",
              "#" + data.hashtag,
              data.nickname,
              data.points.toString() + "점",
              data.ranking.toString() + "등",
          ]
        : [
              "과목명",
              "점수",
              "상위",
              data.lowCategory,
              data.points.toString() + "점",
              data.percentage.toString() + "%",
          ];
    const tableColumnCount = tableData.length / 2;

    let comment: ReactNode = "";
    if (data.nerd) {
        comment = (
            <>
                왼족 상단의{" "}
                <FontAwesomeIcon
                    icon={faRankingStar}
                    style={{ width: "1em" }}
                ></FontAwesomeIcon>{" "}
                버튼을 누르면 실시간 랭킹을 확인할 수 있습니다.
            </>
        );
    } else if (data.points === 100) {
        comment = (
            <>
                완벽합니다! <a href={data.link.href}>{data.link.text}</a>에
                도전해 보시겠어요?
            </>
        );
    } else if (data.points >= 70) {
        comment = (
            <>
                굉장합니다! <a href={data.link.href}>{data.link.text}</a>에
                도전해 보시겠어요?
            </>
        );
    } else if (data.points >= 30) {
        comment = (
            <>
                휼룡합니다!
                <br />더 높은 점수에 도전해 보세요.
            </>
        );
    } else {
        comment = <>아쉽습니다! 다시 도전해 보시겠어요?</>;
    }

    return (
        <div className={styles.result}>
            <h1 className={styles.title}>
                <div className={styles.subtitle}>
                    $
                    {encode(
                        data.nerd
                            ? data.topCategory + " 고인물 테스트"
                            : data.middleCategory + " 모의고사",
                    )}
                </div>
                성적통지표
                {medal !== null && (
                    <div className={styles.medal}>
                        <img src={medal} />
                    </div>
                )}
            </h1>
            <div className={styles.content}>
                {createTwoRowTable(
                    tableData.slice(0, tableColumnCount),
                    tableData.slice(tableColumnCount),
                )}
                <time>
                    ${data.date.getFullYear()}. ${data.date.getMonth() + 1}. $
                    {data.date.getDate()}.
                </time>
                <p className={styles.comment}>{comment}</p>
            </div>
        </div>
    );
}

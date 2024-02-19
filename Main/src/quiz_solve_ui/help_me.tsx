import html2canvas from "html2canvas";
import initShare from "../init_share";
import addPadding from "../util/add_padding_to_canvas";
import { QuizProblem } from "./types";
import QuestionContent from "./question_box/question_content";
import AnswerFillinForShare from "./question_box/answer_fillin_for_share";
import createShareData from "./share_data";
import { QuizSessionInfo } from "../api/quiz_session";
import styles from "../../styles/quiz/help-me.module.scss";
import shareStyles from "../../styles/common/share-buttons.module.scss";
import { useRef } from "react";

type HelpMeProp = {
    question: QuizProblem & { index: number };
    sessionInfo: QuizSessionInfo;
    timerPaused?: boolean;
    onHelpMeExitRequest: () => void;
};

export default function HelpMe({
    question,
    sessionInfo,
    timerPaused,
    onHelpMeExitRequest: exitHelpMe,
}: HelpMeProp) {
    const problemBoxRef = useRef(null);

    const { doKakaoShare, doTwitterShare, doWebShare, webShareAvailable } =
        initShare({
            content: createShareData(sessionInfo),
            shareDataTransformer: async (shareData) => {
                // 공유 버튼을 눌렀을 때 공유 직전에 이미지를 설정한다.

                /**
                 * .problem-box가 보이지 않으면 svg 렌더링이 되지 않으므로
                 * .problem-box가 보일 때 svg 렌더링을 한다.
                 */
                const canvas = await html2canvas(problemBoxRef.current!, {
                    // 이미지가 안 보이는 버그 수정
                    useCORS: true,
                });
                const blob = await addPadding(canvas);

                // 이미지에 여백을 추가한다.
                if (shareData && blob) {
                    const file = new File([blob], "problem.png", {
                        type: "image/png",
                    });

                    // 공유 데이터에 이미지를 설정한다.
                    return {
                        ...shareData,
                        webShare: {
                            ...shareData.webShare,
                            files: [file],
                        },
                        image: file,
                    };
                }

                return shareData;
            },
        });

    return (
        <article className={styles.helpMe}>
            <h1>친구들야, 도와줘!</h1>
            {timerPaused && (
                <div className={styles.timerPaused}>
                    타이머가 일시정지 되었습니다.
                </div>
            )}
            <div className={styles.problemBox} ref={problemBoxRef}>
                <QuestionContent
                    question={question}
                    index={question.index}
                    share
                ></QuestionContent>
                <AnswerFillinForShare
                    question={question}
                ></AnswerFillinForShare>
            </div>
            <div className={styles.buttons}>
                {webShareAvailable ? (
                    <button
                        className={shareStyles.webShare}
                        onClick={(evt) => {
                            evt.preventDefault();
                            doWebShare();
                        }}
                    >
                        친구한테 물어보기
                    </button>
                ) : (
                    [
                        <button
                            className={shareStyles.twitter}
                            onClick={(evt) => {
                                evt.preventDefault();
                                doTwitterShare();
                            }}
                        >
                            트친한테 물어보기
                        </button>,
                        <button
                            className={shareStyles.kakao}
                            onClick={(evt) => {
                                evt.preventDefault();
                                doKakaoShare();
                            }}
                        >
                            실친한테 물어보기
                        </button>,
                    ]
                )}
                <button
                    className={shareStyles.continue}
                    onClick={(evt) => {
                        evt.preventDefault();
                        exitHelpMe();
                    }}
                >
                    이어서 풀기
                </button>
            </div>
        </article>
    );
}

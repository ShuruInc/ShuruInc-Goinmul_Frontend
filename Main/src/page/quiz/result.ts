import html2canvas from "html2canvas";
import "../../../styles/quiz";
import { QuizSession } from "../../api/quiz_session";
import SearchApiClient from "../../api/search";
import createFloatingButton, {
    addFloatingButonListener,
} from "../../floating_button";
import initShareButton from "../../init_share";
import {
    fillPlaceholderSectionInto,
    preparePlaceholderSection,
} from "../../post_board";
import { InitTopNav } from "../../top_logo_navbar";
import { getJosaPicker } from "josa";
import padCanvas from "../../canvas_padding";

const sessionId =
    new URLSearchParams(location.search.substring(1)).get("session") ?? "";
const session = new QuizSession(sessionId);

InitTopNav();
preparePlaceholderSection(document.querySelector(".post-section")!);
createFloatingButton("home");
addFloatingButonListener(() => (location.href = "/"));
SearchApiClient.recommend(8).then((posts) => {
    fillPlaceholderSectionInto(
        {
            portraits: posts,
        },
        document.querySelector(".post-section")!,
    );
});
(async () => {
    const result = await session.result();
    if (result === null)
        return alert("오류가 발생했습니다: 퀴즈가 아직 안 끝났습니다!");

    const whoami = document.querySelector(".whoami")!;
    if (result.nickname && result.hashtag) {
        whoami.querySelector(".nickname")!.textContent = result.nickname;
        whoami.querySelector(".hashtag")!.textContent = "#" + result.hashtag;
    } else {
        whoami.parentNode?.removeChild(whoami);
    }
    document.querySelector(".quiz-title")!.textContent = result.title;
    document.querySelector(".score")!.textContent = result.points + "점";
    if (typeof result.percentage !== "undefined") {
        document.querySelector(".rankings-ad")?.classList.add("display-none");
        document.querySelector(
            ".ranking",
        )!.innerHTML = `${result.comment}<br>당신은 상위 ${result.percentage}%`;
    } else
        document.querySelector(
            ".ranking",
        )!.innerHTML = `맞히셨습니다!<br>당신은 현재 랭킹 ${result.ranking}위!`;

    document.querySelector(".retry")?.addEventListener("click", (evt) => {
        evt.preventDefault();
        location.href =
            "/quiz/solve.html?skip_statistics=true&id=" +
            encodeURIComponent(result.quizId);
    });

    const changeShareData = initShareButton();

    const eunJosa = getJosaPicker("은");
    const url = "https://example.com";
    const canvas = padCanvas(
        await html2canvas(document.querySelector(".result")!),
    );
    const blob: Blob = await canvas.convertToBlob({ type: "iamge/png" });
    const imageFile = new File([blob], "result.png", { type: "image/png" });

    if (typeof result.nickname === "undefined")
        // 모의고사
        changeShareData({
            webShare: {
                url,
                title: `[${result.title}] 모의고사`,
                text: `${result.points}점을 넘을 수 있을까?`,
                files: [imageFile],
            },
            kakao: {
                title: `[${result.title}] 모의고사`,
                content: "이 점수를 넘을 수 있다면?\n↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓",
                buttonText: "나도 풀어보기",
                url,
            },
            twitter: {
                text: `[${result.title}] 모의고사
제 성적표를 공개합니다!
이 점수를 넘을 수 있다면?
⬇️⬇️⬇️⬇️⬇️
🔗 ${url}
#고인물테스트 #슈르네`,
            },
            image: imageFile,
        });
    // 고인물테스트
    else
        changeShareData({
            webShare: {
                url,
                title: `[${result.title}] 고인물 테스트`,
                text: `${result.points}점을 넘을 수 있을까?`,
                files: [imageFile],
            },
            kakao: {
                title: `[${result.title}] 고인물 테스트`,
                content: `당신의 친구 [${result.nickname}]${eunJosa(
                    result.nickname,
                )}
[${result.nickname}에 이만큼 고였습니다.
이 점수를 넘을 수 있다면?
↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓`,
                buttonText: "나도 풀어보기",
                url,
            },
            twitter: {
                text: `[${result.title}] 고인물 테스트
당신의 트친 [${result.nickname}]${eunJosa(result.nickname)}
[${result.title}]에 이만큼 고였습니다.
이 점수를 넘을 수 있다면?
⬇️⬇️⬇️⬇️⬇️
🔗 ${url}
#고인물테스트 #슈르네`,
            },
            image: new File([new Blob()], "asdf.png", { type: "image/png" }),
        });
})();

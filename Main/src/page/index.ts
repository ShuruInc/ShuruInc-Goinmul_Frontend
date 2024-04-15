import PostBoardApiClient from "../api/posts";
import {
    addFloatingButonListener,
} from "../floating_button";
import { displayMainPostBoard } from "../home_post_board";
import { setupPostBoard } from "../post_board";
import { InitTopNav } from "../top_logo_navbar";
import PrepareHorizontalInfiniteScrollLayout from "../prepare_horizontal_infinite_scroll_layout";
import createNoticeFloatingButton from "../notice_floating_button";

createNoticeFloatingButton(
    "5월 5일 23시 59분까지 1등을 유지하신 분께,  \"당신의 최애 장르 공식 굿즈 10만 원 상당\"을 이벤트 선물로 드립니다!",
);

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
        // scroller.addEventListenerToChildren("scroll", (evt) => {
            // const target = evt.target as HTMLElement;
            // if (target.scrollTop !== 0) createFloatingButton("up");
            // else createFloatingButton("home");
        // });

        //let _contentScrollerScrollingByUserDrag = false;
        // 좌우 스크롤시 플로팅버튼을 변경한다.
        // scroller.addScrollEventListener(() => {
        //     if (
        //         scroller.getCurrentlyMostVisibleChild(false)?.dataset?.key !==
        //         "home"
        //     ) {
        //         createFloatingButton("home");
        //     } else {
        //         createFloatingButton(
        //             document.querySelector(".column.main")?.scrollTop === 0
        //                 ? "home"
        //                 : "up",
        //         );
        //     }
        // });

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
    }).then(() => {
        const section = document.querySelector('.post-section');
        const p = document.createElement('p');
        p.style.color = 'white';
        p.style.textAlign = 'center';
        p.style.width = '100%';
        p.style.fontSize = '20px';
        p.style.marginTop = '16px';
        p.style.marginBottom = '4px';
        p.style.fontFamily = 'LeeSeoyun';
        p.innerHTML = `이게 뭔데 X덕아...?<br><a href="https://youtu.be/6WZ5jjVXeF0?utm_source=goinmultestpro" style="color: white" target="_blank">▶ 사이트 소개 영상 바로가기 ◀</a>`

        section?.insertBefore(p, section.firstChild);
    });

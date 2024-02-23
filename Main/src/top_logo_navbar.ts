import { dom, library } from "@fortawesome/fontawesome-svg-core";
import {
    faAngleLeft,
    faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import SmoothScrollbar from "smooth-scrollbar";
import rankingIcon from "../assets/ranking-icon.svg";

/**
 * 랭킹 버튼을 눌렀을 때 호출될 사용자 정의 이벤트 핸들러
 */
let customRankingHandler: (() => void) | null = null;

/**
 * 랭킹 아이콘 버튼이 클릭됐을 때의 동작을 설정한다.
 * 미설정시의 기본 동작은 /#ranking으로의 이동이다.
 * @param handler 랭킹 아이콘 배튼이 클릭됐을 때 실행될 이벤트 핸들러 함수
 */
export function SetCustomRankingHandler(handler: () => void) {
    customRankingHandler = handler;
}

/**
 * 상단 네비게이션 바를 초기화한다.
 * @param animated 스크롤 애니메이션 여부
 */
export function InitTopNav(animated = false) {
    const topFixedBar = document.getElementById("topFixedBar")!;

    // 아이콘 렌더링
    library.add(faMagnifyingGlass, faAngleLeft);
    dom.i2svg({ node: topFixedBar });
    [...document.querySelectorAll(".ranking-icon")].forEach(
        (i) => ((i as HTMLImageElement).src = rankingIcon),
    );

    // 이벤트 핸들러 추가
    topFixedBar
        .querySelector(".ranking-icon")
        ?.addEventListener("click", (evt) => {
            evt.preventDefault();

            if (customRankingHandler !== null) {
                return customRankingHandler();
            }

            location.href = "/rankings.html";
        });
    topFixedBar
        .querySelector(".search-icon")
        ?.addEventListener("click", (evt) => {
            evt.preventDefault();
            location.href = "/search.html";
        });
    topFixedBar.querySelector(".go-back")?.addEventListener("click", (evt) => {
        evt.preventDefault();
        history.back();
    });

    // 클릭 이벤트 투과 (버그 수정용)
    //
    // topFixedBar의 높이가 크기 때문에 (애니메이션 때문)
    // 이용자가 상단의 컨텐츠를 클릭할 시 클릭 이벤트를
    // topFixedBar가 먹는 경우가 발생한다.
    topFixedBar.addEventListener("click", (evt) => {
        if (topFixedBar.style.pointerEvents === "none") return;

        const target = evt.target as HTMLElement;
        let temp: HTMLElement | null = target,
            clickedNav = false;

        // 네비게이션 바 콘텐츠나 혹은 네비게이션 바 콘텐츠 영역을
        // 눌렀는지 확인한다.
        while (temp !== null) {
            if (temp.nodeType === temp.ELEMENT_NODE) {
                if (
                    (temp as HTMLElement).nodeName === "NAV" ||
                    (temp as HTMLElement).nodeName === "BUTTON"
                ) {
                    clickedNav = true;
                    break;
                }
            }
            temp = temp.parentElement;
        }

        //  만약 네비게이션 바 콘텐츠 영역을 누른 것이 아니라면
        if (!clickedNav) {
            // pointer-events: none; 설정하여 클릭 이벤트가 투과하도록 하고
            topFixedBar.style.pointerEvents = "none";

            // 클릭 이벤트를 재생성한 뒤
            let elem = document.elementFromPoint(evt.x, evt.y);
            if (elem !== null && "click" in elem) {
                (elem as any).click();
            }

            // 원복한다.
            topFixedBar.style.pointerEvents = "";
        }
    });

    // 검색 아이콘 버튼 옆에 tooltip을 만든다.
    const tippyInstance = tippy(topFixedBar.querySelector(".search-icon")!, {
        content: "내 장르 찾기!",
        placement: "left",
    });

    if (location.pathname === "/")
        // 메인 페이지라면
        setTimeout(() => {
            // tooltip을 0.8초 뒤에 보여준다.
            tippyInstance.show();
            setTimeout(() => {
                tippyInstance.hide();
            }, 800);
        }, 100); // 바로 실행하면 버그가 생기므로 0.1초 뒤에 표시한다.

    // 애니메이션이 필요하다면 애니메이션을 추가한다.
    if (animated) InitTopBottomAnimation(topFixedBar);

    // clip-path를 이용하여 네비게이션 배경을 투과한다.
    if (topFixedBar.classList.contains("clip-path-bugfix"))
        initClipPathBugfix(topFixedBar);
}

export function initClipPathBugfix(topFixedBar: HTMLElement) {
    const loop = () => {
        const container = document.querySelector(
            ".main-container",
        ) as HTMLElement | null;
        if (container === null) return window.requestAnimationFrame(loop);

        const nav = topFixedBar.querySelector("nav") as HTMLElement;
        const top =
            document.documentElement.scrollTop +
            nav.getBoundingClientRect().height +
            25;
        container.style.clipPath = `xywh(0px ${top}px 100% 100%)`;

        window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
}

/**
 * 상단 네비게이션 바에 애니메이션을 추가한다.
 * 하향 스크롤 시 감추고, 반대의 경우 드러나는 애니메이션이 추가된다.
 * @param topFixedBar 상단바 HTML 요소
 */
export function InitTopBottomAnimation(topFixedBar: HTMLElement) {
    /** 애니메이션이 감춰졌는 지의 여부 */
    let isHidden = false;
    let firstLoad = true;

    /** Post board column의 스크롤 시에 상단 네비게이션 바를 감추거나 보여준다. */
    function setupScrollEventHandlerForcolumn(column: Element) {
        var lastScrollTop = 0;

        // Post-board column은 커스텀 스크롤 라이브러리를 쓴다.
        SmoothScrollbar.get(
            column.querySelector("[data-scrollbar]") as HTMLElement,
        )?.addListener((status) => {
            // column별로 스크롤이 따로 논다!
            var scrollTop = status.offset.y;

            //페이지가 로딩되거나 column이 바뀐 경우에는 상단바를 가리지 않음
            if (firstLoad) {
                firstLoad = false;
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                return;
            }

            if (scrollTop > lastScrollTop + 15) {
                // 하향 스크롤로 전환 시에만 감춤
                if (!isHidden) {
                    topFixedBar.style.transform =
                        "translateX(-50%) translateY(-30%)";
                    isHidden = true;
                }
            } else if (scrollTop < lastScrollTop - 15) {
                // 상향 스크롤로 전환 시에만 드러냄
                if (isHidden) {
                    topFixedBar.style.transform =
                        "translateX(-50%) translateY(0%)";
                    isHidden = false;
                }
            }

            // 클래스명 변경
            if (isHidden) {
                topFixedBar.classList.add("is-hidden");
            } else {
                topFixedBar.classList.remove("is-hidden");
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    // 무한 좌우 스크롤되는 Post-board column들에
    // scroll 이벤트 핸들러를 부착한다.
    //
    // (Post board column들은 스크롤이 따로따로 논다.)
    [...document.querySelectorAll(".column")].forEach(
        setupScrollEventHandlerForcolumn,
    );
}

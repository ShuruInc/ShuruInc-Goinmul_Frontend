import { dom, library } from "@fortawesome/fontawesome-svg-core";
import logoImage1 from "../assets/logo/MainLogo_1_alpha.png";
import logoImage2 from "../assets/logo/MainLogo_1_alpha.png";
import logoImage3 from "../assets/logo/MainLogo_1_alpha.png";
import logoImage4 from "../assets/logo/MainLogo_1_alpha.png";
import {
    faAngleLeft,
    faMagnifyingGlass,
    faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import SmoothScrollbar from "smooth-scrollbar";

const images = [logoImage1, logoImage2, logoImage3, logoImage4];

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

let customRankingHandler: (() => void) | null = null;

/**
 * 랭킹 아이콘 버튼이 클릭됐을 때의 동작을 설정한다.
 * 미설정시의 기본 동작은 /#ranking으로의 이동한다.
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
    library.add(faMagnifyingGlass, faRankingStar, faAngleLeft);
    dom.i2svg({ node: topFixedBar });

    // 로고 이미지 랜덤 설정
    const mainTopLogo = document.querySelector(
        ".main-top-logo-image",
    )! as HTMLImageElement | null;
    if (mainTopLogo !== null) mainTopLogo.src = images[getRandomInt(4)];

    // 이벤트 핸들러 추가
    topFixedBar
        .querySelector(".ranking-icon")
        ?.addEventListener("click", (evt) => {
            evt.preventDefault();

            if (customRankingHandler !== null) {
                return customRankingHandler();
            }

            location.href = "/#ranking";
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
    topFixedBar.addEventListener("click", (evt) => {
        if (topFixedBar.style.pointerEvents === "none") return;

        const target = evt.target as HTMLElement;
        let temp: HTMLElement | null = target,
            clickedNav = false;
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

        if (!clickedNav) {
            topFixedBar.style.pointerEvents = "none";
            let elem = document.elementFromPoint(evt.x, evt.y);
            if (elem !== null && "click" in elem) {
                (elem as any).click();
            }
            topFixedBar.style.pointerEvents = "";
        }
    });

    const tippyInstance = tippy(topFixedBar.querySelector(".search-icon")!, {
        content: "내 장르 찾기!",
        placement: "left",
    });
    if (location.pathname === "/")
        setTimeout(() => {
            tippyInstance.show();
            setTimeout(() => {
                tippyInstance.hide();
            }, 800);
        }, 100);

    if (animated) InitTopBottomAnimation(topFixedBar, mainTopLogo);
}

// 애니메이션이 있는 모바일형 상단바
// 하향 스크롤 시 감추고 반대의 경우 드러냄
export function InitTopBottomAnimation(
    topFixedBar: HTMLElement,
    mainTopLogo: HTMLImageElement | null,
) {
    var isHidden = false;
    var mainLogoNum = 1;
    var logoChangeAllowed = true;

    var firstLoad = true;

    function setupScrollEventHandlerForcolumn(column: Element) {
        var lastScrollTop = 0;
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
                    changeMainTopLogo();
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

            if (isHidden) {
                topFixedBar.classList.add("is-hidden");
                if (mainTopLogo !== null)
                    mainTopLogo.classList.add("is-hidden");
            } else {
                topFixedBar.classList.remove("is-hidden");
                if (mainTopLogo !== null)
                    mainTopLogo.classList.remove("is-hidden");
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    function changeMainTopLogo() {
        if (logoChangeAllowed) {
            logoChangeAllowed = false;
            setTimeout(() => {
                if (mainTopLogo === null) return;

                if (mainLogoNum < 4) {
                    mainLogoNum++;
                } else {
                    mainLogoNum = 1;
                }
                mainTopLogo.src = images[getRandomInt(4)];
                logoChangeAllowed = true;
            }, 100);
        }
    }

    [...document.querySelectorAll(".column")].forEach(
        setupScrollEventHandlerForcolumn,
    );
}

import { dom, library } from "@fortawesome/fontawesome-svg-core";
import logoImage1 from "../assets/logo/MainLogo_1_alpha.png";
import logoImage2 from "../assets/logo/MainLogo_1_alpha.png";
import logoImage3 from "../assets/logo/MainLogo_1_alpha.png";
import logoImage4 from "../assets/logo/MainLogo_1_alpha.png";
import {
    faMagnifyingGlass,
    faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
const images = [logoImage1, logoImage2, logoImage3, logoImage4];

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

let customRankingHandler: (() => void) | null = null;
export function SetCustomRankingHandler(handler: () => void) {
    customRankingHandler = handler;
}

export function InitTopNav() {
    const topFixedBar = document.getElementById("topFixedBar")!;
    // 아이콘 렌더링
    library.add(faMagnifyingGlass, faRankingStar);
    dom.i2svg({ node: topFixedBar });

    // 로고 이미지 랜덤 설정
    const mainTopLogo = document.querySelector(
        ".main-top-logo-image"
    )! as HTMLImageElement;
    mainTopLogo.src = images[getRandomInt(4)];

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
}

// 애니메이션이 있는 모바일형 상단바
// 하향 스크롤 시 감추고 반대의 경우 드러냄
export function InitTopBottomAnimation() {
    var topFixedBar = document.getElementById("topFixedBar")!;
    var mainTopLogo = document.querySelector(
        ".main-top-logo-image"
    )! as HTMLImageElement;

    InitTopNav();

    var isHidden = false;
    var mainLogoNum = 1;
    var logoChangeAllowed = true;

    var firstLoad = true;

    function setupScrollEventHandlerForcolumn(column: Element) {
        var lastScrollTop = 0;
        column.addEventListener("scroll", function (evt) {
            // column별로 스크롤이 따로 논다!
            var scrollTop = (evt.target as HTMLElement).scrollTop;

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
                        "translateX(-50%) translateY(-45%)";
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
                mainTopLogo.classList.add("is-hidden");
            } else {
                topFixedBar.classList.remove("is-hidden");
                mainTopLogo.classList.remove("is-hidden");
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    function changeMainTopLogo() {
        if (logoChangeAllowed) {
            logoChangeAllowed = false;
            setTimeout(() => {
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
        setupScrollEventHandlerForcolumn
    );
}

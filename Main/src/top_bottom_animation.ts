// 애니메이션이 있는 모바일형 상단바
// 하향 스크롤 시 감추고 반대의 경우 드러냄
export function InitTopBottomAnimation() {
    var topFixedBar = document.getElementById("topFixedBar")!;
    var mainTopLogo = document.getElementById(
        "mainTopLogo"
    )! as HTMLImageElement;

    mainTopLogo.src =
        "../dist/assets/images/logo/MainLogo_" + getRandomInt(4) + "_alpha.png";

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
                mainTopLogo.src =
                    "../dist/assets/images/logo/MainLogo_" +
                    mainLogoNum +
                    "_alpha.png";
                logoChangeAllowed = true;
            }, 100);
        }
    }

    function getRandomInt(max: number) {
        return Math.ceil(Math.random() * max);
    }

    [...document.querySelectorAll(".column")].forEach(
        setupScrollEventHandlerForcolumn
    );
}

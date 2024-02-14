import SmoothScrollbar from "smooth-scrollbar";
import logoImages from "./logo_Images";
import React from "react";
import { ScrollStatus } from "smooth-scrollbar/interfaces";
type UseStateReturnType<S> = [S, React.Dispatch<React.SetStateAction<S>>];

// 하향 스크롤 시 감추고 반대의 경우 드러냄
export function setupTopNavbarAnimationOnScroll(
    [logoIndex, setLogoIndex]: UseStateReturnType<number>,
    [isHidden, setIsHidden]: UseStateReturnType<boolean>,
    [logoChangeAllowed, setLogoChangeAllowed]: UseStateReturnType<boolean>,
) {
    var firstLoad = true;

    function setupScrollEventHandlerForSmoothScrollbar(
        scrollbar: SmoothScrollbar,
    ) {
        let lastScrollTop = 0;
        const listener = (status: ScrollStatus) => {
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
                    setIsHidden(true);
                }
            } else if (scrollTop < lastScrollTop - 15) {
                // 상향 스크롤로 전환 시에만 드러냄
                if (isHidden) {
                    setIsHidden(false);
                }
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        };

        scrollbar?.addListener(listener);

        return () => scrollbar?.removeListener(listener);
    }

    function changeMainTopLogo() {
        if (logoChangeAllowed) {
            setLogoChangeAllowed(false);
            setTimeout(() => {
                setLogoIndex((logoIndex + 1) % logoImages.length);
                setLogoChangeAllowed(true);
            }, 100);
        }
    }

    const smoothScrollbars = [...SmoothScrollbar.getAll()];
    const clearListeners = smoothScrollbars.map(
        setupScrollEventHandlerForSmoothScrollbar,
    );

    return () => clearListeners.forEach((i) => i());
}

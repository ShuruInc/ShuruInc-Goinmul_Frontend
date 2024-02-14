import { MouseEvent as ReactMouseEvent } from "react";

/**
 * 애니메이션이 적용된 네브바에서 하단 부분을 클릭시
 * 네브바 밑 요소가 선택되지 않아 의도하지 않은 대로
 * 동작되는 버그를 해결한다.
 */
export function createClickBugFixHandler(
    navbarRef: React.RefObject<HTMLDivElement>,
) {
    return (evt: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
        if (
            navbarRef.current === null ||
            navbarRef.current.style.pointerEvents === "none"
        )
            return;
        const topFixedBar = navbarRef.current;

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
            let elem = document.elementFromPoint(evt.clientX, evt.clientY);
            if (elem !== null && "click" in elem) {
                (elem as any).click();
            }
            topFixedBar.style.pointerEvents = "";
        }
    };
}

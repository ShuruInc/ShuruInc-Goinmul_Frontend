/**
 * 데스크톱에서 좌우 마우스 드래그시 좌우 스크롤이 되도록 한다.
 * @param element HTML요소
 */
export default function setHorizontalDragScrollOnDesktop(element: HTMLElement) {
    let dragStarted = false,
        dragged = false,
        preventClick = false, // 의도치 않게 클릭이 되는 버그 방지용
        lastClientX: number | null = null;

    const elemMouseDown = (evt: MouseEvent) => {
        dragStarted = true;
        lastClientX = evt.clientX;
    };
    const windowMouseMove = (evt: MouseEvent) => {
        evt.preventDefault();
        const newClientX = evt.clientX;

        if (!dragStarted) return;
        else if (lastClientX === null) return (lastClientX = newClientX);
        let xDiff = lastClientX - newClientX;
        element.scrollBy({
            left: xDiff,
        });
        lastClientX = newClientX;
        dragged = true;
        preventClick = true;
    };
    const windowMouseUp = (evt: MouseEvent) => {
        if (dragged) evt.preventDefault();
        else preventClick = false;
        dragStarted = false;
        dragged = false;
    };
    const elemClick = (evt: MouseEvent) => {
        if (preventClick) {
            evt.preventDefault();
            preventClick = false;
        }
    };

    element.addEventListener("mousedown", elemMouseDown);
    window.addEventListener("mousemove", windowMouseMove);
    window.addEventListener("mouseup", windowMouseUp);
    element.addEventListener("click", elemClick);

    return () => {
        element.removeEventListener("mousedown", elemMouseDown);
        window.removeEventListener("mousemove", windowMouseMove);
        window.removeEventListener("mouseup", windowMouseUp);
        element.removeEventListener("click", elemClick);
    };
}

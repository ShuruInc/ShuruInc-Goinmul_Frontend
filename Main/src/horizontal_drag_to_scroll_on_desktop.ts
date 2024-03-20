/**
 * 데스크톱에서 좌우 마우스 드래그시 좌우 스크롤이 되도록 한다.
 * @param element HTML요소
 */
export default function setHorizontalDragScrollOnDesktop(element: HTMLElement) {
    let dragStarted = false,
        dragged = false,
        preventClick = false, // 의도치 않게 클릭이 되는 버그 방지용
        lastClientX: number | null = null;

    const getClientX = (evt: MouseEvent | TouchEvent) => {
        if ((evt as TouchEvent).touches) {
            return (evt as TouchEvent).touches[0].clientX;
        } else if ((evt as MouseEvent).clientX) {
            return (evt as MouseEvent).clientX;
        }
        throw new Error('?'); // This error never fire
    }

    const ondown = (evt: MouseEvent | TouchEvent) => {
        dragStarted = true;
        lastClientX = getClientX(evt);
    };
    const onmove = (evt: MouseEvent | TouchEvent) => {
        evt.preventDefault();
        const newClientX = getClientX(evt);

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
    const onup = (evt: Event) => {
        if (dragged) evt.preventDefault();
        else preventClick = false;
        dragStarted = false;
        dragged = false;
    };

    document.addEventListener('mousedown', ondown);
    document.addEventListener('mouseup', onup);
    document.addEventListener('mousemove', onmove);

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
        document.addEventListener('touchstart', ondown);
        document.addEventListener('touchmove', onmove);
        document.addEventListener('touchcancel', onup);
        document.addEventListener('touchend', onup);
    }

    element.addEventListener("click", (evt) => {
        if (preventClick) {
            evt.preventDefault();
            preventClick = false;
        }
    });
}

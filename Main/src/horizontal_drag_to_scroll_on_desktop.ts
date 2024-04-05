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
        if(dragStarted) {
            lastClientX = newClientX;
        }
        dragged = true;
        preventClick = true;
    };
    const onup = (evt: Event) => {
        if (dragged) evt.preventDefault();
        else preventClick = false;
        dragStarted = false;
        dragged = false;
    };

    // 가로 스크롤 문제 해결
    // const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    // if (isSafari) {
    //     element.addEventListener('touchstart', ondown);
    //     element.addEventListener('touchmove', onmove);
    //     element.addEventListener('touchcancel', onup);
    //     element.addEventListener('touchend', onup);
    // }
    
    //항상 터치인풋 받기
    element.addEventListener('mousedown', ondown);
    element.addEventListener('mousemove', onmove);
    
    element.addEventListener('touchstart', ondown);
    element.addEventListener('touchmove', onmove);
    element.addEventListener('touchcancel', onup);

    document.body.addEventListener('mouseup', onup);
    document.body.addEventListener('touchend', onup);

    //브라우저 밖에서도 드래그 놓는 시뮬
    document.addEventListener('mouseleave', function(evt) {
        if (evt.clientY <= 0 || evt.clientX <= 0 || (evt.clientX >= window.innerWidth || evt.clientY >= window.innerHeight)) {
            if (dragged) evt.preventDefault();
            else preventClick = false;
            dragStarted = false;
            dragged = false;
        }
    });

    element.addEventListener("click", (evt) => {
        if (preventClick) {
            evt.preventDefault();
            preventClick = false;
        }
    });
}

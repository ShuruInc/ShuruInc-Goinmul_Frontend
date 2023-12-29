{
    let timeoutIdx = null;

    HorizontalTouchInterpreter(() => {
        if (timeoutIdx !== null) clearTimeout(timeoutIdx);

        timeoutIdx = setTimeout(fixChromeSnapBug, 1000);
    });

    function fixChromeSnapBug() {
        const columns = [...document.querySelectorAll("article.column")];

        // 얼마나 보이는 지 확인
        const parent = document.querySelector(".post-board-columns");
        const parentWidth = parent.getBoundingClientRect().width;
        const records = columns.map((i) => {
            return {
                target: i,
                intersectionRatio:
                    (Math.min(
                        i.getBoundingClientRect().right,
                        parent.getBoundingClientRect().right
                    ) -
                        Math.max(
                            i.getBoundingClientRect().left,
                            parent.getBoundingClientRect().left
                        )) /
                    parentWidth,
            };
        });

        // 가장 잘 보이는 애 가져오기
        const highestShown = records.sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
        )[0];

        // 덜 스크롤됐으면 끝까지 스크롤
        if (highestShown.intersectionRatio < 0.99) {
            const parentRect = parent.getBoundingClientRect();
            const highestshownRect =
                highestShown.target.getBoundingClientRect();

            let scrollDelta =
                highestshownRect.left +
                highestshownRect.width / 2 -
                (parentRect.left + parentRect.right) / 2;
            parent.scrollBy({
                left: scrollDelta,
                behavior: "smooth",
            });
        }
    }
}

/**
 * @typedef {Object} HomePostBoardData 홈 post board에서 표시될 데이터
 * @property {({imgUrl: string, title: string, likes: number, views: number})[]} popularTests 인기 BEST 테스트 데이터
 * @property {{[key: string]: string[]}} rankings 명예의 전당 데이터
 */

/**
 * 랭킹을 표시하는 section DOM 요소를 만듭니다.
 * @param {string} title 제목
 * @param {string[]} data 랭킹
 */
const createRankingSection = (title, data) => {
    const section = document.createElement("section");
    section.className = "ranking-section";
    section.innerHTML = `<h2></h2>
    <img class="podium">
    <div class="more">
    </div>
    `;

    const podium = createPodium(data[0], data[1], data[2]);
    section.querySelector("img.podium").src = podium;
    section.querySelector("h2").textContent = title;

    let start = 1;
    while (data.length > 0) {
        const three = data.splice(0, 3);
        const column = document.createElement("div");
        column.className = "more-column";
        column.innerHTML = "<ol></ol>";
        column.querySelector("ol").start = start;
        three
            .map((i) => {
                const li = document.createElement("li");
                li.textContent = i;
                return li;
            })
            .forEach((i) => column.querySelector("ol").appendChild(i));

        section.querySelector(".more").appendChild(column);
        start += 3;
    }

    return section;
};

/**
 * 홈 post board 컨텐츠를 표시합니다.
 * @param {HTMLElement} element 표시될 요소
 * @param {HomePostBoardData} data 컨텐츠 데이터
 */
const displayMainPostBoard = (element, data) => {
    element.innerHTML = `<section class="post-section"></section>`;
    preparePlaceholderSection(element.querySelector(".post-section"), [
        { landscape: true, count: 1 },
        { landscape: false, count: data.popularTests.length - 1 },
    ]);
    fillPlaceholderSectionInto(
        {
            title: "인기 BEST",
            landscape: data.popularTests[0],
            portraits: data.popularTests.slice(1),
        },
        element.querySelector(".post-section")
    );
    for (const i in data.rankings) {
        const rankingSection = createRankingSection(i, data.rankings[i]);
        element.appendChild(rankingSection);
    }
};

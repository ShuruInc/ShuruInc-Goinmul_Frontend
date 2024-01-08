// 빈 섹션을 준비한다.
function preparePlaceholderSection(
    placeholderSection,
    rowInfos = [
        {
            landscape: true,
            count: 1,
        },
        {
            landscape: false,
            count: 8,
        },
    ]
) {
    placeholderSection.innerHTML = "";
    placeholderSection.className = "post-section";

    // 제목 생성
    placeholderSection.appendChild(document.createElement("h2"));

    // 가로형 포스트 생성
    for (let rowInfo of rowInfos) {
        const postTable = document.createElement("div");
        postTable.className =
            "post-table" + (rowInfo.landscape ? " landscape" : " portfrait");

        for (let i = 0; i < rowInfo.count; i++) {
            // 요소 생성 후 이미지 소스 설정
            const cell = document.createElement("a");
            cell.href = "quiz.html";

            const image = new Image();
            image.loading = "lazy";
            image.style.backgroundColor = "gray";
            image.alt = "빈 이미지";

            // 클래스 설정
            if (rowInfo.landscape) {
                image.className = "cell-landscape-img ";
                cell.className = "table-landscape-cell";
            } else {
                image.className = "cell-img";
                cell.className = "table-cell";
            }

            // 정보 추가
            const info = document.createElement("div");
            info.className = "cell-info";
            info.innerHTML =
                '<div class="title"></div><div class="popularity"><div class="likes"><span class="like-count" /></div><div class="views"><span class="view-count" /></div></div>';

            postTable.appendChild(cell);
            cell.appendChild(image);
            cell.appendChild(info);
        }

        placeholderSection.appendChild(postTable);
    }

    placeholderSection.classList.add("placeholder");
    placeholderSection.dataset.rowInfos = JSON.stringify(rowInfos);
}

// section을 posts로 채운다.
function fillPlaceholderSectionInto(posts, section) {
    // 제목 설정
    if (posts.title === null || typeof posts.title === "undefined")
        section.querySelector("h2").classList.add("display-none");
    else section.querySelector("h2").textContent = posts.title;

    // 가로형 이미지 설정
    if (posts.landscape === null || typeof posts.landscape === "undefined")
        section
            .querySelector(".post-table.landscape")
            .classList.add("display-none");
    else {
        section.querySelector(".cell-landscape-img").src =
            posts.landscape.imgUrl;
        section.querySelector(
            ".table-landscape-cell .cell-info .title"
        ).innerHTML = posts.landscape.title;
        section.querySelector(
            ".table-landscape-cell .cell-info .like-count"
        ).innerHTML = posts.landscape.likes;
        section.querySelector(
            ".table-landscape-cell .cell-info .view-count"
        ).innerHTML = posts.landscape.views;
    }

    // 세로형 이미지 설정
    if (posts.portraits === null || typeof posts.portraits === "undefined")
        document
            .querySelector(".post-table.portfrait")
            .classList.add("display-none");
    else {
        const portraitCells = [...section.querySelectorAll(".table-cell")];
        for (const portraitCell of portraitCells) {
            const post = posts.portraits.pop();
            portraitCell.querySelector(".cell-img").src = post.imgUrl;
            portraitCell.querySelector(".cell-info .title").innerHTML =
                post.title;
            portraitCell.querySelector(".cell-info .like-count").innerHTML =
                post.likes;
            portraitCell.querySelector(".cell-info .view-count").innerHTML =
                post.views;
        }
    }

    return;
}

// 메인 페이지에 '포스트 보드'를 생성함
// '포스트 보드'는 다수의 포스트로 이루어짐

function setupPostBoard(column, getNextSection) {
    function fillPlaceholderSection(posts) {
        // 포스트를 담을 테이블 생성
        const section = getPlaceholderSection();

        fillPlaceholderSectionInto(posts, section);
    }

    // 빈 섹션이 2개 미만으로 있을 시 빈 섹션을 새로 생성한다.
    function createPlaceholderSectionsIfNeeded() {
        let placeholderCount = [
            ...column.querySelectorAll("section.placeholder"),
        ].length;
        if (placeholderCount >= 2) return;

        const placeholderCountToCreate = 2 - placeholderCount;
        for (let i = 0; i < placeholderCountToCreate; i++) {
            // 포스트를 담을 테이블 생성
            var flexTable = document.createElement("section");
            preparePlaceholderSection(flexTable);

            column.appendChild(flexTable);
            return;
        }
    }

    // 빈 섹션을 반환한다. 없으면 만든다.
    function getPlaceholderSection(markUsed = true) {
        // 빈 섹션이 없을 시 만든다.
        createPlaceholderSectionsIfNeeded();

        // 쓰이지 않은 빈 섹션을 가져오고 placeholder 클래스를 제거한다. (중복 반환 방지!)
        const placeholder = column.querySelector("section.placeholder");
        if (markUsed)
            // IntersectionObserver에서 쓰이는 경우에는 placeholder를 제거하면 안 된다.
            placeholder.classList.remove("placeholder");

        // 항상 빈 섹션이 하단에 있도록 다시 호출한다.
        createPlaceholderSectionsIfNeeded();
        return placeholder;
    }

    document.addEventListener("DOMContentLoaded", function () {
        // 첫 2개의 포스트만 가져온다.
        for (let i = 0; i < 2; i++) fillPlaceholderSection(getNextSection());

        // 나머지는 동적으로 가져올 수 있도록 IntersectionObserver를 설정한다.
        setupIntersectionObserver();
    });

    // 무한 스크롤을 구현한다.

    // 하단 빈 섹션이 보이는지의 여부를 감지하는 데 이용되는 IntersectionObserver
    let intersectionObserver = new IntersectionObserver(onPlaceholderVisible, {
        rootMargin: "2000px",
    });

    // intersectionObserver를 초기화한다.
    // 새로운 빈 섹션이 추가된 경우에도 호출되어야 한다.
    function setupIntersectionObserver() {
        // 기존에 관찰되고 있던 요소는 더이상 빈 섹션이 아닐 수 있으므로 모두 끊는다.
        intersectionObserver.disconnect();
        // 빈 섹션들을 모두 관찰한다.
        for (const i of [...column.querySelectorAll("section.placeholder")])
            intersectionObserver.observe(i);

        // 이벤트 핸들러를 호출한다. (버그 방지)
        onPlaceholderVisible(intersectionObserver.takeRecords());
    }

    // intersectionObserver의 이벤드 핸들러
    // 무한 스크롤이 구현된다.
    function onPlaceholderVisible(entries) {
        if (
            entries.every(
                (i) =>
                    i.target.classList.contains("placeholder") &&
                    i.intersectionRatio <= 0
            )
        )
            // 모든 빈 섹션이 보이지 않고 있다면 무시한다.
            return;
        fillPlaceholderSection(getNextSection());

        setupIntersectionObserver();
    }
}

for (let i of [...document.querySelectorAll("article.column")])
    if (i.dataset.key === "home-board")
        displayMainPostBoard(i, {
            popularTests: [0, 1, 2, 3, 4, 5, 6, 7, 8]
                .map((i) => `https://picsum.photos/200/300?${Date.now()}0${i}`)
                .map((i) => ({
                    imgUrl: i,
                    title: `테스트${Math.floor(Math.random() * 100)}`,
                    likes: 100,
                    views: 100,
                })),
            rankings: {
                "K-POP": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `사람${i}`),
                "J-POP": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `사람${i}`),
                "C-POP": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `사람${i}`),
                "COL-POP": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                    (i) => `사람${i}`
                ),
            },
        });
    else
        setupPostBoard(i, () => {
            // 랜덤 색을 생성한다.
            const randomColor = () => {
                return `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
                    Math.random() * 255
                )},${Math.floor(Math.random() * 255)})`;
            };

            const images = [];
            for (let i = 0; i < 9; i++) {
                images.push({
                    url: `https://picsum.photos/200/300?${Date.now()}0${i}1${Math.floor(
                        Math.random() * 1000
                    )}`,
                    color: randomColor(),
                });
            }
            return {
                title: `Lorem ipsum 가나다라마바사 ${[
                    ...i.parentNode.children,
                ].indexOf(i)}`,
                landscape: {
                    bgColor: images[0].color,
                    imgUrl: images[0].url,
                    title: `테스트${Math.floor(Math.random() * 100)}`,
                    likes: 100,
                    views: 100,
                },
                portraits: images.slice(1).map((img) => ({
                    bgColor: img.color,
                    imgUrl: img.url,
                    title: `테스트${Math.floor(Math.random() * 100)}`,
                    likes: 100,
                    views: 100,
                })),
            };
        });

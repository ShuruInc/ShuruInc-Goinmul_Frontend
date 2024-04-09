import SmoothScrollbar, { ScrollbarPlugin } from "smooth-scrollbar";
import PostBoardApiClient from "./api/posts";
import footer from "./footer";
import setHorizontalDragScrollOnDesktop from "./horizontal_drag_to_scroll_on_desktop";
import "./smooth-scrollbar-scroll-lock-plugin";
import eyeIcon from "../assets/post-cell-popularity-icons/eye.svg";
import heartSolidIcon from "../assets/post-cell-popularity-icons/heart-solid.svg";
// import { isMobile } from "./is_mobile";
// import Color from "color";

type RowInfo = { landscape: boolean; count: number };
export type Post = {
    imgUrl: string;
    title: string;
    likes: number;
    views: number;
    href: string;
    id: number;
    nerdTest: boolean;
};
export type PostBoardSectionData = Partial<{
    title: string;
    landscape: Post;
    portraits: Post[];
}>;

const millify = (number: number): string => {
    let units: [string, number][] = [
        ["k", Math.pow(10, 3)] as [string, number],
        ["M", Math.pow(10, 6)] as [string, number],
        ["G", Math.pow(10, 9)] as [string, number],
        ["T", Math.pow(10, 12)] as [string, number],
        ["P", Math.pow(10, 15)] as [string, number],
        ["E", Math.pow(10, 18)] as [string, number],
        ["Z", Math.pow(10, 21)] as [string, number],
        ["Y", Math.pow(10, 24)] as [string, number],
        ["R", Math.pow(10, 27)] as [string, number],
        ["Q", Math.pow(10, 30)] as [string, number],
    ].reverse();

    for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        if (number >= unit[1]) {
            let quotientString = Math.floor(number / unit[1]).toString();
            let remainder = number % unit[1];

            let precision = Math.max(3 - quotientString.length, 0);
            let remainderString = remainder.toString().substring(0, precision);

            return (
                quotientString +
                (remainderString !== "" ? "." + remainderString : "") +
                unit[0]
            );
        }
    }
    return number.toString();
};

/** placeholderSection 요소를 빈 섹션으로 바꾼다. */
export function preparePlaceholderSection(
    placeholderSection: HTMLElement,
    rowInfos: RowInfo[] = [
        {
            landscape: true,
            count: 1,
        },
        {
            landscape: false,
            count: 8,
        },
    ],
    placeholder = true,
) {
    placeholderSection.innerHTML = ``;
    placeholderSection.classList.add("post-section");

    // 제목 생성
    placeholderSection.appendChild(document.createElement("h2"));

    // 가로형 포스트 생성
    for (let rowInfo of rowInfos) {
        const postTable = document.createElement("div");
        postTable.innerHTML = `<button class="floating-btn-scrollX left"></button><button class="floating-btn-scrollX right"></button>`;
        postTable.querySelectorAll('button.floating-btn-scrollX').forEach((btn) => {
            btn.addEventListener('click', () => {
                btn.parentElement?.scrollBy({ behavior: 'smooth', left: 340 * (btn.classList.contains('left') ? -1 : 1), top: 0 });
            });
        });
        postTable.className =
            "post-table" + (rowInfo.landscape ? " landscape" : " portrait");
        if (!rowInfo.landscape) {
            setHorizontalDragScrollOnDesktop(postTable);
        }

        for (let i = 0; i < rowInfo.count; i++) {
            // 분필 border 생성
            const chalkBordered = document.createElement("div");
            chalkBordered.className =
                "chalk-bordered " +
                (rowInfo.landscape ? "landscape" : "portrait");

            // 요소 생성 후 이미지 소스 설정
            const cell = document.createElement("a");
            cell.href = "quiz.html";

            if (rowInfo.landscape) {
                cell.className = "table-cell landscape";
            } else {
                cell.className = "table-cell portrait";
            }
            cell.draggable = false;

            // 정보 추가
            const info = document.createElement("div");
            info.className = "cell-info";
            info.innerHTML =
                '<div class="title"></div>' +
                '<div class="popularity-and-like-button">' +
                '<div class="popularity">' +
                `<div class="views"><img class="icon" src="${eyeIcon}"><span class="view-count" /></div>` +
                "</div>" +
                `<a href="#" class="like-button"><img class="icon" src="${heartSolidIcon}"></a>` +
                "</div>";

            // 그림자 추가
            const shadow = document.createElement("div");
            shadow.className = "shadow";

            // wrapper
            const wrapper = document.createElement("div");
            wrapper.className =
                "wrapper " + (rowInfo.landscape ? "landscape" : "");
            wrapper.appendChild(chalkBordered);
            wrapper.appendChild(shadow);

            postTable.appendChild(wrapper);
            chalkBordered.appendChild(cell);
            cell.appendChild(info);
        }

        placeholderSection.appendChild(postTable);
    }

    if (placeholder) placeholderSection.classList.add("placeholder");
    placeholderSection.dataset.rowInfos = JSON.stringify(rowInfos);
}

function getImageDataFromImageElement(url: string) {
    return new Promise<ImageData>((resolve, _) => {
        const img = new Image();
        img.addEventListener("load", (_) => {
            const canvas = new OffscreenCanvas(img.width, img.height);
            const context = canvas.getContext("2d");
            if (context === null) throw new Error("null canvas context");
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            try{resolve(context.getImageData(0, 0, img.width, img.height));}
            catch(e){ /*console.log("from getImageData")*/ }
        });
        img.src = url;
    });
}

async function getAverageColor(url: string) {
    const data = await getImageDataFromImageElement(url);
    let resultColor = [0, 0, 0];
    for (let i = 0; i < data.data.length; i += 4) {
        // RGBA
        for (let j = 0; j < 3; j++) {
            resultColor[j] += data.data[i * 4 + j] ?? 0;
        }
    }

    return resultColor.map((i) =>
        Math.floor(i / Math.floor(data.data.length / 4)),
    );
}

/*
function manipulateRepresentingColor([r, g, b]: number[]) {
    const color = Color.rgb(r, g, b);
    return [color.red(), color.green(), color.blue()].map(Math.floor);
}
*/

// section을 posts로 채운다.
export function fillPlaceholderSectionInto(
    posts: Partial<PostBoardSectionData>,
    section: HTMLElement,
    noCellInfo = false,
) {
    // placeholder 재생성 (필요한 경우)
    const hasLandscape =
        posts.landscape !== null && typeof posts.landscape !== "undefined";
    const hasPortraits =
        posts.portraits !== null &&
        typeof posts.portraits !== "undefined" &&
        posts.portraits.length > 0;
    const rowInfos: RowInfo[] = [];
    if (hasLandscape)
        rowInfos.push({
            landscape: true,
            count: 1,
        });
    if (hasPortraits)
        rowInfos.push({
            landscape: false,
            count: posts.portraits!.length,
        });
    preparePlaceholderSection(section, rowInfos, false);

    // 애니메이션 효과
    const animateHeart = (element: HTMLElement) => {
        element.classList.add("liked");
        setTimeout(() => {
            element.classList.remove("liked");
        }, 200);
    };

    // 제목 설정
    if (
        posts.title === null ||
        typeof posts.title === "undefined" ||
        posts.title.trim().length === 0
    ){
        // 원래 Home을 제외한 탭에서는 제목란이 없었는데, 
        // "도전! 고인물 테스트 문구"를 일괄적으로 추가함.
        section.querySelector("h2")!.textContent = "도전! 고인물 테스트";
        //따라서, -32px 마진을 줘야 최상단 콘텐츠의 시작선이 맞아짐.
        section.querySelector("h2")!.style.marginTop = "-32px";
    } else {
        section.querySelector("h2")!.textContent = posts.title;
    }

    // 가로형 이미지 설정
    if (hasLandscape) {
        const landscapeCell = section.querySelector(
            ".table-cell.landscape",
        ) as HTMLAnchorElement;
        landscapeCell.style.backgroundImage = `url("${
            posts.landscape!.imgUrl
        }")`;
        getAverageColor(posts.landscape!.imgUrl)
            /* .then(manipulateRepresentingColor) */
            .then(([r, g, b]) => {
                landscapeCell.style.setProperty(
                    "--representing-color",
                    `${r}, ${g}, ${b}`,
                );
            });
        landscapeCell.href = posts.landscape!.href;
        landscapeCell.dataset.id = posts.landscape!.id.toString();
        landscapeCell
            .querySelector(".like-button")
            ?.addEventListener("click", (evt) => {
                evt.preventDefault();
                PostBoardApiClient.like(posts.landscape!.id!).then(() => {
                    animateHeart(landscapeCell.querySelector(".like-button")!);
                });
            });
        landscapeCell.querySelector(".cell-info .title")!.innerHTML =
            posts.landscape!.title;
        if (noCellInfo) {
            landscapeCell.classList.add("no-cell-popularity-info");
        } else {
            landscapeCell.querySelector(".cell-info .view-count")!.innerHTML =
                millify(posts.landscape!.views).toString();
        }
    }

    // 세로형 이미지 설정
    if (hasPortraits) {
        const portraitCells = [
            ...section.querySelectorAll(".table-cell.portrait"),
        ] as HTMLAnchorElement[];
        for (const portraitCell of portraitCells) {
            const post = posts.portraits!.shift();
            if (typeof post === "undefined") break;

            portraitCell.href = post.href;
            portraitCell.dataset.id = post.id.toString();
            portraitCell.style.setProperty(
                "--background-img",
                `url("${post.imgUrl}")`,
            );
            portraitCell.classList.add("lazy-bg");
            if (!post.nerdTest) {
                portraitCell.classList.add("non-nerd-test");
            }
            portraitCell.querySelector(".cell-info .title")!.innerHTML =
                post.title;
            portraitCell
                .querySelector(".like-button")
                ?.addEventListener("click", (evt) => {
                    evt.preventDefault();
                    PostBoardApiClient.like(post.id!).then(() => {
                        animateHeart(
                            portraitCell.querySelector(".like-button")!,
                        );
                    });
                });
            if (noCellInfo) {
                portraitCell.classList.add("no-cell-popularity-info");
            } else {
                portraitCell.querySelector(
                    ".cell-info .view-count",
                )!.innerHTML = millify(post.views).toString();
            }

            portraitCell.classList.add("filled");
        }

        portraitCells
            .filter((i) => !i.classList.contains("filled"))
            .forEach((i) => i.parentNode?.removeChild(i));

        // lazy-loading 구현
        const observer = new IntersectionObserver(
            (entries) => {
                entries
                    .filter((i) => i.intersectionRatio > 0)
                    .map((i) => i.target as HTMLElement)
                    .filter((i) => i.classList.contains("lazy-bg"))
                    .forEach((i) => {
                        i.classList.remove("lazy-bg");
                        i.style.backgroundImage =
                            i.style.getPropertyValue("--background-img");
                        getAverageColor(
                            /url\("(.+)"\)/.exec(i.style.backgroundImage)![1],
                        )
                            /* .then(manipulateRepresentingColor) */
                            .then(([r, g, b]) => {
                                i.style.setProperty(
                                    "--representing-color",
                                    `${r}, ${g}, ${b}`,
                                );
                            });
                    });
            },
            {
                rootMargin: "10% 10% 10% 10%",
            },
        );
        for (const i of [...section.querySelectorAll(".lazy-bg")])
            observer.observe(i);
    }

    // 조회수 올리는 로직
    let thumbnailIntersectionObserver = new IntersectionObserver(
        onThumbnailVisible,
    );

    for (const i of [...section.querySelectorAll(".table-cell")]) {
        thumbnailIntersectionObserver.observe(i);
    }

    let hitIdsBefore: string[] = [];
    function onThumbnailVisible(entries: IntersectionObserverEntry[]) {
        const ids = entries
            .filter((i) => i.intersectionRatio > 0.0)
            .map((i) => (i.target as HTMLElement).dataset.id!);
        for (const id of ids) {
            if (hitIdsBefore.includes(id)) continue;

            PostBoardApiClient.hit(id);
        }
        hitIdsBefore = ids;
    }

    return;
}

class MobilePlugin extends ScrollbarPlugin {
    static pluginName = 'mobile';
    static defaultOptions = {
        speed: 0.5,
    };

    transformDelta(delta: any, fromEvent: any) {
        if (fromEvent.type !== 'touchend') {
            return delta;
        }

        return {
            x: delta.x * this.options.speed,
            y: delta.y * this.options.speed,
        };
    }
}

SmoothScrollbar.use(MobilePlugin);

// 메인 페이지에 '포스트 보드'를 생성함
// '포스트 보드'는 다수의 포스트로 이루어짐

export function setupPostBoard(
    columnParent: HTMLElement,
    getNextSection: () => Promise<PostBoardSectionData | null>,
) {
    let completed = false;
    const columnScrollbar = document.createElement("div");
    columnScrollbar.style.height = "100vh";
    columnParent.appendChild(columnScrollbar);

    // Smooth-scrollbar를 쓴다.
    const scrollbar = SmoothScrollbar.init(columnScrollbar, {
        alwaysShowTracks: false,
        //damping: isMobile ? 1 : 0.2
        damping: .27,
        plugins: {
            mobile: { // this is optional
                speed: 0.2,
            },
        },
    });
    scrollbar.track.yAxis.element.remove();
    const column = scrollbar.contentEl;

    function fillPlaceholderSection(posts: PostBoardSectionData | null) {
        if (posts === null || completed) {
            completed = true;
            [...column.querySelectorAll("section.placeholder")].forEach(
                (i) => i.parentNode?.removeChild(i),
            );
            return (
                column.querySelector("footer") === null &&
                column.appendChild(footer())
            );
        }

        // 포스트를 담을 테이블 생성
        const section = getPlaceholderSection();

        fillPlaceholderSectionInto(posts, section);
    }

    // 빈 섹션이 2개 미만으로 있을 시 빈 섹션을 새로 생성한다.
    function createPlaceholderSectionsIfNeeded() {
        let placeholderCount = [
            ...column.querySelectorAll("section.placeholder"),
        ].length;
        if (placeholderCount >= 2 || completed) return;

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
        const placeholder = column.querySelector("section.placeholder")!;
        if (markUsed)
            // IntersectionObserver에서 쓰이는 경우에는 placeholder를 제거하면 안 된다.
            placeholder.classList.remove("placeholder");

        // 항상 빈 섹션이 하단에 있도록 다시 호출한다.
        createPlaceholderSectionsIfNeeded();
        return placeholder as HTMLElement;
    }

    function getAllSections() {
        if (completed) return;

        getNextSection().then(fillPlaceholderSection).then(getAllSections);
    }
    getAllSections();
}

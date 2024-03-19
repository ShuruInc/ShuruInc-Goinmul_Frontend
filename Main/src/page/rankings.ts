import "../../styles/rankings.scss";
import { InitTopNav } from "../top_logo_navbar";
import pushpinImage from "../../assets/pushpin.svg";
import h1BorderImage from "../../assets/rankings-heading-bottom-line.svg";
import { dom, library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PostBoardApiClient from "../api/posts";
import { RankingItem } from "../home_post_board";
import { encode } from "html-entities";
import createFloatingButton, {
    addFloatingButonListener,
} from "../floating_button";
import createNoticeFloatingButton from "../notice_floating_button";

InitTopNav(false);
createFloatingButton();
createNoticeFloatingButton(
    "2024년 12월 31일 오후 11시 59분까지<br>'1등'을 유지하신 분께는 선물이 있어요!",
);
addFloatingButonListener(() => (location.href = "/"));

(document.querySelector(".pushpin img") as HTMLImageElement).src = pushpinImage;
(document.querySelector("img.h1-border") as HTMLImageElement).src =
    h1BorderImage;

library.add(faSearch);
dom.i2svg({ node: document.querySelector(".paper .search-icon")! });

let buttonLabels: string[] = [];
let rankingData: RankingItem[] = [];
let isTextExsits = false;

const activateRankingButton = (selectedLabel: string) => {
    const activeLabelIndex = buttonLabels.indexOf(selectedLabel);
    (
        activeLabelIndex === 0
        ? [activeLabelIndex, activeLabelIndex + 1, activeLabelIndex + 2]
        : activeLabelIndex === buttonLabels.length - 1
        ? [activeLabelIndex - 2, activeLabelIndex - 1, activeLabelIndex]
        : [activeLabelIndex - 1, activeLabelIndex, activeLabelIndex + 1]
    )
    .map((i) => {
        const active = i === activeLabelIndex;
        while (i < 0) {
            i += buttonLabels.length;
        }
        i %= buttonLabels.length;
        return { 
            label: buttonLabels[i], active 
        };
    })
    .forEach((data, idx) => {
        const button = document.querySelector(
            `nav.categories button:nth-child(${idx + 1})`,
        ) as HTMLButtonElement;
        button.textContent = data.label;
        button.dataset.label = data.label;

        if (data.active) button?.classList.add("active");
        else button?.classList.remove("active");
    });
};

const displayRanking = (query?: string, allowEmpty?: boolean) => {
    const tbody = document.createElement("tbody");
    const filtered = rankingData.filter((i) =>
        query ? `${i.nickname}#${i.hashtag}`.includes(query) : true,
    );
    filtered
        .map((i, idx) => {
            const row = document.createElement("tr");
            row.innerHTML =
                `<td class="ranking">${(idx + 1) == 1||2||3?'':(idx + 1)}</td>` +
                `<td class="nickname">${encode(i.nickname)}#${i.hashtag}</td>` +
                `<td class="score">${i.score}</td>`;
            return row;
        })
        .forEach((i, idx, arr) => {
            const padding = document.createElement("tr");
            padding.className = "padding";
            tbody.appendChild(i);
            if (idx !== arr.length - 1) tbody.appendChild(padding);
        });

    if (allowEmpty || filtered.length > 0)
        document
            .querySelector("table.rankings")
            ?.replaceChild(
                tbody,
                document.querySelector("table.rankings tbody")!,
            );
};

PostBoardApiClient.getRankings().then((rankings) => {
    buttonLabels = Object.keys(rankings);
    [...document.querySelectorAll("nav.categories")].forEach((i) => {
        i.addEventListener("mousedown", (evt) => {
            const label = (evt.target as HTMLButtonElement).dataset.label!;
            activateRankingButton(label);
            rankingData = rankings[label];
            displayRanking(undefined, true);
        });
    });
    document
        .querySelector(".search input")
        ?.addEventListener("input", (evt) => {
            displayRanking((evt.target as HTMLInputElement).value);
        });
    activateRankingButton(buttonLabels[0]);
    rankingData = rankings[buttonLabels[0]];
    displayRanking(undefined, true);
});


// 랭킹 검색창에 텍스트가 있는지 체크하고 기억
document.querySelector("input")?.addEventListener('input', () => {
    const text = document.querySelector("input")?.value;

    if(text == null) return;
    if (text.length > 0) {
        isTextExsits  = true;
    } else {
        isTextExsits  = false;
    }
    
});

// 랭킹 검색창에 텍스트가 비어있으면 메달 컬럼 표시, 텍스트가 없으면 메달 컬럼 비표시
setInterval(() => {
    if (isTextExsits) {
        document.querySelectorAll('.ranking').forEach(item => {
            (item as HTMLElement).style.display = 'none';
            
        });
    } else {
        document.querySelectorAll('.ranking').forEach(item => {
            (item as HTMLElement).style.display = '';
        });
    }
}, 1); 

// 랭킹 검색창이 포커스될 때 최초 한 번 텍스트를 비우기
document.querySelector("input")?.addEventListener('focus', () => {
    const input = document.querySelector("input");
    if(input == null) 
        return;
    else
    {
        input.value = "";
        isTextExsits = false;
    }
});
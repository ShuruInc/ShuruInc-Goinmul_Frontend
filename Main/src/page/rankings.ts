import "../../styles/rankings.scss";
import { InitTopNav } from "../top_logo_navbar";
import pushpinImage from "../../assets/pushpin.png";
import h1BorderImage from "../../assets/rankings-heading-bottom-line.svg";
import { dom, library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PostBoardApiClient from "../api/posts";
import { RankingItem } from "../home_post_board";
import { encode } from "html-entities";
import {
    addFloatingButonListener,
} from "../floating_button";
import createNoticeFloatingButton from "../notice_floating_button";

InitTopNav(false);
createNoticeFloatingButton(
    "5월 5일 23시 59분까지 1등을 유지하신 분께,  \"당신의 최애 장르 공식 굿즈 10만 원 상당\"을 이벤트 선물로 드립니다!",
);
addFloatingButonListener(() => (location.href = "/"));

(document.querySelector(".pushpin img") as HTMLImageElement).src = pushpinImage;
(document.querySelector("img.h1-border") as HTMLImageElement).src =
    h1BorderImage;

library.add(faSearch);
dom.i2svg({ node: document.querySelector(".paper .search-icon")! });

let buttonLabels: string[] = [];
let rankingData: RankingItem[] = [];
// let isTextExsits = false;

const rankingClass = [ 'first', 'second', 'third' ];

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
            `nav.categories button:nth-child(${
                (idx + 1)
            })`,
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

    if(filtered.length == 0){
        const tbody = document.querySelector('.rankings tbody');
        while (tbody?.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
    }

    filtered
        .map((i, idx) => {
            const row = document.createElement("tr");
            const k = idx + 1;

            row.innerHTML =
                `<td class="ranking ${rankingClass[k] ?? ''}">${(k==1)||(k==2)||(k==3)?'':idx+1}</td>` +
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
    const keysArr = Object.keys(rankings);
    buttonLabels = [keysArr[0], keysArr[2], keysArr[1]];

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
            searchRanking((evt.target as HTMLInputElement).value);
        });
    activateRankingButton(buttonLabels[0]);
    rankingData = rankings[buttonLabels[0]];
    displayRanking(undefined, true);
});

function searchRanking(value: string) {
    const tbody = document.querySelector<HTMLElement>('.rankings tbody');
    const rows = tbody?.querySelectorAll('tr');

    if(tbody !== null && rows !== null && rows !== undefined) {
        tbody.style.display = 'display-none';
    
        rows.forEach(row => {
            const nickname = row.querySelector('.nickname')?.textContent;
            if(nickname == null) return;
            if(nickname.includes(value)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

        tbody.style.display = '';
    }
}

// 한글 자모만 입력했는지 체크
// function hasCharactersWithinUnicodeRange(input: string): boolean {
//     // Regular expressions for the Unicode ranges
//     const range1Regex: RegExp = /[\u3131-\u314E]/; // Unicode hexadecimal: 12593 to 12622
//     const range2Regex: RegExp = /[\u314F-\u3163]/; // Unicode hexadecimal: 12623 to 12643
//     console.log(`Nothing`);

//     // Check if any character in the input string falls within the specified Unicode ranges
//     for (const char of input) {
//         if (range1Regex.test(char) || range2Regex.test(char)) {
//             console.log(`Character '${char}' is within Unicode ranges.`);
//             return true; // Return true as soon as a character within the range is found
//         }
//     }

//     return false; // Return false if no character within the range is found
// }


// 랭킹 검색창에 텍스트가 있는지 체크하고 기억
// document.querySelector("input")?.addEventListener('input', () => {
//     const text = document.querySelector("input")?.value;

//     if(text == null) return;
//     if (text.length > 0) {
//         isTextExsits  = true;
//     } else {
//         isTextExsits  = false;
//     }
    
// });

// 랭킹 검색창에 텍스트가 비어있으면 메달 컬럼 표시, 텍스트가 없으면 메달 컬럼 비표시
// setInterval(() => {
//     if (isTextExsits) {
//         document.querySelectorAll('.ranking').forEach(item => {
//             (item as HTMLElement).style.display = 'none';
            
//         });
//     } else {
//         document.querySelectorAll('.ranking').forEach(item => {
//             (item as HTMLElement).style.display = '';
//         });
//     }
// }, 1); 

// 랭킹 검색창이 포커스될 때 최초 한 번 텍스트를 비우기
// document.querySelector("input")?.addEventListener('focus', () => {
//     const input = document.querySelector("input");
    
//     if(input == null) 
//         return;
//     else
//     {
//         input.value = "";
//         isTextExsits = false;
//     }

// });

// document.querySelector("input")?.addEventListener('blur', () => {
//     location.href = location.href; //새로고침
// })

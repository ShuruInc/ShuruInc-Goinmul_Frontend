/* 
이하 코드는 스타일과 DOM요소를 임시적으로 조작하기 위해 작성되었습니다.
런칭 전에 요구사항을 급히 반영하기 위해 작성되었습니다. 
darkmagic.js를 제거하고 싶다면, 먼저 의도된 기능/요구사항을 파악하고 고쳐야 합니다.
darkmagic.js는 독립적이므로, <script src="darkmagic.js"></script> 를 모두 제거하면 
더 이상 추가적인 의존성은 없습니다.
*/

// 모바일 판정
function mobileCheckByRegex() {
    let check = false;
    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                a,
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4),
            )
        ) {
            check = true;
        }
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}
// 모바일 판정
function isTouchDevice() {
    let check = ("ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0);
    return check;
} 
// 모바일 판정
const isMobile = mobileCheckByRegex();

// 루프를 종료하기 위한 플래그
let changeOnepiceFlag = true;
let changeKorFlag = true;
let insertFlag = true;
let isWebtoonAnimSwaped = false;
// DOM 저장 변수
let plaveQuizSection;
let companyQuizSection;

document.addEventListener("DOMContentLoaded", function() {
    if(isMobile) {
        let loop_a = setInterval(() => {
            const footer = document.querySelector("footer");
            const paragraph = footer.querySelector("p");
            paragraph.style.height = "40px"
            
            clearInterval(loop_a);
        }, 300);
    } else {
        // PC만 푸터 관련 크기 증가
        //console.log("PC")
        let loop_b = setInterval(() => {
            const footer = document.querySelector("footer");
            if (footer != null) {
                const computedStyle = window.getComputedStyle(footer);
                
                const currentFontSize = parseFloat(computedStyle.fontSize);
                const newFontSize = currentFontSize * 1.3;
                footer.style.fontSize = newFontSize + "px";

                const currentHeight = footer.clientHeight;
                const newHeight = currentHeight * 1.1;
                footer.style.height = newHeight + "px";

                const paragraphs = footer.querySelectorAll("p");
                paragraphs.forEach(paragraph => {
                    const computedStyle = window.getComputedStyle(paragraph);
                    const currentFontSize = parseFloat(computedStyle.fontSize);
                    const newFontSize = currentFontSize * 1.3;
                    paragraph.style.fontSize = newFontSize + "px";

                    const currentLineHeight = parseFloat(computedStyle.lineHeight);
                    const newLineHeight = currentLineHeight * 1.6;
                    paragraph.style.lineHeight = newLineHeight + "px";
                });
                clearInterval(loop_b);
            } 
        }, 300);
    }
});

let loop_c = setInterval(() => {
    const allMiddleCategoryName = document.querySelectorAll('section.post-section, h2');
    if(allMiddleCategoryName.length > 0) {
        // 바꾸고 싶은 썸네일 div 내부의 텍스트(제목), 새로 넣을 썸네일
        replaceBackgroundImageIfTitleMatches("짱구는 못말려 극장판 퀴즈", "https://i.ibb.co/xGVm8rR/jjangu.png");
        // 원피스와 한국 애니메이션 텍스트를 찾는 구간
        // if(changeKorFlag || changeOnepiceFlag){
        //     allMiddleCategoryName.forEach((elem) => {
        //         if(changeOnepiceFlag && elem.textContent  == "원피스 모의고사"){
        //             changeOnepiceFlag = false;
        //             elem.textContent = "한국 애니메이션 맞히기 모의고사";
        //         } else if(changeKorFlag && elem.textContent == "한국 애니메이션 맞히기 모의고사"){
                    
        //             changeKorFlag = false;
        //             //맨 마지막 스페이스 문자로 중복변경 방지
        //             elem.textContent = "원피스 모의고사 ";
        //         }
        //     });
        // }

        // allMiddleCategoryName.forEach((elem) => {
        //     if(elem.textContent == "플레이브 모의고사"){
        //         plaveQuizSection = elem.parentNode;
        //     } else if(elem.textContent == "소속사별 모의고사") {
        //         companyQuizSection = elem.parentNode;
        //     }
        // });

        // if(plaveQuizSection != null && companyQuizSection != null){
        //     const parent = companyQuizSection.parentNode;
        //     if(parent != null) parent.insertBefore(plaveQuizSection, companyQuizSection);

        //     insertFlag = false;
        // }

        swapElements();

        // 모든 수행이 끝나면 루프 삭제
        if(!changeKorFlag && !changeOnepiceFlag && !insertFlag && isWebtoonAnimSwaped) {
            clearInterval(loop_c);
        }
    }
}, 10);


function replaceBackgroundImageIfTitleMatches(titleText, newBackgroundImageUrl) {
    const titleElements = document.querySelectorAll('.title');

    titleElements.forEach(titleElement => {
        if (titleElement.textContent.trim() === titleText) {
            const parentElement = titleElement.parentElement.parentElement;

            if (parentElement != null) {
                parentElement.style.backgroundImage = `url('${newBackgroundImageUrl}')`;
            }
        }
    });
}


// let loop_d = setInterval(() => {
//     const h2Element = document.querySelector('h2.subtitle');
    
//     console.log(h2Element.textContent.trim() )

//     // if (h2Element && h2Element.textContent.trim() === "원피스 모의고사 ") {
//     //     h2Element.textContent = "한국 애니 맞히기 모의고사";
//     //     clearInterval(loop_d);
//     //     return;
//     // } 

//     // else if (h2Element && h2Element.textContent.trim() === "한국 애니메이션 맞히기 모의고사") {
//     //     h2Element.textContent = "원피스 모의고사";
//     //     clearInterval(loop_d);
//     //     return;
//     // }
// }, 10);


function swapElements() {
    if(isWebtoonAnimSwaped) return;

    var h2Elements = document.querySelectorAll('h2');
    var webtoonParent = null;
    var animationParent = null;

    h2Elements.forEach(function(element) {
        if (element.textContent.includes("웹툰")) {
            webtoonParent = element.parentNode;
        } else if (element.textContent.includes("애니메이션")) {
            animationParent = element.parentNode;
        }
    });

    if (webtoonParent && animationParent) {
        var nextSibling = animationParent.nextSibling;
        webtoonParent.parentNode.insertBefore(animationParent, webtoonParent.nextSibling);
        animationParent.parentNode.insertBefore(webtoonParent, nextSibling);
        isWebtoonAnimSwaped = true;
    }
}

let changeOnepiceFlag = true;
let changeKorFlag = true;
let insertFlag = true;

let plaveQuizSection;
let companyQuizSection;

var loop = setInterval(() => {
    const allMiddleCategoryName = document.querySelectorAll('section.post-section, h2');
    
    // 바꾸고 싶은 썸네일 div 내부의 텍스트(제목), 새로 넣을 썸네일
    replaceBackgroundImageIfTitleMatches("짱구는 못말려 극장판 퀴즈", "https://i.ibb.co/xGVm8rR/jjangu.png");

    if(allMiddleCategoryName == null) return;

    // 원피스와 한국 애니메이션 텍스트를 찾는 구간
    if(changeKorFlag || changeOnepiceFlag){
        allMiddleCategoryName.forEach((elem) => {
            if(changeOnepiceFlag && elem.textContent  == "원피스 모의고사"){
                changeOnepiceFlag = false;
                elem.textContent = "한국 애니메이션 맞히기 모의고사 "; 
            } else if(changeKorFlag && elem.textContent == "한국 애니메이션 맞히기 모의고사"){
                changeKorFlag = false;
                //맨 마지막 스페이스 문자로 중복변경 방지                                                                                                                                                                                                                                                                                                                                                   
                elem.textContent = "원피스 모의고사 ";
            }
        });
    }

    allMiddleCategoryName.forEach((elem) => {
        if(elem.textContent == "플레이브 모의고사"){
            plaveQuizSection = elem.parentNode;
        } else if(elem.textContent == "소속사별 모의고사") {
            companyQuizSection = elem.parentNode;
        }
    });

    if(plaveQuizSection != null && companyQuizSection != null){
        const parent = companyQuizSection.parentNode;
        if(parent != null) parent.insertBefore(plaveQuizSection, companyQuizSection);

        insertFlag = false;
    }

    // 모든 수행이 끝나면 루프 삭제
    if(!changeKorFlag && !changeOnepiceFlag && !insertFlag) {
        clearInterval(loop);
    }
}, 10);



function replaceBackgroundImageIfTitleMatches(titleText, newBackgroundImageUrl) {
    // Find all elements with class "title"
    const titleElements = document.querySelectorAll('.title');
    // const board = document.querySelector('.chalk-bordered');
    // board.style.backgroundColor = "rgba(0,0,0,0)";

    // Iterate through each title element
    titleElements.forEach(titleElement => {
        // Check if the text content of the title element matches the provided titleText
        if (titleElement.textContent.trim() === titleText) {
            // Replace the parent element's background image URL with the newBackgroundImageUrl
            const parentElement = titleElement.parentElement.parentElement;

            if (parentElement != null) {
                parentElement.style.backgroundImage = `url('${newBackgroundImageUrl}')`;
            }
        }
    });
}
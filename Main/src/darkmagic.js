let changeOnepiceFlag = true;
let changeKorFlag = true;
let insertFlag = true;

let plaveQuizSection;
let companyQuizSection;

var loop = setInterval(() => {
    const allMiddleCategoryName = document.querySelectorAll('section.post-section, h2');
    
    if(allMiddleCategoryName == null) return;

    // 원피스와 한국 애니메이션 텍스트를 찾는 구간
    if(changeKorFlag || changeOnepiceFlag){
        allMiddleCategoryName.forEach((elem) => {
            if(changeOnepiceFlag && elem.textContent  == "원피스 모의고사"){
                changeOnepiceFlag = false;
                elem.textContent = "한국 애니메이션 맞히기 모의고사 "; 
                // console.log("원피스를 해결");
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

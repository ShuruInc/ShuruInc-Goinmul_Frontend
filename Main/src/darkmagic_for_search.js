let liDone = false;

delegate();
hide();

document.addEventListener("DOMContentLoaded", function() {
    setInterval(() => {
        // 해시태그(연관검색결과)가 있으면 "검색 결과가 없습니다, 출제요청" 섹션을 숨긴다.
        hide();
    }, 50);
    
    setInterval(() => {
        //<li>태그의 클릭 이벤트를 <a>로 위임한다.
        delegate();
    }, 500)
});

function hide(){
    // 해시태그(연관검색결과)가 있으면 "검색 결과가 없습니다, 출제요청" 섹션을 숨긴다.
    try{
        const inputElem = document.querySelector('input.search');
        const relatedTestElem = document.querySelector('section.similar');
        const isTextExist = (inputElem != null) && inputElem.value.trim() !== '';
        const isRelatedTestExist = !(relatedTestElem.classList.contains("display-none"));

        //검색창에 텍스트가 있고 && "연관된 모의고사" 섹션이 display 되어있으면
        if(isTextExist && isRelatedTestExist) {
            // "검색 결과가 없습니다, 출제요청" 섹션을 가림
            document.querySelector('.no-results').style.display = 'none';
        } else if (isTextExist) {
            document.querySelector('.no-results').style.display = 'flex';
        }
    } catch(e){ }
}

function delegate(){
    //<li>태그의 클릭 이벤트를 <a>로 위임한다.
    try { 
        const listItems = document.querySelectorAll('.columns .column li');

        listItems.forEach(item => {
            //커서 모양을 포인터로 바꾸고
            const anchor = item.querySelector('a');
            item.style.cursor = "pointer";

            //li(item)요소의 클릭 이벤트를 <a>(anchor)로 전파
            item.addEventListener('click', (event) => {
                event.preventDefault();
                anchor.click();
            });
        });
    } catch(e){     
    }
}

document.querySelectorAll('article .popularNow .columns .column li').forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault();

        item.querySelector('a').click();
    });
});

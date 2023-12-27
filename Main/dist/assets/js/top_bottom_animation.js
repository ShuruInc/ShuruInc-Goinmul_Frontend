// 애니메이션이 있는 모바일형 상단바
// 하향 스크롤 시 감추고 반대의 경우 드러냄
var lastScrollTop = 0;
var topFixedBar = document.getElementById('topFixedBar');
var mainTopLogo = document.getElementById('mainTopLogo');
mainTopLogo.src = "../dist/assets/images/logo/MainLogo_"+getRandomInt(4)+"_alpha.png";

var body = document.body;
var isHidden = false;
var isFirstLoad = true;
var mainLogoNum = 1;
var logoChangeAllowed = true; 

window.addEventListener('scroll', function () {
    // 구형 브라우저는 후자가 할당됨
    var scrollTop = window.scrollY || document.documentElement.scrollTop;

    //페이지가 로딩될 때에는 상단바를 가리지 않음
    if(isFirstLoad){
        isFirstLoad = false;
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        return;
    }

    if (scrollTop > (lastScrollTop + 15)) {
        // 하향 스크롤로 전환 시에만 감춤 
        if(!isHidden) {
            changeMainTopLogo();
            topFixedBar.style.transform = 'translateX(-50%) translateY(-45%)';
            isHidden = true;
        }
    } else if (scrollTop < (lastScrollTop - 15)) {
        // 상향 스크롤로 전환 시에만 드러냄
        if(isHidden) {
            topFixedBar.style.transform = 'translateX(-50%) translateY(0%)';
            isHidden = false;
        }
    }

    if(isHidden){
        topFixedBar.classList.add('is-hidden');
        mainTopLogo.classList.add('is-hidden');
    } else {
        topFixedBar.classList.remove('is-hidden');
        mainTopLogo.classList.remove('is-hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

function changeMainTopLogo(){
    if(logoChangeAllowed){
        logoChangeAllowed = false;
        setTimeout(()=>{
            if(mainLogoNum < 4){
                mainLogoNum++;
            } else {
                mainLogoNum = 1;
            }
            mainTopLogo.src = "../dist/assets/images/logo/MainLogo_"+mainLogoNum+"_alpha.png";
            logoChangeAllowed = true;
        }, 100)
    }
}

function getRandomInt(max) {
    return Math.ceil(Math.random() * max);
}
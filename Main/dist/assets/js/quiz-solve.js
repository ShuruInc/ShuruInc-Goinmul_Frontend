let tmp = 0;
let progress = 30;
let stopLoop = false;
setInterval(() => {
    if (stopLoop) return;

    updateProgress(progress);
    let problem;
    switch (tmp) {
        case 0:
            problem = {
                question: "문제 텍스트입니다",
                figure: "https://picsum.photos/200/200",
                figureType: "image",
                points: 10,
                choices: ["ㅁㄴㅇㄹ1", "ㅁㄴㅇㄹ2", "ㅁㄴㅇㄹ3", "ㅁㄴㅇㄹ4"],
            };
            break;
        case 1:
            problem = {
                question: "문제 텍스트입니다",
                figure: "ㅉㅉㄴ ㅁㅁㄹ",
                figureType: "initials",
                points: 10,
                choices: null,
            };
            break;
        case 2:
            problem = {
                question: "문제 텍스트입니다",
                figure: "https://picsum.photos/200/200",
                figureType: "image",
                points: 10,
                choices: null,
            };
    }

    displayProblem(document.querySelector("article"), problem);
    updateShareProblem(
        document.querySelector(".help-me .problem-box"),
        problem
    );
    tmp = (tmp + 1) % 3;
    progress = (progress + 5) % 100;
}, 1000);

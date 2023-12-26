// 메인 페이지에 '포스트 보드'를 생성함
// '포스트 보드'는 다수의 포스트로 이루어짐

document.addEventListener('DOMContentLoaded', function () {
    createFlexTable();
    createFlexTable();
    createFlexTable();
});

function createFlexTable() {
    var imgs = Array.from({ length: 8 }, (_, index) => `${index + 1}.jpg`)
                .sort(() => Math.random() - 0.5);
    
    var mainContainer = document.getElementById('mainContainer');

    // 포스트를 담을 테이블 생성
    var flexTable = document.createElement('div');
    flexTable.className = 'flex-table';


    // 가로형 포스트 생성
    var tableLandscapeCell = document.createElement('div');
    tableLandscapeCell.className = 'table-landscape-cell';
    var image = new Image();
    image.className = 'cell-landscape-img';
    image.src = '/dist/assets/images/kpop/' + imgs[4];
    image.alt = 'Error';
    flexTable.appendChild(tableLandscapeCell);
    tableLandscapeCell.appendChild(image);

    // 세로형 포스트를 8개 생성
    for (var i = 0; i < imgs.length; i++) {
        var tableCell = document.createElement('div');
        tableCell.className = 'table-cell';

        image = new Image();
        image.className = 'cell-img';
        image.src = '/dist/assets/images/kpop/' + imgs[i];
        image.alt = 'Image ' + (i + 1);

        tableCell.appendChild(image);
        flexTable.appendChild(tableCell);
    }

    mainContainer.appendChild(flexTable);
}
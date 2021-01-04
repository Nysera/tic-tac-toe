const dom = (function() {
    const cacheDom = {
        boardContainer: document.querySelector(".board")
    };
    const squareMarkup = function() {
        const square = document.createElement("div");
        square.classList.add("square");
        square.innerHTML = "<span></span>";
        return square;
    };
    const render = function(board) {
        board.forEach(function() {
            cacheDom.boardContainer.append(squareMarkup());
        });
    };


    // public scope
    return {
        render
    };
})();

const gameBoard = (function() {
    let board = [];
    const square = {
        marker: ""
    };

    const initializeBoard = function() {
        for (let i = 0; i < 9; i++ ) {
            board.push(square);
        }
        dom.render(board);
    };

    initializeBoard();
})();
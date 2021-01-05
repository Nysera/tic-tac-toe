const dom = (function() {
    const cacheDom = {
        boardContainer: document.querySelector(".board")
    };
    const squareSelector = function() {
        return cacheDom.boardContainer.querySelectorAll(".square");
    };
    const setMarker = function(el, marker) {
        const span = el.querySelector("span");
        span.innerHTML = marker;
        if (marker === "o") {
            setTimeout(function(){
                span.classList.add("visible");
            }, 180);
        } else {
            span.classList.add("visible");
        }
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
        render,
        squareSelector,
        setMarker
    };
})();

const playerFactory = function(name, marker, type) {
    const takeTurn = function() {
        console.log({ name, marker, type });
        if (name === "player1") {
            const index = Array.from(event.currentTarget.parentNode.children).indexOf(event.currentTarget);
            gameBoard.addMarker(index, marker);
        }
    };

    return {
        takeTurn
    };
};

const gameBoard = (function() {
    let board = [];
    const square = {
        marker: ""
    };
    const addMarker = function(index, marker) {
        const getSquareDivFromIndex = Array.from(dom.squareSelector())[index];
        board[index] = { marker }
        dom.setMarker(getSquareDivFromIndex, marker);
    };
    const initializeBoard = function() {
        for (let i = 0; i < 9; i++ ) {
            board.push(square);
        }
        dom.render(board);
    };

    // public scope
    return {
        initializeBoard,
        addMarker
    };
})();

const game = (function() {
    const player1 = playerFactory("player1", "x", "human");
    let player2 = playerFactory("player2", "o", "human");
    let isPlayer1Turn = true;
    let currentPlayer;

    const startGame = function() {
        gameBoard.initializeBoard();
        setPlayer();
        addSquareEventListener();
    };
    const setPlayer = function() {
        isPlayer1Turn ? currentPlayer = player1 : currentPlayer = player2;
    };

    const addSquareEventListener = function() {
        dom.squareSelector().forEach(function(square){
            square.addEventListener("click", function(event){
                if (event.currentTarget.textContent === "") {
                    currentPlayer.takeTurn(event);
                }
            });
        });
    };



    startGame();
})();
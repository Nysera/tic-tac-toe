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
            }, 100);
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
    const humanPlayer = function() {
        const index = Array.from(event.currentTarget.parentNode.children).indexOf(event.currentTarget);
        gameBoard.addMarker(index, marker);
    };
    const computerPlayer = function() {
        const unfilteredChoices = gameBoard.getBoard().map(function(square, index) {
            if (square.marker !== "") {
                return false;
            } else {
                return index;
            }
        });
        const filteredChoices = unfilteredChoices.filter(function(choice) {
            return choice !== false;
        });
        const randomizeIndex = Math.floor(Math.random() * filteredChoices.length);
        gameBoard.addMarker(filteredChoices[randomizeIndex], marker);
    };
    const takeTurn = function() {
        if (name === "player1" || name === "player2" && type === "human") {
            humanPlayer();
        } else if (name === "player2" && type === "computer") {
            computerPlayer();
        }
    };

    return {
        name,
        marker,
        type,
        takeTurn
    };
};

const gameBoard = (function() {
    let board = [];
    const square = {
        marker: ""
    };
    const getBoard = function() {
        return board;
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
        addMarker,
        getBoard
    };
})();

const game = (function() {
    const player1 = playerFactory("player1", "x", "human");
    let player2 = playerFactory("player2", "o", "computer");
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
    const switchPlayer = function() {
        isPlayer1Turn = !isPlayer1Turn;
    };
    const addSquareEventListener = function() {
        dom.squareSelector().forEach(function(square){
            square.addEventListener("click", function(event){
                const checkBoardForSpace = function() {
                    return gameBoard.getBoard().some(function(square) {
                        return square.marker === "";
                    });
                };
                if (event.currentTarget.textContent === "") {
                    currentPlayer.takeTurn(event);
                    switchPlayer();
                    setPlayer();
                    if (currentPlayer.name === "player2" && currentPlayer.type === "computer" && checkBoardForSpace()) {
                        currentPlayer.takeTurn();
                        switchPlayer();
                        setPlayer();
                    } else {
                        return;
                    }
                }
            });
        });
    };



    startGame();
})();
const dom = (function() {
    const cacheDom = {
        boardContainer: document.querySelector(".board")
    };
    const squareSelector = function() {
        return cacheDom.boardContainer.querySelectorAll(".square");
    };
    const toggleWinnerClasses = function(status, array) {
        if (status === "win") {
            if (!cacheDom.boardContainer.classList.contains("winner")) {
                cacheDom.boardContainer.classList.add("winner");
            } else {
                cacheDom.boardContainer.classList.remove("winner");
            }
            array.forEach(function(square) {
                const getElementFromIndex = Array.from(dom.squareSelector())[square.index];
                getElementFromIndex.querySelector("span").classList.add("winner");
            });
        } else if (status === "tie") {
            if (!cacheDom.boardContainer.classList.contains("tie")) {
                cacheDom.boardContainer.classList.add("tie");
            } else {
                cacheDom.boardContainer.classList.remove("tie");
            }
        }
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
    const resetBoard = function() {
        cacheDom.boardContainer.innerHTML = "";
    };
    const render = function(board) {
        resetBoard();
        board.forEach(function() {
            cacheDom.boardContainer.append(squareMarkup());
        });
    };


    // public scope
    return {
        render,
        squareSelector,
        setMarker,
        toggleWinnerClasses,
    };
})();

const playerFactory = function(name, marker, type) {
    const humanPlayer = function(event) {
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
    const takeTurn = function(event) {
        if (name === "player1" || name === "player2" && type === "human") {
            humanPlayer(event);
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
        board = [];
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
    const resetGame = function() {
        isPlayer1Turn = true;
        startGame();
    };
    const setPlayer = function() {
        isPlayer1Turn ? currentPlayer = player1 : currentPlayer = player2;
    };
    const switchPlayer = function() {
        isPlayer1Turn = !isPlayer1Turn;
    };
    const addSquareEventListener = function() {
        dom.squareSelector().forEach(function(square){
            square.addEventListener("click", function(event) {
                if (!winner()) {
                    if (event.currentTarget.textContent === "") {
                        currentPlayer.takeTurn(event);
                        if (!winner()) {
                            switchPlayer();
                            setPlayer();
                        }
                    }
                    if (currentPlayer.name === "player2" && currentPlayer.type === "computer" && checkBoardForSpace()) {
                        currentPlayer.takeTurn();
                        if (!winner()) {
                            switchPlayer();
                            setPlayer();
                        }
                    }
                } else {
                    resetGame();
                }
            });
        });
    };
    const checkBoardForSpace = function() {
        return gameBoard.getBoard().some(function(square) {
            return square.marker === "";
        });
    };
    const winner = function() {
        const board = gameBoard.getBoard();
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        const checkForWinner = function() {
            return winConditions.some(function(array) {
                let filteredArray = [];
                array.forEach(function(idx) {
                    if (board[idx].marker !== "") {
                        const addIndex = {
                            marker: board[idx].marker,
                            index: idx
                        };
                        filteredArray.push(addIndex);
                    }
                });
                if (filteredArray.length === 3) {
                    if (filteredArray.every(function(square) {
                        return square.marker === "x";
                    })) {
                        console.log("X has won!");
                        dom.toggleWinnerClasses("win", filteredArray);
                        return true;

                    } else if (filteredArray.every(function(square) {
                        return square.marker === "o";
                    })) {
                        console.log("O has won!");
                        dom.toggleWinnerClasses("win", filteredArray);
                        return true;

                    } else {
                        return false;
                    }
                }
            }); 
        };
        const checkForTie = function() {
            return board.filter(function(square) {
                return square.marker !== "";
            }).length === 9;
        };

        if (checkForWinner() === true) {
            return true;
        } else if (checkForTie() === true) {
            console.log("tie");
            dom.toggleWinnerClasses("tie", null);
            return true;
        } else {
            return false;
        }
    };



    startGame();
})();
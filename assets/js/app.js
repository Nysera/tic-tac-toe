const dom = (function() {
    const cacheDom = {
        boardContainer: document.querySelector(".board"),
        playerToggleBtn: document.querySelector("#player-toggle"),
        player2ScoreContainer: document.querySelector("#computer")
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
        } else {
            cacheDom.boardContainer.classList.remove("winner");
            cacheDom.boardContainer.classList.remove("tie");
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
        cacheDom,
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
        dom.cacheDom.playerToggleBtn.addEventListener("click", changePlayer);
    };
    const resetGame = function() {
        isPlayer1Turn = true;
        dom.toggleWinnerClasses();
        startGame();
    };
    const setPlayer = function() {
        isPlayer1Turn ? currentPlayer = player1 : currentPlayer = player2;
    };
    const switchPlayer = function() {
        isPlayer1Turn = !isPlayer1Turn;
    };
    const changePlayer = function() {
        if (player2.type === "computer") {
            dom.cacheDom.playerToggleBtn.querySelector(".icon").innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="28" viewBox="0 0 18 16"><path d="M12 12.041v-0.825c1.102-0.621 2-2.168 2-3.716 0-2.485 0-4.5-3-4.5s-3 2.015-3 4.5c0 1.548 0.898 3.095 2 3.716v0.825c-3.392 0.277-6 1.944-6 3.959h14c0-2.015-2.608-3.682-6-3.959z"></path><path d="M5.112 12.427c0.864-0.565 1.939-0.994 3.122-1.256-0.235-0.278-0.449-0.588-0.633-0.922-0.475-0.863-0.726-1.813-0.726-2.748 0-1.344 0-2.614 0.478-3.653 0.464-1.008 1.299-1.633 2.488-1.867-0.264-1.195-0.968-1.98-2.841-1.98-3 0-3 2.015-3 4.5 0 1.548 0.898 3.095 2 3.716v0.825c-3.392 0.277-6 1.944-6 3.959h4.359c0.227-0.202 0.478-0.393 0.753-0.573z"></path></svg>`;
            dom.cacheDom.playerToggleBtn.querySelector(".value").innerHTML = "2P";
            dom.cacheDom.player2ScoreContainer.querySelector(".title").innerHTML = "Player 2(<b>O</b>)"
            player2 = playerFactory("player2", "o", "human");
            resetGame();
        } else {
            dom.cacheDom.playerToggleBtn.querySelector(".icon").innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16"><path d="M9 11.041v-0.825c1.102-0.621 2-2.168 2-3.716 0-2.485 0-4.5-3-4.5s-3 2.015-3 4.5c0 1.548 0.898 3.095 2 3.716v0.825c-3.392 0.277-6 1.944-6 3.959h14c0-2.015-2.608-3.682-6-3.959z"></path></svg>`;
            dom.cacheDom.playerToggleBtn.querySelector(".value").innerHTML = "1P";
            dom.cacheDom.player2ScoreContainer.querySelector(".title").innerHTML = "Computer(<b>O</b>)"
            player2 = playerFactory("player2", "o", "computer");
            resetGame();
            dom.toggleWinnerClasses();
        }
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
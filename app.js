
const userArray = [];

const computerArray = [];

const matrixSize = 9;

let shipsHorizontal = true;

let gameOver = false;

let gameStarted = false;

let currentPlayer = "user";


let draggs = 0;

const smallShipObj = {
  name: "Small-Ship",
  horizontal: [0, 1],
  vertical: [0, matrixSize],
};

const mediumShipObj = {
  name: "Medium-Ship",
  horizontal: [0, 1, 2],
  vertical: [0, matrixSize, matrixSize * 2],
};

const mediumShipObj2 = {
  name: "Medium-Ship2",
  horizontal: [0, 1, 2],
  vertical: [0, matrixSize, matrixSize * 2],
};

const bigShipObj = {
  name: "Big-Ship",
  horizontal: [0, 1, 2, 3],
  vertical: [0, matrixSize, matrixSize * 2, matrixSize * 3],
};

const bigShipObj2 = {
  name: "Big-Ship2",
  horizontal: [0, 1, 2, 3],
  vertical: [0, matrixSize, matrixSize * 2, matrixSize * 3],
};


function createGameBoard(matrixSize, gameboard, array) {
  for (let i = 0; i < matrixSize * matrixSize; i++) {
    const square = document.createElement("div");

    square.dataset.id = i;
    gameboard.appendChild(square);

    array.push(square);
  }
}

createGameBoard(matrixSize, userGameboard, userArray);
createGameBoard(matrixSize, computerGameboard, computerArray);

rotateButton.addEventListener("click", rotateShips);
fireButton.addEventListener("click", fireTorpedo);
showShipsButton.addEventListener("click", showShips);
restartButton.addEventListener("click", restartGame);
startButton.addEventListener("click", play);

ships.forEach((ship) => ship.addEventListener("dragstart", dragStart));
userArray.forEach((array) => array.addEventListener("dragstart", dragStart));
userArray.forEach((array) => array.addEventListener("dragover", dragOver));
userArray.forEach((array) => array.addEventListener("dragenter", dragEnter));
userArray.forEach((array) => array.addEventListener("dragleave", dragLeave));
userArray.forEach((array) => array.addEventListener("drop", dragDrop));
userArray.forEach((array) => array.addEventListener("dragend", dragEnd));




function rotateShips() {
  if (shipsHorizontal) {
    document.querySelector(".ships-display").style.display = "flex";
  }
  if (!shipsHorizontal) {
    document.querySelector(".ships-display").style.display = "block";
  }
  smallShip.classList.toggle("small-ship-container-v");
  mediumShip1.classList.toggle("medium-ship-container-0-v");
  mediumShip2.classList.toggle("medium-ship-container-1-v");
  bigShip1.classList.toggle("big-ship-container-0-v");
  bigShip2.classList.toggle("big-ship-container-1-v");
  shipsHorizontal = !shipsHorizontal;
}




let currentShipIndex;

let currentShip;

let currentShipLength;

ships.forEach((ship) =>
  ship.addEventListener("mousedown", (event) => {
    currentShipIndex = event.target.id;
  })
);

function dragStart() {
  currentShip = this;
  currentShipLength = currentShip.children.length;
}

function dragOver(event) {
  event.preventDefault();
}

function dragEnter(event) {
  event.preventDefault();
}

function dragLeave() {
  return;
}

function dragDrop() {

  let shipWithLastId = currentShip.lastElementChild.id;

  let shipClass = currentShip.lastElementChild.id.slice(0, -2);

  let lastShipIndex = parseInt(shipWithLastId.substr(-1));


  let lastId = lastShipIndex + parseInt(this.dataset.id);


  let selectedShipIndex = parseInt(currentShipIndex.substr(-1));

  console.log(`currentShipIndex: ${currentShipIndex}`);
  console.log(`shipWithLastId: ${shipWithLastId}`);
  console.log(`shipClass : ${shipClass}`);
  console.log(`lastShipIndex: ${lastShipIndex}`);
  console.log(`lastId: ${lastId}`);
  console.log(`selectedShipIndex: ${selectedShipIndex}`);


  lastId = lastId - selectedShipIndex;

  const forbiddenHorizontalSquares = [];
  for (let i = 0; i < 10; i++) {
    forbiddenHorizontalSquares.push(i * 9);
  }
  for (let i = 0; i < 10; i++) {
    forbiddenHorizontalSquares.push(i * 9 + 1);
  }
  for (let i = 0; i < 10; i++) {
    forbiddenHorizontalSquares.push(i * 9 + 2);
  }
  for (let i = 0; i < 10; i++) {
    forbiddenHorizontalSquares.push(i * 9 + 3);
  }


  
  let newForbiddenHorizontalSquares = forbiddenHorizontalSquares.splice(
    0,
    9 * lastShipIndex
  );

  
  if (shipsHorizontal && newForbiddenHorizontalSquares.includes(lastId)) {
    return;
  }


  
  if (!shipsHorizontal && lastId - lastShipIndex + lastShipIndex * 9 > 80) {
    return;
  }

  if (shipsHorizontal) {
    for (let i = 0; i < currentShipLength; i++) {

      userArray[
        parseInt(this.dataset.id) - selectedShipIndex + i
      ].classList.add("taken", shipClass);
    }
  } else if (!shipsHorizontal) {

    for (let i = 0; i < currentShipLength; i++) {
      userArray[
        parseInt(this.dataset.id) - selectedShipIndex + matrixSize * i
      ].classList.add("taken", shipClass);
    }
  }

  shipsDisplay.removeChild(currentShip);

  draggs++;
}

function dragEnd() {
  return;
}

function generateRandomShip(ship) {
  const randomDirection = Math.floor(Math.random() * 2);
  const currentDirection = randomDirection ? ship.vertical : ship.horizontal;

  const direction = randomDirection ? 9 : 1;

  const randomShipStart = Math.abs(
    Math.floor(Math.random() * computerArray.length) -
      ship.horizontal.length * direction
  );

  const squareInUse = currentDirection.some((i) =>
    computerArray[randomShipStart + i].classList.contains("pc-taken")
  );
  const squareInRightEdge = currentDirection.some(
    (i) => (randomShipStart + i) % matrixSize === matrixSize - 1
  );
  const squareInLeftEdge = currentDirection.some(
    (i) => (randomShipStart + i) % matrixSize === 0
  );

  if (!squareInUse && !squareInRightEdge && !squareInLeftEdge) {
    currentDirection.forEach((i) =>
      computerArray[randomShipStart + i].classList.add("pc-taken", ship.name)
    );
  } else {
    generateRandomShip(ship);
  }
}

generateRandomShip(smallShipObj);
generateRandomShip(mediumShipObj);
generateRandomShip(mediumShipObj2);
generateRandomShip(bigShipObj);
generateRandomShip(bigShipObj2);


function fireTorpedo() {
  if (!gameStarted) {
    alert("El juego no ha empezado todavía");
    return;
  }
  const coordinatesPromt = prompt("X, Y Where X is the Row and Y the Column");
  const newCoordintes = coordinatesPromt.replace(",", "");

  const operation = (
    9 * parseInt(newCoordintes[0] - 1) +
    parseInt(newCoordintes[1] - 1)
  ).toString();

  for (square of computerArray) {
    if (square.dataset.id === operation) {
      showSquare(square);
    }
  }
}


function showShips() {
  computerArray.forEach((square) => {
    if (square.classList.contains("pc-taken")) {
      square.style.backgroundColor = "steelblue";
    }
    if (square.classList.contains("hit")) {
      square.style.backgroundColor = "red";
    }
  });
}


function restartGame() {
  location.reload();
}



function play() {
  if (draggs < 5) {
    alert("You have to drag your ships first!");
    return;
  }
  if (gameOver) {
    return;
  }
  gameStarted = true;
  startButton.style.display = "none";

  if (currentPlayer == "user") {
    turn.textContent = "It's your turn";
    computerArray.forEach((square) =>
      square.addEventListener("click", function (event) {
        showSquare(square);
      })
    );
  }
  if (currentPlayer == "computer") {
    turn.textContent = "Computer's turn";
    setTimeout(() => {
      computerPlays();
    }, 500);
  }
}


let smallShipCount = 0;
let mediumShipCount = 0;
let mediumShip2Count = 0;
let bigShipCount = 0;
let bigShip2Count = 0;

function showSquare(square) {
  if (!square.classList.contains("hit")) {
    if (square.classList.contains("Small-Ship")) {
      smallShipCount++;
      square.style.backgroundColor = "red";
    }
    if (square.classList.contains("Medium-Ship")) {
      mediumShipCount++;
      square.style.backgroundColor = "red";
    }
    if (square.classList.contains("Medium-Ship2")) {
      mediumShip2Count++;
      square.style.backgroundColor = "red";
    }
    if (square.classList.contains("Big-Ship")) {
      bigShipCount++;
      square.style.backgroundColor = "red";
    }
    if (square.classList.contains("Big-Ship2")) {
      bigShip2Count++;
      square.style.backgroundColor = "red";
    }
  }
  if (square.classList.contains("pc-taken")) {
    square.classList.add("hit");
  } else {
    square.classList.add("miss");
  }
  checkWinner();
  currentPlayer = "computer";
  play();
}


let pcSmallShipCount = 0;
let pcMediumShipCount = 0;
let pcMediumShip2Count = 0;
let pcBigShipCount = 0;
let pcBigShip2Count = 0;

const computerPlays = () => {
  const randomSquare = Math.floor(Math.random() * userArray.length);
  if (
    !userArray[randomSquare].classList.contains("hit") &&
    !userArray[randomSquare].classList.contains("miss")
  ) {
    userArray[randomSquare].classList.add("miss");

    if (userArray[randomSquare].classList.contains("small-ship-0")) {
      pcSmallShipCount++;
      userArray[randomSquare].classList.remove("miss");
      userArray[randomSquare].classList.add("hit");
    }
    if (userArray[randomSquare].classList.contains("medium-ship-0")) {
      pcMediumShipCount++;
      userArray[randomSquare].classList.remove("miss");
      userArray[randomSquare].classList.add("hit");
    }
    if (userArray[randomSquare].classList.contains("medium-ship-1")) {
      pcMediumShip2Count++;
      userArray[randomSquare].classList.remove("miss");
      userArray[randomSquare].classList.add("hit");
    }
    if (userArray[randomSquare].classList.contains("big-ship-0")) {
      pcBigShipCount++;
      userArray[randomSquare].classList.remove("miss");
      userArray[randomSquare].classList.add("hit");
    }
    if (userArray[randomSquare].classList.contains("big-ship-1")) {
      userArray[randomSquare].classList.remove("miss");
      userArray[randomSquare].classList.add("hit");
      pcBigShip2Count++;
    }
  } else {
    computerPlays();
  }
  checkWinner();
  currentPlayer = "Usuario";
  turn.textContent = "Tu turno";
};


const checkWinner = () => {
  if (smallShipCount === 2) {
    generalInfo.textContent = "Hundiste una nave pequeña!";
    smallShipCount = 10;
  }
  if (mediumShipCount === 3) {
    generalInfo.textContent = "Hundiste una nave mediana!";
    mediumShipCount = 10;
  }
  if (mediumShip2Count === 3) {
    generalInfo.textContent = "Hundiste una nave mediana!";
    mediumShip2Count = 10;
  }
  if (bigShipCount === 4) {
    generalInfo.textContent = "Hundiste una nave grande!";
    bigShipCount = 10;
  }
  if (bigShip2Count === 4) {
    generalInfo.textContent = "Hundiste una nave grande!";
    bigShip2Count = 10;
  }
  if (pcSmallShipCount === 2) {
    generalInfo.textContent = "La computadora hundió una nave pequeña";
    pcSmallShipCount = 10;
  }
  if (pcMediumShipCount === 3) {
    generalInfo.textContent = "La computadora hundió una nave mediana!";
    pcMediumShipCount = 10;
  }
  if (pcMediumShip2Count === 3) {
    generalInfo.textContent = "La computadora hundió una nave mediana!";
    pcMediumShip2Count = 10;
  }
  if (pcBigShipCount === 4) {
    generalInfo.textContent = "La computadora hundió una nave grande!";
    pcBigShipCount = 10;
  }
  if (pcBigShip2Count === 4) {
    generalInfo.textContent = "La computadora hundió una nave grande!";
    pcBigShip2Count = 10;
  }

  if (
    smallShipCount +
      mediumShipCount +
      mediumShip2Count +
      bigShipCount +
      bigShip2Count ===
    50
  ) {
    generalInfo.textContent = "Ganaste!";
    gameIsOver();
  }
  if (
    pcSmallShipCount +
      pcMediumShipCount +
      pcMediumShip2Count +
      pcBigShipCount +
      pcBigShip2Count ===
    50
  ) {
    generalInfo.textContent = "La Computadora Ganó";
    gameIsOver();
  }
};


function gameIsOver() {
  gameOver = true;
  restartButton.style.display = "block";
}

const sudokuSelector = document.querySelector(".sudoku");
const [size, totalNumbersToShow, spaceEmpty] = [3, 25, ""];
const [rowId, columnId] = ["Row:", "Column:"];
const [gameMatriz, allNumbers] = [
    [],
    [...possibleNumbers()]
];
let buttonToChange;

const [numberType, buttonElement] = ["button", "button"]
const [numberClass, parClass, imparClass, blockedClass, errorClass, clickedClass, sameNumberClass, decendentClass] = [".number", ".par", ".impar", ".blocked", ".error", ".clicked", ".sameNumber", ".decendent"]

function possibleNumbers() {
    array = [];
    for (let i = 1; i < (size * size) + 1; i++)
        array.push(i.toString());
    return array;
}

function createLine() {
    let array = [];
    for (let i = 0; i < size * size; i++)
        array.push(spaceEmpty);
    return array;
}

function createEmptyGame() {
    let lineSpaces = createLine();
    for (let i = 0; i < size * size; i++)
        gameMatriz.push([...lineSpaces]);
}

function createNumbers() {
    for (let i = 0; i < size * size; i++)
        for (let j = 0; j < size * size; j++)
            gameMatriz[i][j] = (((i * size) + j + Math.floor(i / size)) % (size * size)) + 1;
    randonizeNumbers();
}

function randonizeNumbers() {
    randonizeRows();
    randonizeColunm();
}

function randonizeRows() {
    for (let i = 0; i < size * size; i++) {
        let row = Math.floor(Math.random() * size) + Math.floor(i / size) * size;
        [gameMatriz[i], gameMatriz[row]] = [gameMatriz[row], gameMatriz[i]];
    }
}

function randonizeColunm() {
    let matrizPorColuna = getColumnsOfMatriz();
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let column = (Math.floor(Math.random() * size) * size) + j;
            [matrizPorColuna[j], matrizPorColuna[column]] = [matrizPorColuna[column], matrizPorColuna[j]];
        }
    }
    for (let i = 0; i < size * size; i++)
        for (let j = 0; j < size * size; j++)
            gameMatriz[i][j] = matrizPorColuna[j][i];
}

function getColumnsOfMatriz() {
    let newMatriz = [];
    for (let i = 0; i < size * size; i++) {
        let coluna = [];
        for (let j = 0; j < size * size; j++) {
            coluna.push(gameMatriz[j][i]);
        }
        newMatriz.push(coluna);
    }
    return newMatriz;
}

function createNumberButton() {
    let newButton = document.createElement(buttonElement);
    newButton.type = numberType;
    newButton.classList.add(numberClass.substring(1));
    return newButton;
}

function testBlockOdd(value) {
    return (Math.floor(value / size) % 2) == 0;
}

function blockClasses(x, y) {
    if ((testBlockOdd(x) && testBlockOdd(y)) || (!testBlockOdd(x) && !testBlockOdd(y)))
        return parClass.substring(1);
    return imparClass.substring(1);
}

function showThisSpace() {
    if (Math.floor(Math.random() * ((size * size * size * size) + 1)) < totalNumbersToShow)
        return true;
    return false;
}

function showGame() {
    for (let i = 0; i < size * size; i++) {
        for (let j = 0; j < size * size; j++) {
            let newButton = createNumberButton();
            newButton.id = `${rowId + i} ${columnId + j}`;
            newButton.classList.add(blockClasses(i, j));
            if (showThisSpace()) {
                newButton.innerHTML = gameMatriz[i][j];
                newButton.classList.add(blockedClass.substring(1));
            }
            sudokuSelector.appendChild(newButton);
        }
    }
}

function pickDecendents(centerPosition) {
    let [row, column] = getId(centerPosition);
    let botoes = document.querySelectorAll(numberClass);
    let decendents = new Set();
    Array.from(botoes).filter(botao => {
        if (botao.id.includes(rowId + row.toString()) || botao.id.includes(columnId + column.toString()))
            return botao;
    }).forEach(botao => decendents.add(botao));
    getDecendentsOfBlock(row, column, botoes).forEach(botao => decendents.add(botao));
    return Array.from(decendents);
}

function getDecendentsOfBlock(row, column, botoes) {
    let [motherRow, motherColumn] = [Math.floor(row / size), Math.floor(column / size)]
    let block = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            block.push(botoes[(motherRow * size * size * size) + (motherColumn * size) + j + (i * size * size)]);
        }
    }
    return block;
}

function removeError(plus = false) {
    if (buttonToChange.target.classList.contains(errorClass.substring(1))) {
        buttonToChange.target.classList.remove(errorClass.substring(1));
        if (plus)
            buttonToChange.target.innerHTML = spaceEmpty;
    }
}

function createClickEvent() {
    bts = document.querySelectorAll(numberClass)
    bts.forEach(button => {
        button.addEventListener("click", event => {
            if (buttonToChange) {
                deleteOldClick();
            }
            event.target.classList.add(clickedClass.substring(1));
            setDecendents(event);
            buttonToChange = event;
            setSameNumbers(event);
        })
    })
}

function setSameNumbers() {
    let number = buttonToChange.target.innerHTML;
    if (number) {
        bts.forEach(botao => {
            if (botao.innerHTML == number.toString()) {
                botao.classList.add(sameNumberClass.substring(1))
            }
        })
    }
}

function setDecendents(event) {
    pickDecendents(event.target.id).forEach(decendent => {
        if (!decendent.classList.contains(clickedClass.substring(1)))
            decendent.classList.add(decendentClass.substring(1))
    })
}

function deleteOldClick() {
    removeError(true);
    deleteDecendents();
    document.querySelector(clickedClass).classList.remove(clickedClass.substring(1));
    deleteSameNumbers();
}

function deleteDecendents() {
    Array.from(document.querySelectorAll(decendentClass)).forEach(decendent => {
        decendent.classList.remove(decendentClass.substring(1))
    })
}

function deleteSameNumbers() {
    let sameNumbers = document.querySelectorAll(sameNumberClass);
    if (sameNumbers) {
        sameNumbers.forEach(element => {
            element.classList.remove(sameNumberClass.substring(1));
        })
    }
}

function getLine(typeOfLineId, lineToCheck) {
    return Array.from(document.querySelectorAll(numberClass)).filter(botao => {
        if (botao.id.includes(typeOfLineId + lineToCheck.toString()))
            return botao;
    })
}

function checkLine(typeOfLineId, lineToCheck, newNumber) {
    let elementsOfLine = getLine(typeOfLineId, lineToCheck);
    elementsOfLine.find(element => element.innerHTML == newNumber);
    return elementsOfLine ? true : false;
}

function checkRow(rowToCheck, newNumber) {
    return checkLine(rowId, rowToCheck, newNumber);
}

function checkColumn(columnToCheck, newNumber) {
    return checkLine(columnId, columnToCheck, newNumber);
}

function getHowIds(row, column) {
    let howIds = [];
    let [motherRow, motherColumn] = [Math.floor(row / size), Math.floor(column / size)];
    for (let i = 0; i < size; i++)
        for (let j = 0; j < size; j++)
            howIds.push(`${rowId + (motherRow*size + i).toString()} ${columnId + (motherColumn*size + j).toString()}`);
    return howIds;
}


function checkBox(row, column, newNumber) {
    let boxIds = getHowIds(row, column);
    let existInTheHow = Array.from(document.querySelectorAll(numberClass)).find(elemento => {
        if (boxIds.includes(elemento.id) && elemento.innerHTML == newNumber) {
            return true;
        }
    })
    return existInTheHow ? false : true;
}

function getId(idCompleto) {
    let row = idCompleto.slice(idCompleto.indexOf(rowId) + rowId.length, idCompleto.indexOf(rowId) + rowId.length + 1);
    let column = idCompleto.slice(idCompleto.indexOf(columnId) + columnId.length, idCompleto.indexOf(columnId) + columnId.length + 1);
    return [row, column];
}

function checkValues(novoValor) {
    let [rowAdr, columnAdr] = getId(buttonToChange.target.id);
    if (checkRow(rowAdr, novoValor) && checkColumn(columnAdr, novoValor) && checkBox(rowAdr, columnAdr, novoValor)) {
        buttonToChange.target.innerHTML = novoValor;
        setSameNumbers();
    } else {
        buttonToChange.target.innerHTML = novoValor;
        buttonToChange.target.classList.add(errorClass.substring(1));
    }
}

function createEvents() {
    createClickEvent();
    createSetNumbersEvent();
}

function createSetNumbersEvent() {
    sudokuSelector.addEventListener("keydown", (event) => {
        event.preventDefault();
        if (buttonToChange.target.classList.contains(blockedClass.substring(1)))
            return;
        if (buttonToChange.target && allNumbers.includes(event.key)) {
            removeError();
            checkValues(event.key);
        } else if (event.key == "Backspace") {
            buttonToChange.target.innerHTML = spaceEmpty;
        }
    })
}

function createGame() {
    createEmptyGame();
    createNumbers();
    showGame();
    createEvents();
}

createGame();
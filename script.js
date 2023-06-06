function allNumbers(){
    array = [];
    for(let i = 1; i < (GB*GB)+1; i++)
        array.push(i.toString());
    return array;
}

var buttonToChange;
const [GB, numberToShow] = [3, 25]; //numbers GB === gameBlocks
const [rowId, columnId] = ["Row:", "Column:"]; //strings
const [gameMatriz, numbersToSelect] = [[],[...allNumbers()]]; //arrays

var sameNumbers;
const sudokuSelector = document.querySelector(".sudoku"); //selectors

function createLine(){
    let array = [];
    for(let i = 0; i < GB*GB; i++)
        array.push("");
    return array;
}

function createGrade(){
    let lineSpaces = createLine();
    for(let i = 0; i < GB*GB; i++)
        gameMatriz.push([...lineSpaces]);
}

function makeRandonizedNumbers(){
    let random = Math.floor(Math.random()*(GB*GB));
    for(let i = 0; i < GB; i++, random++)
        for(let j = 0; j < GB; j++, random+=GB)
            for(let k = 0; k < GB*GB; k++, random++)
                gameMatriz[GB*i+j][k] = (random % (GB*GB)) + 1;
}

function createNumberButton(){
    let newButton = document.createElement("button");
    newButton.type = "button";
    newButton.classList.add("number");
    return newButton;
}

function testBlockOdd(value){
    return (Math.floor(value/GB) % 2) == 0;
}

function blockClass(x, y){
    if ((testBlockOdd(x) && testBlockOdd(y)) || (!testBlockOdd(x)  && !testBlockOdd(y)))
        return "par";
    return "impar";
}

function showThisSpace(){
    if(Math.floor(Math.random()*((GB*GB*GB*GB)+1)) < numberToShow)
        return true;
    return false;
}

function showNumbersInGame(){
    for(let i = 0; i < GB*GB; i++){
        for(let j = 0; j < GB*GB; j++){
            let newButton = createNumberButton( );
            newButton.id = rowId + i + " " + columnId + j;
            newButton.classList.add(blockClass(i,j));
            if (showThisSpace()){
                newButton.innerHTML = gameMatriz[i][j];
                newButton.classList.add("blocked");
            }
            sudokuSelector.appendChild(newButton);
        }
    }
}

function pickDecendents(centerPosition){
    let [row, column] = getId(centerPosition);
    let botoes = document.querySelectorAll("button");
    let decendents = Array.from(botoes).filter(botao=>{
        if(botao.id.includes(rowId+row.toString()) || botao.id.includes(columnId + column.toString()))
            return botao;
    })
    let [motherRow, motherColumn] = [Math.floor(row/GB), Math.floor(column/GB)]
    let block = [];
    for(let i = 0; i < GB; i++){
        for(let j = 0; j < GB; j++){
           block.push(botoes[(motherRow*GB*GB*GB)+(motherColumn*GB)+j+(i*9)]);
        }
    }
    for(let i = 0; i < GB*GB; i++){
        if(decendents.includes(block[i])){
            continue;
        }else{
            decendents.push(block[i])
        }
    }
    return decendents;
}

function removeError(){
    if(buttonToChange.target.classList.contains("error")){
        buttonToChange.target.classList.remove("error");
    }
}

function createClickCheck(){
    bts = document.querySelectorAll("button")
    bts.forEach(button=>{
        button.addEventListener("click", event=>{
            if(buttonToChange){
                if(buttonToChange.target.classList.contains("error")){
                    buttonToChange.target.classList.remove("error");
                    buttonToChange.target.innerHTML = "";
                }
                document.querySelector(".clicked").classList.remove("clicked");
                Array.from(document.querySelectorAll(".decendent")).forEach(decendent=>{
                    decendent.classList.remove("decendent")
                })
                sameNumbers = document.querySelectorAll(".sameNumber");
                if(sameNumbers){
                    sameNumbers.forEach(element =>{
                        element.classList.remove("sameNumber");
                    })
                }
            }
            event.target.classList.add("clicked");
            pickDecendents(event.target.id).forEach(decendent=>{
                if(!decendent.classList.contains("clicked"))
                    decendent.classList.add("decendent")
            })
            let number = event.target.innerHTML;
            if(number){
                bts.forEach(botao=>{
                    if(botao.innerHTML==number.toString()){
                        botao.classList.add("sameNumber")
                    }
                })
            }
            buttonToChange = event;
        })
    })
}

function pickLine(typeOfLineId, lineToCheck){
    return Array.from(document.querySelectorAll("button")).filter(botao=>{
        if(botao.id.includes(typeOfLineId+lineToCheck.toString()))
            return botao;
    })
}

function checkLine(typeOfLineId, lineToCheck, newNumber){
    let validation = true;
    let elementsOfLine = pickLine(typeOfLineId, lineToCheck);
    elementsOfLine.forEach(element => {
        if(element.innerHTML == newNumber)
            validation = false;
    })
    return validation;
}

function checkRow(rowToCheck, newNumber){
    return checkLine(rowId, rowToCheck, newNumber);
}

function checkColumn(columnToCheck, newNumber){
    return checkLine(columnId, columnToCheck, newNumber);
}

function checkBox(row, column, newNumber){
    let [validation, allId] = [true,[]]
    row = Math.floor(row/GB);
    column = Math.floor(column/GB);
    for(let i = 0; i < GB; i++)
        for(let j = 0; j < GB; j++)
            allId.push(`${rowId+(row*GB + i).toString()} ${columnId + (column*GB + j).toString()}`);
    Array.from(document.querySelectorAll("button")).filter(elemento=>{
        if(allId.includes(elemento.id)){
            if(elemento.innerHTML == newNumber){
                validation = false;
            }
        }
    })
    return validation;
}   

function getId(idCompleto){
    let row = idCompleto.slice(idCompleto.indexOf(rowId) + rowId.length, idCompleto.indexOf(rowId) + rowId.length+1);
    let column = idCompleto.slice(idCompleto.indexOf(columnId) + columnId.length, idCompleto.indexOf(columnId) + columnId.length+1);
    return [row,column];
}

function checkValues(novoValor){
    let [rowAdr, columnAdr] = getId(buttonToChange.target.id);
    if(checkRow(rowAdr, novoValor) && checkColumn(columnAdr, novoValor) && checkBox(rowAdr, columnAdr, novoValor)){
        buttonToChange.target.innerHTML = Number(novoValor);
    }else if(!buttonToChange.target.classList.contains("blocked")){
        buttonToChange.target.innerHTML = novoValor;
        buttonToChange.target.classList.add("error");
    }
    
}

function createSetNumbersEvent(){
    sudokuSelector.addEventListener("keydown", (event)=>{
        event.preventDefault();
        if(buttonToChange.target && numbersToSelect.includes(event.key) && !buttonToChange.target.classList.contains("blocked")){
            removeError();
            checkValues(event.key);
        }else if(event.key == "Backspace" && !buttonToChange.target.classList.contains("blocked")){
            buttonToChange.target.innerHTML = ""
        }
    })
}

function createGame(){
    createGrade();
    makeRandonizedNumbers();
    showNumbersInGame();
    createClickCheck();
    createSetNumbersEvent();
}

createGame();

//win-game
// the p5.js canvas
let canvas;

let uiElements = [];

// array of uiElements that can be interacted with.
let interactives = [];

// constants that control the size of the p5.js canvas
let grid;
let gridWidth;
let gridHeight;
let autoRefreshOn = true;

let opponentContainer;

let boardSpacePointers;

let clickValue = null;
let turn = 'x';

// p5.js built-in method
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    frameRate(24);

    // draws the elements on the canvas
    redrawElements();

    // parents the canvas to the DOM element 'sketch-holder'
    canvas.parent('sketch-holder');

    // centers the canvas
    imageMode(CENTER);


}

// p5.js built-in method
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    redrawElements();
    console.log(boardSpacePointers)
}

// p5.js built-in method
function draw () {
    background(256);
    for (let i = 0; i < uiElements.length; i++){
        uiElements[i].draw();
    }
}

function redrawElements(){
    let portrait = windowWidth < windowHeight;

    uiElements = [];
    for (let i = 0; i < 2; i++){
        let containerParams = {row: portrait, len:2, index:i}
        let container = new Container(containerParams)
        uiElements.push(container)
    }

    let cartoonSliderContainer =  uiElements[0]
    let cartoonImageContainerParams = {row: true, len:3, index:0, height:cartoonSliderContainer.height*(2/3), parent:cartoonSliderContainer}
    let cartoonImageContainer = new Container(cartoonImageContainerParams)
    uiElements.push(cartoonImageContainer)
    let sliderContainerParams = {row: true, len:3, index:2, height:cartoonSliderContainer.height/3, parent:cartoonSliderContainer}
    let sliderContainer = new Container(sliderContainerParams)
    uiElements.push(sliderContainer)
    let sliderParams = {row: true, parent:sliderContainer}
    let slider = new Slider(sliderParams)
    uiElements.push(slider)

    let boardContainer = uiElements[1]

    let boardRowParams = {row: true, len:8, index:1, parent:boardContainer}
    let rowAnchor = new Container(boardRowParams)
    uiElements.push(rowAnchor)
    let boardColParams = {row: false, len:8, index:1, parent:rowAnchor}
    let columnAnchor = new Container(boardColParams)
    uiElements.push(columnAnchor)

    let boardLength = 0 ;
    boardContainer.height > boardContainer.width ? boardLength = boardContainer.width/1.3 : boardLength = boardContainer.height/1.3;

    let boardParams = {row: true,  height: boardLength, width: boardLength, parent:columnAnchor}
    let board = new Container(boardParams)
    uiElements.push(board)

    let count = 0;
    let spaceColor;
    let blue = color(86,133,151)
    let red = color(165,67,68)
    let previousSymbol = undefined;

    let storeSymbols;
    // if (boardSpacePointers){
    //     storeSymbols = getBoardIconObjects();
    //     console.log(storeSymbols)
    // }

    boardSpacePointers = [];

    for (let i = 0; i < 3; i++){
        boardRowParams = {row: true, len: 3, index: i, parent:board}
        let boardRow = new Container(boardRowParams)
        uiElements.push(boardRow)
        for (let j = 0; j < 3; j++){

            count % 2 ? spaceColor = blue : spaceColor = red;
            // storeSymbols ? previousSymbol = storeSymbols[count] : previousSymbol = undefined

            boardSpaceParams = {row: false, len: 3, index: j, color: spaceColor, parent:boardRow}
            let boardSpace = new TicTacToeSpace(boardSpaceParams)
            // boardSpace.setSymbol(previousSymbol)
            uiElements.push(boardSpace)
            boardSpacePointers.push(boardSpace)

            count++;
    }
}

    boardRowParams = {row: true, len:8, index:0, parent:boardContainer}
    rowAnchor = new Container(boardRowParams)
    uiElements.push(rowAnchor)

    for (let i = 0; i < 3; i++){
        let testUIParams = {row: false, len:3, index:i, parent:rowAnchor}
        let testUIElement = new Container(testUIParams)
        uiElements.push(testUIElement)

        switch (i){
            case 0:
            let setTurnToXParams = {row: true, parent:testUIElement, mouseClickfunc:setTurnToX}
            let setTurnToXButton = new Button(setTurnToXParams)
            uiElements.push(setTurnToXButton)
            break;
            case 1:
            submitBoardButtonParams = {row: true, parent:testUIElement, mouseClickfunc:getBoardState}
            let submitBoardButton = new Button(submitBoardButtonParams)
            uiElements.push(submitBoardButton)
            break;

            case 2:
            let setTurnToOParams = {row: true, parent:testUIElement, mouseClickfunc:setTurnToO}
            let setTurnToOButton = new Button(setTurnToOParams)
            uiElements.push(setTurnToOButton)
            break;

        }

    }



    }



// button functionality on click
let nullFunction = () => "I do nothing!";
let setTurnToX = () => turn = 'x';
let setTurnToO = () => turn = 'o';
let getBoardState = () => {
    let boardState = ""
    for (let i = 0; i < boardSpacePointers.length; i++){
        boardState += boardSpacePointers[i].currentSymbol.name
    }
    return boardState
}

// let getBoardIconObjects = () => {
//     objects = []
//     for (let i = 0; i < boardSpacePointers.length; i++){
//         objects.push(boardSpacePointers[i].currentSymbol)
//     }
//     return objects
// }


// p5.js built-in method
function mouseClicked() {
    for (let i = 0; i < uiElements.length; i++){
        if (uiElements[i].testForClick()){
            clickValue = uiElements[i].performClickFunctionality()
        }
    }
    if (turn && clickValue) {

        $.ajax({
                url: "http://play-tictactoe-ai.herokuapp.com/api/v1/turn/"+turn+"/board/"+clickValue,
                beforeSend: function(xhr) {
                     // xhr.setRequestHeader("Authorization", "Bearer 6QXNMEMFHNY4FJ5ELNFMP5KRW52WFXN5")
                }, success: function(data){
                    alert(data);
                    console.log(data)
                    //process the JSON data etc
                }
        })

        //
        //
        // let request = require('request');
        // request("http://play-tictactoe-ai.herokuapp.com/api/v1/turn/"+turn+"/board/"+clickValue, function (error, response, body) {
        // console.error('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
        // info = JSON.parse(body)
        // console.log(info)
    // });

    }
}

// p5.js built-in method
function mousePressed() {
    clickLocation = { 'x': mouseX, 'y' : mouseY };
    for (let i = 0; i < interactives.length; i++){
        if (interactives[i].testForClick() && interactives[i].isDragging != undefined){
            interactives[i].isDragging = true;
        }
    }
}

// p5.js built-in method
function mouseReleased() {
    let value;
    for (let i = 0; i < interactives.length; i++){
        interactives[i].performValuesResetAfterDrag()
        interactives[i].isDragging = false;
    }
}

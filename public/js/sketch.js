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

let boardSpacePointers = [];

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

    let colorCount = 0;
    let spaceColor;
    let blue = color(86,133,151)
    let red = color(165,67,68)

    for (let i = 0; i < 3; i++){
        boardRowParams = {row: true, len: 3, index: i, parent:board}
        let boardRow = new Container(boardRowParams)
        uiElements.push(boardRow)
        for (let j = 0; j < 3; j++){
            colorCount % 2 ? spaceColor = blue : spaceColor = red;
            boardSpaceParams = {row: false, len: 3, index: j, color: spaceColor, parent:boardRow}
            let boardSpace = new TicTacToeSpace(boardSpaceParams)
            uiElements.push(boardSpace)
            boardSpacePointers.push(boardSpace)
        colorCount++;
    }
}

    boardRowParams = {row: true, len:8, index:0, parent:boardContainer}
    rowAnchor = new Container(boardRowParams)
    uiElements.push(rowAnchor)
    boardColParams = {row: false, len:3, index:1, parent:rowAnchor}
    columnAnchor = new Container(boardColParams)
    uiElements.push(columnAnchor)

    submitBoardButtonContainerParams = {row: true, parent:columnAnchor, color:30}
    let submitBoardButtonContainer = new Container(submitBoardButtonContainerParams)
    uiElements.push(submitBoardButtonContainer)

    submitBoardButtonParams = {row: true, parent:submitBoardButtonContainerParams, width:30, mouseClickfunc:getBoardState}
    let submitBoardButton = new Button(submitBoardButtonContainerParams)
    uiElements.push(submitBoardButton)




        // for (let i=0; i < 8; i++){
    // }

    // let boardParams = {row: portrait, width:squareLength, height:squareLength, parent:boardContainer}
    // let board = new Container(boardParams)
    // uiElements.push(board)

}

// button functionality on click
let nullFunction = () => "I do nothing!";
let refresh = () => recreateCanvas();
let togglefAutoRefresh = () => autoRefreshOn = !autoRefreshOn;
let saveToComputer = () => {
    let nums = Date.now()
    let filename = nums.toString() + ".png"
    let dimensions = grid.getGridDimensions()
    let im = get(0, 0, dimensions[0], dimensions[1]);
    im.save(filename);
}
let getBoardState = () => {
    let boardState = ""
    console.log('hey')
    for (let i = 0; i < boardSpacePointers.length; i++){
        boardState += boardSpacePointers[i].name
    }
    console.log(boardState)
}

// mouse interactivity should be handled on the top level.
    // but uielements that have interactivity need to be added to the iterable

// p5.js built-in method
function mouseClicked() {
    for (let i = 0; i < uiElements.length; i++){
        if (uiElements[i].testForClick()){
            uiElements[i].performClickFunctionality()
        }
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

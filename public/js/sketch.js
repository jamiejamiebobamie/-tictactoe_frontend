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

    let squareLength;
    let offsetX
    let offsetY
    if (portrait){
        squareLength = boardContainer.width/2
        offsetX = boardContainer.height/4
        offsetY = boardContainer.height/4

    } else {
        squareLength = boardContainer.height/2
        offsetX = boardContainer.width/50
        offsetY = boardContainer.width/4
    }

    // let boardParams = {row: portrait, width:squareLength, height:squareLength, parent:boardContainer, offsetX:offsetX, offsetY:offsetY}
    // let board = new Container(boardParams)
    // uiElements.push(board)

    let boardParams = {row: portrait, width:squareLength, height:squareLength, parent:boardContainer}
    let board = new Container(boardParams)
    uiElements.push(board)

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

// mouse interactivity should be handled on the top level.
    // but uielements that have interactivity need to be added to the iterable

// p5.js built-in method
function mouseClicked() {
    for (let i = 0; i < interactives.length; i++){
        if (interactives[i].testForClick()){
            interactives[i].performClickFunctionality()
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

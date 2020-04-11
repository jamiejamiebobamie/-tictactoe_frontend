// the p5.js canvas
let canvas;
let returnValueFromViews;
let doneOnce = false;
let views = [];
let view_i = 0;
let menuButton;


// function preload() {
//   img = loadImage('../imgs/brain_base.png');
// }

// p5.js built-in method
function setup() {
    img = loadImage('../imgs/brain_base.png');
    canvas = createCanvas(windowWidth, windowHeight);
    // parent the canvas to the DOM element 'sketch-holder'
    canvas.parent('sketch-holder');

    menuButton = new Container({width:100, height:100, mouseClickfunc: cycleViews})

    frameRate(24);

    // centers the canvas
    imageMode(CENTER);

    redrawn();
}

function redrawn(){
    views = [];
    let view1 = new TestView1
    views.push(view1)
    let view2 = new TestView2
    views.push(view2)

    views[view_i].redrawElements()
}

// p5.js built-in method
function windowResized() {
    // p5.js built-in method
    resizeCanvas(windowWidth, windowHeight);
    redrawn()
}

// p5.js built-in method
function draw(){
    background(256);
    drawRecursive(views[view_i])
    menuButton.draw()
}

// these recursive functions allow uiElements to be nested.
function drawRecursive(uiElement){
    if (uiElement.uiElements) {
        for (let i = 0; i < uiElement.uiElements.length; i++){
            drawRecursive(uiElement.uiElements[i])
        }
    }
    if (uiElement.draw){
        uiElement.draw();
    }
}

// the built-in p5.js function mouseClicked() does not work on mobile.
// must use mousePressed() for all mouse events.
// mousePressed() is called repeatedly each frame,
// 'doneOnce' controls which events are called repeatedly (drag events)
// and which are called once (click events).
// p5.js built-in method
function mousePressed() {
    returnValueFromViews = clickRecursive(views[view_i])
    if (returnValueFromViews){ setTopLevelVariables(returnValueFromViews) }

    if (menuButton.testForClick() && !doneOnce){
        menuButton.performClickFunctionality();
    }

    if (!doneOnce){
        doneOnce = true;
    }
}

function clickRecursive(uiElement){
    if (uiElement.uiElements) {
        for (let i = 0; i < uiElement.uiElements.length; i++){
            clickRecursive(uiElement.uiElements[i])
        }
    }
    if (uiElement.testForClick){
        if (uiElement.testForClick()){
            if (uiElement.performClickFunctionality){
                returnValueFromViews = uiElement.performClickFunctionality()
                return returnValueFromViews
            }
        }
    }
}

// 'doneOnce' is reset with mouseReleased() function.
// p5.js built-in method
function mouseReleased() {
    returnValueFromViews = clickReleasedRecursive(views[view_i])
    if (returnValueFromViews){setTopLevelVariables(returnValueFromViews)}
    // doneOnce = false;
}

function clickReleasedRecursive(uiElement){
    if (uiElement.uiElements) {
        for (let i = 0; i < uiElement.uiElements.length; i++){
            clickReleasedRecursive(uiElement.uiElements[i])
        }
    }
    if (uiElement.isDragging){
        returnValueFromViews = uiElement.performDragFunctionality();
        return returnValueFromViews
    }
}

// testing
function cycleViews(){
    if (view_i < views.length-1){
        view_i++;
    } else {
        view_i = 0;
    }
    views[view_i].redrawElements();
}

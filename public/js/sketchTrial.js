// the p5.js canvas
let canvas;
let returnValueFromViews;
let doneOnce = false;
let views = [];
let view_i = 0;
let menuButton;


let startExitAnimation = false
let startEntranceAnimation = false

// function preload() {
//   img = loadImage('../imgs/brain_base.png');
// }

// p5.js built-in method
function setup() {
    img = loadImage('../imgs/brain_base.png');
    canvas = createCanvas(windowWidth, windowHeight);
    // parent the canvas to the DOM element 'sketch-holder'
    canvas.parent('sketch-holder');

    menuButton = new Container({width:100, height:100, mouseClickfunc: startAnimations})

    frameRate(24);

    // centers the canvas
    imageMode(CENTER);

    redrawn();
}

function redrawn(parameterObject){
    views = [];
    let view1 = new TestView1(parameterObject)
    views.push(view1)
    let view2 = new TestView2(parameterObject)
    views.push(view2)

    views[view_i].redrawElements(parameterObject)
}



let parameterObject = {transitionAmount: 0}

// p5.js built-in method
function windowResized() {
    // p5.js built-in method
    resizeCanvas(windowWidth, windowHeight);
    redrawn(parameterObject)
}

function exitAnimation(){
    // exit animation:
    // click menu icon, startTransitionViewAnimation is set to true
    if (-1 * parameterObject.transitionAmount < windowWidth){
    // if (parameterObject.transitionAmount > -windowWidth){
        // while the translation amount is less than the windowWidth keep adding to the translation amount
        parameterObject.transitionAmount -= frameRate()*2;
        // console.log(parameterObject.transitionAmount)
        redrawn(parameterObject)
    // if the startTransitionViewAnimation is true and the transitionAmount is greater than the windowWidth
    } else if (-1 * parameterObject.transitionAmount > windowWidth){
        // the animation has ended. cycle the view.
        cycleViews();
    }
}

function entranceAnimation(){

    //entrance animation
    // click menu icon, startTransitionViewAnimation is set to true
    if (-1 * parameterObject.transitionAmount < 5){
    // if (int(parameterObject.transitionAmount) != 0){
        // while the translation amount is less than the windowWidth keep adding to the translation amount
        parameterObject.transitionAmount -= int(frameRate()*2);
        // use lerp...
        // parameterObject.transitionAmount = lerp(parameterObject.transitionAmount, 0, 0.05);

        // console.log(parameterObject.transitionAmount, int(parameterObject.transitionAmount) != 0)
        redrawn(parameterObject)
    // if the startTransitionViewAnimation is true and the transitionAmount is greater than the windowWidth
    } else if (-1 * parameterObject.transitionAmount > windowWidth){
        // the animation has ended.
        startEntranceAnimation = false
        // parameterObject.transitionAmount = 0;
    }
}

// p5.js built-in method
function draw(){
    background(256);
    drawRecursive(views[view_i])
    menuButton.draw()

    if (startExitAnimation){
        exitAnimation()
    }
    if (startEntranceAnimation){
        entranceAnimation();
    }

}

function startAnimations(){
    startExitAnimation = true
}

// testing
function cycleViews(){
    console.log('hi')

    startExitAnimation = false
    parameterObject.transitionAmount = windowWidth

    if (view_i < views.length-1){
        view_i++;
    } else {
        view_i = 0;
    }

    views[view_i].redrawElements(parameterObject);

    startEntranceAnimation = true;

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
    doneOnce = false;
}

function clickReleasedRecursive(uiElement){
    if (uiElement.uiElements) {
        for (let i = 0; i < uiElement.uiElements.length; i++){
            clickReleasedRecursive(uiElement.uiElements[i])
        }
    }
    if (uiElement.isDragging){
        uiElement.isDragging = false;
        returnValueFromViews = uiElement.performDragFunctionality();
        return returnValueFromViews
    }
}

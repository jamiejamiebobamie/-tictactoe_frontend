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
}

// p5.js built-in method
function windowResized() {
    // p5.js built-in method
    resizeCanvas(windowWidth, windowHeight);
    redrawn()
}

// p5.js built-in method
function draw () {
    background(256);
    for (let i = 0; i < views[view_i].uiElements.length; i++){
        views[view_i].uiElements[i].draw()
    }
    menuButton.draw()
}

// p5.js built-in method
function mousePressed() {
    for (let i = 0; i < views[view_i].uiElements.length; i++){
        if (views[view_i].uiElements[i].testForClick()){

            views[view_i].uiElements[i].isDragging = true;
            console.log(views[view_i].uiElements[i])
            returnValueFromViews = views[view_i].uiElements[i].performClickFunctionality()

            if (returnValueFromViews){
                setTopLevelVariables(returnValueFromViews)
            }
        }
    }
    if (menuButton.testForClick() && !doneOnce){
        menuButton.performClickFunctionality();
    }
    if (!doneOnce){
        doneOnce = true;
    }
}

// p5.js built-in method
function mouseReleased() {
    for (let i = 0; i < views[view_i].uiElements.length; i++){
        if(views[view_i].uiElements[i].mouseDragfunc && views[view_i].uiElements[i].isDragging){
            returnValueFromViews = views[view_i].uiElements[i].performDragFunctionality()
            if (returnValueFromViews){setTopLevelVariables(returnValueFromViews)}
        }
        views[view_i].uiElements[i].isDragging = false;
    }
    doneOnce = false;
}


// testing
function cycleViews(){
    if (view_i < views.length-1){
        view_i++;
    } else {
        view_i = 0;
    }
    console.log('hey')
    views[view_i].redrawElements();
}

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
    let view1 = new TestView2
    views.push(view1)
    let view2 = new TestView1
    views.push(view2)
}

// p5.js built-in method
function windowResized() {
    // p5.js built-in method
    resizeCanvas(windowWidth, windowHeight);
    redrawn()
}

// p5.js built-in method
// function draw () {
//     background(256);
//     for (let i = 0; i < views[view_i].uiElements.length; i++){
//         views[view_i].uiElements[i].draw()
//     }
//     menuButton.draw()
// }

/*
PROBLEM:
    I've created a ScalableContainer class with buttons that have click/drag
    capabilities. I cannot click them, because testing for click and all
    mouse functionality is top-level in 'sketchTrial.js' and 'sketchTrial.js'
    is not aware of uiElements that are nested three levels deep:
        uiElements[i].uiElements[j].uiElements[k]
        views -> the uiElements of views -> the uiElements of uiElements of views

    the *composite pattern* allows you to iterate over a tree structure
        that is composed of both 'things' and 'containers of things'

    to allow for infinitely nested uiElements, i need to write a function that
        can be passed a 'root' node and iterate through the composite-tree structure,
        calling the appopriate method(s) on the elements
*/

function draw(){
    background(256);
    console.log(draw)
    recurseDownTreeDraw(views[view_i])
    menuButton.draw()
}

// composite pattern:
// uiElements[i].uiElements[j].uiElements[k]...
function recurseDownTreeDraw(uiElement){
    // check to see we're at a leaf. if we're not...
    if (uiElement.uiElements) {
        for (let i = 0; i < uiElement.uiElements.length; i++){
            recurseDownTreeDraw(uiElement.uiElements[i])
        }
    }

    // TESTING
    // console.log(uiElement)

    // check to see if the uiElement at this level,
        // the one passed in as a parameter, has
        // the function to call. if it does, call it.
    if (uiElement.draw){
        uiElement.draw();
    }
}

// p5.js built-in method
function mousePressed() {
    for (let i = 0; i < views[view_i].uiElements.length; i++){
        if (views[view_i].uiElements[i].testForClick()){

            views[view_i].uiElements[i].isDragging = true;
            // console.log(views[view_i].uiElements[i])
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
    // console.log('hey')
    views[view_i].redrawElements();
}

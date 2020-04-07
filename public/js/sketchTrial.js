// the p5.js canvas
let canvas;
let returnValueFromViews;
let doneOnce = false;
let uiElements = [];
let img;


// function preload() {
//   img = loadImage('../imgs/brain_base.png');
// }

// p5.js built-in method
function setup() {
    img = loadImage('../imgs/brain_base.png');
    canvas = createCanvas(windowWidth, windowHeight);
    // parent the canvas to the DOM element 'sketch-holder'
    canvas.parent('sketch-holder');

    frameRate(24);

    // centers the canvas
    imageMode(CENTER);

    redrawn();
}

function redrawn(){
    uiElements = [];

    let params = {width:200, height: 200, offsetX:300}
    let container = new Container(params)
    uiElements.push(container)

    params = {width:200, height: 200, parent:container}
    let imageContainer = new ImageContainer(params)
    imageContainer.setImageProps(img,382,279)
    uiElements.push(imageContainer)
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
        for (let i = 0; i < uiElements.length; i++){
            uiElements[i].draw()
        }

    // redrawImage();
}

// // p5.js built-in method
// function mousePressed() {
//     for (let i = 0; i < uiElements.length; i++){
//
//         if (uiElements[i].testForClick()){
//                 uiElements[i].isDragging = true;
//                 returnValueFromViews = uiElements[i].performClickFunctionality()
//                 if (returnValueFromViews){setTopLevelVariables(returnValueFromViews)}
//             }
//         }
//     if (!doneOnce){
//         doneOnce = true;
//     }
// }
//
// // p5.js built-in method
// function mouseReleased() {
//     for (let i = 0; i < uiElements.length; i++){
//         if(uiElements[i].mouseDragfunc && uiElements[i].isDragging){
//             returnValueFromViews = uiElements[i].performDragFunctionality()
//             if (returnValueFromViews){setTopLevelVariables(returnValueFromViews)}
//         }
//         uiElements[i].isDragging = false;
//     }
//     doneOnce = false;
// }

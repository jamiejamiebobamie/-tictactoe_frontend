// the p5.js canvas
let canvas;
let views = []
let viewIndex = 0;
let menuButton;

// without callbacks, I can't pass in the context/scope that I'm referring to
    // so... things are about to get real ugly.
    // these are variables that should be farther down the chain:
let board;
let turn;
let aiDifficulty;
let callBackValue;

// p5.js built-in method
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    frameRate(24);
    let playWithAI = new SuggestionsView()
    views.push(playWithAI)
    let playAgainstAI = new PlayView()
    views.push(playAgainstAI)
    menuButton = new Container({width:100, height:100, mouseClickfunc: cycleViews})
    // draw the elements on the canvas
    views[viewIndex].redrawElements();
    // parent the canvas to the DOM element 'sketch-holder'
    canvas.parent('sketch-holder');
    // centers the canvas
    imageMode(CENTER);
}

// p5.js built-in method
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    views[viewIndex].redrawElements();
}

// p5.js built-in method
function draw () {
    background(256);
    views[viewIndex].draw()
    
    // test
    menuButton.draw()
}

// testing
function cycleViews(){
    if (viewIndex < views.length-1){
        viewIndex++;
    } else {
        viewIndex = 0;
    }
    views[viewIndex].redrawElements(windowWidth, windowHeight);
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
    if (menuButton.testForClick()){
        menuButton.performClickFunctionality();
    }

    for (let i = 0; i < views[viewIndex].uiElements.length; i++){
        if (views[viewIndex].uiElements[i].testForClick()){
            callBackValue = views[viewIndex].uiElements[i].performClickFunctionality()
        }
    }

//     if (clickValue){
//     if (clickValue.length == 2) {
//         let turnString = clickValue[0]
//         let boardString = clickValue[1]
//         console.log("http://play-tictactoe-ai.herokuapp.com/api/v1/turn/"+turn+"/board/"+clickValue)
//         // $.ajax({
//         //         url: "http://play-tictactoe-ai.herokuapp.com/api/v1/turn/"+turn+"/board/"+clickValue,
//         //         beforeSend: function(xhr) {
//         //              // xhr.setRequestHeader("Authorization", "Bearer 6QXNMEMFHNY4FJ5ELNFMP5KRW52WFXN5")
//         //         }, success: function(data){
//         //             alert(data);
//         //             console.log(data)
//         //             //process the JSON data etc
//         //         }
//         // })
//     }
// }
console.log(callBackValue)
}
//
// p5.js built-in method
function mousePressed() {
    for (let i = 0; i < views[viewIndex].uiElements.length; i++){
        if (views[viewIndex].uiElements[i].testForClick() && views[viewIndex].uiElements[i].isDragging != undefined ){
            views[viewIndex].uiElements[i].isDragging = true;
        }
    }
}

// p5.js built-in method
function mouseReleased() {
    for (let i = 0; i < views[viewIndex].uiElements.length; i++){
        if(views[viewIndex].uiElements[i].mouseDragfunc && views[viewIndex].uiElements[i].isDragging){
            callBackValue = views[viewIndex].uiElements[i].performDragFunctionality()
        }
        views[viewIndex].uiElements[i].isDragging = false;
    }
    console.log(callBackValue)
}

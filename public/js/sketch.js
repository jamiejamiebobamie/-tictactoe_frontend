// the p5.js canvas
let canvas;
let views = []
let viewIndex = 0;
let menuButton;

// without callbacks, I can't pass in the context/scope that I'm referring to
    // so... things are about to get real ugly.
    // these are variables that should be farther down the chain:

// the return value from functions down the chain.
let callBackValue;

// parameterObject to pass in to redrawElements() method to set the state
// to its previous state. states are lost on windowResized
let previousStatesObject = { boardArray:["!","!","!","!","!","!","!","!","!"],
                            turn:'x',
                            aiDifficulty:13
                            }

// url parameters to query the backend
let boardString = "!!!!!!!!!"
let turn = 'x';

// mouseClicked() function does not work on mobile.
// must use mousePressed() for all mouse events.
// mousePressed() is called repeatedly each frame,
// so 'doneOnce' controls which events are called repeatedly (drag events)
// and which are called once (click events)
let doneOnce = false;

// p5.js built-in method
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    // parent the canvas to the DOM element 'sketch-holder'
    canvas.parent('sketch-holder');

    frameRate(24);

    let playWithAI = new SuggestionsView()
    views.push(playWithAI)

    let playAgainstAI = new PlayView()
    views.push(playAgainstAI)

    menuButton = new Container({width:100, height:100, mouseClickfunc: cycleViews})

    // draw the elements on the canvas
    views[viewIndex].redrawElements();

    // centers the canvas
    imageMode(CENTER);
}

// p5.js built-in method
function windowResized() {
    // p5.js built-in method
    resizeCanvas(windowWidth, windowHeight);

    views[viewIndex].redrawElements(previousStatesObject);
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
    views[viewIndex].redrawElements(previousStatesObject);
}

function setTopLevelVariables(callBackValue){
    switch (callBackValue) {
        case 'x':
            turn = 'x'
            previousStatesObject.turn = turn
            break;
        case 'o':
            turn = 'o'
            previousStatesObject.turn = turn
            break;
        case 'getBoardString':
            boardString = previousStatesObject.boardArray.toString().replace(/,/g, '')

            // testing.
            queryBackend()

            break;
        default:
         if(typeof(callBackValue) === typeof(100)){
             previousStatesObject.aiDifficulty = callBackValue
         } else if (typeof(callBackValue) === typeof([0,'x'])){
            index = callBackValue[0]
            val = callBackValue[1]
            previousStatesObject.boardArray[index] = val
        }
        break;
    }
}

function queryBackend(){
    console.log("http://play-tictactoe-ai.herokuapp.com/api/v1/turn/"+turn+"/board/"+boardString)
    $.ajax({
            url: "http://play-tictactoe-ai.herokuapp.com/api/v1/turn/"+turn+"/board/"+boardString,
            beforeSend: function(xhr) {
                 // xhr.setRequestHeader("Authorization", "Bearer 6QXNMEMFHNY4FJ5ELNFMP5KRW52WFXN5")
            }, success: function(data){
                alert(data);
                console.log(data)
                //process the JSON data etc
            }
    })
}

// p5.js built-in method
// mouseClicked() function does not seem to work on mobile so
// will move below code to mousePressed. (will need a 'doOnce' boolean.)
// function mouseClicked() {
//     for (let i = 0; i < views[viewIndex].uiElements.length; i++){
//         if (views[viewIndex].uiElements[i].testForClick()){
//             callBackValue = views[viewIndex].uiElements[i].performClickFunctionality()
//             if (callBackValue){setTopLevelVariables(callBackValue)}
//         }
//     }
// console.log(previousStatesObject, boardString, turn)
// }

// p5.js built-in method
function mousePressed() {
    // do repeatedly
    for (let i = 0; i < views[viewIndex].uiElements.length; i++){

        if (views[viewIndex].uiElements[i].testForClick() && !doneOnce){
                views[viewIndex].uiElements[i].isDragging = true;
                callBackValue = views[viewIndex].uiElements[i].performClickFunctionality()
                if (callBackValue){setTopLevelVariables(callBackValue)}
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
    for (let i = 0; i < views[viewIndex].uiElements.length; i++){
        if(views[viewIndex].uiElements[i].mouseDragfunc && views[viewIndex].uiElements[i].isDragging){
            callBackValue = views[viewIndex].uiElements[i].performDragFunctionality()
            if (callBackValue){setTopLevelVariables(callBackValue)}
        }
        views[viewIndex].uiElements[i].isDragging = false;
    }
    doneOnce = false;
}

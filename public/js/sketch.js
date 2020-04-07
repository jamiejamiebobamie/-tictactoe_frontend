// the p5.js canvas
let canvas;
let views = []
let viewIndex = 0;
let menuButton;

// the return value from functions nested UIElements.
let returnValueFromViews;

// parameterObject to pass in to redrawElements() method to set the states
// to its previous states. states are lost on window resize.
let stateObject = { boardArray:["!","!","!","!","!","!","!","!","!"],
                    turn:'x',
                    aiDifficulty:13, // slider range: 13 to 113
                    gameOver:false
                            }

// url parameters to query the backend
let boardString = "!!!!!!!!!"
let turn = 'x';

// mouseClicked() function does not work on mobile.
// must use mousePressed() for all mouse events.
// mousePressed() is called repeatedly each frame,
// so 'doneOnce' controls which events are called repeatedly (drag events)
// and which are called once (click events).
// boolean reset with mouseReleased() function.
let doneOnce = false;

let apiReturnValue = null;

// p5.js built-in method
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    // parent the canvas to the DOM element 'sketch-holder'
    canvas.parent('sketch-holder');

    frameRate(24);

    let playWithAI = new SuggestionView()
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

    views[viewIndex].redrawElements(stateObject);
}

// p5.js built-in method
function draw () {
    background(256);
    views[viewIndex].draw()

    // test
    menuButton.draw()
    if (apiReturnValue != null){
        setBoardAndTurn(apiReturnValue)
        views[viewIndex].redrawElements(stateObject);
        apiReturnValue = null;
    }
}

function setBoardAndTurn(apiReturnValue){
    const OPPONENT_LOOKUP = {'x':'o', 'o':'x'}
    for (let i = 0; i < apiReturnValue.length; i++){
        stateObject.boardArray[i] = apiReturnValue[i]
    }
    turn = OPPONENT_LOOKUP[turn]
    stateObject.turn = turn
}

// testing
function cycleViews(){
    if (viewIndex < views.length-1){
        viewIndex++;
    } else {
        viewIndex = 0;
    }
    views[viewIndex].redrawElements(stateObject);
}

function setTopLevelVariables(returnValueFromViews){
    switch (returnValueFromViews) {
        case 'x':
            turn = 'x'
            stateObject.turn = turn
            break;
        case 'o':
            turn = 'o'
            stateObject.turn = turn
            break;
        case 'suggestMove':
            boardString = stateObject.boardArray.toString().replace(/,/g, '')
            // sets the 'apiReturnValue' top-level variable
            queryBackend();
            break;
        default:
         if(typeof(returnValueFromViews) === typeof(100)){
             stateObject.aiDifficulty = returnValueFromViews
         } else if (typeof(returnValueFromViews) === typeof([0,'x'])){
                 index = returnValueFromViews[0]
                 val = returnValueFromViews[1]
                 stateObject.boardArray[index] = val
        }
            break;
    }
}

function queryBackend(){
    let result;
    // fetch("http://127.0.0.1:5000/api/v1/turn/"+turn+"/board/"+boardString, {
    fetch("https://play-tictactoe-ai.herokuapp.com/api/v1/turn/"+turn+"/board/"+boardString, {
        headers: { "Content-Type": "application/json" }
    }).then(async response => {
    if (response.ok) {
      apiError = false;
      result = await response.json();
      apiReturnValue = result.board
    } else {
      apiError = true;
    }
  }).catch(() => (apiError = true));
}

// p5.js built-in method
function mousePressed() {
    for (let i = 0; i < views[viewIndex].uiElements.length; i++){

        if (views[viewIndex].uiElements[i].testForClick() && !doneOnce){
                views[viewIndex].uiElements[i].isDragging = true;
                returnValueFromViews = views[viewIndex].uiElements[i].performClickFunctionality()
                if (returnValueFromViews){setTopLevelVariables(returnValueFromViews)}
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
            returnValueFromViews = views[viewIndex].uiElements[i].performDragFunctionality()
            if (returnValueFromViews){setTopLevelVariables(returnValueFromViews)}
        }
        views[viewIndex].uiElements[i].isDragging = false;
    }
    doneOnce = false;
    // console.log(stateObject, boardString, turn, returnValueFromViews, apiReturnValue)
}

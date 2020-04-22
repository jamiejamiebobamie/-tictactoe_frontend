// the p5.js canvas
let canvas;
let views = []
let view_i = 0;
let menuButton;

// the return value from functions nested UIElements.
let returnValueFromViews;

// url parameters to query the backend
let boardString = "!!!!!!!!!"
let turn = 'x';

let doneOnce = false;
let isWaitingForResponse = false;

let apiReturnValue = null;

let startExitAnimation = false
let startEntranceAnimation = false

// parameterObject to pass in to redrawElements() method to set the states
// to its previous states. states are lost on window resize.
let parameterObject = {transitionAmount: 0,
                       boardArray:["!","!","!","!","!","!","!","!","!"],
                       turn:'x',
                       aiDifficulty:13, // slider range: 13 to 113
                       winner:null}

// p5.js built-in method
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    // parent the canvas to the DOM element 'sketch-holder'
    canvas.parent('sketch-holder');

    frameRate(24);
    menuButton = new Container({width:100, height:100, mouseClickfunc: startAnimations})
    // centers the canvas
    imageMode(CENTER);
    redrawn();
}

function redrawn(parameterObject){
    views = [];

    let playWithAI = new SuggestionView()
    views.push(playWithAI)

    let playAgainstAI = new PlayView()
    views.push(playAgainstAI)

    views[view_i].redrawElements(parameterObject)
}

// p5.js built-in method
function windowResized() {
    // p5.js built-in method
    resizeCanvas(windowWidth, windowHeight);
    redrawn(parameterObject);
}

function exitAnimation(){
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

    if (apiReturnValue != null){
        parameterObject.winner = apiReturnValue.winner
        setBoardAndTurn(apiReturnValue.board)
        redrawn(parameterObject);
        console.log(parameterObject)
        isWaitingForResponse = false;
        apiReturnValue = null;
    }
}

function startAnimations(){
    startExitAnimation = true
}

// testing
function cycleViews(){
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
    returnValueFromViews = clickRecursive(views[view_i]) || returnValueFromViews

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
    returnValueFromViews = clickReleasedRecursive(views[view_i]) || returnValueFromViews
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

function setBoardAndTurn(apiReturnValue){
    const OPPONENT_LOOKUP = {'x':'o', 'o':'x'}
    for (let i = 0; i < apiReturnValue.length; i++){
        parameterObject.boardArray[i] = apiReturnValue[i]
    }
    turn = OPPONENT_LOOKUP[turn]
    parameterObject.turn = turn
}

function setTopLevelVariables(returnValueFromViews){
    let queryAIMove;
    let queryRandMove;
    if (!isWaitingForResponse){
        // returnValueFromViews is an array of commands.
        while (returnValueFromViews.length){
            // some buttons return multiple commands that are iterated through
                // from back to front. (this might not work async.)
            console.log(returnValueFromViews)
            command = returnValueFromViews.pop()
            switch (command) {
                case 'x':
                    turn = 'x'
                    parameterObject.turn = turn
                    break;
                case 'o':
                    turn = 'o'
                    parameterObject.turn = turn
                    break;
                case 'aiMove':
                    boardString = parameterObject.boardArray.toString().replace(/,/g, '')
                    queryAIMove = "https://play-tictactoe-ai.herokuapp.com/api/v1/turn/"+turn+"/board/"+boardString

                    isWaitingForResponse = true;
                    // sets the 'apiReturnValue' top-level variable
                    queryBackend(queryAIMove);
                    break;
                case 'randMove':
                    boardString = parameterObject.boardArray.toString().replace(/,/g, '')
                    queryRandMove = "https://play-tictactoe-ai.herokuapp.com/api/v1/rand/turn/"+turn+"/board/"+boardString

                    isWaitingForResponse = true;
                    // sets the 'apiReturnValue' top-level variable
                    queryBackend(queryRandMove);
                    break;
                default:
                 if(typeof(returnValueFromViews) === typeof(100)){
                     parameterObject.aiDifficulty = returnValueFromViews
                 } else if (typeof(returnValueFromViews) === typeof([0,'x'])){
                         index = returnValueFromViews[0]
                         val = returnValueFromViews[1]
                         parameterObject.boardArray[index] = val
                }
                    break;
            }
        }
    }
}

// function queryBackend(){
//     let result;
//     // fetch("http://127.0.0.1:5000/api/v1/turn/"+turn+"/board/"+boardString, {
//     fetch("https://play-tictactoe-ai.herokuapp.com/api/v1/turn/"+turn+"/board/"+boardString, {
//         headers: { "Content-Type": "application/json" }
//     }).then(async response => {
//     if (response.ok) {
//       apiError = false;
//       result = await response.json();
//       apiReturnValue = result.board
//     } else {
//       apiError = true;
//     }
//   }).catch(() => (apiError = true));
// }

function queryBackend(url){
    let result;
    fetch(url, {
        headers: { "Content-Type": "application/json" }
    }).then(async response => {
    if (response.ok) {
      apiError = false;
      result = await response.json();
      apiReturnValue = { board: result.board, winner: result.winner}
    } else {
      apiError = true;
    }
  }).catch(() => (apiError = true));
}

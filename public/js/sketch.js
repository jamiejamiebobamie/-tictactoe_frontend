// the p5.js canvas
let canvas;
// top level ui components.
let views = []
let view_i = 0;
let menuButton;
// store the index of the play view
let playViewIndex;
// the return value from functions of nested UIElements.
let returnValueFromViews;
// url parameters to query the backend
let boardString = "!!!!!!!!!"
let turn = 'x';
// mousePressed boolean.
let doneOnce = false;
// api returns board and winner variables.
let apiReturnValue = null;
// parameterObject to pass in to redrawElements() method to set the states
    // to its previous states. states are lost on window resize.
let parameterObject = {
                       boardArray:["!","!","!","!","!","!","!","!","!"],
                       turn:'x',
                       // slider range: 44 to 144
                       aiDifficulty:44,
                       winner:null,
                       // to stop player input while waiting for a response from backend.
                       isWaitingForResponse:false,
                       fontStyle: null,
                       loadedImage: undefined
                   }
function preload(){
    parameterObject.loadedImage = loadImage('../imgs/brain_base.png');
    parameterObject.fontStyle = loadFont('fonts/Quicksand-Bold.otf');
}
// p5.js built-in method
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    // p5.js built-in method. parents the canvas to the DOM element 'sketch-holder'
    canvas.parent('sketch-holder');
    // p5.js built-in method. sets the framerate. improves performance.
    frameRate(24);
    // cycleViewIcon
    menuButton = new MenuButton({width:50, height:50, mouseClickfunc: cycleViews})
    // p5.js built-in method. centers the canvas and all drawn objects.
    imageMode(CENTER);
    redrawn(parameterObject);
}
function redrawn(parameterObject){
    views = [];
    let playAgainstAI = new PlayView()
    views.push(playAgainstAI)
    playViewIndex = views.length - 1;
    let playWithAI = new SuggestionView()
    views.push(playWithAI)
    views[view_i].redrawElements(parameterObject)
}
// p5.js built-in method
function windowResized() {
    // p5.js built-in method
    resizeCanvas(windowWidth, windowHeight);
    redrawn(parameterObject);
}
// p5.js built-in method
function draw(){
    background(256);
    drawRecursive(views[view_i])
    menuButton.draw()
    if (apiReturnValue != null){
        parameterObject.winner = apiReturnValue.winner
        setBoardAndTurn(apiReturnValue.board)
        parameterObject.isWaitingForResponse = false;
        redrawn(parameterObject);
        apiReturnValue = null;
    }
}
function resetParameterObject(){
    let saveDifficulty = parameterObject.aiDifficulty;
    let saveFont = parameterObject.fontStyle;
    let saveImage = parameterObject.loadedImage;
    parameterObject = {    boardArray: ["!","!","!","!","!","!","!","!","!"],
                           turn: 'x',
                           aiDifficulty: saveDifficulty, // slider range: 43 to 143
                           winner: null,
                           fontStyle:saveFont,
                           loadedImage:saveImage
                       }
}
function cycleViews(){
    if (view_i < views.length-1){
        view_i++;
    } else {
        view_i = 0;
    }
    views[view_i].redrawElements(parameterObject);
    resetParameterObject();
    redrawn(parameterObject);
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
// p5.js built-in method
function mousePressed() {
    // the built-in p5.js function mouseClicked() does not work on mobile.
    // must use mousePressed() for all mouse events.
    // mousePressed() is called repeatedly each frame,
    // 'doneOnce' controls which events are called repeatedly (drag events)
    // and which are called once (click events).
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
// p5.js built-in method
function mouseReleased() {
    returnValueFromViews = clickReleasedRecursive(views[view_i]) || returnValueFromViews
    if (returnValueFromViews){setTopLevelVariables(returnValueFromViews);}
    redrawn(parameterObject);
    // 'doneOnce' is reset with mouseReleased() function.
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
    if (!parameterObject.isWaitingForResponse){
        // returnValueFromViews is an array of commands.
        while (returnValueFromViews.length > 0){
            // some buttons return multiple commands that are iterated through
                // from back to front.
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
                case 'queryBackend':
                    boardString = parameterObject.boardArray.toString().replace(/,/g, '')
                    parameterObject.isWaitingForResponse = true;
                    // sets the 'apiReturnValue' top-level variable
                    queryBackend();
                    break;
                case 'replay':
                    resetParameterObject();
                    redrawn(parameterObject);
                    break;
                case 'exit':
                    window.location.href = "https://github.com/jamiejamiebobamie/tictactoe_frontend";
                    break;
                default:
                 if(typeof(command) === typeof(100)){
                     parameterObject.aiDifficulty = command
                 } else if (typeof(command) === typeof([0,'x'])){
                     index = command[0]
                     val = command[1]
                     parameterObject.boardArray[index] = val
                     break;
                }
                break;
            }
        }
    }
}
function queryBackend(){
    let result;
    let url;
    let mustBeAboveDifficultyToUseAI = Math.random()*144+44;
    // check slider amount and generate a random number that must be higher
        // than the aiDifficulty to use the AI
        // (so aiDifficulty is harder the lower the slider score is...)
    let suggestMoveView = view_i == 1;
    let useAI = mustBeAboveDifficultyToUseAI > parameterObject.aiDifficulty || suggestMoveView;
    if (useAI) {
        url = "https://play-tictactoe-ai.herokuapp.com/api/v1/turn/"+turn+"/board/"+boardString
    } else {
        url = "https://play-tictactoe-ai.herokuapp.com/api/v1/rand/turn/"+turn+"/board/"+boardString
    }
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

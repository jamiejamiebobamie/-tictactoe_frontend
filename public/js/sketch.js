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
// the gameState is used to keep track of the state of the game.
    // uiElements lose their state each time they are redrawn
    // so require the state to be passed in on re-initializtion.
let gameState = {   boardArray:["!","!","!","!","!","!","!","!","!"],
                    turn:'x',
                    // slider range: 44 to 144
                    aiDifficulty:44,
                    winner:null,
                    // to stop player input while waiting for a response from backend.
                    isWaitingForResponse:false,
                    fontStyle: null,
                    loadedImage: undefined
                 }
// p5.js built-in method
function preload(){
    gameState.loadedImage = loadImage('../imgs/brain_base.png');
    gameState.fontStyle = loadFont('fonts/Quicksand-Bold.otf');
    textFont(gameState.fontStyle)

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
    redrawn(gameState);
}
// redraws the views based on the current dimensions
    // of the screen (width and height) and the current gameState.
function redrawn(gameState){
    views = [];
    let playAgainstAI = new PlayView()
    views.push(playAgainstAI)
    playViewIndex = views.length - 1;
    let playWithAI = new SuggestionView()
    views.push(playWithAI)
    views[view_i].redrawElements(gameState)
}
// p5.js built-in method
function windowResized() {
    // p5.js built-in method
    resizeCanvas(windowWidth, windowHeight);
    redrawn(gameState);
}
// p5.js built-in method
function draw(){
    background(256);
    drawRecursive(views[view_i])
    menuButton.draw()
    if (apiReturnValue != null){
        gameState.winner = apiReturnValue.winner
        setBoardAndTurn(apiReturnValue.board)
        gameState.isWaitingForResponse = false;
        redrawn(gameState);
        apiReturnValue = null;
    }
}
// recursive functions allow uiElements to be nested.
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
// p5.js built-in method. called repeatedly as mouse click is held down.
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
// recursive functions allow uiElements to be nested.
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
// p5.js built-in method. called when mouse click is release.
function mouseReleased() {
    returnValueFromViews = clickReleasedRecursive(views[view_i]) || returnValueFromViews
    if (returnValueFromViews){setTopLevelVariables(returnValueFromViews);}
    redrawn(gameState);
    // 'doneOnce' is reset with mouseReleased() function.
    doneOnce = false;
}
// recursive functions allow uiElements to be nested.
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
// sets the top level variables.
    // all game logic and state is managed and stored in this file.
    // nested UIElements send an array of string command(s)
    // to this method to change the app's state based on user interacting with
    // them
function setTopLevelVariables(returnValueFromViews){
    let queryAIMove;
    let queryRandMove;
    if (!gameState.isWaitingForResponse){
        // returnValueFromViews is an array of commands.
        while (returnValueFromViews.length > 0){
            // some buttons return multiple commands that are iterated through
                // from back to front.
            command = returnValueFromViews.pop()
            switch (command) {
                case 'x':
                    turn = 'x'
                    gameState.turn = turn
                    break;
                case 'o':
                    turn = 'o'
                    gameState.turn = turn
                    break;
                case 'queryBackend':
                    boardString = gameState.boardArray.toString().replace(/,/g, '')
                    gameState.isWaitingForResponse = true;
                    // sets the 'apiReturnValue' top-level variable
                    queryBackend();
                    break;
                case 'replay':
                    resetGameState();
                    redrawn(gameState);
                    break;
                case 'exit':
                    window.location.href = "https://github.com/jamiejamiebobamie/tictactoe_frontend";
                    break;
                default:
                 if(typeof(command) === typeof(100)){
                     gameState.aiDifficulty = command
                 } else if (typeof(command) === typeof([0,'x'])){
                     index = command[0]
                     val = command[1]
                     gameState.boardArray[index] = val
                     break;
                }
                break;
            }
        }
    }
}
// set the board and winner top level variables.
function queryBackend(){
    let result;
    let url;
    // generate a random number
    let mustBeAboveDifficultyToUseAI = Math.random()*144+44;
    // always query the backend for the correct move if in suggestion view.
    let suggestMoveView = view_i == 1;
    // ai is used more often the lower the slider score is.
    let useAI = mustBeAboveDifficultyToUseAI > gameState.aiDifficulty || suggestMoveView;
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
function resetGameState(){
    let saveDifficulty = gameState.aiDifficulty;
    let saveFont = gameState.fontStyle;
    let saveImage = gameState.loadedImage;
    gameState = {    boardArray: ["!","!","!","!","!","!","!","!","!"],
                           turn: 'x',
                           aiDifficulty: saveDifficulty, // slider range: 43 to 143
                           winner: null,
                           fontStyle:saveFont,
                           loadedImage:saveImage
                       }
}
// the menu button's function.
    // changes the view index, resets the parameter object,
    // and redraws the board.
function cycleViews(){
    if (view_i < views.length-1){
        view_i++;
    } else {
        view_i = 0;
    }
    views[view_i].redrawElements(gameState);
    resetGameState();
    redrawn(gameState);
}
// sets the next player's turn after recieving a response from the backend.
function setBoardAndTurn(apiReturnValue){
    const OPPONENT_LOOKUP = {'x':'o', 'o':'x'}
    for (let i = 0; i < apiReturnValue.length; i++){
        gameState.boardArray[i] = apiReturnValue[i]
    }
    turn = OPPONENT_LOOKUP[turn]
    gameState.turn = turn
}

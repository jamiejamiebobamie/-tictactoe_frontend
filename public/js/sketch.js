// the p5.js canvas
let canvas;
let views = []
let viewIndex = 0;
let menuButton;

// the return value from functions nested UIElements.
let callBackValue;

// parameterObject to pass in to redrawElements() method to set the states
// to its previous states. states are lost on window resize.
let previousStatesObject = { boardArray:["!","!","!","!","!","!","!","!","!"],
                            turn:'x',
                            aiDifficulty:13 // slider range: 13 to 113
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

    // const invocation = new XMLHttpRequest();
    // const url = 'http://bar.other/resources/credentialed-content/';
    // if (invocation) {
    //     invocation.open('GET', url, true);
    //     invocation.withCredentials = false;
    //     invocation.onreadystatechange = handler;
    //     invocation.send();
    // }

    fetch("https://play-tictactoe-ai.herokuapp.com/api/v1/turn/"+turn+"/board/"+boardString, {
  // NEW - add a Content-Type header
        headers: { "Content-Type": "application/json" }
    })
  .then(async response => {
    if (response.ok) {
      apiError = false;
      result = await response.json();
      console.log(result)
    } else {
      apiError = true;
    }
  })
  .catch(() => (apiError = true));

    // console.log("http://play-tictactoe-ai.herokuapp.com/api/v1/turn/"+turn+"/board/"+boardString)
    // fetch("http://play-tictactoe-ai.herokuapp.com/api/v1/turn/"+turn+"/board/"+boardString)
    //   .then((response) => {
    //       console.log(response.json())
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //   });
}

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
    // console.log(previousStatesObject, boardString, turn, callBackValue)
}

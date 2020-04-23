
class SuggestionView extends View{
    constructor(parameterObject){
        super(parameterObject)
    }

    redrawElements(previousStatesObject){
        let portrait = windowWidth < windowHeight;

        this.uiElements = []
        for (let i = 0; i < 2; i++){
            let containerParams = {row: portrait, len:2, index:i}
            let container = new Container(containerParams)
            this.uiElements.push(container)
        }

        let boardContainer = this.uiElements[1]

        let boardRowParams = {row: true, len:8, index:1, parent:boardContainer}
        let rowAnchor = new Container(boardRowParams)
        this.uiElements.push(rowAnchor)
        let boardColParams = {row: false, len:8, index:1, parent:rowAnchor}
        let columnAnchor = new Container(boardColParams)
        this.uiElements.push(columnAnchor)

        let boardLength = 0;
        boardContainer.height > boardContainer.width ? boardLength = boardContainer.width/1.3 : boardLength = boardContainer.height/1.3;

        let boardParams = {row: true,  height: boardLength, width: boardLength, parent:columnAnchor}
        let board = new Container(boardParams)
        this.uiElements.push(board)

        let boardSpace;
        let boardCount = 0;
        let spaceColor;
        let blue = color(86,133,151)
        let red = color(165,67,68)

        for (let i = 0; i < 3; i++){
            boardRowParams = {row: true, len: 3, index: i, parent:board}
            let boardRow = new Container(boardRowParams)
            this.uiElements.push(boardRow)

            for (let j = 0; j < 3; j++){
                boardCount % 2 ? spaceColor = blue : spaceColor = red;
                let boardSpaceParams = {row: false, len: 3, index: j, color: spaceColor, parent:boardRow}
                boardSpace = new TicTacToeSpace(boardSpaceParams)
                if (previousStatesObject){
                    boardSpace.setSymbol(previousStatesObject.boardArray[boardCount])
                }
                this.uiElements.push(boardSpace)
                boardCount++;
            }
        }

        let turnButtonContainer =  this.uiElements[0]

        let turnButtonAnchorParams = {row: true, len:5, index:2, parent: turnButtonContainer}
        let turnButtonAnchor = new Container(turnButtonAnchorParams)
        this.uiElements.push(turnButtonAnchor)

        boardCount % 2 ? spaceColor = blue : spaceColor = red;
        let chooseTurnParams = {row: false, color: spaceColor, width:boardSpace.width, height: boardSpace.height, parent:turnButtonAnchor}
        let turnChoice = new TicTacToePlayerTurnSelector(chooseTurnParams)
        if (previousStatesObject){
            turnChoice.setSymbol(previousStatesObject.turn);
        }
        this.uiElements.push(turnChoice)

        let submitContainer = this.uiElements[1]

        let submitBoardButtonAnchorParams = {row: true, len:8, index:0, parent: submitContainer}
        let submitBoardButtonAnchor = new Container(submitBoardButtonAnchorParams)
        this.uiElements.push(submitBoardButtonAnchor)

        let submitBoardButtonParams = {row: true, parent:submitBoardButtonAnchor, mouseClickfunc:this.aiMove}
        let submitBoardButton = new Button(submitBoardButtonParams)
        this.uiElements.push(submitBoardButton)
    }

    // mouse click functions.
    // can't set 'this' member variables without binding this,
    // which I'm not sure can be done outside of React.
    aiMove(){ return ['queryBackend'] }
    setTurnToX(){ return ['x'] }
    setTurnToO(){ return ['o'] }
}

class PlayView extends View{
    constructor(parameterObject){
        super(parameterObject)
    }

    redrawElements(previousStatesObject){
        let portrait = windowWidth < windowHeight;

        this.uiElements = []
        for (let i = 0; i < 2; i++){
            let containerParams = {row: portrait, len:2, index:i}
            let container = new Container(containerParams)
            this.uiElements.push(container)
        }

        let cartoonSliderContainer =  this.uiElements[0]
        let cartoonImageContainerParams = {row: true, len:3, index:0, height:cartoonSliderContainer.height*(2/3), parent:cartoonSliderContainer}
        let cartoonImageContainer = new Container(cartoonImageContainerParams)
        this.uiElements.push(cartoonImageContainer)
        let sliderContainerParams = {row: true, len:3, index:2, height:cartoonSliderContainer.height/3, parent:cartoonSliderContainer}
        let sliderContainer = new Container(sliderContainerParams)
        this.uiElements.push(sliderContainer)
        let sliderParams = {row: true, parent:sliderContainer}
        let slider = new DifficultySlider(sliderParams)
        // console.log(previousStatesObject || "hey" )
        let difficulty = previousStatesObject ? previousStatesObject.aiDifficulty : 13;
        slider.setDifficulty(difficulty)
        this.uiElements.push(slider)

        let boardContainer = this.uiElements[1]
        let boardRowParams = {row: true, len:8, index:1, parent:boardContainer}
        let rowAnchor = new Container(boardRowParams)
        this.uiElements.push(rowAnchor)
        let boardColParams = {row: false, len:8, index:1, parent:rowAnchor}
        let columnAnchor = new Container(boardColParams)
        this.uiElements.push(columnAnchor)

        let boardLength = 0;
        boardContainer.height > boardContainer.width ? boardLength = boardContainer.width/1.3 : boardLength = boardContainer.height/1.3;

        let boardParams = {row: true,  height: boardLength, width: boardLength, parent:columnAnchor}
        let board = new Container(boardParams)
        this.uiElements.push(board)

        let count = 0;
        let spaceColor;
        let blue = color(86,133,151)
        let red = color(165,67,68)

        for (let i = 0; i < 3; i++){
            boardRowParams = {row: true, len: 3, index: i, parent:board}
            let boardRow = new Container(boardRowParams)
            this.uiElements.push(boardRow)

            for (let j = 0; j < 3; j++){
                count % 2 ? spaceColor = blue : spaceColor = red;
                let boardSpaceParams = {row: false, len: 3, index: j, color: spaceColor, parent:boardRow}
                let boardSpace = new TicTacToeSpacePlay(boardSpaceParams)
                if (previousStatesObject){
                    boardSpace.setSymbol(previousStatesObject.boardArray[count])
                    boardSpace.setBoardState(previousStatesObject.boardArray)
                }
                this.uiElements.push(boardSpace)
                count++;
            }
        }
    }

    // aiMove(){ return ['aiMove'] }
    // randMove(){ return ['randMove'] }
    // setTurnToX(){ return ['x'] }
    // setTurnToO(){ return ['o'] }
}


class TicTacToeSpace extends Container{
    constructor(parameterObject){
        super(parameterObject)
        this.currentSymbol = new NullIcon({parent: this})
        this.symbols = [new NullIcon({parent: this}), new X({parent: this}), new O({parent: this})]
        this.symbolIndex = 0;

        this.mouseClickfunc = this.getSymbol
    }

    incrementSymbol(){
        this.symbolIndex < 2 ? this.symbolIndex++ : this.symbolIndex = 0
        this.currentSymbol = this.symbols[this.symbolIndex]
    }

    getSymbol(){
        this.incrementSymbol();

        const LOOKUP = {'00':0, '01':1, '02':2,
                  '10':3, '11':4, '12':5,
                  '20':6, '21':7, '22':8}

        let boardIndex = str(this.parent.index) + str(this.index)

        return [ [LOOKUP[boardIndex], this.currentSymbol.name] ]
    }

    setSymbol(symbol){
        const LOOKUP = {'!':0,
                        'x':1,
                        'o':2}

        symbol ? this.symbolIndex = LOOKUP[symbol] : this.symbolIndex = 0
    }

    userDrag(){}

    draw() {
        super.draw()
        // draw symbol / icon
        this.symbols[this.symbolIndex].draw()
    }
}

class TicTacToeSpacePlay extends TicTacToeSpace{
    constructor(parameterObject){
        super(parameterObject)
        this.currentSymbol = new NullIcon({parent: this})
        this.symbols = [new NullIcon({parent: this}), new X({parent: this}), new O({parent: this})]
        this.symbolIndex = 0;

        this.boardState = []

        this.mouseClickfunc = this.playTurn
    }

    playTurn(){
        // commands are pushed into the array in reverse order that they occur
        let commands = []

        // query the backend to either generate a random move or an ai move
        let command = 'queryBackend'
        commands.push(command)

        // the ai player 'O' gets to go.
        command = 'o'
        commands.push(command)

        // user 'X' picks tictactoe square
        command = this.getSymbol()
        commands.push(command)

        let moveBoardIndex = command[0]

        // check to make sure the player has clicked on a valid space.
            // this only works if clicking on a past X move, but still overwrites
            // O.
        let index = moveBoardIndex
        console.log(index, this.boardState)
        if (this.boardState[index] == "!"){
            return commands
        }
    }

    // need to set the spaces symbol after checking that O hasn't gone there
    getSymbol(){
        this.symbolIndex = 1
        this.currentSymbol = this.symbols[this.symbolIndex]
        const LOOKUP = {'00':0, '01':1, '02':2,
                  '10':3, '11':4, '12':5,
                  '20':6, '21':7, '22':8}
        let boardIndex = str(this.parent.index) + str(this.index)
        return [LOOKUP[boardIndex], this.currentSymbol.name]
    }

    setBoardState(boardState){
        this.boardState = boardState
    }
}

class TicTacToePlayerTurnSelector extends TicTacToeSpace{
    constructor(parameterObject){
        super(parameterObject)
        this.currentSymbol = new X({parent: this})
        this.symbols = [new X({parent: this}), new O({parent: this})]
        this.symbolIndex = 0;

        this.mouseClickfunc = this.getSymbol
    }

    incrementSymbol(){
        this.symbolIndex < 1 ? this.symbolIndex++ : this.symbolIndex = 0
        this.currentSymbol = this.symbols[this.symbolIndex]
    }

    getSymbol(){
        this.incrementSymbol();

        return [ this.currentSymbol.name ]
    }

    setSymbol(symbol){
        const LOOKUP = {'x':0,
                        'o':1}

        symbol ? this.symbolIndex = LOOKUP[symbol] : this.symbolIndex = 0
    }

    userDrag(){}

    draw() {
        super.draw()
        // draw symbol / icon
        this.symbols[this.symbolIndex].draw()
    }

}


class TicTacToeIcon extends Icon{
    constructor(parameterObject){
        super(parameterObject);
        this.name = 'abstract icon';
        this.isSuggestion = false;
    }

    draw(){
        this.isSuggestion ? fill(50) : fill(50);
    }
}

class NullIcon extends TicTacToeIcon{
    constructor(parameterObject){
        super(parameterObject);
        this.name = '!';

    }
    draw(){
    }
}

class X extends TicTacToeIcon{
    constructor(parameterObject){
        super(parameterObject);
        this.name = 'x';
        this.x += this.parent.width/8
        this.y += this.parent.height/8
    }

    draw(){
        super.draw()
        rect(this.x,this.y,this.parent.width/1.35, this.parent.height/1.35)
    }
}


class O extends TicTacToeIcon{
    constructor(parameterObject){
        super(parameterObject);
        this.name = 'o';
        this.x += this.parent.width/2
        this.y += this.parent.height/2
    }

    draw(){
        super.draw()
        ellipse(this.x, this.y, this.parent.width/1.5)
        fill(this.parent.color);
        ellipse(this.x, this.y, this.parent.width/2)
    }
}

class DifficultySlider extends Slider{
    constructor(parameterObject){
        super(parameterObject)
        this.mouseDragfunc = this.getDifficulty
    }

    setDifficulty(difficulty){
        if (this.row){
            this.buttonX = this.sliderWidth * float(difficulty/100)
        } else {
            this.buttonY = this.sliderHeight * float(difficulty/100)
        }
    }

    getDifficulty(){
        let difficulty = this.row ? this.buttonX / this.sliderWidth : this.buttonY / this.sliderHeight
        difficulty *= 100 // the slider is shifted up by 13 so the range needs to be adjusted to 0-100
        // scale of 0 to 10
        return [int(difficulty)];
    }
}

class View{
    constructor(parameterObject){
        // fill in with data objects that are shared among View subclasses.
        this.uiElements = []
    }

    // abstract method
    redrawElements(){}

    draw(){
        for (let i = 0; i < this.uiElements.length; i++){
            this.uiElements[i].draw();
        }
    }
}

class SuggestionsView extends View{
    constructor(parameterObject){
        super(parameterObject)
        this.redrawElements()
    }

    redrawElements(previousStatesObject){
        let portrait = windowWidth < windowHeight;

        this.uiElements = []
        for (let i = 0; i < 3; i++){
            let containerParams = {row: portrait, len:3, index:i}
            let container = new Container(containerParams)
            this.uiElements.push(container)
        }

        let turnButtonContainer =  this.uiElements[0]

        let turnbuttonAnchorParams = {row: true, len:4, index:3, parent: turnButtonContainer}
        let turnButtonsAnchor = new Container(turnbuttonAnchorParams)
        this.uiElements.push(turnButtonsAnchor)

        let chooseXButtonParams = {row: false, len:4, index:1, parent: turnButtonsAnchor}
        let chooseXButtonContainer = new Container(chooseXButtonParams)
        this.uiElements.push(chooseXButtonContainer)

        let chooseOButtonParams = {row: false, len:4, index:2, parent: turnButtonsAnchor}
        let chooseOButtonContainer = new Container(chooseOButtonParams)
        this.uiElements.push(chooseOButtonContainer)

        let setTurnToXParams = {row: true, parent:chooseXButtonContainer, mouseClickfunc:this.setTurnToX}
        let setTurnToXButton = new Button(setTurnToXParams)
        this.uiElements.push(setTurnToXButton)

        let setTurnToOParams = {row: true, parent:chooseOButtonContainer, mouseClickfunc:this.setTurnToO}
        let setTurnToOButton = new Button(setTurnToOParams)
        this.uiElements.push(setTurnToOButton)

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
                let boardSpace = new TicTacToeSpaceSuggest(boardSpaceParams)
                if (previousStatesObject){
                    boardSpace.setSymbol(previousStatesObject.boardArray[count])
                }
                this.uiElements.push(boardSpace)
                count++;
            }
        }

        let submitContainer = this.uiElements[2]

        let submitBoardButtonAnchorParams = {row: true, len:3, index:1, parent: submitContainer}
        let submitBoardButtonAnchor = new Container(submitBoardButtonAnchorParams)
        this.uiElements.push(submitBoardButtonAnchor)

        let submitBoardButtonParams = {row: true, parent:submitBoardButtonAnchor, mouseClickfunc:this.getBoardString}
        let submitBoardButton = new Button(submitBoardButtonParams)
        this.uiElements.push(submitBoardButton)
    }

    // mouse click functions.
    // can't set 'this' member variables without binding this,
    // which I'm not sure can be done outside of React.
    getBoardString(){ return 'getBoardString'}
    setTurnToX(){ return 'x' }
    setTurnToO(){ return 'o' }
}

class PlayView extends View{
    constructor(parameterObject){
        super(parameterObject)
        this.redrawElements()
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
                let boardSpace = new TicTacToeSpaceSuggest(boardSpaceParams)
                if (previousStatesObject){
                    boardSpace.setSymbol(previousStatesObject.boardArray[count])
                }
                this.uiElements.push(boardSpace)
                count++;
            }
        }
    }

    // mouse click functions.
    // can't set 'this' member variables without binding this,
    // which I'm not sure can be done outside of React.
    getBoardString(){return 'getBoardString'}
    setTurnToX(){ return 'x' }
    setTurnToO(){ return 'o' }
}
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
        this.turn = 'x'
        this.boardState;
        this.redrawElements()
    }

    redrawElements(){
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
        let slider = new Slider(sliderParams)
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
        let previousSymbol = undefined;

        let storeSymbols;
        // if (this.boardState){
        //     storeSymbols = getBoardIconObjects();
        //     console.log(storeSymbols)
        // }

        this.boardState = [];
        for (let i = 0; i < 3; i++){
            boardRowParams = {row: true, len: 3, index: i, parent:board}
            let boardRow = new Container(boardRowParams)
            this.uiElements.push(boardRow)
            for (let j = 0; j < 3; j++){

                count % 2 ? spaceColor = blue : spaceColor = red;
                // storeSymbols ? previousSymbol = storeSymbols[count] : previousSymbol = undefined

                let boardSpaceParams = {row: false, len: 3, index: j, color: spaceColor, parent:boardRow}
                let boardSpace = new TicTacToeSpace(boardSpaceParams)
                // boardSpace.setSymbol(previousSymbol)
                this.uiElements.push(boardSpace)
                this.boardState.push(boardSpace)
                count++;
        }
    }

        boardRowParams = {row: true, len:8, index:0, parent:boardContainer}
        rowAnchor = new Container(boardRowParams)
        this.uiElements.push(rowAnchor)

        for (let i = 0; i < 3; i++){
            let testUIParams = {row: false, len:3, index:i, parent:rowAnchor}
            let testUIElement = new Container(testUIParams)
            this.uiElements.push(testUIElement)

            switch (i){
                case 0:
                let setTurnToXParams = {row: true, parent:testUIElement, mouseClickfunc:this.setTurnToX}
                let setTurnToXButton = new Button(setTurnToXParams)
                this.uiElements.push(setTurnToXButton)
                break;
                case 1:
                let submitBoardButtonParams = {row: true, parent:testUIElement, mouseClickfunc:this.getBoardString}
                let submitBoardButton = new Button(submitBoardButtonParams)
                this.uiElements.push(submitBoardButton)
                break;

                case 2:
                let setTurnToOParams = {row: true, parent:testUIElement, mouseClickfunc:this.setTurnToO}
                let setTurnToOButton = new Button(setTurnToOParams)
                this.uiElements.push(setTurnToOButton)
                break;
            }
        }
    }

    // mouse click functions
    setTurnToX(){ this.turn = 'x' }
    setTurnToO(){ this.turn = 'o' }
    getBoardString(){
        let boardString = ""
        for (let i = 0; i < this.boardState.length; i++){
            boardString += this.boardState[i].currentSymbol.name
        }
        return [this.turn, boardString]
    }
}


class TestView extends View{
    constructor(parameterObject){
        super(parameterObject)
    }

    // abstract method
    redrawElements(){
        ellipse(100,100,30)
    }

    draw(){
        ellipse(100,100,30)
    }
}

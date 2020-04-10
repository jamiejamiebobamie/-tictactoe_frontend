class View{
    constructor(parameterObject){

        this.uiElements = []

        // for drawing the UIElements the first time.
        this.redrawElements();
    }

    // abstract method
    redrawElements(){}

    draw(){
        for (let i = 0; i < this.uiElements.length; i++){
            this.uiElements[i].draw();
        }
    }
}

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

        let turnButtonAnchorParams = {row: true, len:4, index:3, parent: turnButtonContainer}
        let turnButtonAnchor = new Container(turnButtonAnchorParams)
        this.uiElements.push(turnButtonAnchor)

        boardCount % 2 ? spaceColor = blue : spaceColor = red;
        let chooseTurnParams = {row: false, color: spaceColor, width:boardSpace.width, height: boardSpace.height, parent:turnButtonAnchor}
        let turnChoice = new TicTacToePlayerTurnSelector(chooseTurnParams)
        if (previousStatesObject){
            turnChoice.setSymbol(previousStatesObject.turn);
        }
        this.uiElements.push(turnChoice)

        // let submitContainer = this.uiElements[2]
        //
        // let submitBoardButtonAnchorParams = {row: true, len:3, index:1, parent: submitContainer}
        // let submitBoardButtonAnchor = new Container(submitBoardButtonAnchorParams)
        // this.uiElements.push(submitBoardButtonAnchor)
        //
        // let submitBoardButtonParams = {row: true, parent:submitBoardButtonAnchor, mouseClickfunc:this.suggestMove}
        // let submitBoardButton = new Button(submitBoardButtonParams)
        // this.uiElements.push(submitBoardButton)
    }

    // mouse click functions.
    // can't set 'this' member variables without binding this,
    // which I'm not sure can be done outside of React.
    suggestMove(){ return 'suggestMove'}
    setTurnToX(){ return 'x' }
    setTurnToO(){ return 'o' }
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
                let boardSpace = new TicTacToeSpace(boardSpaceParams)
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
    suggestMove(){return 'suggestMove'}
    setTurnToX(){ return 'x' }
    setTurnToO(){ return 'o' }
}

class TestView1 extends View{
    constructor(parameterObject){
        super(parameterObject)
        this.redrawElements()
    }

    redrawElements(){
        let base_container1_params = {row:false, len:7, index:0,width:windowWidth*6/7, color:'orange'}
        let container = new Container(base_container1_params)
        this.uiElements.push(container)

        base_container1_params = {row:false, len:7, index:6, color:'green', mouseDragfunc:this.swipeLeft}
        container = new Container(base_container1_params)
        this.uiElements.push(container)

        let params = {row: false, width: 200, height: 300, color: 'red'}
        let cont = new DraggableContainer(params)
        this.uiElements.push(cont)
    }

    swipeLeft(){
        console.log(windowWidth - mouseX)
        for (let i = 0; i < this.uiElements.length; i++){
            this.uiElements[i].swipeAmount = windowWidth - mouseX
        }
    }
    draw(){
        super.draw()
        for (let i = 0; i < this.uiElements.length; i++){
            if (this.uiElements[i].isDragging){
                this.swipeLeft()
            }
        }
    }

}

class TestView2 extends View{
    constructor(parameterObject){
        super(parameterObject)
        this.img = loadImage('../imgs/brain_base.png');
        this.redrawElements()
    }

    redrawElements(){

        let base_container1_params = {row:false, len:7, index:0,width:windowWidth*6/7, color:'orange'}
        let container = new Container(base_container1_params)
        this.uiElements.push(container)

        base_container1_params = {row:false, len:7, index:6, color:'green', mouseDragfunc:this.swipeLeft}
        container = new Container(base_container1_params)
        this.uiElements.push(container)

        let params = {row: false, width: 200, height: 300, offsetX:400}
        let contImg = new ImageContainer(params)
        contImg.setImageProps(this.img, 382,279)
        this.uiElements.push(contImg)

        let hi = new ScalableContainer({width:200,height:300, offsetX:200, offsetY:300})
        this.uiElements.push(hi)

    }

    swipeLeft(){
        console.log(windowWidth - mouseX)
        for (let i = 0; i < this.uiElements.length; i++){
            this.uiElements[i].swipeAmount = windowWidth - mouseX
        }
    }
    draw(){
        super.draw()
        for (let i = 0; i < this.uiElements.length; i++){
            if (this.uiElements[i].isDragging){
                this.swipeLeft()
            }
        }
    }
}

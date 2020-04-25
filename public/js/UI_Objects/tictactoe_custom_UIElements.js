
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

        let boardContainer = this.uiElements[0]

        let boardLength = boardContainer.height > boardContainer.width ? boardContainer.width/1.3 : boardContainer.height/1.3;
        let offsetX = boardContainer.width / 2 -  boardLength / 2
        let offsetY = boardContainer.height / 2 -  boardLength / 2
        let boardParams = {row: true, offsetX: offsetX, offsetY:offsetY,  height: boardLength, width: boardLength, parent:boardContainer}
        let board = new Container(boardParams)
        this.uiElements.push(board)

        let boardSpace;
        let boardCount = 0;
        let spaceColor;
        let blue = color(86,133,151)
        let red = color(165,67,68)

        for (let i = 0; i < 3; i++){
            let boardRowParams = {row: true, len: 3, index: i, parent:board}
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

        let turnAndSubmitButtonsContainer =  this.uiElements[1]
        for (let i = 0; i < 3; i++){
            let containerParams = {row: true, len:3, index:i, parent: turnAndSubmitButtonsContainer}
            let container = new Container(containerParams)
            turnAndSubmitButtonsContainer.uiElements.push(container)
        }

        let infoArea = turnAndSubmitButtonsContainer.uiElements[0]
        let infoTextBoxParams = {row: true, offsetX: infoArea.width/6, width:infoArea.width*2/3, offsetY: infoArea.height/10, parent:infoArea}
        let infoSection = new TextBox(infoTextBoxParams)
        infoSection.setString("input turn and board to recieve a suggestion")
        infoSection.setTextColor(30)
        this.uiElements.push(infoSection)

        spaceColor = boardCount % 2 ? blue : red;
        let turnButtonArea = turnAndSubmitButtonsContainer.uiElements[1]
        let chooseTurnParams = {row: false, color: spaceColor, offsetX:turnButtonArea.width/2-boardSpace.width/2, offsetY:turnButtonArea.height/2-boardSpace.height/2, width:boardSpace.width, height: boardSpace.height, parent:turnButtonArea}
        let whosTurnButton = new TicTacToePlayerTurnSelector(chooseTurnParams)
        if (previousStatesObject){
            whosTurnButton.setSymbol(previousStatesObject.turn);
        }
        this.uiElements.push(whosTurnButton)

        let submitButtonArea = turnAndSubmitButtonsContainer.uiElements[2]
        let submitBoardButtonParams = {row: true, offsetX: submitButtonArea.width/4, offsetY: submitButtonArea.height/4, width:submitButtonArea.width/2, height:submitButtonArea.height/2, parent:submitButtonArea, mouseClickfunc:this.aiMove}
        let submitBoardButton = new TextBox(submitBoardButtonParams)
        submitBoardButton.setString("submit")
        submitBoardButton.setTextColor(30)
        submitBoardButton.setStroke(true)
        this.uiElements.push(submitBoardButton)
    }

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

        // brainparts
        // https://github.com/jamiejamiebobamie/conway-gol/blob/6a9c8a80b3d6353af137a9569e3dc62e73b1ec86/public/js/sketch-playground.js

        // left-eyelid
        let dumbPose = {
                firstAnchorPoint:{x:55,y:109},
                firstControlPoint:{x:142,y:7},
                secondAnchorPoint:{x:243,y:54},
                secondControlPoint:{x:309,y:247}
            }
        let smartPose = {
                firstAnchorPoint:{x:202,y:55},
                firstControlPoint:{x:202,y:55},
                secondAnchorPoint:{x:202,y:55},
                secondControlPoint:{x:202,y:55}
            }
        // let translationCoords = {x:cartoonImageContainer.x, y:cartoonImageContainer.y}
        // let brainPart_test = new BrainPart(dumbPose,smartPose,translationCoords)
        let brainPart_testParams = {row:true,parent:cartoonImageContainer}
        let brainPart_test = new BrainPart(brainPart_testParams)
        brainPart_test.setPoses(dumbPose,smartPose)
        brainPart_test.setBlendAmount(parameterObject.aiDifficulty)
        brainPart_test.blend();
        cartoonSliderContainer.uiElements.push(brainPart_test)


        // --------------------------------------------------------------------

        // let sliderContainerParams = {row: true, len:3, index:2, height:cartoonSliderContainer.height/3, parent:cartoonSliderContainer}
        // let sliderContainer = new Container(sliderContainerParams)
        // this.uiElements.push(sliderContainer)
        // let sliderParams = {row: true, parent:sliderContainer}
        // let slider = new DifficultySlider(sliderParams)
        // let difficulty = previousStatesObject ? previousStatesObject.aiDifficulty : 13;
        // slider.setDifficulty(difficulty)
        // this.uiElements.push(slider)
        //
        // let boardContainer = this.uiElements[1]
        // let boardRowParams;
        //
        // let boardLength = 0;
        // boardLength = boardContainer.height > boardContainer.width ? boardContainer.width/1.3 : boardContainer.height/1.3;
        //
        // let offsetX = boardContainer.width / 2 -  boardLength / 2
        // let offsetY = boardContainer.height / 2 -  boardLength / 2
        //
        // let boardParams = {row: true, offsetX: offsetX, offsetY: offsetY, height: boardLength, width: boardLength, parent:boardContainer}
        // let board = new Container(boardParams)
        // this.uiElements.push(board)
        //
        // let count = 0;
        // let spaceColor;
        // let blue = color(86,133,151)
        // let red = color(165,67,68)
        //
        // for (let i = 0; i < 3; i++){
        //     boardRowParams = {row: true, len: 3, index: i, parent:board}
        //     let boardRow = new Container(boardRowParams)
        //     this.uiElements.push(boardRow)
        //
        //     for (let j = 0; j < 3; j++){
        //         count % 2 ? spaceColor = blue : spaceColor = red;
        //         let boardSpaceParams = {row: false, len: 3, index: j, color: spaceColor, parent:boardRow}
        //         let boardSpace = new TicTacToeSpacePlay(boardSpaceParams)
        //         if (previousStatesObject){
        //             boardSpace.setSymbol(previousStatesObject.boardArray[count])
        //             boardSpace.setBoardState(previousStatesObject.boardArray)
        //         }
        //         this.uiElements.push(boardSpace)
        //         count++;
        //     }
        // }
    }
}

class BrainPart extends UIElement{
    constructor(parameterObject){
        super(parameterObject)
        this.pose1 = undefined;
        this.pose2 = undefined;
        this.blendAmount = 0;
        this.poseIsSet = false;

        if (this.pose1 && this.pose2){
            this.firstAnchorPointX = (this.blendAmount * (this.pose2.firstAnchorPoint.x - this.pose1.firstAnchorPoint.x) + this.pose1.firstAnchorPoint.x)
            this.firstAnchorPointY = (this.blendAmount * (this.pose2.firstAnchorPoint.y - this.pose1.firstAnchorPoint.y) + this.pose1.firstAnchorPoint.y)

            this.firstControlPointX = (this.blendAmount * (this.pose2.firstControlPoint.x - this.pose1.firstControlPoint.x) + this.pose1.firstControlPoint.x)
            this.firstControlPointY = (this.blendAmount * (this.pose2.firstControlPoint.y - this.pose1.firstControlPoint.y) + this.pose1.firstControlPoint.y)

            this.secondAnchorPointX = (this.blendAmount * (this.pose2.secondAnchorPoint.x - this.pose1.secondAnchorPoint.x) + this.pose1.secondAnchorPoint.x)
            this.secondAnchorPointY = (this.blendAmount * (this.pose2.secondAnchorPoint.y - this.pose1.secondAnchorPoint.y) + this.pose1.secondAnchorPoint.y)

            this.secondControlPointX = (this.blendAmount * (this.pose2.secondControlPoint.x - this.pose1.secondControlPoint.x) + this.pose1.secondControlPoint.x)
            this.secondControlPointY = (this.blendAmount * (this.pose2.secondControlPoint.y - this.pose1.secondControlPoint.y) + this.pose1.secondControlPoint.y)
            // console.log(this.firstAnchorPointX, this.firstAnchorPointY,
            //         this.firstControlPointX, this.firstControlPointY,
            //         this.secondAnchorPointX, this.secondAnchorPointY,
            //         this.secondControlPointX, this.secondControlPointY)
            }
            // use the smaller edge of the containing rectangle to scale the brainPart by some fraction
            this.scaleAmount = this.width < this.height ? this.width / (this.height)*.1 : this.height / (this.width)*.1;
            console.log(this.scaleAmount, this.width, this.height)
            // 1300 to 300
            // -300 / 1000
    }

    setPoses(dumbPose,smartPose){
        this.pose1 = smartPose;
        this.pose2 = dumbPose;
        this.poseIsSet = true;
    }

    setBlendAmount(blendAmount){
        this.blendAmount = blendAmount;
    }

    blend(){
        this.firstAnchorPointX = (this.blendAmount * (this.pose2.firstAnchorPoint.x - this.pose1.firstAnchorPoint.x) + this.pose1.firstAnchorPoint.x)
        this.firstAnchorPointY = (this.blendAmount * (this.pose2.firstAnchorPoint.y - this.pose1.firstAnchorPoint.y) + this.pose1.firstAnchorPoint.y)

        this.firstControlPointX = (this.blendAmount * (this.pose2.firstControlPoint.x - this.pose1.firstControlPoint.x) + this.pose1.firstControlPoint.x)
        this.firstControlPointY = (this.blendAmount * (this.pose2.firstControlPoint.y - this.pose1.firstControlPoint.y) + this.pose1.firstControlPoint.y)

        this.secondAnchorPointX = (this.blendAmount * (this.pose2.secondAnchorPoint.x - this.pose1.secondAnchorPoint.x) + this.pose1.secondAnchorPoint.x)
        this.secondAnchorPointY = (this.blendAmount * (this.pose2.secondAnchorPoint.y - this.pose1.secondAnchorPoint.y) + this.pose1.secondAnchorPoint.y)

        this.secondControlPointX = (this.blendAmount * (this.pose2.secondControlPoint.x - this.pose1.secondControlPoint.x) + this.pose1.secondControlPoint.x)
        this.secondControlPointY = (this.blendAmount * (this.pose2.secondControlPoint.y - this.pose1.secondControlPoint.y) + this.pose1.secondControlPoint.y)
    }

    draw(){
        push();
        stroke(0)
        fill(0)
        translate(this.parent.x,this.parent.y)
        // translate(0,0)
        // scale(.1);

        scale(this.scaleAmount);
        if (this.poseIsSet){
            bezier(this.firstAnchorPointX, this.firstAnchorPointY,
                    this.firstControlPointX, this.firstControlPointY,
                    this.secondAnchorPointX, this.secondAnchorPointY,
                    this.secondControlPointX, this.secondControlPointY)
        }
        pop();
    }
}

// for brain matter that isn't part of the face.
class Shape{
    constructor(x,y,width,height){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
    draw(){
        stroke(0);
        strokeWeight(1)
        noFill();
        ellipse(this.x,this.y,this.width)
    }
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

        this.boardState = ["!","!","!", "!","!","!", "!","!","!"]

        this.mouseClickfunc = this.playTurn
    }

    playTurn(){

        const LOOKUP = {'00':0, '01':1, '02':2,
                  '10':3, '11':4, '12':5,
                  '20':6, '21':7, '22':8}
        let key = str(this.parent.index) + str(this.index)
        let boardIndex = LOOKUP[key]

        // check to make sure the player has clicked on a valid space.
        if (this.boardState[boardIndex] == "!"){
        // commands are pushed into the array in reverse order that they occur
        let commands = []

        // query the backend to either generate a random move or an ai move
        let command = 'queryBackend'
        commands.push(command)

        // the ai player 'O' gets to go.
        command = 'o'
        commands.push(command)

        // user 'X' picks tictactoe square
        command = this.getSymbol(boardIndex)
        commands.push(command)
        return commands
        }
    }

    getSymbol(boardIndex){
        this.symbolIndex = 1
        this.currentSymbol = this.symbols[this.symbolIndex]
        return [boardIndex, this.currentSymbol.name]
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

class MenuButton extends Container{
    constructor(parameterObject){
        super(parameterObject)
        this.icon = new cycleViewIcon({parent:this})
    }
    draw(){
        super.draw();
        this.icon.draw()
    }
}

class cycleViewIcon extends Icon{
    constructor(parameterObject){
        super(parameterObject)
        this.test = 0;
    }

    draw(){
        push()
            translate(this.parent.width/2,this.parent.height/2)
            push()
                // rotate(radians(this.test+=frameRate()))
                rotate(radians(this.translateXAmount))
                translate(-17, -366);
                stroke(30);
                strokeWeight(3);
                noFill();
                arc(19, 367.3, 13, 13, QUARTER_PI + QUARTER_PI, 2*PI);//refresh circle
                strokeWeight(1);
                push();
                    translate(-39, 302);
                    rotate(radians(10));
                    fill(30);
                    triangle(75, 61, 70, 55, 80, 55); //refresh_triangle
                pop();
            pop();
        pop();

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

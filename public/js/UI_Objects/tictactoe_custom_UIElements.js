
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
        let infoTextBoxParams = {row: true, offsetX: infoArea.width/6, width:infoArea.width*2/3, parent:infoArea}
        let infoSection = new TextBox(infoTextBoxParams)
        infoSection.setString("input whose turn it is and the state of the board to recieve a suggestion")
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
        if (parameterObject){
            if (parameterObject.fontStyle){
                textFont(parameterObject.fontStyle)
            }
        }
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
        this.loadedImage = loadImage('../imgs/brain_base.png')
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

        let brainImageParams = {row:true, parent:cartoonSliderContainer, offsetY:-200}
        let brainImage = new ImageContainer(brainImageParams)
        if (parameterObject){
            if (parameterObject.loadedImage){
                let scaleAmount = cartoonSliderContainer.width < cartoonSliderContainer.height ? cartoonSliderContainer.width / 950 : cartoonSliderContainer.height / 950

                brainImage.setImageProps(parameterObject.loadedImage,382*scaleAmount,279*scaleAmount)
                brainImage.setImageOffsets(-120*scaleAmount,-100*scaleAmount)
            }
        }
        cartoonSliderContainer.uiElements.push(brainImage)

        // brainparts
        // https://github.com/jamiejamiebobamie/conway-gol/blob/6a9c8a80b3d6353af137a9569e3dc62e73b1ec86/public/js/sketch-playground.js

        let bottomLipParams = {row:true,parent:cartoonImageContainer}
        let bottomLip = new BrainPartBezier(bottomLipParams)
        let dumbPose, smartPose;

        dumbPose = {
            firstControlPoint:{x:130,y:211},
            firstAnchorPoint:{x:50,y:50},
            secondAnchorPoint:{x:366,y:143},
            secondControlPoint:{x:244,y:50}
            }
        smartPose = {
                firstControlPoint:{x:50,y:209},
                firstAnchorPoint:{x:50,y:50},
                secondAnchorPoint:{x:350,y:209},
                secondControlPoint:{x:350,y:50}
            }

        let bottomLipBezierCurves = {dumbPose:dumbPose,smartPose:smartPose}

        bottomLip.setPoses(bottomLipBezierCurves.dumbPose,bottomLipBezierCurves.smartPose)
        bottomLip.setBlendAmount(parameterObject.aiDifficulty)
        bottomLip.blend();
        cartoonSliderContainer.uiElements.push(bottomLip)

        let yTranslation = 150
        dumbPose = {
            firstControlPoint:{x:4,y:125-yTranslation},
            firstAnchorPoint:{x:54,y:209-yTranslation},
            secondAnchorPoint:{x:366,y:143-yTranslation},
            secondControlPoint:{x:198+47,y:199-yTranslation}
            }

        // bottom and top lips share the same smart pose :)
        let topLipBezierCurves = {dumbPose:dumbPose,smartPose:smartPose}

        let topLipParams = {row:true,parent:cartoonImageContainer}
        let topLip = new BrainPartBezier(topLipParams)
        topLip.setPoses(topLipBezierCurves.dumbPose,topLipBezierCurves.smartPose)
        topLip.setBlendAmount(parameterObject.aiDifficulty)
        topLip.blend();
        cartoonSliderContainer.uiElements.push(topLip)

        let eyeParams = {row:true, parent:cartoonSliderContainer, offsetX:cartoonSliderContainer.width/2.4, offsetY:cartoonSliderContainer.height/2.5}
        // leftEye from viewer's perspective... brain's right eye...
        let leftEye = new BrainPartEllipse(eyeParams)
        smartPose = {x:0,y:0}
        dumbPose = {x:5,y:-3}
        leftEye.setPoses(dumbPose, smartPose)
        leftEye.setBlendAmount(parameterObject.aiDifficulty)
        leftEye.blend();
        let isThinking = parameterObject ? parameterObject.isWaitingForResponse : false;
        leftEye.setThinking(isThinking);
        cartoonSliderContainer.uiElements.push(leftEye)

        // eyeParams = {row:true, parent:cartoonSliderContainer, offsetX:cartoonSliderContainer.width*.0005, offsetY:-390}
        // // leftEye from viewer's perspective... brain's right eye...
        // leftEye = new BrainPartEllipse(eyeParams)
        // smartPose = {x:-3,y:0}
        // dumbPose = {x:5,y:-3}
        // leftEye.setPoses(dumbPose, smartPose)
        // leftEye.setBlendAmount(parameterObject.aiDifficulty)
        // leftEye.blend();
        // cartoonSliderContainer.uiElements.push(leftEye)

        eyeParams = {row:true, parent:cartoonSliderContainer, offsetX:cartoonSliderContainer.width/1.9, offsetY:cartoonSliderContainer.height/2.5}//, offsetX:15, offsetY:-390}
        // brain's left eye
        let rightEye = new BrainPartEllipse(eyeParams)
        smartPose = {x:0,y:0}
        dumbPose = {x:-3,y:-3}
        rightEye.setPoses(dumbPose, smartPose)
        rightEye.setBlendAmount(parameterObject.aiDifficulty)
        rightEye.blend();
        isThinking = parameterObject ? parameterObject.isWaitingForResponse : false;
        rightEye.setThinking(isThinking);
        cartoonSliderContainer.uiElements.push(rightEye)


        // --------------------------------------------------------------------

        let sliderContainerParams = {row: true, len:3, index:2, height:cartoonSliderContainer.height/3, width:cartoonSliderContainer.width/1.5, offsetX: cartoonSliderContainer.width/6, offsetY:-cartoonSliderContainer.height/10, parent:cartoonSliderContainer}
        let sliderContainer = new Container(sliderContainerParams)
        this.uiElements.push(sliderContainer)
        let sliderParams = {row: true, parent:sliderContainer}
        let slider = new DifficultySlider(sliderParams)
        let difficulty = previousStatesObject ? previousStatesObject.aiDifficulty : 13;
        slider.setDifficulty(difficulty)
        this.uiElements.push(slider)

        let boardContainer = this.uiElements[1]
        let boardRowParams;

        let boardLength = 0;
        boardLength = boardContainer.height > boardContainer.width ? boardContainer.width/1.3 : boardContainer.height/1.3;

        let offsetX = boardContainer.width / 2 -  boardLength / 2
        let offsetY = boardContainer.height / 2 -  boardLength / 2

        let boardParams = {row: true, offsetX: offsetX, offsetY: offsetY, height: boardLength, width: boardLength, parent:boardContainer}
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

        // ------
        if (parameterObject){
            if (parameterObject.winner != null){
                let replayWindowParams = {row:portrait}
                let replayWindow = new ReplayWindow(replayWindowParams)
                replayWindow.setContext(this.uiElements)
                replayWindow.setMessage(parameterObject)
                this.uiElements.push(replayWindow)
            }
        }
    }
}

class BrainPart extends UIElement{
    constructor(parameterObject){
        super(parameterObject)
        this.pose1 = undefined;
        this.pose2 = undefined;
        this.blendAmount = 0;
        this.poseIsSet = false;
        // use the smaller edge of the containing rectangle to scale the brainPart by some fraction
        // this.scaleAmount = this.parent.width < this.parent.height ? this.parent.width / (this.parent.height) : this.parent.height / (this.parent.width);
        this.scaleAmount = this.width / 950

    }

    setPoses(dumbPose,smartPose){
        this.pose1 = smartPose;
        this.pose2 = dumbPose;
        this.poseIsSet = true;
    }

    setBlendAmount(blendAmount){
        this.blendAmount = (blendAmount-45)/100;
    }

    blend(){}
    draw(){}
}

class BrainPartEllipse extends BrainPart{
    constructor(parameterObject){
        super(parameterObject)
        // this.ellipseScelera = ellipse(this.x,this.y,50)
        // this.ellipsePupil = ellipse(this.x,this.y,30)
        this.sceleraX = 0
        this.sceleraY = 0

        this.sceleraYAddition = 0
        // use the smaller edge of the containing rectangle to scale the brainPart by some fraction
        // console.log("width",this.parent.width, "height",this.parent.height)
        // this.scaleAmount = this.parent.width < this.parent.height ?  this.parent.width / 950 : this.parent.height / 1200;
        this.scaleAmount = this.parent.width < this.parent.height ? this.width / 950 : this.height / 950


    }

    // use lerp()
    blend(){
        this.sceleraX += (this.pose2.x - this.pose1.x) * this.blendAmount + this.pose1.x
        this.sceleraY += (this.pose2.y - this.pose1.y) * this.blendAmount + this.pose1.y
        // console.log(this.pose1, this.pose2, this.blendAmount)
    }

    // use lerp()
    setThinking(isThinking){
        this.sceleraYAddition = isThinking ? -4 : 0;
    }

    draw(){
        push();
            scale(this.scaleAmount);
            fill(230)
            ellipse(this.x/this.scaleAmount,this.y/this.scaleAmount,40)
            fill(30)
            ellipse((this.x+this.sceleraX*this.scaleAmount)/this.scaleAmount,(this.y+this.sceleraY*this.scaleAmount+this.sceleraYAddition)/this.scaleAmount,20)
        pop();

    }
}

class BrainPartBezier extends BrainPart{
    constructor(parameterObject){
        super(parameterObject)

        if (this.pose1 && this.pose2){
            this.firstAnchorPointX = (this.blendAmount * (this.pose2.firstAnchorPoint.x - this.pose1.firstAnchorPoint.x) + this.pose1.firstAnchorPoint.x)
            this.firstAnchorPointY = (this.blendAmount * (this.pose2.firstAnchorPoint.y - this.pose1.firstAnchorPoint.y) + this.pose1.firstAnchorPoint.y)

            this.firstControlPointX = (this.blendAmount * (this.pose2.firstControlPoint.x - this.pose1.firstControlPoint.x) + this.pose1.firstControlPoint.x)
            this.firstControlPointY = (this.blendAmount * (this.pose2.firstControlPoint.y - this.pose1.firstControlPoint.y) + this.pose1.firstControlPoint.y)

            this.secondAnchorPointX = (this.blendAmount * (this.pose2.secondAnchorPoint.x - this.pose1.secondAnchorPoint.x) + this.pose1.secondAnchorPoint.x)
            this.secondAnchorPointY = (this.blendAmount * (this.pose2.secondAnchorPoint.y - this.pose1.secondAnchorPoint.y) + this.pose1.secondAnchorPoint.y)

            this.secondControlPointX = (this.blendAmount * (this.pose2.secondControlPoint.x - this.pose1.secondControlPoint.x) + this.pose1.secondControlPoint.x)
            this.secondControlPointY = (this.blendAmount * (this.pose2.secondControlPoint.y - this.pose1.secondControlPoint.y) + this.pose1.secondControlPoint.y)
        }

        this.scaleOffset = 7
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

        // this.scaleOffset = *-this.blendAmount + 7
    }

    draw(){
        push();
        stroke(35);
        // i need the strokeWeight to decrease as I scale up the this.blendAmount
        strokeWeight(this.blendAmount*50+45);
        // only fill in the bezier curve if dumb pose (i.e. if mouth is open)
        if (this.blendAmount < .5){
            strokeWeight(this.blendAmount*50+45);
            noFill();
        } else {
            strokeWeight(70.22-70.22*this.blendAmount+30);
            // fill(40);
            fill(130,50,47);

        }

        // testing
        translate(this.x+this.parent.width/2-(this.secondAnchorPointX - this.firstAnchorPointX)*this.scaleAmount/this.scaleOffset,this.parent.height*2/3)//this.y+this.parent.height/3)
        scale(this.scaleAmount/this.scaleOffset);
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
        // this.mouseClickfunc = this.getDifficulty
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
        // console.log(difficulty)
        difficulty *= 100
        return [int(difficulty)];
    }
}


class ReplayWindow extends Container{
    constructor(parameterObject){
        super(parameterObject)
        this.message = undefined;
        this.context = undefined
        this.doOnce = true;
    }

    displayContent(){
        let replayScreenParams = {row:true, width:parent.width/1.5, color: 'white', height:parent.height/1.5, offsetX: parent.width/6, offsetY: parent.height/6}
        let replayScreen = new Container(replayScreenParams)
        replayScreen.setStroke(true)
        this.context.push(replayScreen)

        let gameOverMessageParams = {row:true, height:replayScreen.height*2/3, parent:replayScreen}
        let gameOverMessage = new TextBox(gameOverMessageParams)
        gameOverMessage.setString(this.message)
        gameOverMessage.setTextColor(30)
        this.context.push(gameOverMessage)

        let buttonsRowParams = {row:true, len:3, index:2, parent: replayScreen}
        let buttonRow = new Container(buttonsRowParams)
        this.context.push(buttonRow)

        let replayButtonContainerParams;
        let replayButtonContainer;
        for (let i =0; i < 2; i++){
            replayButtonContainerParams = {row:this.row, len:2, index:i, parent: buttonRow}
            replayButtonContainer = new Container(replayButtonContainerParams)
            this.context.push(replayButtonContainer)
        }

        let playAgainButtonContainer = this.context[this.context.length-2]
        let exitButtonContainer = this.context[this.context.length-1]

        let playAgainButtonParams = {row: true, offsetX: playAgainButtonContainer.width/6, offsetY: playAgainButtonContainer.height/4, width:playAgainButtonContainer.width/1.5, height:playAgainButtonContainer.height/2, parent:playAgainButtonContainer, mouseClickfunc:this.playAgain}
        let playAgainButton = new TextBox(playAgainButtonParams)
        playAgainButton.setString("play again")
        playAgainButton.setTextColor(30)
        playAgainButton.setStroke(true)
        this.context.push(playAgainButton)

        let exitButtonParams = {row: true, offsetX: exitButtonContainer.width/6, offsetY: exitButtonContainer.height/4, width:exitButtonContainer.width/1.5, height:exitButtonContainer.height/2, parent:exitButtonContainer, mouseClickfunc:this.exit}
        let exitButton = new TextBox(exitButtonParams)
        exitButton.setString("exit")
        exitButton.setTextColor(30)
        exitButton.setStroke(true)
        this.context.push(exitButton)
    }

    setContext(context){
        this.context = context
    }

    setMessage(parameterObject){
        let message;
        switch(parameterObject.winner){
            case 1:
            message = "you won";
            break;
            case 0:
            message = "the a.i. won";
            break;
            case -1:
            message = "tie";
            break;
            default:
            message = "wtf";
            break;
        }
        this.message = message;
    }

    playAgain(){
        return ["replay"]
    }

    exit(){
        return ["exit"]
    }

    draw(){
        super.draw();

        if (this.doOnce && this.context){
            this.displayContent()
            this.doOnce = false;
        }
        for (let i = 0; i < this.uiElements.length; i++){
             this.uiElements[i].draw()
        }
    }
}

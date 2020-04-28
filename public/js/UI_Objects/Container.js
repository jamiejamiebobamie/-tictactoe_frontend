class Container extends UIElement{
    constructor(parameterObject) {
        super(parameterObject);
        this.hasStroke = false;
        this.hasFill = false;
    }
    // containers can be clicked
    testForClick(){
        if (mouseX > this.x
            && mouseX < this.x + this.width
            && mouseY > this.y
            && mouseY < this.y + this.height){
            return true;
        }
    }
    performClickFunctionality(){
        if (this.mouseClickfunc){
            return this.mouseClickfunc()
        }
    }
    setStroke(bool){
        this.hasStroke = bool
    }

    setFill(bool){
        this.hasFill = bool
    }
    draw() {
        push();
            translate(this.translateXAmount,0)
            this.hasStroke ? stroke(45) : noStroke();
            this.hasFill ? fill(45) : noFill();
            this.color ? fill(this.color) : noFill();
            rect(this.x,this.y,this.width,this.height)
            for (let i = 0; i < this.uiElements.length; i++){
                if (this.uiElements[i].draw){
                    this.uiElements[i].draw();
                }
            }
        pop();
    }
}

class ImageContainer extends Container{
    constructor(paramsObject){
        super(paramsObject)
        // set with member functions.
        this.loadedImg = undefined
        this.imageWidth = undefined
        this.imageHeight = undefined
        // maybe change. the placement of the image is reliant on the parent's
            // dimensions and centers the image in the middle of the parent
            // height and width. makes more sense to be centered in the middle of its own container...
        this.imageX = this.parent ? this.parent.x + this.parent.width/2 : windowWidth/2
        this.imageY = this.parent ? this.parent.y + this.parent.height/2 : windowHeight/2

        this.offsetX = 0;
        this.offsetY = 0;
    }
    // images can exceed the bounds of their container
    setImageProps(loadedImg,imageWidth,imageHeight){
        this.loadedImg = loadedImg
        this.imageWidth = imageWidth
        this.imageHeight = imageHeight
    }
    setImageOffsets(offsetX,offsetY){
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
    // needs to be called every frame.
    redrawImage() { image(this.loadedImg, this.imageX+this.offsetX, this.imageY+this.offsetY, this.imageWidth, this.imageHeight); }
    draw() {
        push();
            translate(this.translateXAmount,0)
            if (this.loadedImg){
                this.redrawImage()
            }
        pop();
    }
}

class TextBox extends Container{
    constructor(parameterObject){
        super(parameterObject)
        // set with member functions.
        this.text = undefined
        this.textColor = undefined;
        // this.row determines the orientation of the font.
        // use the orientation of the parent container for aligning
            // normally-oriented text, vertically.
        this.textSize = this.row ? this.width / 10 : this.height / 20
        if (this.textSize * 2.5 > this.height && this.row){this.textSize = this.width / 20}
        textSize(this.textSize);
        // alignement options cannot be set after instantiation.
            // subclass to change the alignment:
            // ( horizAlign: LEFT, CENTER, or RIGHT,
            //   vertAlign:  TOP, BOTTOM, CENTER, or BASELINE )
        this.align = [CENTER,CENTER]
        textAlign(this.align[0],this.align[1]);
    }
    // call this after instantiating the object to set the text
    setString(s) { this.text = s }
    // call this after instantiating the object to set the text color
    setTextColor(color) { this.textColor = color }
    drawRotatedTextBox(){
        push();
            super.draw()
            translate(this.x,this.y)
            rotate(radians(90))
            if (this.text){
                if (this.textColor){
                    fill(this.textColor)
                }
                if (parameterObject){
                    if (parameterObject.fontStyle){
                        textFont(parameterObject.fontStyle)
                    }
                }
                text(this.text, 0, -this.width, this.height, this.width)
            }
        pop();
    }
    drawNormalTextBox(){
        super.draw()
        if (this.text){
            if (this.textColor){
                fill(this.textColor)
            }
            if (parameterObject){
                if (parameterObject.fontStyle){
                    textFont(parameterObject.fontStyle)
                }
            }
            text(this.text, this.x, this.y, this.width, this.height)
        }
    }
    draw() {
        push();
            translate(this.translateXAmount,0)
            this.row ? this.drawNormalTextBox() : this.drawRotatedTextBox()
        pop();
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

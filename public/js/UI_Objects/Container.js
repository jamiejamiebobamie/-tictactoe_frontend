class Container extends UIElement{
    constructor(parameterObject) {
        super(parameterObject);
        this.isDragging = false;
        // this is the current amount the element has been dragged from
            // its original position
        this.dragOffsetX = undefined;
        this.dragOffsetY = undefined;

        this.borderRadius = {topLeft:0, topRight:0, bottomRight:0, bottomLeft:0};

        // the x and y coordinates of all UI elements are anchored at the top left
            // corner.
            // when clicked, the element needs to take this into account.
        if (!this.hasBeenDragged){
            this.draggedX = undefined
            this.draggedY = undefined
            this.ratioX = 1
            this.ratioY = 1
        } else {
            this.x = this.draggedX * windowWidth/this.ratioX
            this.y = this.draggedY * windowHeight/this.ratioY
        }
    }
// https://p5js.org/learn/program-flow.html
//     mouseOver() - Code inside this block is run once after every time a mouse moves onto the element.
// mouseOut() - Code inside this block is run once after every time a mouse moves off the element

    performClickFunctionality(){
        if (this.mouseClickfunc){
            return this.mouseClickfunc()
        }
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

    // containers can be clicked
    testForBounds(x,y,object){
        if (x + this.dragOffsetX > object.x
            && x + this.dragOffsetX < object.x + object.width - this.width
            && y + this.dragOffsetY > object.y
            && y + this.dragOffsetY < object.y + object.height - this.height){
            return true;
        }
    }

    // containers can be dragged to change their position
    userDrag(){
        if (this.dragOffsetX == undefined){
            this.dragOffsetX = this.x - mouseX;
            this.dragOffsetY = this.y - mouseY;
        }

        // only drag the object within the bounds of its parent
        let canvasObject = {x: 0, y: 0, width:windowWidth, height: windowHeight};
        let parent = this.parent || canvasObject;
        if ( this.testForBounds(mouseX,mouseY,parent) ) {
            this.x = mouseX + this.dragOffsetX;
            this.y = mouseY + this.dragOffsetY;
            this.draggedX = this.x
            this.draggedY = this.y
            let parentWidth = this.parent ? this.parent.width : windowWidth
            let parentHeight = this.parent ? this.parent.height : windowHeight
            this.ratioX = this.x/parentWidth
            this.ratioY = this.y/parentHeight
            this.hasBeenDragged = true;
        }
    }

    performDragFunctionality(){
        if(this.mouseDragfunc){
            console.log(this.mouseDragfunc)
            return this.mouseDragfunc();
        }
    }

    performValuesResetAfterDrag(){
        this.dragOffsetX = undefined;
        this.dragOffsetY = undefined;
    }

    draw() {
        push()
        translate(this.swipeAmount,0)
        if (this.isDragging){
            this.userDrag();
        }

        // testing to show the bounds of the container
        stroke(30);
        fill(this.color);
        // noFill();
        rect(this.x,this.y,this.width,this.height)
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

        return [LOOKUP[boardIndex], this.currentSymbol.name]
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

        return this.currentSymbol.name
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

class ImageContainer extends Container{
    constructor(paramsObject){
        super(paramsObject)
        this.loadedImg = undefined
        this.imageWidth = undefined
        this.imageHeight = undefined
        this.imageX = this.parent ? this.parent.x + this.parent.width/2 : windowWidth/2
        this.imageY = this.parent ? this.parent.y + this.parent.height/2 : windowHeight/2
    }

    setImageProps(loadedImg,imageWidth,imageHeight){
        this.loadedImg = loadedImg
        this.imageWidth = imageWidth
        this.imageHeight = imageHeight
    }

    redrawImage(){
        image(this.loadedImg, this.imageX, this.imageY, this.imageWidth, this.imageHeight);
    }

    draw(){
        if (this.loadedImg){
            this.redrawImage()
        }
    }
}

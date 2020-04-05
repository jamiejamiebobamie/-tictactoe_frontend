class Container extends UIElement{
    constructor(parameterObject) {
        super(parameterObject);
        this.isDragging = false;
        // this is true if the element has ever been dragged from its original position
        this.hasBeenDragged = false;
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

    performValuesResetAfterDrag(){
        this.dragOffsetX = undefined;
        this.dragOffsetY = undefined;
    }

    draw() {
        if (this.isDragging){
            this.userDrag();
        }

        // testing to show the bounds of the container
        stroke(30);
        fill(this.color);
        // noFill();
        rect(this.x,this.y,this.width,this.height,
            this.borderRadius.topLeft,this.borderRadius.topRight,
            this.borderRadius.bottomRight,this.borderRadius.bottomLeft)
    }
}

class TicTacToeSpaceSuggest extends Container{
    constructor(parameterObject){
        super(parameterObject)
        this.currentSymbol = new NullIcon({parent: this})
        this.symbols = [new NullIcon({parent: this}), new X({parent: this}), new O({parent: this})]
        this.symbolIndex = 0;

        this.mouseClickfunc = this.incrementSymbol
    }

    incrementSymbol(){
        /*
        parent(i):         0       1       2
         index(j):         0       1       2

        00 01 02 10 11 12 20 21 22
        1  2  3  4  5  6   7  8  9
        */
        const LOOKUP = {'00':0, '01':1, '02':2,
                  '10':3, '11':4, '12':5,
                  '20':6, '21':7, '22':8}

        this.symbolIndex < 2 ? this.symbolIndex++ : this.symbolIndex = 0
        this.currentSymbol = this.symbols[this.symbolIndex]
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

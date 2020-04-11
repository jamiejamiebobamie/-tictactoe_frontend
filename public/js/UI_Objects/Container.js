class Container extends UIElement{
    constructor(parameterObject) {
        super(parameterObject);
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

    draw() {
        stroke(30);
        this.color ? fill(this.color) : noFill();
        rect(this.x,this.y,this.width,this.height)
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

    // images can exceed the bounds of the container
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

class TextBox extends Container{
    constructor(parameterObject){
        super(parameterObject)

        this.align = [CENTER,CENTER]

        // this.row determines the orientation of the font.
        // use the orientation of the parent container for aligning
            // normally-oriented text, vertically.

        if (this.row){
            // draws text horizontally
            this.textSize = this.width / 20
        } else {
            // draws text vertically
            this.textSize = this.height / 20
        }

        this.text = undefined
        this.textColor = undefined;

        textSize(this.textSize);
        textAlign(this.align[0],this.align[1]);

        // not using...
        this.chars = 1
        this.valuesChanged = false
    }

    setString(s){
        this.chars += s.length
        this.text = s
    }

    setTextColor(color){
        this.textColor = color
    }

    drawRotatedTextBox(){
        push();
            super.draw()
            translate(this.x,this.y)
            rotate(radians(90))
            if (this.text){
                if (this.textColor){
                    fill(this.textColor)
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
            text(this.text, this.x, this.y, this.width, this.height)
        }
    }
    draw(){
        if (this.row){
            this.drawNormalTextBox();
        } else {
            this.drawRotatedTextBox()
        }
    }
}

class DraggableContainer extends Container{
    constructor(parameterObject){
        super(parameterObject)

        this.isDragging = false;
        this.hasBeenDragged = false; // this is doing nothing.

        // this is the current amount the element has been dragged from
            // its original position
        this.dragOffsetX = undefined;
        this.dragOffsetY = undefined;

        // the x and y coordinates of all container are anchored at the top left
        // corner. when clicked, the element needs to take this into account.
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

    // containers can only move around inside the bounds of their parent
        // containers.
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

    // performDragFunctionality(){
    //     if(this.mouseDragfunc){
    //         console.log(this.mouseDragfunc)
    //         return this.mouseDragfunc();
    //     }
    // }

    performValuesResetAfterDrag(){
        this.dragOffsetX = undefined;
        this.dragOffsetY = undefined;
    }

    draw(){
        super.draw()
        if (this.isDragging){
            this.userDrag();
        }
    }
}

// not working... in progress.
class ScalableContainer extends Container{
    constructor(parameterObject){
        super(parameterObject)
        this.uiElements = [];

        let lol = ScalableContainer.prototype.topLeftButtonMouseDrag.bind(this);
        let hey = ScalableContainer.prototype.topLeftButtonMouseDrag.call(this);

        let params = {offsetX:-this.width/2, offsetY: -this.height/2, width:15, parent:this, mouseClickfunc:hey}
        let topLeftButton = new DraggableButton(params);
        this.uiElements.push(topLeftButton)

        params = {offsetX: this.x-this.width/2, offsetY:-this.height/2, width:15, parent:this, mouseClickfunc:lol}
        let topRightButton = new DraggableButton(params);
        this.uiElements.push(topRightButton)
        //
        params = {offsetX:-this.width/2, offsetY:this.y-this.height/2, width:15, parent:this, mouseClickfunc:this.bottomLeftButtonMouseDrag}
        let bottomLeftButton = new DraggableButton(params);
        this.uiElements.push(bottomLeftButton)
        //
        params = {offsetX: this.width-this.width/2, offsetY: this.height-this.height/2, width:15, parent:this, mouseClickfunc:this.bottomRightButtonMouseDrag}
        let bottomRightButton = new DraggableButton(params);
        this.uiElements.push(bottomRightButton)

        // this.color = undefined;

        // https://gist.github.com/zcaceres/2a4ac91f9f42ec0ef9cd0d18e4e71262

        // This binding is necessary to make `this` work in the callback
        // var runner = { name: 'John', myFavoriteActivity: 'running' };

        // console.log(topLeftButton)
    }

    // this isn't going to work how i want it to...
    // this moves the entire container.
    // i want the respective corners to be locked if
    // the user is not decreasing the container along that axis
    topLeftButtonMouseDrag(){
        this.width= 300// -= this.x - mouseX
        this.height=600// -= this.y - mouseY
        // this.x = mouseX
        // this.y = mouseY
        console.log(this)
        // return 'hey'
    }

    topRightButtonMouseDrag(){
        // this.x = mouseX - this.x
        this.y = mouseY
        this.width -= mouseX - this.x
        this.height -= this.y + mouseY
    }

    bottomLeftButtonMouseDrag(){
        this.x = mouseX
        this.height = mouseY - this.y
    }

    bottomRightButtonMouseDrag(){
        this.width = mouseX - this.x
        this.height = mouseY - this.y
    }

    // mouseReleased(){
    //     console.log('hey')
    //     for (let i = 0; i < this.uiElements.length; i++){
    //         this.uiElements[i].isDragging = false;
    //     }
    // }
    //
    // mousePressed(){
    //     for (let i = 0; i < this.uiElements.length; i++){
    //         if (this.uiElements[i].testForClick()){
    //             this.uiElements[i].isDragging = true;
    //         }
    //     }
    //     return true
    // }

    draw(){
        stroke(100);
        noFill();
        super.draw();
        fill(256);
        for (let i = 0; i < this.uiElements.length; i++){
            this.uiElements[i].draw();
            let hey = this.uiElements[i].performClickFunctionality()
            if (hey){
                console.log(hey)
                // this.uiElements[i].performClickFunctionality()
                // this.uiElements[i].isDragging = false;
            }
        }
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

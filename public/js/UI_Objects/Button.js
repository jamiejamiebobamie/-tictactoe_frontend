class Button extends UIElement{
    constructor(parameterObject) {
        super(parameterObject);
        this.parent = this.parent || new Container()

        // this.width = width || this.parent.height/1.1;
        this.mouseOver = false;
        this.mouseOverColor = 'pink'; // testing


        let offsetX;
        let offsetY;
        if (!this.row) {
            offsetX = this.parent.width/this.len/2;
            offsetY = this.parent.height/2;
        } else {
            offsetX = this.parent.width/2;
            offsetY = this.parent.height/this.len/2;
        }
        this.x += offsetX;
        this.y += offsetY;

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
        if (this.mouseClickfunc) {
            return this.mouseClickfunc();
        }
    }

    performDragFunctionality(){}

    testForClick() {
        if (mouseX > this.x - this.width
            && mouseX < this.x + this.width
            && mouseY > this.y - this.width
            && mouseY < this.width + this.y){
                return true;
        }
    }

    testForMouseOver(mouseX, mouseY) {
        if (mouseX > this.x - this.width
            && mouseX < this.x + this.width
            && mouseY > this.y - this.width
            && mouseY < this.width + this.y)
        {
            return true;
        } else {
            return false;
        }
    }

    draw() {
        // this.mouseOver ? fill(this.mouseOverColor) : fill(this.color);
        ellipse(this.x, this.y, this.width)
    }
}

class DraggableButton extends Button{
    constructor(paramsObject){
        super(paramsObject)
        this.isDragging = false;
        this.mouseDragfunc = this.userDrag
    }

    performClickFunctionality(){}

    // performDragFunctionality(){
    //     if(this.mouseDragfunc){
    //         return this.mouseDragfunc();
    //     }
    // }

    userDrag(){
        this.x = mouseX;
        this.y = mouseY;
    }

    draw(){
        super.draw();
        if (this.isDragging){
            this.userDrag();
        }
}
}


class ThrowableButton extends Button{
    constructor(paramsObject){
        super(paramsObject)
        this.isDragging = false;
        this.mouseDragfunc = this.userDrag
        this.frameOne = undefined
        this.frameTwo = undefined

    }

    performClickFunctionality(){}

    // performDragFunctionality(){
    //     if(this.mouseDragfunc){
    //         return this.mouseDragfunc();
    //     }
    // }

    recordVector(){
        this.frameOne = frameRate()
        this.frameTwo = frameRate()
        this.frameOne
    }

    userDrag(){
        this.x = mouseX;
        this.y = mouseY;
    }

    draw(){
        super.draw();
        if (this.isDragging){
            this.userDrag();
        }
}
}

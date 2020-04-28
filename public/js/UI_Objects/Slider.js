class Slider extends UIElement{
    constructor(parameterObject){
        super(parameterObject);

        this.parent ? this.parent : this.parent = new Container({row: this.row, width:this.width, height: this.height})
        this.width = 20;
        // this.mouseOver = false;

        this.isDragging = false;
        this.userDragButtonAmount = 0;

        // testing
        this.color = 'black';
        // this.mouseOverColor = 'blue';

        // the placement of the button on the canvas based on the orientation
            //  and the bounds of the container.
        if (this.row){
            this.offset = this.parent.width/10
            this.buttonX = this.offset + this.parent.x
            this.buttonY = this.parent.height/(this.len*2) + this.index * this.parent.height / this.len + this.parent.y
            this.sliderX = this.buttonX
            this.sliderY = this.buttonY - 2
            this.sliderWidth = this.parent.width - this.offset*2;
            this.sliderHeight = this.width/4;
        } else {
            this.offset = this.parent.height/10
            this.buttonX = this.parent.width/(this.len*2) + this.index * this.parent.width / this.len + this.parent.x;
            this.buttonY = this.offset + this.parent.y;
            this.sliderX = this.buttonX - 2
            this.sliderY = this.buttonY
            this.sliderWidth = this.width/4;
            this.sliderHeight = this.parent.height - this.parent.height/10 - this.offset;
        }
    }

    testForClick(){
        if (mouseX > this.buttonX - this.width
            && mouseX < this.buttonX + this.width
            && mouseY > this.buttonY - this.width
            && mouseY < this.width + this.buttonY){
            return true;
        }
    }

    // testForMouseOver(mouseX, mouseY){
    //     if (mouseX > this.buttonX - this.width/2
    //         && mouseX < this.buttonX + this.width/2
    //         && mouseY > this.buttonY - this.width/2
    //         && mouseY < this.width/2 + this.buttonY){
    //             return true
    //     } else {
    //         return false
    //     }
    // }

    userDrag(){
            if (this.row){
                if ( this.sliderX < mouseX && mouseX < this.sliderWidth+this.sliderX){
                        this.buttonX = mouseX;
                }
            } else {
                if ( this.sliderY - 5 < mouseY && mouseY < this.sliderHeight+this.sliderY){
                this.buttonY = mouseY;
            }
        }
    }

    // a slider within a draggable container isn't going to work...
    performClickFunctionality(){
        this.isDragging = true;
        if(this.mouseClickfunc){
            return this.mouseClickfunc();
        }
    }

    // on mouseReleased(), stop dragging the container, update the ratio,
        // reset the dragOffsets, and return the ratio to be stored on the top-level.
    performDragFunctionality(){
        // this.isDragging = false;
        if(this.mouseDragfunc){
            return this.mouseDragfunc();
        }
    }

    draw(){
        if (this.isDragging){
            this.userDrag();
        }
        push();
            translate(this.translateXAmount,0)
            // stroke(90);
            noStroke();
            // fill(256);
            fill(230);

            // slider groove
            rect(this.sliderX, this.sliderY, this.sliderWidth, this.sliderHeight, 30);
            // slider button
            stroke(90);
            fill(256);

            ellipse(this.buttonX, this.buttonY, this.width);
        pop();
    }

}

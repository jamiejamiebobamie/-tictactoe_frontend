class Slider extends UIElement{
    constructor(parameterObject){
        super(parameterObject);
        this.parent ? this.parent : this.parent = new Container({row: this.row, width:this.width, height: this.height})
        this.width = 20;
        this.isDragging = false;
        this.userDragButtonAmount = 0;
        this.color = 0;
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
    performClickFunctionality(){
        this.isDragging = true;
        if(this.mouseClickfunc){
            return this.mouseClickfunc();
        }
    }
    performDragFunctionality(){
        if(this.mouseDragfunc){
            return this.mouseDragfunc();
        }
    }
    draw(){
        if (this.isDragging){
            this.userDrag();
        }
        push();
            // slider groove
            noStroke();
            fill(230);
            rect(this.sliderX, this.sliderY, this.sliderWidth, this.sliderHeight, 30);

            // slider button
            stroke(90);
            fill(256);
            ellipse(this.buttonX, this.buttonY, this.width);
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
        difficulty *= 100
        return [int(difficulty)];
    }
}

class Slider extends UIElement{
    constructor(parameterObject){
        super(parameterObject);

        this.width = 20;
        this.mouseOver = false;
        this.isDragging = false;
        this.userDragButtonAmount = 0;

        // testing
        this.color = 'black';
        this.mouseOverColor = 'blue';

        // the placement of the button on the canvas based on the orientation
            //  and the bounds of the container.
        let widthOfContainer = this.parent ? this.parent.width : windowWidth;
        let heightOfContainer = this.parent ? this.parent.height : windowHeight;
        let userDragButton;

        if (this.row){

            this.offset = widthOfContainer/10

            this.buttonX = userDragButton || this.offset + this.parent.x
            this.buttonY = heightOfContainer/(this.len*2) + this.index * heightOfContainer / this.len + this.parent.y

            this.sliderX = this.offset
            this.sliderY = this.buttonY - 2

            this.sliderWidth = widthOfContainer - this.offset*2;
            this.sliderHeight = this.width/4;

        } else {

            this.offset = heightOfContainer/10

            this.buttonX = widthOfContainer/(this.len*2) + this.index * widthOfContainer / this.len + this.parent.x;
            this.buttonY = userDragButton | this.offset + this.parent.y;

            this.sliderX = this.buttonX
            this.sliderY = this.offset

            this.sliderWidth = this.width/4;
            this.sliderHeight = heightOfContainer - heightOfContainer/10 - this.offset;

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

    testForMouseOver(mouseX, mouseY){
        if (mouseX > this.buttonX - this.width/2
            && mouseX < this.buttonX + this.width/2
            && mouseY > this.buttonY - this.width/2
            && mouseY < this.width/2 + this.buttonY){
                return true
        } else {
            return false
        }
    }

    userDrag(){
        let portrait = true;
            if (this.row == portrait){
                if ( this.offset < mouseX && mouseX < this.sliderWidth+this.offset){
                        this.buttonX = mouseX;
                }
            } else {
                if ( this.offset - 5 < mouseY && mouseY < this.sliderHeight+this.offset){
                this.buttonY = mouseY;
            }
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

        stroke(90);
        fill(256);
        // slider groove
        rect(this.sliderX, this.sliderY, this.sliderWidth, this.sliderHeight, 30);
        // slider button
        ellipse(this.buttonX, this.buttonY, this.width);
    }

}


class DifficultySlider extends Slider{
    constructor(parameterObject){
        super(parameterObject)

        this.mouseDragfunc = this.getDifficulty
    }

    getDifficulty(){
        let difficulty = this.row ? this.buttonX / this.sliderWidth : this.buttonY / this.sliderHeight
        difficulty *= 10
        // scale of 0 to 10
        return int(difficulty) - 1;
    }
}

class Container extends UIElement{
    constructor(parameterObject) {
        super(parameterObject);


     this.mouseClickfunc = () => {console.log('test')}
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

    draw() {
        stroke(30);
        this.color ? fill(this.color) : noFill();
        rect(this.x,this.y,this.width,this.height)
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
            // height and width.
        this.imageX = this.parent ? this.parent.x + this.parent.width/2 : windowWidth/2
        this.imageY = this.parent ? this.parent.y + this.parent.height/2 : windowHeight/2
    }
    // images can exceed the bounds of the container
    setImageProps(loadedImg,imageWidth,imageHeight){
        this.loadedImg = loadedImg
        this.imageWidth = imageWidth
        this.imageHeight = imageHeight
    }
    // needs to be called every frame.
    redrawImage(){
        image(this.loadedImg, this.imageX, this.imageY, this.imageWidth, this.imageHeight);
    }
    draw() { if (this.loadedImg) { this.redrawImage() } }
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
        this.row ? this.textSize = this.width / 20 : this.textSize = this.height / 20
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
    draw() { this.row ? this.drawNormalTextBox() : this.drawRotatedTextBox() }
}

class DraggableContainer extends Container{
    constructor(parameterObject){
        super(parameterObject)

        // controls the userDrag
        this.isDragging = false;

        // set the parent object
        let canvasObject = {x: 0, y: 0, width:windowWidth, height: windowHeight};
        this.parent = this.parent || canvasObject;

        // stores where on the container you have clicked relative to the container's
            // this.x and this.y (the top-left corner)
        this.dragOffsetX = undefined;
        this.dragOffsetY = undefined;

        // the ratio of the container's position (this.x,this.y)
            // relative to the bounds of its parent
        this.ratioX = this.x/parent.width
        this.ratioY = this.y/parent.height

        // return the container's placement within its parent as a ratio
        this.mouseDragfunc = () => { return { ratioX:this.ratioX, ratioY:this.ratioY }; }
    }

    // containers can only move around inside the bounds of their parent.
    testForBounds(x,y){
        if (x + this.dragOffsetX > this.parent.x
            && x + this.dragOffsetX < this.parent.x + this.parent.width - this.width
            && y + this.dragOffsetY > this.parent.y
            && y + this.dragOffsetY < this.parent.y + this.parent.height - this.height){
            return true;
        }
    }

    // drag functionality.
    userDrag(){
        // stores where you're grabbing the container relative to the container's
            // top-left corner (top-left corner = this.x, this.y)
        if (this.dragOffsetX == undefined){
            this.dragOffsetX = this.x - mouseX;
            this.dragOffsetY = this.y - mouseY;
        }

        // drag the container within the bounds of the parent
        if ( this.testForBounds(mouseX, mouseY, parent) ) {
            this.x = mouseX + this.dragOffsetX;
            this.y = mouseY + this.dragOffsetY;
        }
    }

    // update the ratio when user is finished dragging.
    updateRatio(){
        this.ratioX = this.x/parent.width
        this.ratioY = this.y/parent.height
    }

    // a slider within a draggable container isn't going to work...
    performClickFunctionality(){
        this.isDragging = true;
    }

    // on mouseReleased(), stop dragging the container, update the ratio,
        // reset the dragOffsets, and return the ratio to be stored on the top-level.
    performDragFunctionality(){
        this.isDragging = false;
        this.updateRatio();
        this.performValuesResetAfterDrag();
        if(this.mouseDragfunc){
            return this.mouseDragfunc();
        }
    }

    // call this method to set the state (the dragged position) after it is lost
        // when you resize the window or change the view.
    setContainerPositionFromRatio(ratioX, ratioY){
        this.x = windowWidth/ratioX
        this.y = windowHeight/ratioY
    }

    // erases the grab offset from the last time you grabbed it,
        // allowing you to grab the container at different places each time.
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

class SwipableContainer extends DraggableContainer{
    constructor(parameterObject){
        super(parameterObject)
    }
    /*
    two types:
        "slideshow"
            user drags the element. it moves along the x axis.
            when the user releases the element, if it is beyond some amount (start_mouseX - end_mouseX)
            that is relative to the size of the container (1/3 width) it will activate the mouseDragfunc
            (in tictactoe case: cycleView)*
            * will need an ending and beginning animation so the views slide on and off the screen.
        "dating app"
            user drags the element.
            it rotates -/+ (left/right) around a point at the center and below the current view.
            when the user releases the element, if it has rotated beyond some amount (0 -/+ end_mouseX)
            it will activate one of two mouseDragfunc's (swipeLeft/swipeRight)
    */
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

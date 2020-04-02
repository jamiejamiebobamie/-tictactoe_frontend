
// button base class
class Button extends UIElement{
    constructor(parameterObject) {
        super(parameterObject);

        this.width = this.width || 20;
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
    }

    performClickFunctionality(){
        if (this.func) {
            this.func();
        }
    }

    testForClick(clickLocation) {
        if (clickLocation.x > this.x - this.width
            && clickLocation.x < this.x + this.width
            && clickLocation.y > this.y - this.width
            && clickLocation.y < this.width + this.y) {
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

    // containers can be dragged to change position
    userDrag(){
        this.x = mouseX;
        this.y = mouseY;
    }

    draw() {
        this.mouseOver ? fill(this.mouseOverColor) : fill(this.color);
        ellipse(this.x, this.y, this.width)
    }
}

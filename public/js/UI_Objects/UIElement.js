class UIElement{
    constructor(parameterObject){
        // null parameterObject
        let parameters = {
            offsetX: undefined,
            offsetY: undefined,
            parent: undefined,
            row: undefined,
            index: undefined,
            len: undefined,
            mouseClickfunc: undefined,
            mouseDragfunc: undefined,
            width: undefined,
            height: undefined,
            color: undefined,
        };
        // if a 'parameterObject' has been passed in, set the fields in the
            // 'parameterObject' to the null parameter object 'parameters'.
            // only accepts the fields defined above.
        if (parameterObject){
            parameters = parameterObject;
        }
        // destructure the object to get at the fields.
            // begin to set the uiElements data members to field values
        let {
            offsetX: offsetX,
            offsetY: offsetY,
            parent: parent,
            row: row,
            index: index,
            len: len,
            mouseClickfunc: mouseClickfunc,
            mouseDragfunc: mouseDragfunc,
            width: width,
            height: height,
            color: color,
        } = parameters;
        // performed on mousePressed()
        // used for when you want to grab the value of something after having
            // clicked it or to set a draggable's 'isDragging' boolean to true.
        this.mouseClickfunc = mouseClickfunc;
        // performed on mouseReleased()
        // used for when you want to grab the value of something after having
            // finished dragging it or to set a draggable's 'isDragging' boolean to false.
        this.mouseDragfunc = mouseDragfunc;
        // the UIElement's index within the parent UIElement
        this.index = index != undefined ? index : 0;
        // the number of elements that are siblings to this UIElement in the
            // parent.
        // EXAMPLE:
            // index:0, len:2 = a UIElement that is the first element of two in the parent.
        this.len = len || 1;
        // mostly used for testing / to see the bounds of the UIELement
        this.color = color
        // used to offset the UIElement's position.
        // depending on the UIElement this offset is applied to the top-left
            // corner (containers, sliders, icons, views) or to the middle of the
            // UIElement (buttons).
        offsetX = offsetX != undefined ? offsetX : 0;
        offsetY = offsetY != undefined ? offsetY : 0;
        // the orientation of the UIElement.
            // true for row orientation
            // false for column orientation.
        // defaults to a changing orientation where:
            // it is true if the screen's width is less than it's height
            // (portrait mode) and false if the screen's width is greater than its
            // height (landscape mode).
        this.row = row != undefined ? row : windowWidth < windowHeight;
        // given the relevant fields, positions the UIElement on the canvas.
            // depends on: the orientation, the parent's bounds and placement,
            // and the number of siblings and index of the UIElement.
        if (this.row) {
            if (parent){
                // if row orientation and parent
                this.parent = parent;
                this.width = width || this.parent.width;
                this.height = height || this.parent.height / this.len;
                this.x = this.parent.x + offsetX;
                this.y = this.index * this.parent.height / this.len + this.parent.y + offsetY;
            } else {
                // if row orientation and no parent
                this.width = width || windowWidth;
                this.height = height || windowHeight / this.len;
                this.x = offsetX;
                this.y = this.index * windowHeight / this.len + offsetY;
            }
        } else {
            if (parent) {
                // if column orientation and parent
                this.parent = parent;
                this.width = width || this.parent.width / this.len;
                this.height = height || this.parent.height;
                this.x = this.index * this.parent.width / this.len + this.parent.x + offsetX;
                this.y = this.parent.y + offsetY;
            } else {
                // if column orientation and no parent
                this.width = width || windowWidth / this.len;
                this.height = height || windowHeight;
                this.x = offsetX + this.index * windowWidth / this.len;
                this.y = offsetY;
            }
        }
        this.uiElements = []
        // used for translating the UIElements along the x axis.
            // TESTING.
            // may be redundant to 'offsetX'.
        this.translateXAmount = 0;
    }
    // p5.js built-in methods
    mouseOver(){}
    mouseOut(){}
    // abstract methods for subclasses
    performClickFunctionality(){}
    testForClick() {}
    testForMouseOver() {}
    performDragFunctionality(){}
    performValuesResetAfterDrag(){}
    setTranslateXAmount(amount){
        this.translateXAmount = amount
    }
    // incorrect. will edit when parameters are finalized.
    getParameterList(){
         let parameters = {
            offsetX: "the offset of the container's left corner along the X-axis. if none, index * windowWidth / len",
            offsetY: "the offset of the container's left corner along the Y-axis. if none, index * windowHeight / len",
            widthOfParent: "the width of the parent container, if none, the windowWidth of the canvas",
            heightOfParent: "the height of the parent container, if none, the windowHeight of the canvas",
            orientation: "the orientation of the container: row or column, if none, windowWidth < windowHeight of the canvas",
            index: "the index of the container in the parent object, if none, 0",
            len: "the number of siblings contained in the parent container. if none, 1.",
            func: "a wildcard function. if none, nullFunction.",
            width: "the width of the container. if none, the windowWidth / len.",
            height: "the height of the container. if none, the windowHeight / len.",
        };
        return parameters
    }
}

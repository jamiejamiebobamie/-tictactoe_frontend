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

        if (parameterObject){
            parameters = parameterObject;
        }

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

        this.mouseClickfunc = mouseClickfunc;
        this.mouseDragfunc = mouseDragfunc;

        this.index = index != undefined ? index : 0;
        this.len = len || 1;
        this.color = color != undefined ? color : 256;

        offsetX = offsetX != undefined ? offsetX : 0;
        offsetY = offsetY != undefined ? offsetY : 0;

        this.row = row != undefined ? row : windowWidth < windowHeight;

        if (this.row) {
            if (parent){
                // if portrait mode and parent
                this.parent = parent;
                this.width = width || this.parent.width;
                this.height = height || this.parent.height / this.len;
                this.x = this.parent.x + offsetX;
                this.y = this.index * this.parent.height / this.len + this.parent.y + offsetY;
            } else {
                // if portrait mode and no parent
                this.width = width || windowWidth;
                this.height = height || windowHeight / this.len;
                this.x = offsetX;
                this.y = this.index * windowHeight / this.len + offsetY;
            }
        } else {
            if (parent) {
                // if landscape mode and parent
                this.parent = parent;
                this.width = width || this.parent.width / this.len;
                this.height = height || this.parent.height;
                this.x = this.index * this.parent.width / this.len + this.parent.x + offsetX;
                this.y = this.parent.y + offsetY;
            } else {
                // if landscape and no parent
                this.width = width || windowWidth / this.len;
                this.height = height || windowHeight;
                this.x = offsetX + this.index * windowWidth / this.len;
                this.y = offsetY;
            }
        }
        this.swipeAmount = 0
    }

    recreate(){
        // for child in children:
            // child.recreate()
    }

    // p5.js built-in method
    mouseDragged() {}

    // abstract methods for subclasses
    performClickFunctionality(){}
    testForClick() {}
    testForMouseOver() {}
    performDragFunctionality(){}
    performValuesResetAfterDrag(){}

    getParentWidthAndHeight(){
        parentDimensions = {width:0, height:0}
        if (this.parent){
            parentDimensions.width = parent.width
            parentDimensions.height = parent.height
        } else {
            parentDimensions.width =  parent.width
            parentDimensions.height = parent.height
        }
        return parentDimensions
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

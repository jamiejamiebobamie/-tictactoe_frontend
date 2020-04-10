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

        this.row = row != undefined ? row : displayWidth < displayHeight;

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
                this.width = width || displayWidth;
                this.height = height || displayHeight / this.len;
                this.x = offsetX;
                this.y = this.index * displayHeight / this.len + offsetY;
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
                this.width = width || displayWidth / this.len;
                this.height = height || displayHeight;
                this.x = offsetX + this.index * displayWidth / this.len;
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
            offsetX: "the offset of the container's left corner along the X-axis. if none, index * displayWidth / len",
            offsetY: "the offset of the container's left corner along the Y-axis. if none, index * displayHeight / len",
            widthOfParent: "the width of the parent container, if none, the displayWidth of the canvas",
            heightOfParent: "the height of the parent container, if none, the displayHeight of the canvas",
            orientation: "the orientation of the container: row or column, if none, displayWidth < displayHeight of the canvas",
            index: "the index of the container in the parent object, if none, 0",
            len: "the number of siblings contained in the parent container. if none, 1.",
            func: "a wildcard function. if none, nullFunction.",
            width: "the width of the container. if none, the displayWidth / len.",
            height: "the height of the container. if none, the displayHeight / len.",
        };
        return parameters
    }
}

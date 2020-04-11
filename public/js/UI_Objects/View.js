class View extends UIElement{
    constructor(parameterObject){
        super(parameterObject)
        // for drawing the UIElements the first time.
        this.redrawElements();
    }
    // abstract method
    redrawElements(){}
    draw(){
        for (let i = 0; i < this.uiElements.length; i++){
            this.uiElements[i].draw();
        }
    }
}

class TestView1 extends View{
    constructor(parameterObject){
        super(parameterObject)
        this.redrawElements()
    }

    redrawElements(){
        let baseContainer = new SwipableContainer()
        let contentParams = {row:false, len:7, index:0,width:windowWidth*6/7, color:'orange', parent:baseContainer}
        let container = new Container(contentParams)
        this.uiElements.push(container)

        let textbox = new TextBox({row:false, len:7, index:6, color:'green', parent:baseContainer})
        textbox.setString('SWIPE LEFT FOR SUGGESTION')
        textbox.setTextColor('orange')
        this.uiElements.push(textbox)

        let params = {row: false,  offsetX:105, offsetY:105, width: 200, height: 300, color: 'red', parent:baseContainer}
        let cont = new DraggableContainer(params)
        this.uiElements.push(cont)

        params = {row: false, parent:cont}
        let slider = new Slider(params)
        this.uiElements.push(slider)
    }
}

class TestView2 extends View{
    constructor(parameterObject){
        super(parameterObject)
        this.img = loadImage('../imgs/brain_base.png'); // 382, 279
        this.redrawElements()
    }

    redrawElements(){
        let baseContainer = new SwipableContainer()

        let contentParams = {row:false, len:7, index:0,width:windowWidth*6/7, color:'orange', parent:baseContainer}
        let container = new Container(contentParams)
        this.uiElements.push(container)

        let textbox = new TextBox({row:false, len:7, index:6, color:'green', parent:baseContainer})
        textbox.setString('SWIPE LEFT TO PLAY')
        textbox.setTextColor('orange')
        this.uiElements.push(textbox)

        let params = {row: false,  offsetX:5, offsetY:5, width: 200, height: 300, color: 'blue', parent:baseContainer}
        let cont = new DraggableContainer(params)
        this.uiElements.push(cont)

        let image = new ImageContainer();
        image.setImageProps(this.img, 382, 279)
        this.uiElements.push(image)
    }
}

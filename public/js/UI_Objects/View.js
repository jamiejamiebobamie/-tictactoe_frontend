class View extends UIElement{
    constructor(parameterObject){
        super(parameterObject)
        // for drawing the UIElements the first time.
        this.redrawElements();
    }
    // abstract method
    redrawElements(parameterObject){}
    draw(){
        for (let i = 0; i < this.uiElements.length; i++){
            this.uiElements[i].draw();
        }
    }
}

class TestView1 extends View{
    constructor(parameterObject){
        super(parameterObject)
        this.redrawElements(parameterObject)
    }

    redrawElements(parameterObject){
        this.uiElements = []
        let baseContainer = new SwipableContainer()
        let contentParams = {row:false, len:7, index:0,width:windowWidth*6/7, color:'orange', parent:baseContainer}
        let container = new Container(contentParams)
        if (parameterObject){
            container.setTranslateXAmount(parameterObject.transitionAmount)
        }
        this.uiElements.push(container)

        let textbox = new TextBox({row:false, len:7, index:6, color:'green', parent:baseContainer})
        textbox.setString('SWIPE LEFT FOR SUGGESTION')
        textbox.setTextColor('orange')
        if (parameterObject){
            textbox.setTranslateXAmount(parameterObject.transitionAmount)
        }
        this.uiElements.push(textbox)

        let params = {row: false,  offsetX:105, offsetY:105, width: 200, height: 300, color: 'red', parent:baseContainer}
        let cont = new DraggableContainer(params)
        if (parameterObject){
            cont.setTranslateXAmount(parameterObject.transitionAmount)
        }
        this.uiElements.push(cont)

        params = {row: false,  offsetX:105, offsetY:105, width: 50, height: 75, color: 'blue', parent:cont}
        let anotherCont = new DraggableContainer(params)
        if (parameterObject){
            anotherCont.setTranslateXAmount(parameterObject.transitionAmount)
        }
        cont.uiElements.push(anotherCont)
    }
}

class TestView2 extends View{
    constructor(parameterObject){
        super(parameterObject)
        this.img = loadImage('../imgs/brain_base.png'); // 382, 279
        this.redrawElements()
    }

    redrawElements(parameterObject){
        this.uiElements = []
        let baseContainer = new SwipableContainer()
        let contentParams = {row:false, len:7, index:0,width:windowWidth*6/7, color:'orange', parent:baseContainer}
        let container = new Container(contentParams)
        if (parameterObject){
            container.setTranslateXAmount(parameterObject.transitionAmount)
        }
        this.uiElements.push(container)

        let textbox = new TextBox({row:false, len:7, index:6, color:'green', parent:baseContainer})
        textbox.setString('SWIPE LEFT FOR SUGGESTION')
        textbox.setTextColor('orange')
        if (parameterObject){
            textbox.setTranslateXAmount(parameterObject.transitionAmount)
        }
        this.uiElements.push(textbox)

        let params = {row: false,  offsetX:105, offsetY:105, width: 200, height: 300, color: 'red', parent:baseContainer}
        let cont = new DraggableContainer(params)
        if (parameterObject){
            cont.setTranslateXAmount(parameterObject.transitionAmount)
        }
        this.uiElements.push(cont)

        params = {row: false, parent:cont}
        let slider = new Slider(params)
        if (parameterObject){
            slider.setTranslateXAmount(parameterObject.transitionAmount)
        }

        this.uiElements.push(slider)
        let image = new ImageContainer();
        image.setImageProps(this.img, 382, 279)
        if (parameterObject){
            image.setTranslateXAmount(parameterObject.transitionAmount)
        }
        this.uiElements.push(image)
    }
}

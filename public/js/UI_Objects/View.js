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

class SuggestionView extends View{
    constructor(parameterObject){
        super(parameterObject)
    }
    redrawElements(previousStatesObject){
        let portrait = windowWidth < windowHeight;

        this.uiElements = []
        for (let i = 0; i < 2; i++){
            let containerParams;
            if (i == 1 && portrait){
                // shift the turn_selector_button, the instructions, and the submit_button up if portrait mode.
                containerParams = {row: portrait, len:2, index:i, offsetY:-windowWidth/12}
            } else {
                containerParams = {row: portrait, len:2, index:i}
            }
            let container = new Container(containerParams)
            this.uiElements.push(container)
        }

        let boardContainer = this.uiElements[0]

        let boardLength = boardContainer.height > boardContainer.width ? boardContainer.width/1.3 : boardContainer.height/1.3;
        let offsetX = boardContainer.width / 2 -  boardLength / 2
        let offsetY = boardContainer.height / 2 -  boardLength / 2
        let boardParams = {row: true, offsetX: offsetX, offsetY:offsetY,  height: boardLength, width: boardLength, parent:boardContainer}
        let board = new Container(boardParams)
        this.uiElements.push(board)

        let boardSpace;
        let boardCount = 0;
        let spaceColor;
        let blue = color(86,133,151)
        let red = color(165,67,68)

        for (let i = 0; i < 3; i++){
            let boardRowParams = {row: true, len: 3, index: i, parent:board}
            let boardRow = new Container(boardRowParams)
            this.uiElements.push(boardRow)

            for (let j = 0; j < 3; j++){
                boardCount % 2 ? spaceColor = blue : spaceColor = red;
                let boardSpaceParams = {row: false, len: 3, index: j, color: spaceColor, parent:boardRow}
                boardSpace = new TicTacToeSpace(boardSpaceParams)
                if (previousStatesObject){
                    boardSpace.setSymbol(previousStatesObject.boardArray[boardCount])
                }
                this.uiElements.push(boardSpace)
                boardCount++;
            }
        }

        let turnAndSubmitButtonsContainer =  this.uiElements[1]
        for (let i = 0; i < 3; i++){
            let containerParams = {row: true, len:3, index:i, parent: turnAndSubmitButtonsContainer}
            let container = new Container(containerParams)
            turnAndSubmitButtonsContainer.uiElements.push(container)
        }

        let infoArea = turnAndSubmitButtonsContainer.uiElements[0]
        let infoTextBoxParams = {row: true, offsetX: infoArea.width/6, width:infoArea.width*2/3, parent:infoArea}
        let infoSection = new TextBox(infoTextBoxParams)
        infoSection.setString("input whose turn it is and the state of the board to recieve a suggestion")
        infoSection.setTextColor(30)
        this.uiElements.push(infoSection)

        spaceColor = boardCount % 2 ? blue : red;
        let turnButtonArea = turnAndSubmitButtonsContainer.uiElements[1]
        let chooseTurnParams = {row: false, color: spaceColor, offsetX:turnButtonArea.width/2-boardSpace.width/2, offsetY:turnButtonArea.height/2-boardSpace.height/2, width:boardSpace.width, height: boardSpace.height, parent:turnButtonArea}
        let whosTurnButton = new TicTacToePlayerTurnSelector(chooseTurnParams)
        if (previousStatesObject){
            whosTurnButton.setSymbol(previousStatesObject.turn);
        }
        this.uiElements.push(whosTurnButton)

        let submitButtonArea = turnAndSubmitButtonsContainer.uiElements[2]
        let submitBoardButtonParams = {row: true, offsetX: submitButtonArea.width/4, offsetY: submitButtonArea.height/4, width:submitButtonArea.width/2, height:submitButtonArea.height/2, parent:submitButtonArea, mouseClickfunc:this.aiMove}
        let submitBoardButton = new TextBox(submitBoardButtonParams)
        if (parameterObject){
            if (parameterObject.fontStyle){
                textFont(parameterObject.fontStyle)
            }
        }
        submitBoardButton.setString("submit")
        submitBoardButton.setTextColor(30)
        submitBoardButton.setStroke(true)
        this.uiElements.push(submitBoardButton)
    }

    aiMove(){ return ['queryBackend'] }
    setTurnToX(){ return ['x'] }
    setTurnToO(){ return ['o'] }
}

class PlayView extends View{
    constructor(parameterObject){
        super(parameterObject)
        this.loadedImage = loadImage('../imgs/brain_base.png')
    }

    redrawElements(previousStatesObject){
        let portrait = windowWidth < windowHeight;

        this.uiElements = []
        for (let i = 0; i < 2; i++){
            let containerParams = {row: portrait, len:2, index:i}
            let container = new Container(containerParams)
            this.uiElements.push(container)
        }

        let cartoonSliderContainer =  this.uiElements[0]
        let cartoonImageContainerParams = {row: true, len:3, index:0, height:cartoonSliderContainer.height*(2/3), parent:cartoonSliderContainer}
        let cartoonImageContainer = new Container(cartoonImageContainerParams)
        this.uiElements.push(cartoonImageContainer)

        let brainImageParams = {row:true, parent:cartoonSliderContainer, offsetY:-190}
        let brainImage = new ImageContainer(brainImageParams)
        if (parameterObject){
            if (parameterObject.loadedImage){
                let scaleAmount = cartoonSliderContainer.width < cartoonSliderContainer.height ? cartoonSliderContainer.width / 950 : cartoonSliderContainer.height / 950

                brainImage.setImageProps(parameterObject.loadedImage,382*scaleAmount,279*scaleAmount)
                brainImage.setImageOffsets(-30*scaleAmount,-100*scaleAmount)
            }
        }
        cartoonSliderContainer.uiElements.push(brainImage)

        // brainparts
        // https://github.com/jamiejamiebobamie/conway-gol/blob/6a9c8a80b3d6353af137a9569e3dc62e73b1ec86/public/js/sketch-playground.js
        let lipsOffsetX = 50 - 12*960/cartoonImageContainer.width;
        let bottomLipParams = {row:true,parent:cartoonImageContainer, offsetX: lipsOffsetX}
        let bottomLip = new BrainPartBezier(bottomLipParams)
        let dumbPose, smartPose;

        dumbPose = {
            firstControlPoint:{x:130,y:211},
            firstAnchorPoint:{x:50,y:50},
            secondAnchorPoint:{x:366,y:143},
            secondControlPoint:{x:244,y:50}
            }
        smartPose = {
                firstControlPoint:{x:50,y:209},
                firstAnchorPoint:{x:50,y:50},
                secondAnchorPoint:{x:350,y:209},
                secondControlPoint:{x:350,y:50}
            }

        let bottomLipBezierCurves = {dumbPose:dumbPose,smartPose:smartPose}

        bottomLip.setPoses(bottomLipBezierCurves.dumbPose,bottomLipBezierCurves.smartPose)
        bottomLip.setBlendAmount(parameterObject.aiDifficulty)
        bottomLip.blend();
        cartoonSliderContainer.uiElements.push(bottomLip)

        // bottom lip's dumb pose needs to be shifted up.
        let yTranslation = 150
        dumbPose = {
            firstControlPoint:{x:4,y:125-yTranslation},
            firstAnchorPoint:{x:54,y:209-yTranslation},
            secondAnchorPoint:{x:366,y:143-yTranslation},
            secondControlPoint:{x:198+47,y:199-yTranslation}
            }

        // bottom and top lips share the same smart pose :)
        let topLipBezierCurves = {dumbPose:dumbPose,smartPose:smartPose}

        let topLipParams = {row:true,parent:cartoonImageContainer, offsetX: lipsOffsetX}
        let topLip = new BrainPartBezier(topLipParams)
        topLip.setPoses(topLipBezierCurves.dumbPose,topLipBezierCurves.smartPose)
        topLip.setBlendAmount(parameterObject.aiDifficulty)
        topLip.blend();
        cartoonSliderContainer.uiElements.push(topLip)

        let eyeParams = {row:true, parent:cartoonSliderContainer, offsetX:cartoonSliderContainer.width/2.1, offsetY:cartoonSliderContainer.height/2.5}
        // leftEye from viewer's perspective... brain's right eye...
        let leftEye = new BrainPartEllipse(eyeParams)
        smartPose = {x:0,y:0}
        dumbPose = {x:5,y:-3}
        leftEye.setPoses(dumbPose, smartPose)
        leftEye.setBlendAmount(parameterObject.aiDifficulty)
        leftEye.blend();
        let isThinking = parameterObject ? parameterObject.isWaitingForResponse : false;
        leftEye.setThinking(isThinking);
        cartoonSliderContainer.uiElements.push(leftEye)

        eyeParams = {row:true, parent:cartoonSliderContainer, offsetX:cartoonSliderContainer.width/1.7-5, offsetY:cartoonSliderContainer.height/2.5}//, offsetX:15, offsetY:-390}
        // brain's left eye
        let rightEye = new BrainPartEllipse(eyeParams)
        smartPose = {x:0,y:0}
        dumbPose = {x:-3,y:-3}
        rightEye.setPoses(dumbPose, smartPose)
        rightEye.setBlendAmount(parameterObject.aiDifficulty)
        rightEye.blend();
        isThinking = parameterObject ? parameterObject.isWaitingForResponse : false;
        rightEye.setThinking(isThinking);
        cartoonSliderContainer.uiElements.push(rightEye)


        // --------------------------------------------------------------------

        let sliderContainerParams = {row: true, len:3, index:2, height:cartoonSliderContainer.height/3, width:cartoonSliderContainer.width/1.5, offsetX: cartoonSliderContainer.width/6, offsetY:-cartoonSliderContainer.height/10, parent:cartoonSliderContainer}
        let sliderContainer = new Container(sliderContainerParams)
        this.uiElements.push(sliderContainer)
        let sliderParams = {row: true, parent:sliderContainer}
        let slider = new DifficultySlider(sliderParams)
        let difficulty = previousStatesObject ? previousStatesObject.aiDifficulty : 13;
        slider.setDifficulty(difficulty)
        this.uiElements.push(slider)

        let boardContainer = this.uiElements[1]
        let boardRowParams;

        let boardLength = 0;
        boardLength = boardContainer.height > boardContainer.width ? boardContainer.width/1.3 : boardContainer.height/1.3;

        let offsetX = boardContainer.width / 2 -  boardLength / 2
        // shift the board up in portrait mode to be better spaced.
        let offsetY = portrait ? boardContainer.height / 2 -  boardLength / 1.45 : boardContainer.height / 2 -  boardLength / 2

        let boardParams = {row: true, offsetX: offsetX, offsetY: offsetY, height: boardLength, width: boardLength, parent:boardContainer}
        let board = new Container(boardParams)
        this.uiElements.push(board)

        let count = 0;
        let spaceColor;
        let blue = color(86,133,151)
        let red = color(165,67,68)

        for (let i = 0; i < 3; i++){
            boardRowParams = {row: true, len: 3, index: i, parent:board}
            let boardRow = new Container(boardRowParams)
            this.uiElements.push(boardRow)

            for (let j = 0; j < 3; j++){
                count % 2 ? spaceColor = blue : spaceColor = red;
                let boardSpaceParams = {row: false, len: 3, index: j, color: spaceColor, parent:boardRow}
                let boardSpace = new TicTacToeSpacePlay(boardSpaceParams)
                if (previousStatesObject){
                    boardSpace.setSymbol(previousStatesObject.boardArray[count])
                    boardSpace.setBoardState(previousStatesObject.boardArray)
                }
                this.uiElements.push(boardSpace)
                count++;
            }
        }

        // ------
        if (parameterObject){
            if (parameterObject.winner != null){
                setTimeout(displayReplayWindow, 700, this.uiElements, portrait);
            }
        }
    }
}

function displayReplayWindow(array, portrait){
    let replayWindowParams = {row:portrait}
    let replayWindow = new ReplayWindow(replayWindowParams)
    replayWindow.setContext(array)
    replayWindow.setMessage(parameterObject)
    array.push(replayWindow)
}

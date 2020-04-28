class BrainPart extends UIElement{
    constructor(parameterObject){
        super(parameterObject)
        this.pose1 = undefined;
        this.pose2 = undefined;
        this.blendAmount = 0;
        this.poseIsSet = false;
        this.scaleAmount = this.width / 950
    }
    setPoses(dumbPose,smartPose){
        this.pose1 = smartPose;
        this.pose2 = dumbPose;
        this.poseIsSet = true;
    }
    setBlendAmount(blendAmount){
        this.blendAmount = (blendAmount-45)/100;
    }
    blend(){}
    draw(){}
}

class BrainPartEllipse extends BrainPart{
    constructor(parameterObject){
        super(parameterObject)
        this.sceleraX = 0
        this.sceleraY = 0
        this.sceleraYAddition = 0
        // use the smaller edge of the containing rectangle to scale the brainPart by some fraction
        this.scaleAmount = this.parent.width < this.parent.height ? this.width / 950 : this.height / 950
    }
    blend(){
        this.sceleraX += (this.pose2.x - this.pose1.x) * this.blendAmount + this.pose1.x
        this.sceleraY += (this.pose2.y - this.pose1.y) * this.blendAmount + this.pose1.y
    }
    setThinking(isThinking){
        this.sceleraYAddition = isThinking ? -4 : 0;
    }
    draw(){
        push();
            scale(this.scaleAmount);
            fill(230)
            ellipse(this.x/this.scaleAmount,this.y/this.scaleAmount,40)
            fill(30)
            ellipse((this.x+this.sceleraX*this.scaleAmount)/this.scaleAmount,(this.y+this.sceleraY*this.scaleAmount+this.sceleraYAddition)/this.scaleAmount,20)
        pop();
    }
}

class BrainPartBezier extends BrainPart{
    constructor(parameterObject){
        super(parameterObject)

        if (this.pose1 && this.pose2){
            this.firstAnchorPointX = (this.blendAmount * (this.pose2.firstAnchorPoint.x - this.pose1.firstAnchorPoint.x) + this.pose1.firstAnchorPoint.x)
            this.firstAnchorPointY = (this.blendAmount * (this.pose2.firstAnchorPoint.y - this.pose1.firstAnchorPoint.y) + this.pose1.firstAnchorPoint.y)

            this.firstControlPointX = (this.blendAmount * (this.pose2.firstControlPoint.x - this.pose1.firstControlPoint.x) + this.pose1.firstControlPoint.x)
            this.firstControlPointY = (this.blendAmount * (this.pose2.firstControlPoint.y - this.pose1.firstControlPoint.y) + this.pose1.firstControlPoint.y)

            this.secondAnchorPointX = (this.blendAmount * (this.pose2.secondAnchorPoint.x - this.pose1.secondAnchorPoint.x) + this.pose1.secondAnchorPoint.x)
            this.secondAnchorPointY = (this.blendAmount * (this.pose2.secondAnchorPoint.y - this.pose1.secondAnchorPoint.y) + this.pose1.secondAnchorPoint.y)

            this.secondControlPointX = (this.blendAmount * (this.pose2.secondControlPoint.x - this.pose1.secondControlPoint.x) + this.pose1.secondControlPoint.x)
            this.secondControlPointY = (this.blendAmount * (this.pose2.secondControlPoint.y - this.pose1.secondControlPoint.y) + this.pose1.secondControlPoint.y)
        }

        this.scaleOffset = 7
    }

    blend(){
        this.firstAnchorPointX = (this.blendAmount * (this.pose2.firstAnchorPoint.x - this.pose1.firstAnchorPoint.x) + this.pose1.firstAnchorPoint.x)
        this.firstAnchorPointY = (this.blendAmount * (this.pose2.firstAnchorPoint.y - this.pose1.firstAnchorPoint.y) + this.pose1.firstAnchorPoint.y)

        this.firstControlPointX = (this.blendAmount * (this.pose2.firstControlPoint.x - this.pose1.firstControlPoint.x) + this.pose1.firstControlPoint.x)
        this.firstControlPointY = (this.blendAmount * (this.pose2.firstControlPoint.y - this.pose1.firstControlPoint.y) + this.pose1.firstControlPoint.y)

        this.secondAnchorPointX = (this.blendAmount * (this.pose2.secondAnchorPoint.x - this.pose1.secondAnchorPoint.x) + this.pose1.secondAnchorPoint.x)
        this.secondAnchorPointY = (this.blendAmount * (this.pose2.secondAnchorPoint.y - this.pose1.secondAnchorPoint.y) + this.pose1.secondAnchorPoint.y)

        this.secondControlPointX = (this.blendAmount * (this.pose2.secondControlPoint.x - this.pose1.secondControlPoint.x) + this.pose1.secondControlPoint.x)
        this.secondControlPointY = (this.blendAmount * (this.pose2.secondControlPoint.y - this.pose1.secondControlPoint.y) + this.pose1.secondControlPoint.y)
    }

    draw(){
        push();
            stroke(35);
            strokeWeight(this.blendAmount*50+45);
            // only fill in the bezier curve if dumb pose (i.e. if mouth is open)
            if (this.blendAmount < .5){
                strokeWeight(this.blendAmount*50+45);
                noFill();
            } else {
                strokeWeight(70.22-70.22*this.blendAmount+30);
                fill(130,50,47);

            }

            translate(this.x+this.parent.width/2-(this.secondAnchorPointX - this.firstAnchorPointX)*this.scaleAmount/this.scaleOffset,this.parent.height*2/3)//this.y+this.parent.height/3)
            scale(this.scaleAmount/this.scaleOffset);
            if (this.poseIsSet){
                bezier(this.firstAnchorPointX, this.firstAnchorPointY,
                        this.firstControlPointX, this.firstControlPointY,
                        this.secondAnchorPointX, this.secondAnchorPointY,
                        this.secondControlPointX, this.secondControlPointY)
            }
        pop();
    }
}

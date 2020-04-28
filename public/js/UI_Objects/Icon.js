class Icon extends UIElement{
    constructor(parameterObject){
        super(parameterObject);
    }
}

class TicTacToeIcon extends Icon{
    constructor(parameterObject){
        super(parameterObject);
        this.name = 'abstract icon';
        this.isSuggestion = false;
    }
    draw(){
        this.isSuggestion ? fill(50) : fill(50);
    }
}

class NullIcon extends TicTacToeIcon{
    constructor(parameterObject){
        super(parameterObject);
        this.name = '!';
    }
    draw(){
    }
}

class X extends TicTacToeIcon{
    constructor(parameterObject){
        super(parameterObject);
        this.name = 'x';
        this.x += this.parent.width/8
        this.y += this.parent.height/8
    }
    draw(){
        super.draw()
        rect(this.x,this.y,this.parent.width/1.35, this.parent.height/1.35)
    }
}


class O extends TicTacToeIcon{
    constructor(parameterObject){
        super(parameterObject);
        this.name = 'o';
        this.x += this.parent.width/2
        this.y += this.parent.height/2
    }
    draw(){
        super.draw()
        ellipse(this.x, this.y, this.parent.width/1.5)
        fill(this.parent.color);
        ellipse(this.x, this.y, this.parent.width/2)
    }
}

class cycleViewIcon extends Icon{
    constructor(parameterObject){
        super(parameterObject)
        this.test = 0;
    }

    draw(){
        push()
            translate(this.parent.width/2,this.parent.height/2)
            push()
                rotate(radians(this.translateXAmount))
                translate(-17, -366);
                stroke(30);
                strokeWeight(3);
                noFill();
                arc(19, 367.3, 13, 13, QUARTER_PI + QUARTER_PI, 2*PI);//refresh circle
                strokeWeight(1);
                push();
                    translate(-39, 302);
                    rotate(radians(10));
                    fill(30);
                    triangle(75, 61, 70, 55, 80, 55); //refresh_triangle
                pop();
            pop();
        pop();

    }
}

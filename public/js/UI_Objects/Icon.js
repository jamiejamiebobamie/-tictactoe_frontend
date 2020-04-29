// abstract icon. icon's are the physical appearance of
    // containers that act as buttons.
class Icon extends UIElement{
    constructor(parameterObject){
        super(parameterObject);
    }
}
//abstract tictactoe icon
class TicTacToeIcon extends Icon{
    constructor(parameterObject){
        super(parameterObject);
        this.name = 'abstract icon';
    }
    draw(){
        // color all icons with a basic matte black.
        fill(50);
    }
}
// used to mark empty spaces on the board.
class NullIcon extends TicTacToeIcon{
    constructor(parameterObject){
        super(parameterObject);
        this.name = '!';
    }
    draw(){
    }
}
// used to mark X spaces on the board.
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
// used to mark O spaces on the board.
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
// the menu button icon.
class cycleViewIcon extends Icon{
    constructor(parameterObject){
        super(parameterObject)
    }
    draw(){
        push()
            translate(this.parent.width/2,this.parent.height/2)
            push()
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

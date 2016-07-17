class Point {
    x: number;
    y: number;
    constructor(x : number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(point: Point) {
        this.x += point.x;
        this.y += point.y;
    }
}

class Vector extends Point {
    flipX() {
        this.x *= -1;
    }

    flipY() {
        this.y *= -1;
    }
}

class Rect {
    topLeft : Point;
    bottomRight : Point;

    constructor(left : number, top: number, right: number, bottom: number) {
        this.topLeft = new Point(left, top);
        this.bottomRight = new Point(right, bottom);
    }

    clone() : Rect {
        return new Rect(this.topLeft.x, this.topLeft.y, this.bottomRight.x, this.bottomRight.y);
    }

    add(point: Point) {
        this.topLeft.add(point);
        this.bottomRight.add(point);
    }

    moveTo(rect: Rect) {
        this.topLeft.x = rect.topLeft.x;
        this.topLeft.y = rect.topLeft.y;
        this.bottomRight.x = rect.bottomRight.x;
        this.bottomRight.y = rect.bottomRight.y;
    }
}

class Obstacle extends Rect {
    checkCollision(anotherRect : Rect) : Boolean {
        return this.topLeft.x < anotherRect.bottomRight.x 
            && this.bottomRight.x > anotherRect.topLeft.x
            && this.topLeft.y < anotherRect.bottomRight.y
            && this.bottomRight.y > anotherRect.topLeft.y;   
    }
}

class Ball extends Rect {
    radius : number;
    dir  : Vector;

    wallLeft : Obstacle;
    wallTop: Obstacle;
    wallRight: Obstacle;
    wallBottom: Obstacle;

    constructor(radius : number, posX : number, posY : number, dirX : number, dirY : number) {
        super(posX, posY, posX + 2 * radius, posY + 2 * radius);
        this.radius = radius;        
        this.dir = new Vector(dirX, dirY);        
    }

    move() : Point {
        var newPosition = this.clone();
        newPosition.add(this.dir);

        if (this.wallLeft.checkCollision(newPosition) || this.wallRight.checkCollision(newPosition)) {
            this.dir.flipX();
        }
        if (this.wallTop.checkCollision(newPosition) || this.wallBottom.checkCollision(newPosition)) {
            this.dir.flipY();
        }    

        this.moveTo(newPosition);

        return this.topLeft;
    }

    setConstraints(minX : number, minY : number, maxX : number, maxY : number) {
        this.wallLeft = new Obstacle(minX - this.radius, minY - this.radius, minX, maxY + this.radius);
        this.wallTop = new Obstacle(minX - this.radius, minY - this.radius, maxX + this.radius, minY);
        this.wallRight = new Obstacle(maxX, minY - this.radius, maxX + this.radius, maxY + this.radius);
        this.wallBottom = new Obstacle(minX - this.radius, maxY, maxX + this.radius, maxY + this.radius);        
    }    
}

console.log('Hello from BrickBuster !!!');

var ballElement : HTMLElement = <HTMLElement>document.getElementsByClassName("ball")[0];
var boardElement : HTMLElement = <HTMLElement>document.getElementsByClassName("game-board")[0];

var ball = new Ball(parseInt(getComputedStyle(ballElement)['border-top-left-radius']), ballElement.offsetLeft, ballElement.offsetTop, 1, -1);

ball.setConstraints(0, 0, boardElement.offsetWidth, boardElement.offsetHeight);

setInterval(() => {
    let {x: posX, y: posY} = ball.move();

    ballElement.style.left = posX + 'px';
    ballElement.style.top = posY + 'px';        
}, 20);
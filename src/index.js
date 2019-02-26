//GLOBALS
const GAME_WIDTH = 750;
const GAME_HEIGHT = 500;
const N_WIDTH = 15;
const N_HEIGHT = 10;
const TILE_SIZE = 75;
const OBJ_SIZE = 40;
//35 px by 35 px
const CLIP_SIZE = 72;


var playerUpDown = [0, 1, 0, 1]
var playerLeft = [2, 3, 2, 4]
var playerRight = [7, 6, 7, 5]
var playerStill = [0, 0, 0, 0]

var usedNPCSprites = []
var recordPos = {
    x: 1,
    y: 1
}

var usbPos = {
    x: 0,
    y: 1
}

var count = 0;
/****************************************************************************************************/
//NPC Functions

//function Npc(usedNPCSprites) {
//    this.position = {
//        x: 0,
//        y: 0,
//    }
//    //this.sprite = new Sprite()
//}

//Npc.prototype.update() {
//
//}
//
//Npc.prototype.draw(ctx) {
//
//}
//function draw_npcs(npcs, ctx){
//    for ( var i = 0; i < length(); 
//}

/****************************************************************************************************/
//Player Functions
function Player(name, size, x, y, imgSrc, characterCol) {
    this.name = name
    this.size = size
    this.position = {
        x: 20,
        y: GAME_HEIGHT / 2 - 55
    }
    this.speed = {
        x: 0,
        y: 0
    }
    this.imgSrc = imgSrc

    // url, position, size, speed is 6
    // not dancing, just walking, false for repeat ania=m
    // row is the row of said character
    // 0 is for colun start of character
    this.sprite = new Sprite(this.imgSrc, this.position, this.size, 600, "default", false, 0, characterCol)
}

Player.prototype.draw = function (ctx) {
    this.sprite.draw(ctx)
}

Player.prototype.moveLeft = function () {
    this.speed.x = -2
}

Player.prototype.moveRight = function () {
    this.speed.x = 2
}

Player.prototype.moveDown = function () {
    this.speed.y = 2
}

Player.prototype.moveUp = function () {
    this.speed.y = -2
}

Player.prototype.stopX = function () {
    this.speed.x = 0
}

Player.prototype.stopY = function () {
    this.speed.y = 0
}

Player.prototype.update = function (deltaTime) {

    if (this.speed.x < 0 && this.position.x >= 10)
        this.position.x += this.speed.x

    else if (this.speed.x > 0 && this.position.x <= GAME_WIDTH - 100)
        this.position.x += this.speed.x

    if (this.speed.y < 0 && this.position.y >= 10)
        this.position.y += this.speed.y

    else if (this.speed.y > 0 && this.position.y <= GAME_HEIGHT - 100)
        this.position.y += this.speed.y

    this.sprite.update(deltaTime, this.position, this.speed, count)
    
    if (count === 8) count = 0;
    else count = count + 1;


}

/****************************************************************************************************/
//Sprite Functions


/********************************
Sprite function code borrowed from 
https://jlongster.com/Making-Sprite-based-Games-with-Canvas
********************************/
function Sprite(src, position, size, speed, dir, once, characterRow, characterCol) {
    this.position = {
        x: position.x,
        y: position.y
    }
    this.size = size;
    this.speed = {
        x: speed.x,
        y: speed.y
    }
    this.frames = frames
    this._index = 0
    this.imgSrc = src
    this.once = once
    this.characterRow = characterRow
    this.characterCol = characterCol
};

//if sprite moving, update time
Sprite.prototype.update = function (dt, position, speed, count) {
    this.speed = {
        x: speed.x,
        y: speed.y
    }
    this.position = {
        x: position.x,
        y: position.y
    }
    if (count == 0 && (this.speed.x !== 0 || this.speed.y !== 0))
        this._index += 1;
}

Sprite.prototype.draw = function (ctx) {

    //declare size of cropped image
    //get index of what frame we are in
    var idx = this._index
    var framesIn = []
    
    console.log(this.speed.x + " , " + this.speed.y)
    //get correct frames array based on direction
    if (this.speed.x === 0 && this.speed.y === 0)
        framesIn = playerStill
    else if (this.speed.x > 0)
        framesIn = playerRight
    else if (this.speed.x < 0)
        framesIn = playerLeft
    else if (this.speed.y !== 0 && this.speed.x === 0)
        framesIn = playerUpDown

    //current frame is which index we are, mod size of walking arrays
    frame = framesIn[idx % 4];

    //    if (this.once && idx >= 4) {
    //        this.done = true;
    //        return;
    //    }

    row = frame * CLIP_SIZE

    row += this.characterRow * CLIP_SIZE
    col = this.characterCol * CLIP_SIZE

    //make new drawing
    drawing = new Image();
    drawing.src = this.imgSrc;

    ctx.drawImage(drawing, row, col,
        71, 71,
        this.position.x, this.position.y,
        this.size, this.size);

}

/****************************************************************************************************/
//Drink Functions

function Drink(src, name, num) {
    this.carried = 0
    this.position = {
        x: (GAME_WIDTH - 150),
        y: (60 + 70 * num)
    }
    this.imgSrc = src
    this.name = name
    this.size = OBJ_SIZE
}

Drink.prototype.draw = function (ctx) {
    drawing = new Image();
    drawing.src = this.imgSrc
    size = this.size
    x = this.position.x
    y = this.position.y
    row = this.
    col
    ctx.drawImage(drawing, x, y, size, size)
}

Drink.prototype.update = function (carried, player) {
    if (carried === 1) {
        this.carried = 1
        this.position = player.position
    }
    if (carried === -1)
        this.carried = 0
}
/****************************************************************************************************/
function InputHandler(player) {
    document.addEventListener("keydown", event => {
        switch (event.keyCode) {
            case 37:
                player.moveLeft();
                break;
            case 38:
                player.moveUp();
                break;
            case 39:
                player.moveRight();
                break;
            case 40:
                player.moveDown();
                break;
            case 32:
                break;
        }
    });

    document.addEventListener("keyup", event => {
        switch (event.keyCode) {
            case 37: //left
                if (player.speed.x < 0) player.stopX();
                break;
            case 39:
                if (player.speed.x > 0) player.stopX();
                break;
            case 38:
                if (player.speed.y < 0) player.stopY();
                break;
            case 40:
                if (player.speed.y > 0) player.stopY();
                break;
        }
    });
}
/****************************************************************************************************/
//MISC FUNCTIONS

function _drawSquares(ctx) {
    for (var j = 0; j < 15; j++) {
        for (var k = 0; k < 10; k++) {
            x = j * TILE_SIZE;
            y = k * TILE_SIZE;

            ctx.rect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.stroke();
        }
    }
}


/****************************************************************************************************/
//Collision FUNCTIONS
function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
        b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
        pos[0] + size[0], pos[1] + size[1],
        pos2[0], pos2[1],
        pos2[0] + size2[0], pos2[1] + size2[1]);
}
//function loadFloorplan(floorplan) {
//    console.log("brillo is: " + floorplan)
//    var floor = new Array();
//    for (var j = 0; j < 15; j++) {
//        var temp = new Array();
//        for (var k = 0; k < 10; k++) {
//            if (floorplan[j][k] == 1)
//                temp.push(1)
//            else
//                temp.push(0)
//        }
//        floor.push(temp)
//    }
//    return floor;
//}


/****************************************************************************************************/

//BEGIN GAME
function start() {
    //GET CANVAS, CTX
    let canvas = document.getElementById("gameScreen");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);



    //CREATE PLAYER
    //TODO: allow users to select character name, image, calculate tile size vs hardcoding 35
    let player = new Player("lily", 75, 1, 1, 'img/djs.png', 4);

    let input = new InputHandler(player)

    let drink1 = new Drink('img/martini.png', 'Martini', 1)
    let drink2 = new Drink('img/cocktail.png', 'Vodka Cran', 2)

    let lastTime = 0;


    function gameLoop(timeStamp) {
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        drink1.update()
        drink1.draw(ctx)

        drink2.update()
        drink2.draw(ctx)


        player.update(deltaTime);
        player.draw(ctx);

        requestAnimationFrame(gameLoop);

    }

    requestAnimationFrame(gameLoop);

}

start();

//GLOBALS
const GAME_WIDTH = 750;
const GAME_HEIGHT = 500;
const N_WIDTH = 15;
const N_HEIGHT = 10;
const TILE_SIZE = 50;
//35 px by 35 px


/****************************************************************************************************/
//NPC Functions

function generate_npc(){
    //somehow get this to be dynamic, reading from file probably
}


/****************************************************************************************************/
//Player Functions
function Player(name, size, x, y, imgSrc) {
    this.name = name
    this.size = size
    this.x = x
    this.y = y
    this.imgSrc = imgSrc
}


Player.prototype.draw = function (ctx) {
    drawing = new Image();
    drawing.src = this.imgSrc;
    size = this.size
    posX = this.x * size
    posY = this.y * size
    ctx.drawImage(drawing, posX, posY, size, size)
}

Player.prototype.moveLeft = function () {
    if (this.x >= 1) 
        this.x -= 1;
}

Player.prototype.moveRight = function () {
    if (this.x <= N_WIDTH - 2)
        this.x += 1;
}

Player.prototype.moveDown = function () {
    if (this.y <= N_HEIGHT - 2)
        this.y += 1;
}

Player.prototype.moveUp = function () {
    if (this.y >= 1)
            this.y -= 1;
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
    let player = new Player("lily", TILE_SIZE, 1, 1, 'img/noah.png');

    let input = new InputHandler(player)

    function gameLoop() {
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
       // _drawSquares(ctx);
        player.draw(ctx);
        requestAnimationFrame(gameLoop);

    }

    requestAnimationFrame(gameLoop);

}

start();

//GLOBALS
const GAME_WIDTH = 750;
const GAME_HEIGHT = 500;
const N_WIDTH = 15;
const N_HEIGHT = 10;
const TILE_SIZE = 75;
const OBJ_SIZE = 40;
//35 px by 35 px


/****************************************************************************************************/
//NPC Functions

//function generate_npc() {
//    npc = {
//        x: 0, 
//        y: 0,
//        img: "/img/noah.png"
//    }
//    return npc;
//}
//
//function draw_npcs(npcs, ctx){
//    for ( var i = 0; i < length(); 
//}

/****************************************************************************************************/
//Player Functions
function Player(name, size, x, y, imgSrc) {
    this.name = name
    this.size = size
    this.position = {
        x: 20,
        y: GAME_HEIGHT/2 - 55
    }
    this.speed = {
        x: 0,
        y: 0
    }
    this.imgSrc = imgSrc
}


Player.prototype.draw = function (ctx) {
    drawing = new Image();
    drawing.src = this.imgSrc;
    size = this.size
    x = this.position.x
    y = this.position.y
    ctx.drawImage(drawing, x, y, size, size)
}

Player.prototype.moveLeft = function () {
    this.speed.x = -2;
}

Player.prototype.moveRight = function () {
    this.speed.x = 2;
}

Player.prototype.moveDown = function () {
    this.speed.y = 2;
}

Player.prototype.moveUp = function () {
    this.speed.y = -2;
}

Player.prototype.stopX = function () {
    this.speed.x = 0;
}

Player.prototype.stopY = function () {
    this.speed.y = 0;
}

Player.prototype.update = function (deltaTime) {
    
    if (this.speed.x < 0 && this.position.x >= 10)
        this.position.x += this.speed.x;
    
    else if (this.speed.x > 0 && this.position.x <= GAME_WIDTH - 100)
        this.position.x += this.speed.x;
    
     if (this.speed.y < 0 && this.position.y >= 10)
        this.position.y += this.speed.y;
    
    else if (this.speed.y > 0 && this.position.y <= GAME_HEIGHT - 100)
        this.position.y += this.speed.y;

}
/****************************************************************************************************/
//Drink Functions

function Drink(src, name, num) {
    this.carried = 0
    this.position = {
        x: (GAME_WIDTH - 150),
        y: (60 + 70*num)
    }
    this.imgSrc = src
    this.name = name
    this.size = OBJ_SIZE
}

Drink.prototype.draw = function(ctx){
    drawing = new Image();
    drawing.src = this.imgSrc
    size = this.size
    x = this.position.x
    y = this.position.y
    ctx.drawImage(drawing, x, y, size, size)
}

Drink.prototype.update = function (carried, player){
    if(carried == 1){
        this.carried = 1
        this.position = player.position
    }
    if(carried == -1)
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
    let player = new Player("lily", 75, 1, 1, 'img/noah.png');

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

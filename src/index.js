//GLOBALS
const GAME_WIDTH = 750;
const GAME_HEIGHT = 500;
const N_WIDTH = 15;
const N_HEIGHT = 10;
const SIZE = 75;

const OBJ_SIZE = 40;
//35 px by 35 px
const DJS_IMG_SIZE = 120
const PEOPLE_SIZE = 100



//TO CONVERT TO TEXT FILE
const NPC_COL = 15
const MINX = 3
const MAXX = 7
const MINY = 2
const MAXY = 5

var playerUpDown = [0, 1, 0, 1]
var playerLeft = [2, 3, 2, 4]
var playerRight = [7, 6, 7, 5]
var playerStill = [0, 0, 0, 0]

var usedNPCSprites = []


var places = [
    [3, 1], [3, 2], [3, 3], [3, 4], [3, 5],
    [4, 1], [4, 2], [4, 3], [4, 4], [4, 5],
    [4, 1], [4, 2], [4, 4], [4, 4], [4, 5],
    [5, 1], [5, 2], [5, 3], [5, 4], [5, 5],
    [6, 2], [6, 3], [6, 4], [6, 5], [7, 3],
    [7, 4], [7, 5], [8, 5]
]
var placesHolder = []

var count = 0;
var countNpc = 0;

var npcs = []
var desired_npcs = 4;
var drinks = []
var drink_options = [['img/martini.png', 'Martini'], ['img/cocktail.png', 'VodkaCran']]
var desiredDrinks = 3;
/****************************************************************************************************/
//NPC Functions

function Npc() {

    //get random location, that is available
    var randPos = 0;
    while (1) {
        randPos = Math.floor(Math.random() * 28)
        if (placesHolder[randPos] !== 1)
            break;
    }
    placesHolder[randPos] = 1
    this.position = {
        x: places[randPos][0] * SIZE,
        y: places[randPos][1] * SIZE
    }

    console.log(this.position)
    this.size = SIZE
    this.crop_size = PEOPLE_SIZE

    //Find random user
    var ranCol = -1
    do {
        ranCol = Math.floor(Math.random() * 15)
        if (npcs.length >= 15)
            break;
    } while (usedNPCSprites.includes(ranCol))
    //append used character
    usedNPCSprites.push(ranCol)

    //speed: 0, necessary to reuse player sprite functions
    this.speed = {
        x: 0,
        y: 0
    }

    //create sprite!
    //Prototype: Sprite(src, position, size, speed, dir, once, characterRow, characterCol)
    this.sprite = new Sprite('img/people.png', this.position, this.size, this.crop_size, this.speed, "npc_dance", false, 0, ranCol);

}


Npc.prototype.draw = function (ctx) {
    this.sprite.draw(ctx)
}

function create_npcs() {
    for (var i = 0; i < desired_npcs; i++) {
        npcs.push(new Npc)
    }
}

function update_npcs(deltaTime) {
    if (countNpc === 14) countNpc = 0;
    else countNpc = countNpc + 1;

    for (var i = 0; i < npcs.length; i++) {
        npcs[i].sprite.update(deltaTime, npcs[i].position, npcs[i].speed, countNpc)
        //dt, position, speed, count
    }
}

function draw_npcs(ctx) {
    for (var i = 0; i < npcs.length; i++) {
        npcs[i].draw(ctx)
    }
}

/****************************************************************************************************/
//Player Functions
function Player(name, size, x, y, imgSrc, characterCol) {
    this.name = name
    this.size = size
    this.crop_size = DJS_IMG_SIZE
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
    // not dancing, just walking, false for repeat anim
    // row is pos start (Unused for now, possible if mult people on same row)
    // 0 is for colun start of character
    this.sprite = new Sprite(this.imgSrc, this.position, this.size, this.crop_size, 600, "default", false, 0, characterCol)
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

    if (this.speed.x < 0 && this.position.x >= 10 && !checkCollides(this.position, this.size)) {
        this.position.x += this.speed.x
        if (checkCollides(this.position, this.size))
            this.position.x -= this.speed.x

    } else if (this.speed.x > 0 && this.position.x <= GAME_WIDTH - 100 && !checkCollides(this.position, this.size)) {
        this.position.x += this.speed.x
        if (checkCollides(this.position, this.size))
            this.position.x -= this.speed.x
    }

    if (this.speed.y < 0 && this.position.y >= 10 && !checkCollides(this.position, this.size)) {
        this.position.y += this.speed.y
        if (checkCollides(this.position, this.size))
            this.position.y -= this.speed.y

    } else if (this.speed.y > 0 && this.position.y <= GAME_HEIGHT - 100) {
        this.position.y += this.speed.y
        if (checkCollides(this.position, this.size))
            this.position.y -= this.speed.y
    }

    this.sprite.update(deltaTime, this.position, this.speed, count)

    if (count === 8) count = 0;
    else count = count + 1;

}

function checkCollides(position, size) {
    for (var i = 0; i < npcs.length; i++) {
        if (distCenters(position, size, npcs[i].position, size) <= 50)
            return true;
    }
    return false;
}


/****************************************************************************************************/
//Sprite Functions


/********************************
Sprite function code borrowed from (and edited)  
https://jlongster.com/Making-Sprite-based-Games-with-Canvas
********************************/
function Sprite(src, position, size, crop_size, speed, type, once, characterRow, characterCol) {
    this.position = {
        x: position.x,
        y: position.y
    }
    this.size = size;
    this.crop_size = crop_size;
    this.speed = {
        x: speed.x,
        y: speed.y
    }
    this.frames = frames
    this._index = 0
    this.imgSrc = src
    this.once = once
    this.type = type
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
    if ((count == 0 && (this.speed.x !== 0 || this.speed.y !== 0)) || (count == 0 && this.type === "npc_dance"))
        this._index += 1;
}

Sprite.prototype.draw = function (ctx) {

    var crop_size = this.crop_size
    //declare size of cropped image
    //get index of what frame we are in
    var idx = this._index
    var framesIn = []

    //get correct frames array based on direction
    if (this.type === "npc_dance")
        framesIn = playerUpDown
    else if (this.speed.x === 0 && this.speed.y === 0)
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

    xs = frame * crop_size
    xs += this.characterRow * crop_size
    ys = this.characterCol * crop_size

    //make new drawing
    drawing = new Image();
    drawing.src = this.imgSrc;

    ctx.drawImage(drawing, xs, ys,
        crop_size, crop_size,
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
    ctx.drawImage(drawing, x, y, size, size)
}

Drink.prototype.update = function (player) {
    if (this.carried === 1) {
        this.position.x = player.position.x + 10
        this.position.y = player.position.y + 10
    }
}


function create_drinks() {
    randPos = Math.floor(Math.random() * 2)
    for (var i = 0; i < desiredDrinks; i++)
        drinks.push(new Drink(drink_options[randPos][0], drink_options[randPos][1], i))
}

/****************************************************************************************************/
//Object handlers

function dist(position1, position2) {
    var a = position1.x - position2.x;
    var b = position1.y - position2.y;

    return Math.sqrt(a * a + b * b);
}

function distCenters(pos, size, pos2, size2) {
    x1 = pos.x + (size / 2)
    y1 = pos.y + (size / 2)

    x2 = pos2.x + (size2 / 2)
    y2 = pos2.y + (size2 / 2)

    var a = x1 - x2
    var b = y1 - y2
    return Math.sqrt(a * a + b * b)
}


function near(position1, position2, dist) {
    if (dist(position1, position2) <= 10)
        return true
    return false
}


function update_objects(player) {
    for (var i = 0; i < drinks.length; i++) {
        drinks[i].update(player)
    }
}

function draw_objects(ctx) {
    for (var i = 0; i < drinks.length; i++) {
        drinks[i].draw(ctx)
    }
}

function pickup(player) {
    for (var i = 0; i < desiredDrinks; i++) {
        if (distCenters(player.position, player.size, drinks[i].position, player.size) <= 50) {
            drinks[i].carried = (drinks[i].carried + 1) % 2
            console.log(drinks[0].name + " carried is : " + drinks[0].carried)
        }
    }
}
/****************************************************************************************************/
//Input Handler
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
                pickup(player);
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
            x = j * SIZE;
            y = k * SIZE;

            ctx.rect(x, y, SIZE, SIZE);
            ctx.stroke();
        }
    }
}


function contains(element, array) {
    for (var i = 0; i < array.length; i++) {
        if (element === array[i])
            return true
    }
    return false
}
/****************************************************************************************************/

function _drawPossiblePlaces(ctx) {
    ctx.font = "15px Arial";
    for (var i = 0; i < places.length; i++) {
        var str = places[i][0] + " " + places[i][1]
        ctx.fillText(str, places[i][0] * SIZE, places[i][1] * SIZE);
    }
}

/****************************************************************************************************/

//BEGIN GAME
function start() {
    //GET CANVAS, CTX
    let canvas = document.getElementById("gameScreen");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    //TODO: add to file read function
    for (var i = 0; i < 28; i++) {
        placesHolder.push(0)
    }
    //CREATE PLAYER
    //TODO: allow users to select character name, image, calculate tile size vs hardcoding 35
    let player = new Player("lily", SIZE, 1, 1, 'img/djs.png', 1);

    let input = new InputHandler(player)

    let lastTime = 0;

    create_drinks()
    create_npcs();
    //let test = new Npc()
    function gameLoop(timeStamp) {
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        //_drawSquares(ctx)

        update_objects(player)
        draw_objects(ctx)

        update_npcs(deltaTime)
        draw_npcs(ctx)

        player.update(deltaTime);
        player.draw(ctx);

        //checkCollisions(player)
        //_drawPossiblePlaces(ctx)
        requestAnimationFrame(gameLoop);

    }

    requestAnimationFrame(gameLoop);

}

start();

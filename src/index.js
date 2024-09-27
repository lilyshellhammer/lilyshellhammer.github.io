//GLOBALS
const GAME_WIDTH = 750;
const GAME_HEIGHT = 500;

const SIZE = 75;
const OBJ_SIZE = 50;
const DJS_IMG_SIZE = 120
const PEOPLE_SIZE = 100

var image_index = 0
var game_paused = 0;
//TO CONVERT TO TEXT FILE
const NPC_COL = 15

var playerUpDown = [0, 1, 0, 1]
var playerLeft = [2, 3, 2, 4]
var playerRight = [7, 6, 7, 5]
var playerStill = [0, 0, 0, 0]
var playerCelebrate = 8

var usedNPCSprites = []

var places = [
    [3, 1], [3, 2], [3, 3], [3, 4], [3, 5],
    [4, 1], [4, 2], [4, 3], [4, 4], [4, 5],
    [5, 1], [5, 2], [5, 3], [5, 4], [5, 5],
    [6, 2], [6, 3], [6, 4], [6, 5], [7, 3],
    [7, 4], [7, 5], [8, 5]
]
var placesHolder = []

var count = 0;
var countNpc = 0;
var countEnemy = 0;
var countDance = 0;
var objs = []
var npcs = []
var desiredNpcs = 5;
var drinks = []
var desiredDrinks = 3;

var winRect = {
    x: 75,
    y: 170,
    xSize: 60,
    ySize: 150
}

var dj_urls = ['img/djs/gladstone.png',
              'img/djs/noah.png',
              'img/djs/cj.png',
              'img/djs/brendan.png',
              'img/djs/pat.png',
              'img/djs/elias.png',
              'img/djs/michael.png',
              'img/djs/ryan.png',
              'img/djs/brad.png',
             ]

var collected = []
var npc_names = ["Veronica", "Lily", "George", "Christine", "Morgan", "Kirby", "Caitlyn", "Vera", "Jorge", "Irene", "Richie", "Jay", "Jisun", "Cassie", "Stephanie", "Liam", "Justin"]
//Globals for enemy level 2
var records = []
var enemyX = 700
var enemyY = 75

var lightsAdjusted = 0;
var lost = false;

var name = 'default name';
//TODO:
//Lights
//Light function, for pickup when you are in the region
//Player choose screen
//Win screen
//Level 1 banner
//Timer

//cookies?
//leader board

//Next level
//what is reusable
//records throwing
//collision detection, points lower
//health representation


/****************************************************************************************************/
//NPC Functions

function Npc() {

    //get random location, that is available
    r = getFreePos()
    this.position = {
        x: r.x,
        y: r.y
    }

    this.size = SIZE
    this.cropSize = PEOPLE_SIZE

    //Find random user
    var ranCol = -1
    do {
        ranCol = Math.floor(Math.random() * 17)
        if (npcs.length >= 17)
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
    this.sprite = new Sprite(npc_names[ranCol], 'img/people_names.png', this.position, this.size, this.cropSize, this.speed, "npc_dance", false, 0, ranCol);

}


Npc.prototype.draw = function (ctx) {
    this.sprite.draw(ctx)
}

function createNpcs() {
    for (var i = 0; i < desiredNpcs; i++) {
        npcs.push(new Npc)
    }
}

function updateNpcs(deltaTime) {
    if (countNpc === 14) countNpc = 0;
    else countNpc = countNpc + 1;

    for (var i = 0; i < npcs.length; i++) {
        npcs[i].sprite.update(deltaTime, npcs[i].position, npcs[i].speed, countNpc)
        //dt, position, speed, count
    }
}

function drawNpcs(ctx) {
    for (var i = 0; i < npcs.length; i++) {
        npcs[i].draw(ctx)
    }
}

/****************************************************************************************************/
//Enemy Functions

function updateRecordEnemy(deltaTime) {
    countEnemy = countEnemy + 1;

    if (countEnemy % 150 === 0 && records.length < 7) {

        records.push(new Object('img/objects.png', "Record", records.length, 1, 1))
        records[records.length - 1].position.x = enemyX
        records[records.length - 1].position.y = (enemyY + (Math.floor(Math.random() * 5) * SIZE))

        records.push(new Object('img/objects.png', "Record", records.length, 1, 1))
        records[records.length - 1].position.x = enemyX
        records[records.length - 1].position.y = (enemyY + (Math.floor(Math.random() * 5) * SIZE))
    }

    if (countEnemy % 5 === 0) {
        for (var i = 0; i < records.length; i++) {
            if (records[i].position.x - 10 <= 0) {
                records[i].position.x = enemyX
                records[i].position.y = (enemyY + (Math.floor(Math.random() * 5) * SIZE))

            } else
                records[i].position = {
                    x: records[i].position.x - 7, //(3 + countEnemy*(0.005)),
                    y: records[i].position.y
                }
        }
    }

}

function drawRecordEnemy(ctx) {
    for (var i = 0; i < records.length; i++) {
        records[i].draw(ctx)
    }
}

/****************************************************************************************************/
//Player Functions
function Player(name, size, x, y, imgSrc, characterCol) {
    this.name = name
    this.size = size
    this.cropSize = DJS_IMG_SIZE
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
    this.sprite = new Sprite(this.name, this.imgSrc, this.position, this.size, this.cropSize, 600, "default", false, 0, characterCol)
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

Player.prototype.update = function (deltaTime, level) {

    if (this.speed.x < 0 && this.position.x >= 10 && !checkCollides(level, this.position, this.size)) {
        this.position.x += this.speed.x
        if (checkCollides(this.position, this.size))
            this.position.x -= this.speed.x

    } else if (this.speed.x > 0 && this.position.x <= GAME_WIDTH - 100 && !checkCollides(level, this.position, this.size)) {
        this.position.x += this.speed.x
        if (checkCollides(this.position, this.size))
            this.position.x -= this.speed.x
    }

    if (this.speed.y < 0 && this.position.y >= 10 && !checkCollides(level, this.position, this.size)) {
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

function checkCollides(level, position, size) {
    if (level === 1) {
        for (var i = 0; i < npcs.length; i++) {
            if (distCenters(position, size, npcs[i].position, size) <= 50)
                return true;
        }
    } else if (level === 2) {
        for (var i = 0; i < records.length; i++) {
            if (distCenters(position, size, records[i].position, size) <= 30) {
                lost = true;
                return true;
            }

        }
    }
    return false;
}


/****************************************************************************************************/
//Sprite Functions


/********************************
Sprite function code borrowed from (and edited)
https://jlongster.com/Making-Sprite-based-Games-with-Canvas
********************************/
function Sprite(name, src, position, size, cropSize, speed, type, once, characterRow, characterCol) {
    this.name = name;
    this.position = {
        x: position.x,
        y: position.y
    }
    this.size = size;
    this.cropSize = cropSize;
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

    var cropSize = this.cropSize
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

    xs = frame * cropSize
    xs += this.characterRow * cropSize
    ys = this.characterCol * cropSize

    //make new drawing
    drawing = new Image();
    drawing.src = this.imgSrc;

    ctx.drawImage(drawing, xs, ys,
        cropSize, cropSize,
        this.position.x, this.position.y,
        this.size, this.size);

    ctx.font = "10px Courier";
    ctx.fillStyle = "#dedede";
    ctx.fillText(this.name, this.position.x + 10, this.position.y - 5);
}

/****************************************************************************************************/
//Object Functions

function Object(src, name, num, x, y) {
    this.carried = 0
    this.name = name
    if (this.name === 'Cocktail') {
        this.position = {
            x: (GAME_WIDTH - 150),
            y: (60 + 70 * num)
        }
    } else {
        r = getFreePos()
        this.position = {
            x: r.x,
            y: r.y
        }
    }
    this.imgSrc = src
    this.name = name
    this.size = OBJ_SIZE
    this.cropSize = SIZE
    this.clip = {
        x: x,
        y: y,
    }
    this.frozen = 0
}

Object.prototype.draw = function (ctx) {
    drawing = new Image();
    drawing.src = this.imgSrc
    size = this.size
    cropSize = this.cropSize
    xs = this.clip.x * this.cropSize
    ys = this.clip.y * this.cropSize
    ctx.drawImage(drawing, xs, ys,
        cropSize, cropSize,
        this.position.x, this.position.y,
        size, size);
}

Object.prototype.update = function (player) {
    if (this.carried === 1) {
        this.position.x = player.position.x + 10
        this.position.y = player.position.y + 10
    }
}


function createDrinks() {
    randPos = Math.floor(Math.random() * 2)
    for (var i = 0; i < desiredDrinks; i++)
        objs.push(new Object('img/objects.png', "Cocktail", i, randPos, 0))
}

function createMiscObjs() {
    //add USB
    objs.push(new Object('img/objects.png', "USB", 0, 0, 1))
    //add Record
    objs.push(new Object('img/objects.png', "Record", 1, 1, 1))
}


function updateObjects(player) {
    for (var i = 0; i < objs.length; i++) {
        objs[i].update(player)
        if (objs[i].frozen !== 1 && inside(objs[i].position, winRect)) {
            objs[i].frozen = 1;
            collected.push(objs[i].name)

            //            updateText();
        }
    }
}

function drawObjects(ctx) {
    for (var i = 0; i < objs.length; i++) {
        objs[i].draw(ctx)
    }
}


function pickup(player) {
    var x = 0
    for (var i = 0; i < objs.length; i++) {
        if (distCenters(player.position, player.size, objs[i].position, player.size) <= 50) {
            if (!(objs[i].carried === 0 && objs[i].frozen === 1)) {
                objs[i].carried = (objs[i].carried + 1) % 2
                x = 1
            }
        }
    }
    return x
}

/****************************************************************************************************/
//Light Box

function checkLights(player) {
    lightsPos = {
        x: 500,
        y: 30
    }
    if (dist(player.position, lightsPos) <= 35) {
        lightsAdjusted = (lightsAdjusted + 1) % 2
    }
}

function drawLights(ctx) {
    if (lightsAdjusted !== 0) {
        drawing = new Image();
        drawing.src = 'img/lights.png'
        ctx.drawImage(drawing, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
}

/****************************************************************************************************/
//Dist handlers


function inside(position, rect) {
    if ((position.x > rect.x && position.x < (rect.x + rect.xSize)))
        if (position.y > rect.y && position.y < (rect.y + rect.ySize))
            return true
    return false;
}

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
                if (!pickup(player))
                    checkLights(player);
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

function getFreePos() {
    var x = 0;
    while (1) {
        var randPos = Math.floor(Math.random() * 23)
        if (placesHolder[randPos] !== 1) {
            x = randPos
            break;
        }
    }
    placesHolder[randPos] = 1
    return {
        x: places[x][0] * SIZE,
        y: places[x][1] * SIZE
    }

}


function getFreePosPlusTop() {
    var x = 0;
    while (1) {
        var randPos = Math.floor(Math.random() * 23)
        var checkX = places[randPos].x
        var checkY = places[randPos].y + 1
        var freeTop = 0
        for (var i = 0; i < places.length; i++) {
            if (contains([(places[randPos].x), (places[randPos].y + 1)], places))
                freeTop = 1
        }
        if (placesHolder[randPos] !== 1 && freeTop !== 1) {
            x = randPos
            break;
        }
    }
    placesHolder[randPos] = 1
    return {
        x: places[x][0] * SIZE,
        y: places[x][1] * SIZE
    }

}

function _drawPossiblePlaces(ctx) {
    ctx.font = "15px Arial";
    for (var i = 0; i < places.length; i++) {
        var str = places[i][0] + " " + places[i][1]
        ctx.fillText(str, places[i][0] * SIZE, places[i][1] * SIZE);
    }
}
/****************************************************************************************************/
function checkWin2(player) {
    winPos2 = {
        x: 655,
        y: 450
    }
    if (lightsAdjusted === 1 && dist(player.position, winPos2) < 60)
        return true;
    return false;
}


function checkWin1() {
    var cocktailCount = 0
    if (collected.length > 2) {
        for (var i = 0; i < collected.length; i++) {
            if (collected[i] === "Cocktail") {
                cocktailCount += 1
            }
        }
        if (collected.length + 1 - cocktailCount === 3) {
            return true;
        }
    }
    return false;
}

function drawDance(player, ctx) {
    countDance += 1
    var cropSize = player.sprite.cropSize

    var xs = 8 * cropSize
    xs += player.sprite.characterRow * cropSize
    var ys = player.sprite.characterCol * cropSize


    var x = player.position.x
    var y = player.position.y + (10 * (countDance % 2))

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    //make new drawing
    drawing = new Image();
    drawing.src = player.imgSrc;

    ctx.drawImage(drawing, xs, ys,
        cropSize, cropSize,
        x, y,
        player.size, player.size);
}

function animateWin(player, ctx) {
    drawDance()
    while (count < 5) {
        setTimeout(drawDance, 2000)

    }

}
/****************************************************************************************************/



// Menu and image selection functions
/****************************************************************************************************/
$("#next_image").click(function () {
    image_index = (image_index + 1) % 8;

    document.getElementById('djs').src = dj_urls[image_index];


});

$("#prev_image").click(function () {
    if (image_index == 0)
        image_index = 8;
    else image_index--;

    document.getElementById('djs').src = dj_urls[image_index];
});


$("#submit").click(function () {
    if ($('#username').val() != '') {
        name = $('#username').val();
        menu();
    } else {
        $('#chooseDJtext').text('Enter a username to continue!     ')
    }
});


function menu() {
    
    $('.gameWrapper').removeClass('hidden');
    $('.menuOptions').addClass('hidden');
    $('#missions').removeClass('hidden');
    $('.restart-game').removeClass('hidden');

    var player = new Player('', SIZE, 1, 1, 'img/djs_all.png', image_index);
    var input = new InputHandler(player)

    $('#username_display').text(name);
    banner = 1;
    game_paused = 200;
    level2(player, input)
}





//function banner(type) {
//    let canvas = document.getElementById("gameScreen");
//    let ctx = canvas.getContext("2d");
//
//    if (type === 'level1') {
//        drawing = new Image();
//        drawing.src = "img/banners/level1.png"
//        ctx.drawImage(drawing, 0, 0)
//        ctx.drawImage(drawing, 0, 0)
//        ctx.drawImage(drawing, 0, 0)
//        
//        game_paused = 200;
//
//    } else if (type === 'level2') {
//        drawing = new Image();
//        drawing.src = "img/banners/level2.png"
//        ctx.drawImage(drawing, 60, 150)
//        game_paused = 200;
//
//    } else if (type === 'winner') {
//        drawing = new Image();
//        drawing.src = "img/banners/winner.png"
//        ctx.drawImage(drawing, 60, 150)
//        game_paused = 200;
//    }
//}
//
//
function gameOver() {
   let canvas = document.getElementById("gameScreen");
   let ctx = canvas.getContext("2d");
   drawing = new Image();
   drawing.src = "img/banners/gameover.png"
   ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
   ctx.drawImage(drawing, 60, 150)
   game_paused = 1000;

}

// Level functions
/****************************************************************************************************/

function level2(player, input) {
    //GET CANVAS, CTX, SHOW MISSION
    let canvas = document.getElementById("gameScreen");
    let ctx = canvas.getContext("2d");
//    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    document.getElementById("missions").innerHTML = "Adjust the lights and levels and then head to the exit! Don't get hit!"

    document.getElementById("bodyNotifications").innerHTML = "<br> Use ARROWS to move! <br><br>Use SPACE to turn on the lights! <br> Dont get hit!"

    let lastTime = 0;
    lost = false
    lightsAdjusted = 0;
    var countAlert = 0;
    var level = 2;

    records.push(new Object('img/objects.png', "Record", records.length, 1, 1))
    records[records.length - 1].position.x = enemyX
    records[records.length - 1].position.y = (enemyY + (Math.floor(Math.random() * 5) * SIZE))

    function gameLoop2(timeStamp) {
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

//        console.log(game_paused); 
        if (game_paused <= 0) {
            ctx.font = "20px Arial";
            ctx.fillText("EXIT", 655, 450);

            player.update(deltaTime, level);
            player.draw(ctx);

            updateRecordEnemy(deltaTime)
            drawRecordEnemy(ctx)
            
            drawLights(ctx);
        } else {
            if(banner === 0){
                drawing = new Image();
                drawing.src = "img/banners/winner.png"
                ctx.drawImage(drawing, 150, 160)
            }
            else if(banner === 2){
                drawing = new Image();
                drawing.src = "img/banners/level2.png"
                ctx.drawImage(drawing, 150, 160)
            }
            else if(banner === 4){
                drawing = new Image();
                drawing.src = "img/banners/gameover.png"
                ctx.drawImage(drawing,150, 160)
            }
            game_paused--
        }

        if (!checkWin2(player) && lost === false)
            requestAnimationFrame(gameLoop2);
        else {
            if (lost === true){
                banner = 4;
                game_paused = 200;
                requestAnimationFrame(gameLoop2);
            }
            else {
                banner = 0;
                game_paused = 200;
                requestAnimationFrame(gameLoop2);

            }
            
            
        }


    }

    requestAnimationFrame(gameLoop2);
}


function level1(player, input) {
    ///GET CANVAS, CTX, SHOW MISSION
    let canvas = document.getElementById("gameScreen");
    let ctx = canvas.getContext("2d");
//    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    document.getElementById("missions").innerHTML = "Get your RECORD, USB, and DRINK and bring it back to the RED DJ PODIUM before your set begins!"

    //CREATE PLAYER
    //TODO: allow users to select character name, image, calculate tile size vs hardcoding 35
    let lastTime = 0;

    var won = false

    let level = 1;

    createDrinks()
    createMiscObjs()
    createNpcs();

    var countAlert = 0;
    //let test = new Npc()
    function gameLoop(timeStamp) {
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        

        if (game_paused <= 0) {
            ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            //_drawSquares(ctx)

            //draw win rectangle
            ctx.fillStyle = "rgba(255, 20, 20,0.1)"
            ctx.fillRect(winRect.x, winRect.y, winRect.xSize, winRect.ySize);


            updateObjects(player)
            drawObjects(ctx)

            updateNpcs(deltaTime)
            drawNpcs(ctx)

            player.update(deltaTime, level);
            player.draw(ctx);
            
            //checkCollisions(player)
            //_drawPossiblePlaces(ctx)
        } else {
            if(banner === 1){
                drawing = new Image();
                drawing.src = "img/banners/level1.png"
                ctx.drawImage(drawing, 150, 160)
            }
            game_paused--;
        }
        
        if (!checkWin1(level))
            requestAnimationFrame(gameLoop);
        else {
            banner = 2
            game_paused = 200;
            level2(player, input)
        }


    }

    requestAnimationFrame(gameLoop);
}

if (window.innerWidth < 1000 || window.innerHeight < 610) {
    alert("Window too small! Please use a full screen greater than ~ 10 X 6 inches to play")
}


// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
canvas.id = "game_box";
document.getElementById("game").appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();

heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";


// speed_up image
var speed_up_ready = false;
var speed_up_image = new Image();
speed_up_image.onload = function() {
	speed_up_ready = true;
};
speed_up_image.src = "images/speed_up.png";
var speed_up = {};

// clock image
var clock_ready = false;
var clock_image = new Image();
clock_image.onload = function() {
	clock_ready = true;
};
clock_image.src = "images/clock.png";
var clock = {};

// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	x: canvas.width / 2,
	y: canvas.height / 2
};

var monster = {};
var monstersCaught = 0;
var top_score = 0;
var Timer;
var TotalSeconds;
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {

	//Randomly place the speed up
	if(Math.floor(Math.random() * 100) > 90) {
		speed_up.x = 32 + (Math.random() * (canvas.width - 64));
		speed_up.y = 32 + (Math.random() * (canvas.height - 64));
		window.setTimeout(function() {
			removeSpeedup();
		}, 2000);
	}

	//Randomly place the clock up
	if(Math.floor(Math.random() * 100) > 90) {
		clock.x = 32 + (Math.random() * (canvas.width - 64));
		clock.y = 32 + (Math.random() * (canvas.height - 64));
		window.setTimeout(function() {
			removeClock();
		}, 2000);
		
	}

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}

	if (
		hero.x <= (speed_up.x + 32)
		&& speed_up.x <= (hero.x + 32)
		&& hero.y <= (speed_up.y + 32)
		&& speed_up.y <= (hero.y + 32)
	) {
		changeSpeed(512);
		removeSpeedup();
	}

	if (
		hero.x <= (clock.x + 32)
		&& clock.x <= (hero.x + 32)
		&& hero.y <= (clock.y + 32)
		&& clock.y <= (hero.y + 32)
	) {
		removeClock();
		changeTime(7);
	}
	
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	if (speed_up_ready) {
		ctx.drawImage(speed_up_image, speed_up.x, speed_up.y, 30, 30);
	}

	if (clock_ready) {
		ctx.drawImage(clock_image, clock.x, clock.y, 30, 30);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
	ctx.fillText("Top score: " + top_score, 32, 64);
	ctx.fillText("Time: " + Timer, canvas.width - 256, 32);
};

function resetGame() {
	TotalSeconds = 30;
	monstersCaught = 0;
}

function Tick() {
	if(TotalSeconds <= 0) {
		if(top_score < monstersCaught){
			top_score = monstersCaught;
		}
		resetGame();
	}

	TotalSeconds -= 1;
	UpdateTimer();
	window.setTimeout("Tick()", 1000);
}

function UpdateTimer() {
	var Seconds = TotalSeconds;

	var Days = Math.floor(Seconds / 86400);
	Seconds -= Days * 86400;

	var Hours = Math.floor(Seconds / 3600);
	Seconds -= Hours * (3600);

	var Minutes = Math.floor(Seconds / 60);
	Seconds -= Minutes * (60);

	var TimeStr = ((Days > 0) ? Days + " days " : "") + LeadingZero(Hours) + ":" + LeadingZero(Minutes) + ":" + LeadingZero(Seconds)


	Timer = TimeStr;
}

function CreateTimer(Time) {
	TotalSeconds = Time;
	UpdateTimer();
	window.setTimeout("Tick()", 1000);
}

function LeadingZero(Time) {
	return (Time < 10) ? "0" + Time : + Time;
}


// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();
	// console.log("main being called");
	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
CreateTimer(30);

function changeSpeed(speed){
	hero.speed = speed;
	window.setTimeout(function() {
		hero.speed = 256;
	}, 3000);
}

function createSpeedups(speed) {
	changeSpeed(speed);
}

function removeSpeedup(){
	speed_up.x = 1000;
	speed_up.y = 1000;
}

function removeClock() {
	clock.x = 1000;
	clock.y = 1000;
}

function changeTime(time) {
	TotalSeconds += 7;
}
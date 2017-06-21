// CONSTANTS
var BALL_SPEED = {x: 4, y: -6};
var BALL_WIDTH = 8;
var BUMPER_WIDTH = 75;
var BUMPER_SPEED = 15;
var BRICK_COLUMNS = 5;
var BRICK_ROWS = 12;
var BRICK_COLORS = ['#14cde4', '#aabbcc', '#5f5faa', '#fdf215', '#4591cb'];
var BRICK_WIDTH = 50;
var BRICK_HEIGHT = 10;
var BRICK_SPACE = 9;
var CANVAS_WIDTH = 700;
var CANVAS_HEIGHT = 475;
var GAME_LOOP = 40;
var SCORE_SLOTS = 3;

// GLOBAL VARS
var canvas = null;
var state = 'initial';
var score = 0;
var ballspeed;
var gameInterval, effectInterval;
var bricks = [];
var keys;
var locations;

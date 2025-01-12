/*
    Little JS Starter Project
    - A simple starter project for LittleJS
    - Demos all the main engine features
    - Builds to a zip file
*/

import * as LittleJS from "littlejsengine";

const {
  setShowSplashScreen,
  Color,
  Sound,
  Medal,
  ParticleEmitter,
  PI,
  engineInit,
  medalsInit,
  tile,
  mouseWasPressed,
  drawRect,
  drawTile,
  vec2,
  hsl,
  drawTextScreen,
  TileLayer,
  TileLayerData,
  initTileCollision,
  randInt,
  randColor,
  setCameraPos,
  setCameraScale,
  setGravity,
  setTileCollisionData,
} = LittleJS;

// show the LittleJS splash screen
setShowSplashScreen(true);

// sound effects
const sound_click = new Sound([1, 0.5]);

// medals
const medal_example = new Medal(0, "Example Medal", "Welcome to LittleJS!");
medalsInit("Hello World");

// game variables
let particleEmitter: LittleJS.ParticleEmitter;

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
  // create tile collision and visible tile layer
  const tileSize = vec2(32, 16);
  initTileCollision(tileSize);

  const { mainContext, textureInfos } = LittleJS;
  const pos = vec2();
  const tileLayer = new TileLayer(pos, tileSize);

  // get level data from the tiles image
  const tileImage = textureInfos[0].image;
  mainContext.drawImage(tileImage, 0, 0);
  const imageData = mainContext.getImageData(
    0,
    0,
    tileImage.width,
    tileImage.height
  ).data;
  for (pos.x = tileSize.x; pos.x--; )
    for (pos.y = tileSize.y; pos.y--; ) {
      // check if this pixel is set
      const i = pos.x + tileImage.width * (15 + tileSize.y - pos.y);
      if (!imageData[4 * i]) continue;

      // set tile data
      const tileIndex = 1;
      const direction = randInt(4);
      const mirror = !!randInt(2);
      const color = randColor();
      const data = new TileLayerData(tileIndex, direction, mirror, color);
      tileLayer.setData(pos, data);
      setTileCollisionData(pos, 1);
    }

  // draw tile layer with new data
  tileLayer.redraw();

  // setup camera
  setCameraPos(vec2(16, 8));
  setCameraScale(48);

  // enable gravity
  setGravity(-0.01);

  // create particle emitter
  particleEmitter = new ParticleEmitter(
    vec2(16, 9),
    0, // emitPos, emitAngle
    1,
    0,
    500,
    PI, // emitSize, emitTime, emitRate, emiteCone
    tile(0, 16), // tileIndex, tileSize
    new Color(1, 1, 1),
    new Color(0, 0, 0), // colorStartA, colorStartB
    new Color(1, 1, 1, 0),
    new Color(0, 0, 0, 0), // colorEndA, colorEndB
    2,
    0.2,
    0.2,
    0.1,
    0.05, // time, sizeStart, sizeEnd, speed, angleSpeed
    0.99,
    1,
    1,
    PI, // damping, angleDamping, gravityScale, cone
    0.05,
    0.5,
    true,
    true // fadeRate, randomness, collide, additive
  );
  particleEmitter.elasticity = 0.3; // bounce when it collides
  particleEmitter.trailScale = 2; // stretch in direction of motion
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
  const { mousePos, mousePosScreen } = LittleJS;

  if (mouseWasPressed(0)) {
    // play sound when mouse is pressed
    sound_click.play(mousePos);

    // change particle color and set to fade out
    particleEmitter.colorStartA = new Color();
    particleEmitter.colorStartB = randColor();
    particleEmitter.colorEndA = particleEmitter.colorStartA.scale(1, 0);
    particleEmitter.colorEndB = particleEmitter.colorStartB.scale(1, 0);

    // unlock medals
    medal_example.unlock();
  }

  // move particles to mouse location if on screen
  if (mousePosScreen.x) particleEmitter.pos = mousePos;
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
  // draw a grey square in the background without using webgl
  drawRect(vec2(16, 8), vec2(20, 14), hsl(0, 0, 0.6), 0, false);

  // draw the logo as a tile
  drawTile(vec2(21, 5), vec2(4.5), tile(3, 128));
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
  // draw to overlay canvas for hud rendering
  drawTextScreen(
    "LittleJS Engine Demo",
    vec2(LittleJS.mainCanvasSize.x / 2, 70),
    80, // position, size
    hsl(0, 0, 1),
    6,
    hsl(0, 0, 0)
  ); // color, outline size and color
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);

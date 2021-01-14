// Assuming ball starts at 19.07 ft out and about 13.5 feet high

const imageHeight = 513;
const imageWidth = 908;

const imageDomain = [-4.5, 28]; // used in imageOverlayGrid.js
const imageRange = [0.2, 18]; // used in imageOverlayGrid.js

const shotXRange = 638 // 538px + 100px;
const shotYRange = imageHeight;

const graphWidth = 324;
const graphHeight = 320;

const graphXOffset = 73; // could be different for the two different charts

const offScreenValue = -50;

const canvas = document.getElementById('animation')
const c = canvas.getContext('2d')
canvas.width = imageWidth;
canvas.height = imageHeight;

let line = [];
let line2 = [];
let ballAndLineArray = [];
let ballAndLineArray2 = [];

// Draw or erase
let tooltype = 'draw';

document.documentElement.style.cursor = 'url("http://www.iwansfactory.com/tycoon/movecursor.png"), default';

// Range Slider
let cx = document.getElementById('xpos');
cx.addEventListener('change', moveSlider, true);

// Lines
var lineCanvas = document.getElementById("line");
var firstLine = lineCanvas.getContext("2d");

lineCanvas.width = graphWidth;
lineCanvas.height = graphHeight;

var line2Canvas = document.getElementById("line2");
var secondLine = line2Canvas.getContext("2d");

line2Canvas.width = graphWidth;
line2Canvas.height = graphHeight;

let xPos = 0;
let playing = false;

function createVertLine(vertLine, position) {
  vertLine.clearRect(0,0, graphWidth, graphHeight);
  
  // Draw new one...
  vertLine.beginPath();
  vertLine.strokeStyle = "black";
  vertLine.lineWidth = 1;
  vertLine.moveTo(position, 0);
  vertLine.lineTo(position, graphHeight);
  vertLine.stroke();
}

function moveSlider() {
  let sliderX = parseInt(cx.value);
  
  createVertLine(firstLine, sliderX);
  createVertLine(secondLine, sliderX);
  
  xPos = parseInt(sliderX);

  // Update Ball position
  ballAndLineArray2 && ballAndLineArray.forEach((item, i) => {
    // Why do I need to add + 12 here?
    // Need to allow for multiple lines
    let newLine = ballAndLineArray2.map(item => item.line).flat();
    item.ball.x = newLine.filter(item => item.x === xPos)[0] && getX(newLine.filter(item => item.x === xPos)[0].y + 12) || offScreenValue;
    
    // Why do I need to subtract 10 here?
    item.ball.y = item.line.filter(item => item.x === xPos)[0] && getY((graphHeight - 10) - item.line.filter(item => item.x === xPos)[0].y) || offScreenValue
  })

  ballAndLineArray && ballAndLineArray2.forEach((item, i) => {
    // Why do I need to add + 12 here?
    // Need to allow for multiple Lines
    let newLine = ballAndLineArray.map(item => item.line).flat();
    item.ball.y = newLine.filter(item => item.x === xPos)[0] && getY((graphHeight - 10) - newLine.filter(item => item.x === xPos)[0].y) || offScreenValue;
    
    // Why do I need to subtract 10 here?
    item.ball.x = item.line.filter(item => item.x === xPos)[0] && getX(item.line.filter(item => item.x === xPos)[0].y + 12) || offScreenValue
  })

}

function animateVerticalTimeLine() {
  if(!playing) {
    cancelAnimationFrame(animateVerticalTimeLine);
    return;
  }

  xPos += 1; // Adjust to make the animation faster
  
  if(xPos >= graphWidth) {
    playing = false;
    btn.value = "Play";
  }
  // Update slider value
  cx.value = xPos;

  if(playing) requestAnimationFrame(animateVerticalTimeLine);
}

// Draw line on graph
const canvas2 = document.getElementById('draw');
const ctx = canvas2.getContext('2d');
canvas2.width = 400;
canvas2.height = 400;

// Line style
createLine(ctx);

let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas2.addEventListener('mousedown', (e) => {
    line = [];
    isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas2.addEventListener('mousemove', e => draw(e, ctx, line, isDrawing));

canvas2.addEventListener('mouseup', () => {
  isDrawing = false;
  if (tooltype == 'draw') {
    ballAndLineArray.push({
      line: computePoints(line),
      ball: new Ball(innerWidth / 2, innerHeight / 2, 11, 'orange')
    })
  }
});

canvas2.addEventListener('mouseout', () => {
  isDrawing = false;
});

// second Chart
const canvas3 = document.getElementById('draw2');
const ctxx = canvas3.getContext('2d');
canvas3.width = 400;
canvas3.height = 400;

createLine(ctxx);

let isDrawing2 = false;

canvas3.addEventListener('mousedown', (e) => {
  line2 = [];
  isDrawing2 = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas3.addEventListener('mousemove', e => {
  draw2(e, ctxx, line2, isDrawing2)
});

canvas3.addEventListener('mouseup', () => {
  isDrawing2 = false;

  ballAndLineArray2.push({
    line: computePoints(line2),
    ball: new Ball(innerWidth / 2, innerHeight / 2, 11, 'orange')
  })
});

canvas3.addEventListener('mouseout', () => {
  isDrawing2 = false;
});

// Animation
const animate = () => {
  requestAnimationFrame(animate);
  requestAnimationFrame(moveSlider);
  c.clearRect(0, 0, canvas.width, canvas.height);
  ballAndLineArray.forEach(item => item.ball.update())
  ballAndLineArray2.forEach(item => item.ball.update())
}

animate();

// Play button
document.getElementById("btn").addEventListener('click', function(e) {
  e.preventDefault();

  console.log(ballAndLineArray, ballAndLineArray2)

  if(playing) {
    // pause...
    playing = false;
  }
  else {
    playing = !playing;
    animateVerticalTimeLine();
  }
  
  btn.value = playing?"Pause":"Play";
});

// Utils
const computePoints = function(line) {
  let linePoints = [];
  for (let p = 0; p < line.length - 1; p++) {
    const point1 = line[p];
    const point2 = line[p + 1];
    
    const distanceX = Math.abs(point2.x - point1.x);
    const distanceY = Math.abs(point2.y - point1.y);
    const deltaYperX = distanceY / distanceX;
    
    for (let px = Math.round(point1.x); px <= point2.x; px++) {
      const deltaX = px - point1.x;
      const py = point2.y <= point1.y ? Math.round(point1.y + deltaYperX * deltaX * -1) : Math.round(point1.y + deltaYperX * deltaX); // Math round is causing slight choppiness
      linePoints.push({ x: px - graphXOffset , y: graphHeight - py });
    }
  }
  return linePoints;
};

// Ball 
function Ball(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
};

Ball.prototype.draw = function () {
  c.beginPath();
  c.fillStyle = this.color;
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.fill();
  c.closePath();
};

Ball.prototype.update = function () {
  this.draw();
};

function getX(x) {
  return x * (imageWidth/graphWidth);
}

function getY(y) {
  return y * (imageHeight/graphHeight);
}

function draw(e, context, lineArray, isDrawing) {
  if (!isDrawing) return; // stop the fn from running when they are not moused down

  context.beginPath();

  if(tooltype =='draw') {
    context.globalCompositeOperation = 'source-over';
    context.strokeStyle = 'black';  
    context.lineWidth = 5;
  } else {
    context.strokeStyle = '#123456';
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = 20;
    context.globalCompositeOperation = 'destination-out';
  }

  context.moveTo(lastX, lastY);
  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];

  if (tooltype == 'draw') {
    lineArray.push({ x: lastX, y: lastY });
  } else {
    ballAndLineArray = ballAndLineArray.map(item => {
      const radius = 9;
      const inRangeX = item => lastX - graphXOffset - radius < item.x && item.x < lastX - graphXOffset + radius;
      const inRangeY = item => (graphHeight - lastY) - radius < item.y && item.y < (graphHeight - lastY) + radius;
      return {
        ...item,
        line: item.line
        .filter(item => !isNaN(item.y))
        .filter( // include all points not in the radius
          item => !inRangeX(item) || !inRangeY(item)
        )
      }
    })
  }
}

function draw2(e, context, lineArray, isDrawing) {
  if (!isDrawing) return; // stop the fn from running when they are not moused down

  context.beginPath();

  if(tooltype =='draw') {
    context.globalCompositeOperation = 'source-over';
    context.strokeStyle = 'black';  
    context.lineWidth = 5;
  } else {
    context.strokeStyle = '#123456';
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = 20;
    context.globalCompositeOperation = 'destination-out';
  }

  context.moveTo(lastX, lastY);
  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];

  if (tooltype == 'draw') {
    lineArray.push({ x: lastX, y: lastY });
  } else {
    ballAndLineArray2 = ballAndLineArray2.map(item => {
      const radius = 9;
      const inRangeX = item => lastX - graphXOffset - radius < item.x && item.x < lastX - graphXOffset + radius;
      const inRangeY = item => (graphHeight - lastY) - radius < item.y && item.y < (graphHeight - lastY) + radius;
      return {
        ...item,
        line: item.line
        .filter(item => !isNaN(item.y))
        .filter( // include all points not in the radius
          item => !inRangeX(item) || !inRangeY(item)
        )
      }
    })
  }
}

function use_tool(tool) {
  tooltype = tool;
}

function createLine(context) {
  context.strokeStyle = '#BADA55';
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.lineWidth = 4;
  context.globalCompositeOperation = 'multiply';
}

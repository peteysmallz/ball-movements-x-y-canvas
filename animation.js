// Assuming ball starts at 21 ft out and about 13 feet high

const canvas = document.getElementById('animation')
const c = canvas.getContext('2d')
canvas.width = 856;
canvas.height = 482;

let line = [];
let line2 = [];
let ballAndLineArray = [];
let ballAndLineArray2 = [];

// Range Slider

let cx = document.getElementById('xpos');
cx.addEventListener('change', moveSlider, true);

// Line

var lineCanvas = document.getElementById("line");
var firstLine = lineCanvas.getContext("2d");
const w = 320;
const h = lineCanvas.height;

var lineCanvas = document.getElementById("line2");
var secondLine = lineCanvas.getContext("2d");


let xPos = 0;
let playing = false;

function createVertLine(vertLine, position) {
  vertLine.clearRect(0,0, w, h);
  
  // Draw new one...
  vertLine.beginPath();
  vertLine.strokeStyle = "black";
  vertLine.lineWidth = 1;
  vertLine.moveTo(position, 400);
  vertLine.lineTo(position, 0);
  vertLine.stroke();
}

function moveSlider() {
  let sliderX = cx.value;
  
  createVertLine(firstLine, sliderX);
  createVertLine(secondLine, sliderX);
  xPos = parseInt(sliderX);

  // Update Ball position
  ballAndLineArray.forEach((item, i) => {
    // 82 is the sapce from left border to y-axix
    item.ball.x = (ballAndLineArray2[0] && ballAndLineArray2[0].line.filter(item => item.x === (xPos + 82))[0]) && 800 - getX(ballAndLineArray2[0].line.filter(item => item.x === (xPos + 82))[0].y) || -200;
    item.ball.y = item.line.filter(item => item.x === (xPos + 82))[0] && item.line.filter(item => item.x === (xPos + 82))[0].y || 20
  })
}

function animateVerticalTimeLine() {
  if(!playing) {
    cancelAnimationFrame(animateVerticalTimeLine);
    return;
  }

  xPos += 1;
  
  if(xPos >= w) {
    // xPos = 0;
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

  ballAndLineArray.push({
    line: computePoints(line),
    ball: new Ball(innerWidth / 2, innerHeight / 2, 11, 'orange')
  })
});

canvas2.addEventListener('mouseout', () => {
  isDrawing = false;
});

// second Chart
const canvas3 = document.getElementById('draw2');
const ctxx = canvas3.getContext('2d');
canvas3.width = 400;
canvas3.height = 400;

let isDrawing2 = false;

canvas3.addEventListener('mousedown', (e) => {
  line2 = [];
  isDrawing2 = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas3.addEventListener('mousemove', e => {
  draw(e, ctxx, line2, isDrawing2)
});

canvas3.addEventListener('mouseup', () => {
  isDrawing2 = false;

  ballAndLineArray2.push({
    line: computePoints(line2)
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
      linePoints.push({ x: px, y: py });
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
  var graphWidth = 330;
  var imageWidth = 720;

  return x * (imageWidth/graphWidth);
}

function getY(y) {
  var graphHeight = 400;
  var imageHeight = 484;

  return y * (imageHeight/graphHeight);
}

function draw(e, context, lineArray, isDrawing) {
  if (!isDrawing) return; // stop the fn from running when they are not moused down

  context.strokeStyle = `black`;
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(e.offsetX, e.offsetY);
  context.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];

  lineArray.push({ x: lastX, y: lastY });
}

function createLine(context) {
  context.strokeStyle = '#BADA55';
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.lineWidth = 4;
  context.globalCompositeOperation = 'multiply';
}

// Charts
var emptyLineChart = document.getElementById("myChart").getContext('2d');

var myChart = new Chart(emptyLineChart, {
    type: 'line',
    data:{
      labels: [0, 1, 2, 3, 4, 5],
      data: [
        {
          x: 0,
          y: 18
        },
        {
          x: 2,
          y: 10
        }
      ]
    },
    options: {

      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time (seconds)'
          },
            ticks: {
                suggestedMin: 0,
                suggestedMax: 4.2,
                stepSize: 0.5
            }
        }],
        yAxes: [{
          ticks: {
            min: 5,
            max: 18,
            stepSize: 1
          },
            scaleLabel: {
              display: true,
              labelString: 'Height (ft)'
            }
        }]
      }
    }
});

var emptyLineChart2 = document.getElementById("myChart2").getContext('2d');

var myChart2 = new Chart(emptyLineChart2, {
    type: 'line',
    data:{
      labels: [0, 1, 2, 3, 4, 5],
      data: [
        {
          x: 0,
          y: 18
        },
        {
          x: 2,
          y: 10
        }
      ]
    },
    options: {

      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Time (seconds)'
          },
            ticks: {
                suggestedMin: 0,
                suggestedMax: 4.2,
                stepSize: 0.5
            }
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: 30
          },
            scaleLabel: {
              display: true,
              labelString: 'Distance from basket (ft)'
            }
        }]
      }
    }
});

let id = null;
let id2 = null;
let started = false;
let opx = -2;
let opy = -2;
let pointerX = -1;
let pointerY = -1;
let ctx = null;
let canvas = document.getElementById('canvas');
let array = []
let cMin = 0;
let cMax = 255;
let r = cMax;
let g = cMin;
let b = cMin;
let decRed = false;
let decGreen = false;
let decBlue = false;
let incRed = false;
let incGreen = false;
let incBlue = false;
let count = 0;
let count2 = 0;
let hasChanged = true;

if(canvas.getContext) {
    started = false;
    ctx = canvas.getContext('2d');
    id = setInterval(animate);
    ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
} 

document.onmousemove = function(event) {
	pointerX = event.pageX;
	pointerY = event.pageY;
  if(started) {
    // array.push(new Point(pointerX-10, pointerY-10, 2, 2));
  }
}

function catmullRom(p0, p1, p2, p3, t) {
  let q = 0.5 * ( ( 2*p1) + 
  (-p0 + p2)*t + 
  (2*p0 - 5*p1 + 4*p2 - p3)*(t**2) + 
  (-p0 + 3*p1 - 3*p2 + p3)*(t**3)); 
  return q;
}

function spline(p0, p1, p2, p3) {
    
    let cat = [];
    let inc = 0.05;
    // console.log(p0 + " " + p1 + " " + p2 + " " + p3);
    for(let i=0; i<=1; i+=inc) {
        cat.push(new Point(catmullRom(p0.x, p1.x, p2.x, p3.x, i), catmullRom(p0.y, p1.y, p2.y, p3.y, i)));
    }
    for(let i=0; i<cat.length-1; i++) {
        ctx.beginPath();
        ctx.moveTo(cat[i].x, cat[i].y);
        ctx.lineTo(cat[i+1].x, cat[i+1].y);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(cat[cat.length-1].x, cat[cat.length-1].y);
    ctx.stroke();
}

function draw(i) {
  if(array.length >= 4) {
    if(i == 0) {
        spline(array[i], array[i], array[i+1], array[i+2]);
    } else if(i == array.length-2) {
        spline(array[i-2], array[i-1], array[i], array[i]);
    } else {
        spline(array[i], array[i+1], array[i+2], array[i+3]); // encountering lots of duplicate values
        // console.log("Line: " + array[i] + " " + array[i+1] + " " + array[i+2] + " " + array[i+3]);
    }
  } else {
      ctx.beginPath();
      ctx.moveTo(array[i].x, array[i].y);
      ctx.lineTo(array[i+1].x, array[i+1].y);
      ctx.stroke();
  }
}

function animate() {

  if(!started) return;
  
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if(opx == pointerX && opy == pointerY) {
    hasChanged = false;
    if(array.length > 0) {
      count++;
      if(count > 25) {
        if(count2 > 2) {
          array.shift();
          count2 = 0;
        } else {
          count2++;
        }
        
      }
    }
  } else { 
    opx = pointerX;
    opy = pointerY;
    hasChanged = true;
    count = 0;
  }

  // console.log(hasChanged);

  if(array.length == 0 || hasChanged) {
    array.push(new Point(pointerX-10, pointerY-10, 2, 2));
  }

  let color = r + ',' + g + ',' + b;

  for(let i=0; i<array.length-1; i++) {

    if(i <= 4) continue;

    try {

      // set line stroke and line width
    ctx.strokeStyle = 'rgba(' + color + ', 0.5)';
    ctx.lineWidth = 6;

    draw(i);

    // set line stroke and line width
    ctx.strokeStyle = 'rgba(' + color + ', 0.5)';
    ctx.lineWidth = 3;

    draw(i);

    // set line stroke and line width
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;

    draw(i);
    } catch (error) {} 
  }

  if(array.length > 30) {
    array.shift();
  }

  if(r == cMax && b == cMin) {
    incGreen = true;
    decBlue = false;
  }
  if(r == cMax && g == cMax) {
    decRed = true;
    incGreen = false;
  }
  if(g == cMax && r == cMin) {
    decRed = false;
    incBlue = true;
  }
  if(g == cMax && b == cMax) {
    incBlue = false;
    decGreen = true;
  }
  if(g == cMin && b == cMax) {
    decGreen = false;
    incRed = true;
  }
  if(r == cMax && b == cMax) {
    incRed = false;
    decBlue = true;
  }

  if(incRed && r < cMax) {
    r++;
  }
  if(incGreen && g < cMax) {
    g++;
  }
  if(incBlue && b < cMax) {
    b++;
  }

  if(decRed && r > cMin) {
    r--;
  }
  if(decGreen && g > cMin) {
    g--;
  }
  if(decBlue && b > cMin) {
    b--;
  }

}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return this.x + ',' + this.y;
  }
}

canvas.addEventListener("click", () => {
  if(!started) {
      started = true;
  } else {
      started = false;
  }
})
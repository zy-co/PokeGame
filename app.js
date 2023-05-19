
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


document.getElementById('mapAudio').play();


canvas.width = 1024;
canvas.height = 567;

const collisionsMap = []
for (let i = 0;  i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

class Boundary {
  static width = 48
  static height = 48
  constructor({position}) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }
  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];

const offset = {
  x: -743,
  y: -500
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
    boundaries.push(new Boundary({position: {
      x: j * Boundary.width + offset.x,
      y: i * Boundary.height + offset.y
    }}));
  });
});

console.log(boundaries);

// event listener
class InputHandler {
  constructor(){
    this.keys = [];
    this.touchY = '';
    this.touchX = '';
    this.touchTreshold = 30;
    window.addEventListener('keydown', e => {
      if((e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight')
          && this.keys.indexOf(e.key) === -1) {
             this.keys.push(e.key);
            } else if (e.key === 'enter' && playerWin || enemyWin || draw) restartGame();
          });
      window.addEventListener('keyup', e => {
      if((e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight')
          && this.keys.indexOf(e.key) === 1) {
             this.keys.push(e.key);
            }
          });
      window.addEventListener('touchstart', e => {
        this.touchY = e.changedTouches[0].pageY;
        this.touchX = e.changedTouches[0].pageX;
      });
      window.addEventListener('touchmove', e => {
        const swipeDistance = e.changedTouches[0].pageY - this.touchY;
        const xSwipe = e.changedTouches[0].pageX - this.touchX;
        if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
        if (xSwipe < -this.touchTreshold && this.keys.indexOf('swipe left') === -1) this.keys.push('swipe left');
        if (xSwipe > this.touchTreshold && this.keys.indexOf('swipe right') === -1) this.keys.push('swipe right');
        else if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1) {
          this.keys.push('swipe down');
          //if (playerWin || enemyWin || draw) restartGame();
        }
      });
      window.addEventListener('touchend', e => {
        this.keys.splice(this.keys.indexOf('swipe up'), 1);
        this.keys.splice(this.keys.indexOf('swipe down'), 1);
        this.keys.splice(this.keys.indexOf('swipe left'), 1);
        this.keys.splice(this.keys.indexOf('swipe right'), 1);
      });
    }
  }
  // event listener
  const input = new InputHandler();

const bgImage = new Image();
bgImage.src = './img/Pellet Town.png';

const foregroundImg = new Image();
foregroundImg.src = './img/foregroundObjects.png';

const playerUp = new Image();
playerUp.src = './img/playerUp.png';

const playerLeft = new Image();
playerLeft.src = './img/playerLeft.png';

const playerRight = new Image();
playerRight.src = './img/playerRight.png';

const playerDown = new Image();
playerDown.src = './img/playerDown.png';

class Sprite {
  constructor({position, velocity, image, frames = {max: 1}, sprites}) {
    this.position = position;
    this.image = image;
    this.frames = {...frames, val: 0, elapsed: 0};
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.moving = false;
    this.sprites = sprites;
  }
  draw() {
    ctx.drawImage(this.image, 
    this.frames.val * this.width,
    0, 
    this.image.width / this.frames.max, 
    this.image.height,
    this.position.x, 
    this.position.y, 
    this.image.width / this.frames.max, 
    this.image.height);
  }
  eachFrame() {
    if (!this.moving) return
    if (this.frames.max > 1) this.frames.elapsed++;
    
    if (this.frames.elapsed % 10 === 0) {
    if (this.frames.val < this.frames.max - 1) this.frames.val++;
    else this.frames.val = 0;
    }
  }
  update() {
    this.draw();
    this.eachFrame();
  }
}

const background = new Sprite ({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: bgImage
});

const foreground = new Sprite ({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foregroundImg
});

const player = new Sprite ({
  position: {
    x: canvas.width / 1.77 - 192 / 2,
    y: canvas.height / 1.3 - 68
  },
  image: playerDown,
  frames: {
    max: 4
  },
  sprites: {
    up: playerUp,
    left: playerLeft,
    right: playerRight,
    down: playerDown
  }
});

function boundary() {
  boundaries.forEach(boundary => {
    boundary.draw();
  });
}

function controls() {
  let moving = true
  if ((input.keys.indexOf('ArrowRight') > -1 || input.keys.indexOf('swipe right') > -1)) {
    player.image = player.sprites.left;
    player.moving = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (rectangularCollision({ rectangle1: player, rectangle2: {...boundary, 
      position: {x: boundary.position.x + 5, y: boundary.position.y}}}))
      {
        moving = false;
        break;
      }
    }
    if (moving)
    moveables.forEach(moveable => {
      moveable.position.x += 5
    });
  } else if ((input.keys.indexOf('ArrowLeft') > -1  || input.keys.indexOf('swipe left') > -1)) {
    player.image = player.sprites.right;
    player.moving = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (rectangularCollision({ rectangle1: player, rectangle2: {...boundary, 
      position: {x: boundary.position.x - 5, y: boundary.position.y}}}))
      {
        moving = false;
        break;
      }
    }
    if (moving)
    moveables.forEach(moveable => {
      moveable.position.x -= 5
    })
  } else if ((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1) ) {
    player.image = player.sprites.down;
    player.moving = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (rectangularCollision({ rectangle1: player, 
      rectangle2: {...boundary, 
      position: {x: boundary.position.x, y: boundary.position.y - 5}}})
      )
    {
      moving = false;
      break;
    }
    }
    if (moving)
    moveables.forEach(moveable => {
      moveable.position.y -= 5
    })
  } else if ((input.keys.indexOf('ArrowDown') > -1 || input.keys.indexOf('swipe down') > -1)) {
    player.image = player.sprites.up;
    player.moving = true;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (rectangularCollision({ rectangle1: player, rectangle2: {...boundary, 
      position: {x: boundary.position.x, y: boundary.position.y + 5}}}))
      {
        moving = false;
        break;
      }
    }
    if (moving)
    moveables.forEach(moveable => {
      moveable.position.y += 5
    })
  } else {
    player.moving = false;
  }
}

const moveables = [background, ...boundaries, foreground];

function rectangularCollision({rectangle1, rectangle2}) {
  return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x
  && rectangle1.position.x <= rectangle2.position.x + rectangle2.width
  && rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  && rectangle1.position.y <= rectangle2.position.y + rectangle2.height);
}

function animate() {
  window.requestAnimationFrame(animate);
  background.update();
  //boundary();
  player.update();
  foreground.update();
  controls();
}
animate();
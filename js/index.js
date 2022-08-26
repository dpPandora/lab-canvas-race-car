window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    board.start();
  };

  function startGame() {}
};

let walls = [];
let accel = 0.50;
let decel = 1;
let maxTurnSp = 5;

const board = {
  canvas: document.querySelector('#canvas'),
  ctx: this.canvas.getContext('2d'),
  frame: 0,
  start() {
    this.interval = setInterval(updateBoard, 20);
  },
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  end() {
    clearInterval(this.interval);
  }
}

class gameObject {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
  }

  update() {
    const ctx = board.ctx;
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x ,this.y ,this.width ,this.height);
  }

  newPos() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }

  colision(ob) {
    //not sure gonna move on
    return !(this.bottom() < ob.top() || this.top() > ob.bottom() || this.right() < ob.left() || this.left() > ob.right());
  }
}

class car extends gameObject {
  update() {
    const carImage = new Image();
    carImage.src = '../images/car.png';
    const ctx = board.ctx;

    carImage.onload = () => {
      ctx.drawImage(carImage, this.x, this.y, this.width, this.height);
    }
    //ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

//car 158x319

let player = new car(board.canvas.width/2 - 158 * 0.25, board.canvas.height - 319 * 0.5 - 10, 158 * 0.5, 319 * 0.5);

let anyInput = false;
document.addEventListener('keydown', (e) => {
  //console.log("keydown")
  switch(e.key) {
    case 'ArrowLeft':
      //player.speedX -= (Math.abs(player.speedX) != maxTurnSp ? accel : 0);
      player.speedX = -3;
      anyInput = true;
      break;
    case 'ArrowRight':
      //player.speedX += (player.speedX != maxTurnSp ? accel : 0);
      player.speedX = 3;
      anyInput = true;
      break;
  }
});

document.addEventListener('keyup', () => {
  //console.log("keyup");
  player.speedX = 0;
  anyInput = false;
})

//while (!anyInput && player.speedX != 0) {
//  console.log("bruh");
//  if (player.speedX > 0) player.speedX -= decel;
//  else if (player.speedX < 0) player.speedX += decel;
//  else player.speedX = 0;
//}

function updateOb() {
  board.frame++;
  if (board.frame % 60 === 0) {
    let minheight = 75;
    let maxheight = 300;
    let height = Math.floor((Math.random() * (maxheight - minheight)) + minheight);
    let x = Math.floor(Math.random() * (board.canvas.width - height)  );

    walls.push(new gameObject(x, 0, height, 30));
  }
  for (let i = 0; i < walls.length; i++) {
    walls[i].y += 6;
    walls[i].update();
  }

  //if (walls[0].y > board.canvas.height) walls[0].shift();
}

function gameCheck() {
  if (walls.some(function (ob) {
    return player.colision(ob);
  })) board.end();
}

function updateBoard() {
  board.clear();

  player.newPos();
  player.update();

  updateOb();

  board.ctx.fillStyle = 'blue';
  board.ctx.font = "48px sans-serif";
  board.ctx.fillText(`Score: ${board.frame}`, 10, 50);

  gameCheck();
}


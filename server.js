//	멀티플레이 서버

let playerList = [];

// 환경변수 선언 및 초기화
let timerSec = "00";
let timerMin = 3;
let orangeScore = 0;
let blueScore = 0;

let background_index = 0;
let isGoal = false;
let isGameStart = false;

// 모듈 불러오기
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const p2 = require("p2");

app.use("/js", express.static(__dirname + "/js"));
app.use("/assets", express.static(__dirname + "/assets"));
app.get("/hamzzi", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3100, function () {
  console.log("Listening on port 3100");
});

// 서버 월드 물리 초기화
let world = new p2.World({
  gravity: [0, 0],
});

let playerMaterial = new p2.Material();
let ballMaterial = new p2.Material();
let boxMaterial = new p2.Material();

world.addContactMaterial(
  new p2.ContactMaterial(playerMaterial, ballMaterial, {
    friction: 0,
    restitution: 0.5,
  })
);

world.addContactMaterial(
  new p2.ContactMaterial(ballMaterial, boxMaterial, {
    friction: 0,
    restitution: 1,
  })
);

// 볼 생성
let ball = new p2.Body({
  mass: 1,
  damping: 0.1,
  position: [640, 360],
  angle: 0,
  velocity: [0, 0],
  angularVelocity: 0,
  fixedRotation: false,
});
ball.addShape(new p2.Circle({ radius: 16 * 1.5, material: ballMaterial }));
world.addBody(ball);

// 충돌 박스 생성
let boxes = [];
boxes[0] = new p2.Body({ position: [640, 40] });
boxes[0].addShape(
  new p2.Box({ width: 1140, height: 2, material: boxMaterial })
);
boxes[1] = new p2.Body({ position: [640, 680] });
boxes[1].addShape(
  new p2.Box({ width: 1140, height: 2, material: boxMaterial })
);

boxes[2] = new p2.Body({ position: [67, 145] });
boxes[2].addShape(new p2.Box({ width: 2, height: 200, material: boxMaterial }));
boxes[3] = new p2.Body({ position: [1210, 145] });
boxes[3].addShape(new p2.Box({ width: 2, height: 200, material: boxMaterial }));
boxes[4] = new p2.Body({ position: [67, 580] });
boxes[4].addShape(new p2.Box({ width: 2, height: 200, material: boxMaterial }));
boxes[5] = new p2.Body({ position: [1210, 580] });
boxes[5].addShape(new p2.Box({ width: 2, height: 200, material: boxMaterial }));

boxes[6] = new p2.Body({ position: [34, 250] });
boxes[6].addShape(new p2.Box({ width: 68, height: 2, material: boxMaterial }));
boxes[7] = new p2.Body({ position: [34, 465] });
boxes[7].addShape(new p2.Box({ width: 68, height: 2, material: boxMaterial }));
boxes[8] = new p2.Body({ position: [1244, 250] });
boxes[8].addShape(new p2.Box({ width: 68, height: 2, material: boxMaterial }));
boxes[9] = new p2.Body({ position: [1244, 465] });
boxes[9].addShape(new p2.Box({ width: 68, height: 2, material: boxMaterial }));

boxes[10] = new p2.Body({ position: [4, 232] });
boxes[10].addShape(
  new p2.Box({ width: 2, height: 465, material: boxMaterial })
);
boxes[11] = new p2.Body({ position: [1276, 232] });
boxes[11].addShape(
  new p2.Box({ width: 2, height: 465, material: boxMaterial })
);

for (let i = 0; i < boxes.length; i++) {
  boxes[i].mass = 0;
  world.addBody(boxes[i]);
}

// 서버 상태 전송
setInterval(() => {
  if (playerList.length >= 2) {
    if (!isGoal) {
      // 타이머
      timerSec--;
      if (timerSec === 0) timerSec = "00";
      if (timerSec < 0) {
        timerMin--;
        timerSec = 59;
      }
    }

    if (!isGameStart) {
      restartGame();
      io.emit("destroy_waitText");
      isGameStart = true;
    }
  } else if (isGameStart) {
    restartGame();
    io.emit("waitPlayer");
    isGameStart = false;
  }
}, 1000);

// 월드 물리 시뮬레이션
let lastTimeSeconds = new Date().getTime();
setInterval(() => {
  let dt = new Date().getTime() - lastTimeSeconds;
  lastTimeSeconds = new Date().getTime();
  world.step(1 / 60, dt, 10);
}, 1000 / 60);

// 전송
io.on("connection", function (socket) {
  socket.on("new_player", onNewPlayer);
  socket.on("disconnect", onDisconnect);
  socket.on("player_move", onPlayer_move);
  socket.on("player_kick", onPlayer_kick);

  // 인원 부족
  if (!isGameStart) {
    socket.emit("waitPlayer");
  }

  setInterval(function () {
    // 플레이어 이동
    let movePlayer = find_playerID(socket.id);
    if (!movePlayer) {
      return;
    }

    socket.emit("move_player", {
      x: movePlayer.body.position[0],
      y: movePlayer.body.position[1],
      xdir: movePlayer.xdir,
    });

    socket.broadcast.emit("move_oPlayer", {
      id: movePlayer.id,
      x: movePlayer.body.position[0],
      y: movePlayer.body.position[1],
      xdir: movePlayer.xdir,
    });

    movePlayer.body.position[0] = clamp(movePlayer.body.position[0], 0, 1280);
    movePlayer.body.position[1] = clamp(movePlayer.body.position[1], 0, 720);
    movePlayer.body.velocity[0] = clamp(
      movePlayer.body.velocity[0],
      -movePlayer.speedMax,
      movePlayer.speedMax
    );
    movePlayer.body.velocity[1] = clamp(
      movePlayer.body.velocity[1],
      -movePlayer.speedMax,
      movePlayer.speedMax
    );

    // 볼 이동
    io.emit("update_ball", {
      x: ball.position[0],
      y: ball.position[1],
      angle: ball.angle,
    });
    ball.velocity[0] = clamp(ball.velocity[0], -100, 100);
    ball.velocity[1] = clamp(ball.velocity[1], -100, 100);
    ball.angle +=
      (Math.abs(ball.velocity[0]) > Math.abs(ball.velocity[1])
        ? ball.velocity[0]
        : ball.velocity[1]) / 20;

    // 골!!
    if (!isGoal && isGameStart) {
      if (
        ball.position[0] >= 1232.9 &&
        ball.position[1] >= 252.5 &&
        ball.position[1] <= 447.6
      ) {
        // 포도팀 골!!
        isGoal = true;
        blueScore++;
        io.emit("blueGoal");
        setTimeout(function () {
          resetGame();
          io.emit("destroy_goalText");
        }, 6000);
      }
      if (
        ball.position[0] <= 48.3 &&
        ball.position[1] >= 252.5 &&
        ball.position[1] <= 447.6
      ) {
        // 오렌지팀 골!!
        orangeScore++;
        isGoal = true;
        io.emit("orangeGoal");
        setTimeout(function () {
          resetGame();
          io.emit("destroy_goalText");
        }, 6000);
      }
    }

    // 시간
    io.emit("update_timer", { timerMin: timerMin, timerSec: timerSec });

    // 경기 종료
    if (timerMin === 0 && timerSec === "00" && !isGoal) {
      isGoal = true;
      setTimeout(function () {
        restartGame();
        io.emit("destroy_winText");
        if (background_index < 3) background_index++;
        else background_index = 0;
      }, 5000);
    }
  }, 1000 / 66);
});

// 새로운 플레이어
function onNewPlayer(data) {
  let newPlayer = new Player(
    this.id,
    data.sprite,
    data.radius,
    data.scale,
    data.speed,
    data.speedMax,
    data.kickPower,
    data.name
  );

  // 플레이어 물리 적용
  newPlayer.body = new p2.Body({
    mass: 5,
    damping: 0.1,
    position: [newPlayer.x, newPlayer.y],
    angle: 0,
    velocity: [0, 0],
    angularVelocity: 0,
    fixedRotation: true,
  });
  newPlayer.body.addShape(new p2.Circle({ radius: newPlayer.radius }));
  world.addBody(newPlayer.body);
  for (let i = 0; i < boxes.length; i++) {
    world.disableBodyCollision(newPlayer.body, boxes[i]);
  }

  // 접속된 플레이어 정보 가져오기
  for (let i = 0; i < playerList.length; i++) {
    this.emit("create_oPlayer", {
      id: playerList[i].id,
      x: playerList[i].body.position[0],
      y: playerList[i].body.position[1],
      xdir: playerList[i].xdir,
      sprite: playerList[i].sprite,
      name: playerList[i].name,
      team: playerList[i].team,
    });
  }

  // 나를 제외한 모든 소켓에게 나의 정보 전송
  this.broadcast.emit("create_oPlayer", {
    id: newPlayer.id,
    x: newPlayer.x,
    y: newPlayer.y,
    xdir: newPlayer.xdir,
    sprite: newPlayer.sprite,
    name: newPlayer.name,
    team: newPlayer.team,
  });
  playerList.push(newPlayer);

  // 서버 정보 전송, 내 정보 전송
  this.emit("server_info", {
    background_index: background_index,
    team: newPlayer.team,
    orangeScore: orangeScore,
    blueScore: blueScore,
  });

  console.log("created new player with id " + this.id);
}

// 연결 끊김
function onDisconnect() {
  let removePlayer = find_playerID(this.id);
  if (removePlayer) {
    world.removeBody(removePlayer.body);
    playerList.splice(playerList.indexOf(removePlayer), 1);
  }
  this.broadcast.emit("remove_player", { id: this.id });

  console.log("disconnect player " + this.id);
}

// 플레이어 이동
function onPlayer_move(data) {
  let movePlayer = find_playerID(this.id);

  if (data.hspd != 0) {
    movePlayer.xdir = data.hspd;
  }
  movePlayer.body.velocity[0] += data.hspd * movePlayer.speed;
  movePlayer.body.velocity[1] += data.vspd * movePlayer.speed;
}

// 플레이어 슛
function onPlayer_kick() {
  let kickPlayer = find_playerID(this.id);
  if (!kickPlayer) {
    return;
  }

  if (p2.Broadphase.boundingRadiusCheck(kickPlayer.body, ball)) {
    ball.velocity[0] *= kickPlayer.kickPower;
    ball.velocity[1] *= kickPlayer.kickPower;
    io.emit("sound_kick");
  }
}

// 게임 초기화
function resetGame() {
  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].team === "blue") {
      playerList[i].body.position[0] = 240;
      playerList[i].body.position[1] = 360;
      playerList[i].xdir = 1;
    }
    if (playerList[i].team === "orange") {
      playerList[i].body.position[0] = 1040;
      playerList[i].body.position[1] = 360;
      playerList[i].xdir = -1;
    }
    playerList[i].body.velocity[0] = 0;
    playerList[i].body.velocity[1] = 0;
  }

  ball.position[0] = 640;
  ball.position[1] = 360;
  ball.velocity[0] = 0;
  ball.velocity[1] = 0;
  ball.angle = 0;
  isGoal = false;
  io.emit("reset");
}
function restartGame() {
  timerSec = "00";
  timerMin = 3;
  orangeScore = 0;
  blueScore = 0;
  isGoal = false;
  resetGame();
  io.emit("restart", background_index);
}

// 플레이어 클래스
let Player = function (
  id,
  sprite,
  radius,
  scale,
  speed,
  speedMax,
  kickPower,
  name
) {
  this.id = id;
  this.sprite = sprite;
  this.radius = radius;
  this.scale = scale;
  this.speed = speed;
  this.speedMax = speedMax;
  this.kickPower = kickPower;
  this.name = name;

  if (blue_length() > orange_length()) {
    this.team = "orange";
    this.x = 1040;
    this.y = 360;
    this.xdir = -1;
  } else if (blue_length() < orange_length()) {
    this.team = "blue";
    this.x = 240;
    this.y = 360;
    this.xdir = 1;
  } else {
    let r = Math.floor(Math.random() * 2);
    if (r === 0) {
      this.team = "blue";
      this.x = 240;
      this.y = 360;
      this.xdir = 1;
    } else {
      this.team = "orange";
      this.x = 1040;
      this.y = 360;
      this.xdir = 1;
    }
  }
};

function find_playerID(id) {
  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].id === id) {
      return playerList[i];
    }
  }
  return false;
}

function clamp(val, min, max) {
  if (val > max) return max;
  if (val < min) return min;
  return val;
}

function blue_length() {
  let blue_count = 0;
  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].team === "blue") {
      blue_count++;
    }
  }
  return blue_count;
}

function orange_length() {
  let orange_count = 0;
  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].team === "orange") {
      orange_count++;
    }
  }
  return orange_count;
}

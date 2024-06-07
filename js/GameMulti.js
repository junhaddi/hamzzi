// 멀티플레이 게임 씬

// 클라이언트 설정
let socket;
let oPlayerList = [];
let isConnected = false;

// 게임 환경변수 선언 및 초기화
let playerName = "";
let playerScale = 2;

const gameMulti = {
  init() {
    // 소켓 초기화
    socket = io();
    game.stage.disableVisibilityChange = true;
  },

  create() {
    // 씬 전환 효과
    this.camera.flash("#000000");

    // 배경 이미지
    this.background = game.add.image(0, 0, bg_sprite[0]);

    // 키 입력 설정
    this.kickButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // 게임 환경 변수 초기화
    this.blueScore = 0;
    this.orangeScore = 0;
    this.isPause = false;

    // 플레이어 이름 공백문자 예외 처리
    playerName = playerName === "" ? "플레이어" : playerName;

    // 소켓 수신
    socket.on("connect", onConnected);
    socket.on("remove_player", onRemove_oPlayer);

    socket.on("create_oPlayer", onNew_oPlayer);
    socket.on("move_oPlayer", onMove_oPlayer);
    socket.on("move_player", onMove_player);

    socket.on("server_info", onServerInfo);
    socket.on("update_ball", onUpdateBall);
    socket.on("update_timer", onUpdateTimer);

    socket.on("blueGoal", onBlueGoal);
    socket.on("orangeGoal", onOrangeGoal);

    socket.on("waitPlayer", onWaitPlayer);
    socket.on("reset", onReset);
    socket.on("restart", onRestart);

    socket.on("destroy_winText", function () {
      gameMulti.winText.destroy();
    });
    socket.on("destroy_goalText", function () {
      gameMulti.goalText.destroy();
    });
    socket.on("destroy_waitText", function () {
      gameMulti.waitText.destroy();
    });
    socket.on("sound_kick", function () {
      sfx_kick.play();
    });

    // 플레이어 생성
    this.player = game.add.sprite(0, 0, chr_sprite[chr_select]);
    this.player.anchor.set(0.5);
    this.player.scale.set(playerScale);

    // 볼 생성
    this.ball = game.add.sprite(0, 0, "spr_ball");
    this.ball.anchor.set(0.5);
    this.ball.scale.set(1.5);

    // 플레이어 이름 UI
    this.onPlayerName = game.add.text(0, 0, playerName, {
      font: "bold 20px BMJUA",
      fill: "#ffffff",
    });
    this.onPlayerName.anchor.set(0.5);
    this.onPlayerName.stroke = "#ffffff";
    this.onPlayerName.strokeThickness = 3;
    this.onPlayerName.bringToTop();

    // 남은 시간 UI
    this.timerText = game.add.text(
      CANVAS_WIDTH / 2,
      50,
      timerMin + " : " + timerSec,
      {
        font: "50px BMJUA",
        fill: "#000000",
      }
    );
    this.timerText.anchor.set(0.5);
    this.timerText.stroke = "#ffffff";
    this.timerText.strokeThickness = 3;
    this.timerText.bringToTop();

    // 점수 UI
    this.scoreText = game.add.text(
      CANVAS_WIDTH / 2,
      90,
      this.blueScore + " : " + this.orangeScore,
      {
        font: "30px BMJUA",
        fill: "#000000",
      }
    );
    this.scoreText.addColor("#4834d4", 0);
    this.scoreText.addColor("#000000", 2);
    this.scoreText.addColor("#e67e22", 4);
    this.scoreText.anchor.set(0.5);
    this.scoreText.stroke = "#ffffff";
    this.scoreText.strokeThickness = 3;
    this.scoreText.bringToTop();
  },

  update() {
    if (isConnected) {
      // 플레이어 이동
      let player_hspd =
        game.input.keyboard.addKey(Phaser.Keyboard.D).isDown -
        game.input.keyboard.addKey(Phaser.Keyboard.A).isDown;
      let player_vspd =
        game.input.keyboard.addKey(Phaser.Keyboard.S).isDown -
        game.input.keyboard.addKey(Phaser.Keyboard.W).isDown;

      if ((player_hspd != 0 || player_vspd != 0) && !this.isPause) {
        socket.emit("player_move", {
          hspd: player_hspd,
          vspd: player_vspd,
        });
      }

      // 플레이어 슛
      if (this.kickButton.isDown) {
        socket.emit("player_kick");
      }

      // 플레이어 이름 UI
      this.onPlayerName.x = this.player.x;
      this.onPlayerName.y = this.player.y - 30;

      // 다른 플레이어 이름 UI
      for (let i = 0; i < oPlayerList.length; i++) {
        oPlayerList[i].onPlayerName.x = oPlayerList[i].player.x;
        oPlayerList[i].onPlayerName.y = oPlayerList[i].player.y - 30;
      }

      // 남은 시간 UI
      this.timerText.setText(timerMin + " : " + timerSec);

      // 점수 UI
      this.scoreText.setText(blueScore + " : " + orangeScore);

      // 경기 종료
      if (timerMin === 0 && timerSec === "00" && !this.isPause) {
        // 포도팀 승리!!
        if (blueScore > orangeScore) {
          this.winText = game.add.text(
            CANVAS_WIDTH / 2,
            game.world.centerY,
            "포도팀 승리",
            {
              font: "100px BMJUA",
              fill: "#4834d4",
            }
          );
          this.winText.anchor.set(0.5);
          this.winText.stroke = "#ffffff";
          this.winText.strokeThickness = 3;
          this.winText.bringToTop();
        }

        // 오렌지팀 승리!!
        if (blueScore < orangeScore) {
          this.winText = game.add.text(
            CANVAS_WIDTH / 2,
            game.world.centerY,
            playerName_2 + "오렌지팀 승리",
            {
              font: "100px BMJUA",
              fill: "#e67e22",
            }
          );
          this.winText.anchor.set(0.5);
          this.winText.stroke = "#ffffff";
          this.winText.strokeThickness = 3;
          this.winText.bringToTop();
        }

        // 무승부!!
        if (blueScore === orangeScore) {
          this.winText = game.add.text(
            CANVAS_WIDTH / 2,
            game.world.centerY,
            "무승부",
            {
              font: "100px BMJUA",
              fill: "#000000",
            }
          );
          this.winText.stroke = "#ffffff";
          this.winText.strokeThickness = 3;
          this.winText.anchor.set(0.5);
          this.winText.bringToTop();
        }

        sfx_endWhistle.play();
        this.isPause = true;
      }
    }
  },
};

// 플레이어 접속
function onConnected() {
  socket.emit("new_player", {
    sprite: chr_sprite[chr_select],
    radius: gameMulti.player.width / 2,
    scale: playerScale,
    speed: 2,
    speedMax: 15,
    kickPower: 3,
    name: playerName,
  });

  isConnected = true;
  console.log("Connected to server");
}

// 다른 플레이어 생성
function onNew_oPlayer(data) {
  let new_player = new Player(
    data.id,
    data.x,
    data.y,
    data.sprite,
    data.xdir,
    data.name,
    data.team
  );
  oPlayerList.push(new_player);
}

// 다른 플레이어 정보 수신
function onMove_oPlayer(data) {
  let movePlayer = find_playerID(data.id);
  if (!movePlayer) {
    return;
  }
  movePlayer.player.x = data.x;
  movePlayer.player.y = data.y;
  movePlayer.player.scale.x = data.xdir * playerScale;
}

// 내 플레이어 정보 수신
function onMove_player(data) {
  gameMulti.player.x = data.x;
  gameMulti.player.y = data.y;
  gameMulti.player.scale.x = data.xdir * playerScale;
}

// 플레이어 제거
function onRemove_oPlayer(data) {
  let removePlayer = find_playerID(data.id);
  if (!removePlayer) {
    return;
  }
  removePlayer.player.destroy();
  removePlayer.onPlayerName.destroy();
  oPlayerList.splice(oPlayerList.indexOf(removePlayer), 1);
}

// 서버 정보 수신
function onServerInfo(data) {
  gameMulti.background.loadTexture(bg_sprite[data.background_index]);

  // 내 정보
  if (data.team === "blue") gameMulti.onPlayerName.fill = "#4834d4";
  if (data.team === "orange") gameMulti.onPlayerName.fill = "#e67e22";

  // 점수
  orangeScore = data.orangeScore;
  blueScore = data.blueScore;
}

// 볼 정보 업데이트
function onUpdateBall(data) {
  gameMulti.ball.x = data.x;
  gameMulti.ball.y = data.y;
  gameMulti.ball.angle = data.angle;
}

// 남은 시간 업데이트
function onUpdateTimer(data) {
  timerSec = data.timerSec;
  timerMin = data.timerMin;
}

// 포도팀 골
function onBlueGoal() {
  let style = {
    font: "100px BMJUA",
    fill: "#4834d4",
    align: "center",
  };
  gameMulti.goalText = game.add.text(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    "포도팀 득점",
    style
  );
  gameMulti.goalText.anchor.set(0.5);
  gameMulti.goalText.stroke = "#ffffff";
  gameMulti.goalText.strokeThickness = 3;
  gameMulti.goalText.bringToTop();
  gameMulti.isPause = true;
  sfx_cheer.play();
  blueScore++;
}

// 오렌지팀 골
function onOrangeGoal() {
  let style = {
    font: "100px BMJUA",
    fill: "#e67e22",
    align: "center",
  };
  gameMulti.goalText = game.add.text(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    "오렌지팀 득점",
    style
  );
  gameMulti.goalText.anchor.set(0.5);
  gameMulti.goalText.stroke = "#ffffff";
  gameMulti.goalText.strokeThickness = 3;
  gameMulti.goalText.bringToTop();
  gameMulti.isPause = true;
  sfx_cheer.play();
  orangeScore++;
}

// 게임 상태
function onWaitPlayer() {
  gameMulti.waitText = game.add.text(
    CANVAS_WIDTH / 2,
    game.world.centerY,
    "다른 플레이어를 기다리는중입니다",
    {
      font: "60px BMJUA",
      fill: "#000000",
    }
  );
  gameMulti.waitText.stroke = "#ffffff";
  gameMulti.waitText.strokeThickness = 3;
  gameMulti.waitText.anchor.set(0.5);
  gameMulti.waitText.bringToTop();
}

function onReset() {
  gameMulti.isPause = false;
}

function onRestart(background_index) {
  gameMulti.camera.flash("#000000");
  gameMulti.background.loadTexture(bg_sprite[background_index]);
  timerSec = "00";
  timerMin = 3;
  blueScore = 0;
  orangeScore = 0;
  gameMulti.isPause = false;
  sfx_startWhistle.play();
}

// 플레이어 ID 찾기
function find_playerID(id) {
  for (let i = 0; i < oPlayerList.length; i++) {
    if (oPlayerList[i].id === id) {
      return oPlayerList[i];
    }
  }
}

// 다른 플레이어 클래스
let Player = function (id, startX, startY, sprite, xdir, name, team) {
  this.id = id;

  // 다른 플레이어 생성
  this.player = game.add.sprite(startX, startY, sprite);
  this.player.anchor.setTo(0.5, 0.5);
  this.player.scale.set(playerScale);
  this.player.scale.x = xdir * playerScale;

  // 다른 플레이어 이름 생성
  let color;
  if (team === "blue") color = "#4834d4";
  if (team === "orange") color = "#e67e22";

  this.onPlayerName = game.add.text(this.player.x, this.player.y - 30, name, {
    font: "bold 20px BMJUA",
    fill: color,
  });
  this.onPlayerName.anchor.set(0.5);
  this.onPlayerName.stroke = "#ffffff";
  this.onPlayerName.strokeThickness = 3;
  this.onPlayerName.bringToTop();
};

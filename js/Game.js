// 싱글플레이 게임 씬

// 게임 전역 변수 선언 및 초기화
let playerName_1 = "";
let playerName_2 = "";

let ballScale;
let ballMass;
let playerAccSpeed;
let maxSpeed;
let maxDashSpeed;
let ballMaxSpeed;
let playerShootPower;

let playerMaxSpeed_1 = maxSpeed;
let playerMaxSpeed_2 = maxSpeed;
let dashSpeed_1 = maxDashSpeed;
let dashSpeed_2 = maxDashSpeed;
let playerScale_1 = 2;
let playerScale_2 = 2;

const Game = {
  create() {
    // 씬 전환 효과
    this.camera.flash("#000000");

    // 월드 물리 설정
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 0.5;

    // 배경 이미지
    game.add.image(0, 0, bg_sprite[bg_select]);

    // 키 입력 설정
    this.cursors = game.input.keyboard.createCursorKeys();
    this.kickButton_1 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.kickButton_2 = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.dashButton_1 = game.input.keyboard.addKey(Phaser.Keyboard.M);
    this.dashButton_2 = game.input.keyboard.addKey(Phaser.Keyboard.QUOTES);

    // 충돌 그룹 설정
    this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
    this.ballCollisionGroup = game.physics.p2.createCollisionGroup();
    this.boxCollisionGroup = game.physics.p2.createCollisionGroup();
    game.physics.p2.updateBoundsCollisionGroup();

    // 게임 환경 변수 초기화
    this.isGameStart = false;
    this.isGoal = false;
    this.isTimeOver = false;

    // 플레이어 이름 공백문자 예외 처리
    playerName_1 = playerName_1 === "" ? "플레이어1" : playerName_1;
    playerName_2 = playerName_2 === "" ? "플레이어2" : playerName_2;

    // 킥오프 준비 타이머
    game.time.events.add(Phaser.Timer.SECOND * 3, this.startGame);

    // 킥오브 준비 텍스트
    this.text_ready = game.add.text(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      "준비",
      {
        font: "100px BMJUA",
        fill: "#000000",
      }
    );
    this.text_ready.anchor.set(0.5);
    this.text_ready.stroke = "#ffffff";
    this.text_ready.strokeThickness = 6;

    // 충돌 박스 생성
    let boxes = game.add.group();
    boxes.enableBody = true;
    boxes.physicsBodyType = Phaser.Physics.P2JS;

    for (let i = 0; i < 228; i++) {
      // 상단 라인
      this.box = boxes.create(i * 5 + 68, 40, "spr_box");
      this.box.alpha = 0;
      this.box.body.static = true;
      this.box.scale.set(1);
      this.box.body.mass = 5;
      this.box.body.setCollisionGroup(this.boxCollisionGroup);
      this.box.body.collides(this.ballCollisionGroup);

      // 하단 라인
      this.box = boxes.create(i * 5 + 68, 680, "spr_box");
      this.box.alpha = 0;
      this.box.body.static = true;
      this.box.scale.set(1);
      this.box.body.mass = 5;
      this.box.body.setCollisionGroup(this.boxCollisionGroup);
      this.box.body.collides(this.ballCollisionGroup);
    }

    for (let i = 0; i < 43; i++) {
      // 좌측 상단 라인
      this.box = boxes.create(67, i * 5 + 40, "spr_box");
      this.box.alpha = 0;
      this.box.body.static = true;
      this.box.scale.set(1);
      this.box.body.mass = 5;
      this.box.body.setCollisionGroup(this.boxCollisionGroup);
      this.box.body.collides(this.ballCollisionGroup);

      // 우측 상단 라인
      this.box = boxes.create(1280 - 70, i * 5 + 40, "spr_box");
      this.box.alpha = 0;
      this.box.body.static = true;
      this.box.scale.set(1);
      this.box.body.mass = 5;
      this.box.body.setCollisionGroup(this.boxCollisionGroup);
      this.box.body.collides(this.ballCollisionGroup);
    }

    for (let i = 0; i < 44; i++) {
      // 좌측 하단 라인
      this.box = boxes.create(67, i * 5 + 465, "spr_box");
      this.box.alpha = 0;
      this.box.body.static = true;
      this.box.scale.set(1);
      this.box.body.mass = 5;
      this.box.body.setCollisionGroup(this.boxCollisionGroup);
      this.box.body.collides(this.ballCollisionGroup);

      // 우측 하단 라인
      this.box = boxes.create(1280 - 70, i * 5 + 465, "spr_box");
      this.box.alpha = 0;
      this.box.body.static = true;
      this.box.scale.set(1);
      this.box.body.mass = 5;
      this.box.body.setCollisionGroup(this.boxCollisionGroup);
      this.box.body.collides(this.ballCollisionGroup);
    }

    for (let i = 0; i < 14; i++) {
      // 좌측 상단 골대
      this.box = boxes.create(i * 5 + 3, 250, "spr_box");
      this.box.alpha = 0;
      this.box.body.static = true;
      this.box.scale.set(1);
      this.box.body.mass = 5;
      this.box.body.setCollisionGroup(this.boxCollisionGroup);
      this.box.body.collides(this.ballCollisionGroup);

      // 우측 상단 골대
      this.box = boxes.create(i * 5 + 1270 - 60, 250, "spr_box");
      this.box.alpha = 0;
      this.box.body.static = true;
      this.box.scale.set(1);
      this.box.body.mass = 5;
      this.box.body.setCollisionGroup(this.boxCollisionGroup);
      this.box.body.collides(this.ballCollisionGroup);

      // 좌측 하단 골대
      this.box = boxes.create(i * 5 + 3, 465, "spr_box");
      this.box.alpha = 0;
      this.box.body.static = true;
      this.box.scale.set(1);
      this.box.body.mass = 5;
      this.box.body.setCollisionGroup(this.boxCollisionGroup);
      this.box.body.collides(this.ballCollisionGroup);

      // 우측 하단 골대
      this.box = boxes.create(i * 5 + 1270 - 60, 465, "spr_box");
      this.box.alpha = 0;
      this.box.body.static = true;
      this.box.scale.set(1);
      this.box.body.mass = 5;
      this.box.body.setCollisionGroup(this.boxCollisionGroup);
      this.box.body.collides(this.ballCollisionGroup);
    }

    for (let i = 0; i < 44; i++) {
      // 좌측 골대
      this.box = boxes.create(4, i * 5 + 250, "spr_box");
      this.box.alpha = 0;
      this.box.body.static = true;
      this.box.scale.set(1);
      this.box.body.mass = 5;
      this.box.body.setCollisionGroup(this.boxCollisionGroup);
      this.box.body.collides(this.ballCollisionGroup);

      // 우측 골대
      this.box = boxes.create(1280 - 4, i * 5 + 250, "spr_box");
      this.box.alpha = 0;
      this.box.body.static = true;
      this.box.scale.set(1);
      this.box.body.mass = 5;
      this.box.body.setCollisionGroup(this.boxCollisionGroup);
      this.box.body.collides(this.ballCollisionGroup);
    }

    // 플레이어_1 생성
    this.player_1 = game.add.sprite(
      game.world.centerX - 400,
      game.world.centerY,
      chr_sprite[chr_select_1]
    );
    this.player_1.anchor.set(0.5);

    game.physics.p2.enable(this.player_1, false);
    this.player_1.body.mass = 5;
    this.player_1.body.fixedRotation = true;
    this.player_1.body.damping = 0.75;
    this.player_1.scale.set(playerScale_1);
    this.player_1.body.setCircle(this.player_1.width / 2);
    this.player_1.body.setCollisionGroup(this.playerCollisionGroup);
    this.player_1.body.collides([
      this.ballCollisionGroup,
      this.playerCollisionGroup,
    ]);

    this.player_1.animations.add("stand", [0, 1], 10, true);
    this.player_1.animations.add("walk", [2, 3, 4, 5], 15, true);
    this.player_1.animations.add("win", [6], 10, true);
    this.player_1.animations.add("lose", [7, 8], 10, true);

    this.playerHspd_1 = 1;
    this.isKick_1 = false;

    // 플레이어_2 생성
    this.player_2 = game.add.sprite(
      game.world.centerX + 400,
      game.world.centerY,
      chr_sprite[chr_select_2]
    );
    this.player_2.anchor.set(0.5);

    game.physics.p2.enable(this.player_2, false);
    this.player_2.body.mass = 5;
    this.player_2.body.fixedRotation = true;
    this.player_2.body.damping = 0.75;
    this.player_2.scale.set(playerScale_2);
    this.player_2.body.setCircle(this.player_2.width / 2);
    this.player_2.body.setCollisionGroup(this.playerCollisionGroup);
    this.player_2.body.collides([
      this.ballCollisionGroup,
      this.playerCollisionGroup,
    ]);

    this.player_2.animations.add("stand", [0, 1], 10, true);
    this.player_2.animations.add("walk", [2, 3, 4, 5], 10, true);
    this.player_2.animations.add("win", [6], 10, true);
    this.player_2.animations.add("lose", [7, 8], 10, true);

    this.playerHspd_2 = -1;
    this.isKick_2 = false;

    // 볼 생성
    this.ball = game.add.sprite(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      "spr_ball"
    );
    this.ball.anchor.set(0.5);

    game.physics.p2.enable(this.ball, false);
    this.ball.body.mass = ballMass;
    this.ball.body.damping = 0.7;
    this.ball.body.fixedRotation = false;
    this.ball.scale.set(ballScale);
    this.ball.body.setCircle(this.ball.width / 2);
    this.ball.body.setCollisionGroup(this.ballCollisionGroup);
    this.ball.body.collides([
      this.playerCollisionGroup,
      this.boxCollisionGroup,
    ]);

    // 볼 킥오프 연출 초기화 ( 공중에서 떨어지는 연출 )
    this.ball.scale.set(ballScale * 5);
    this.ball.alpha = 0;

    // 남은 시간 타이머 반복 재생
    this.timer = game.time.create(false);
    this.timer.loop(1000, () => {
      if (Game.isGameStart) {
        if (timerSec > 0) {
          timerSec--;
        } else {
          if (timerMin > 0) {
            timerMin--;
            timerSec = 59;
          } else {
            timerSec = "00";
          }
        }
      }
    });
    this.timer.start();

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

    // 점수 UI
    this.scoreText = game.add.text(
      CANVAS_WIDTH / 2,
      90,
      blueScore + " : " + orangeScore,
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

    // 플레이어_1 이름 UI
    this.onPlayerName_1 = game.add.text(
      this.player_1.body.x,
      this.player_1.body.y - 30,
      playerName_1,
      {
        font: "bold 20px BMJUA",
        fill: "#4834d4",
      }
    );
    this.onPlayerName_1.anchor.set(0.5);
    this.onPlayerName_1.stroke = "#ffffff";
    this.onPlayerName_1.strokeThickness = 3;

    // 플레이어_1 스태미나 UI
    this.staminaBar_1 = new HealthBar(this.game, {
      width: 50,
      height: 10,
      x: this.player_1.x,
      y: this.player_1.y + 40,
      bg: { color: "#7f8c8d" },
      bar: { color: "#3c40c6" },
    });
    this.stamina_1 = 100;
    this.staminaBar_1.setPercent(this.stamina_1);

    // 플레이어_1 슛 이펙트
    this.ef_kick_1 = game.add.sprite(
      this.player_1.x,
      this.player_1.y,
      "ef_kick"
    );
    this.ef_kick_1.anchor.set(0.5);
    this.ef_kick_1.width = 100;
    this.ef_kick_1.height = 100;
    this.ef_kick_1.animations.add(
      "ef_kick",
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      15,
      true
    );
    this.ef_kick_1.animations.play("ef_kick");
    this.ef_kick_1.alpha = 0;

    // 플레이어_2 이름 UI
    this.onPlayerName_2 = game.add.text(
      this.player_2.body.x,
      this.player_2.body.y - 30,
      playerName_2,
      {
        font: "bold 20px BMJUA",
        fill: "#e67e22",
      }
    );
    this.onPlayerName_2.anchor.set(0.5);
    this.onPlayerName_2.stroke = "#ffffff";
    this.onPlayerName_2.strokeThickness = 3;

    // 플레이어_2 스태미나 UI
    this.staminaBar_2 = new HealthBar(this.game, {
      width: 50,
      height: 10,
      x: this.player_2.x,
      y: this.player_2.y + 40,
      bg: { color: "#7f8c8d" },
      bar: { color: "#3c40c6" },
    });
    this.stamina_2 = 100;
    this.staminaBar_2.setPercent(this.stamina_2);

    // 플레이어_2 슛 이펙트
    this.ef_kick_2 = game.add.sprite(
      this.player_2.x,
      this.player_2.y,
      "ef_kick"
    );
    this.ef_kick_2.anchor.set(0.5);
    this.ef_kick_2.width = 100;
    this.ef_kick_2.height = 100;
    this.ef_kick_2.animations.add(
      "ef_kick",
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      15,
      true
    );
    this.ef_kick_2.animations.play("ef_kick");
    this.ef_kick_2.alpha = 0;

    // 렌더링 순서(깊이) 설정
    this.player_1.bringToTop();
    this.player_2.bringToTop();
    this.onPlayerName_2.bringToTop();
    this.onPlayerName_1.bringToTop();
    this.timerText.bringToTop();
    this.scoreText.bringToTop();
  },

  update() {
    if (this.isGameStart && !this.isTimeOver && !this.isGoal) {
      // 플레이어_1 이동
      this.playerHspd_1 =
        game.input.keyboard.addKey(Phaser.Keyboard.D).isDown -
        game.input.keyboard.addKey(Phaser.Keyboard.A).isDown;
      this.player_1.body.velocity.x += this.playerHspd_1 * playerAccSpeed;
      this.playerVspd_1 =
        game.input.keyboard.addKey(Phaser.Keyboard.S).isDown -
        game.input.keyboard.addKey(Phaser.Keyboard.W).isDown;
      this.player_1.body.velocity.y += this.playerVspd_1 * playerAccSpeed;

      // 플레이어_2 이동
      this.playerHspd_2 = this.cursors.right.isDown - this.cursors.left.isDown;
      this.player_2.body.velocity.x += this.playerHspd_2 * playerAccSpeed;
      this.playerVspd_2 = this.cursors.down.isDown - this.cursors.up.isDown;
      this.player_2.body.velocity.y += this.playerVspd_2 * playerAccSpeed;

      // 플레이어_1 애니메이션
      if (
        Math.max(
          Math.abs(this.player_1.body.velocity.x),
          Math.abs(this.player_1.body.velocity.y)
        ) < 10
      ) {
        this.player_1.animations.play("stand");
      } else {
        this.player_1.animations.play("walk");
      }

      // 플레이어_2 애니메이션
      if (
        Math.max(
          Math.abs(this.player_2.body.velocity.x),
          Math.abs(this.player_2.body.velocity.y)
        ) < 10
      ) {
        this.player_2.animations.play("stand");
      } else {
        this.player_2.animations.play("walk");
      }
    }

    // 플레이어_1 속도 제한
    this.player_1.body.velocity.x = game.math.clamp(
      this.player_1.body.velocity.x,
      -playerMaxSpeed_1,
      playerMaxSpeed_1
    );
    this.player_1.body.velocity.y = game.math.clamp(
      this.player_1.body.velocity.y,
      -playerMaxSpeed_1,
      playerMaxSpeed_1
    );

    // 플레이어_2 속도 제한
    this.player_2.body.velocity.x = game.math.clamp(
      this.player_2.body.velocity.x,
      -playerMaxSpeed_2,
      playerMaxSpeed_2
    );
    this.player_2.body.velocity.y = game.math.clamp(
      this.player_2.body.velocity.y,
      -playerMaxSpeed_2,
      playerMaxSpeed_2
    );

    // 플레이어_1 방향 설정
    if (this.playerHspd_1 != 0)
      this.player_1.scale.x = this.playerHspd_1 * playerScale_1;

    // 플레이어_2 방향 설정
    if (this.playerHspd_2 != 0)
      this.player_2.scale.x = this.playerHspd_2 * playerScale_1;

    // 플레이어_1 이름 UI
    this.onPlayerName_1.x = this.player_1.x;
    this.onPlayerName_1.y = this.player_1.y - 30;

    // 플레이어_2 이름 UI
    this.onPlayerName_2.x = this.player_2.x;
    this.onPlayerName_2.y = this.player_2.y - 30;

    // 플레이어_1 스태미너 UI
    this.staminaBar_1.setPosition(this.player_1.x, this.player_1.y + 40);
    this.staminaBar_1.setPercent(this.stamina_1);
    this.stamina_1 = game.math.clamp(this.stamina_1, 0, 100);

    // 플레이어_2 스태미너 UI
    this.staminaBar_2.setPosition(this.player_2.x, this.player_2.y + 40);
    this.staminaBar_2.setPercent(this.stamina_2);
    this.stamina_2 = game.math.clamp(this.stamina_2, 0, 100);

    // 플레이어_1 슛 이펙트
    this.ef_kick_1.x = this.player_1.x;
    this.ef_kick_1.y = this.player_1.y;

    if (this.kickButton_1.isDown && !this.isKick_1) {
      if (this.isGameStart) {
        this.ef_kick_1.alpha = 1;
      }
    } else {
      this.ef_kick_1.alpha = 0;
    }

    // 플레이어_2 슛 이펙트
    this.ef_kick_2.x = this.player_2.x;
    this.ef_kick_2.y = this.player_2.y;

    if (this.kickButton_2.isDown && !this.isKick_2) {
      if (this.isGameStart) {
        this.ef_kick_2.alpha = 1;
      }
    } else {
      this.ef_kick_2.alpha = 0;
    }

    // 플레이어_1 대시
    if (this.isGameStart) {
      if (this.dashButton_1.isDown) {
        playerMaxSpeed_1 = this.stamina_1 > 0 ? dashSpeed_1 : maxSpeed;
        if (this.stamina_1 > 0) {
          this.stamina_1 -= 0.6;
        }
      } else {
        playerMaxSpeed_1 = maxSpeed;
        if (this.stamina_1 < 100) {
          this.stamina_1 += 0.3;
        }
      }
    }

    // 플레이어_2 대시
    if (this.isGameStart) {
      if (this.dashButton_2.isDown) {
        playerMaxSpeed_2 = this.stamina_1 > 0 ? dashSpeed_2 : maxSpeed;
        if (this.stamina_2 > 0) {
          this.stamina_2 -= 0.6;
        }
      } else {
        playerMaxSpeed_2 = maxSpeed;
        if (this.stamina_2 < 100) {
          this.stamina_2 += 0.3;
        }
      }
    }

    // 플레이어_1 슛
    if (
      this.kickButton_1.isDown &&
      !this.isKick_1 &&
      Phaser.Rectangle.intersects(
        this.player_1.getBounds(),
        this.ball.getBounds()
      )
    ) {
      sfx_kick.play();
      const angle =
        (game.math.angleBetween(
          this.player_1.x,
          this.player_1.y,
          this.ball.x,
          this.ball.y
        ) *
          180) /
          Math.PI +
        90;
      this.ball.body.angle = angle;
      this.ball.body.moveForward(playerShootPower);
      this.isKick_1 = true;
    } else if (!this.kickButton_1.isDown) {
      this.isKick_1 = false;
    }

    // 플레이어_2 슛
    if (
      this.kickButton_2.isDown &&
      !this.isKick_2 &&
      Phaser.Rectangle.intersects(
        this.player_2.getBounds(),
        this.ball.getBounds()
      )
    ) {
      sfx_kick.play();
      const angle =
        (game.math.angleBetween(
          this.player_2.x,
          this.player_2.y,
          this.ball.x,
          this.ball.y
        ) *
          180) /
          Math.PI +
        90;
      this.ball.body.angle = angle;
      this.ball.body.moveForward(playerShootPower);
      this.isKick_2 = true;
    } else if (!this.kickButton_2.isDown) {
      this.isKick_2 = false;
    }

    // 볼 킥오프 연출 ( 공중에서 떨어지는 연출 )
    if (this.isGameStart) {
      if (this.ball.scale.x > ballScale) {
        if (this.ball.scale.x + 1 / 10 > ballScale) {
          this.ball.scale.x -= 1 / 10;
          this.ball.scale.y -= 1 / 10;
        } else {
          this.ball.scale.x = ballScale;
          this.ball.scale.y = ballScale;
        }
      }
      this.ball.alpha = Math.min(1, ballScale / this.ball.scale.x);
    }

    // 볼 속도 제한
    this.ball.body.velocity.x = game.math.clamp(
      this.ball.body.velocity.x,
      -ballMaxSpeed,
      ballMaxSpeed
    );
    this.ball.body.velocity.y = game.math.clamp(
      this.ball.body.velocity.y,
      -ballMaxSpeed,
      ballMaxSpeed
    );

    // 볼 각도 설정
    this.ball.body.angle +=
      (Math.abs(this.ball.body.velocity.x) > Math.abs(this.ball.body.velocity.y)
        ? this.ball.body.velocity.x
        : this.ball.body.velocity.y) / 20;

    // 남은 시간 UI
    this.timerText.setText(timerMin + " : " + timerSec);

    // 점수 UI
    this.scoreText.setText(blueScore + " : " + orangeScore);

    // 골!!
    if (!this.isGoal && !this.isTimeOver) {
      // 포도팀 골!!
      if (
        this.ball.body.x >= 1232.9 &&
        this.ball.body.y >= 252.5 &&
        this.ball.body.y <= 447.6
      ) {
        blueScore++;
        sfx_cheer.play();
        this.player_1.animations.play("win");
        this.player_2.animations.play("lose");

        this.text = game.add.text(
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2,
          playerName_1 + " 득점",
          {
            font: "100px BMJUA",
            fill: "#4834d4",
            align: "center",
          }
        );
        this.text.anchor.set(0.5);
        this.text.stroke = "#ffffff";
        this.text.strokeThickness = 3;
        this.text.bringToTop();

        this.isGoal = true;
        this.timer.stop();
        game.time.events.add(Phaser.Timer.SECOND * 6, this.restartGame);
      }

      // 오렌지팀 골!!
      if (
        this.ball.body.x <= 48.3 &&
        this.ball.body.y >= 252.5 &&
        this.ball.body.y <= 447.6
      ) {
        orangeScore++;
        sfx_cheer.play();
        this.player_1.animations.play("lose");
        this.player_2.animations.play("win");

        this.text = game.add.text(
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2,
          playerName_2 + " 득점",
          {
            font: "100px BMJUA",
            fill: "#e67e22",
            align: "center",
          }
        );
        this.text.anchor.set(0.5);
        this.text.stroke = "#ffffff";
        this.text.strokeThickness = 3;
        this.text.bringToTop();

        this.isGoal = true;
        this.timer.stop();
        game.time.events.add(Phaser.Timer.SECOND * 6, this.restartGame);
      }
    }

    // 경기 종료
    if (timerMin === 0 && timerSec === "00" && !this.isTimeOver) {
      // 포도팀 승리!!
      if (blueScore > orangeScore) {
        this.BlueWinText = game.add.text(
          CANVAS_WIDTH / 2,
          game.world.centerY,
          playerName_1 + " 승리",
          {
            font: "100px BMJUA",
            fill: "#4834d4",
          }
        );
        this.BlueWinText.anchor.set(0.5);
        this.BlueWinText.stroke = "#ffffff";
        this.BlueWinText.strokeThickness = 3;
        this.player_1.animations.play("win");
        this.player_2.animations.play("lose");
        this.BlueWinText.bringToTop();
      }

      // 오렌지팀 승리!!
      if (blueScore < orangeScore) {
        this.OrangeWinText = game.add.text(
          CANVAS_WIDTH / 2,
          game.world.centerY,
          playerName_2 + " 승리",
          {
            font: "100px BMJUA",
            fill: "#e67e22",
          }
        );
        this.OrangeWinText.anchor.set(0.5);
        this.OrangeWinText.stroke = "#ffffff";
        this.OrangeWinText.strokeThickness = 3;
        this.player_1.animations.play("lose");
        this.player_2.animations.play("win");
        this.OrangeWinText.bringToTop();
      }

      // 무승부!!
      if (blueScore === orangeScore) {
        this.drawText = game.add.text(
          CANVAS_WIDTH / 2,
          game.world.centerY,
          "무승부",
          {
            font: "100px BMJUA",
            fill: "#000000",
          }
        );
        this.drawText.stroke = "#ffffff";
        this.drawText.strokeThickness = 3;
        this.drawText.anchor.set(0.5);
        this.player_1.animations.play("stand");
        this.player_2.animations.play("stand");
        this.drawText.bringToTop();
      }

      sfx_endWhistle.play();
      this.isTimeOver = true;
      this.timer.stop();
      game.time.events.add(Phaser.Timer.SECOND * 5, this.resetGame);
    }
  },

  startGame: function () {
    sfx_startWhistle.play();
    Game.isGameStart = true;
    Game.text_ready.destroy();
  },

  restartGame: function () {
    game.state.restart();
  },

  resetGame: function () {
    timerSec = "00";
    timerMin = 3;
    orangeScore = 0;
    blueScore = 0;
    game.state.start("singleCustom");
  },
};

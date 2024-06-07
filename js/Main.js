// 로고, 크레딧 씬

const main = {
  create() {
    // 씬 전환 효과
    this.camera.flash("#000000");

    // BGM 재생
    bgm_inGame.loopFull(1);

    // 배경 이미지
    this.bg_lobby = this.game.add.tileSprite(
      0,
      CANVAS_HEIGHT - this.game.cache.getImage("bg_lobby").height,
      CANVAS_WIDTH,
      this.game.cache.getImage("bg_lobby").height,
      "bg_lobby"
    );

    // 로고 이미지
    this.logo = game.add.image(CANVAS_WIDTH / 2, 200, "spr_logo");
    this.logo.anchor.set(0.5);
    this.logo.scale.set(1);

    // 도움말 이미지
    this.pressAnyKey = game.add.image(CANVAS_WIDTH / 2, 550, "spr_pressAnyKey");
    this.pressAnyKey.anchor.set(0.5);
    this.pressAnyKey.scale.set(0.6);
    this.pressAnyKey.alpha = 1;

    // 크레딧 텍스트
    this.text_credit = game.add.text(
      280,
      700,
      "강이수 / 강준하 / 고윤슬 / 박경서 / 정지은 (2018 선린디콘)",
      {
        font: "bold 20px",
        fill: "#ffffff",
      }
    );
    this.text_credit.anchor.set(0.5);

    // 아무 키 눌렸을 때 게임모드 선택 씬 이동
    let isAnyKey = false;
    game.input.keyboard.onPressCallback = (e) => {
      if (e != null && !isAnyKey) {
        sfx_button.play();
        isAnyKey = true;
        game.state.start("selectMode");
      }
    };
  },

  update() {
    // 애니메이션 효과
    this.bg_lobby.tilePosition.x -= 6;
    this.logo.angle = Math.sin(game.time.totalElapsedSeconds() * 2) * 5;
    this.pressAnyKey.scale.set(
      Math.abs(Math.cos(game.time.totalElapsedSeconds() * 2) * 0.2) + 0.6
    );
    this.pressAnyKey.alpha =
      Math.abs(Math.cos(game.time.totalElapsedSeconds() * 2) * 0.6) + 0.4;
  },
};

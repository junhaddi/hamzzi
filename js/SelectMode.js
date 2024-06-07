// 게임 모드 선택 씬

const selectMode = {
  create() {
    // 씬 전환 효과
    this.camera.flash("#000000");

    // 배경 이미지
    this.bg_background = this.game.add.tileSprite(
      0,
      this.game.height - this.game.cache.getImage("bg_lobby").height,
      this.game.width,
      this.game.cache.getImage("bg_lobby").height,
      "bg_lobby"
    );

    // 게임 모드 선택 텍스트
    this.text_title = game.add.text(CANVAS_WIDTH / 2, 100, "게임 모드 선택", {
      font: "bold 60px BMJUA",
    });
    this.text_title.anchor.set(0.5);
    this.text_title.stroke = "#ffffff";
    this.text_title.strokeThickness = 6;

    // 싱글플레이 이미지
    this.singleLogo = game.add.image(
      CANVAS_WIDTH / 2 - 300,
      CANVAS_HEIGHT / 2,
      "spr_singleLogo"
    );
    this.singleLogo.anchor.set(0.5);
    this.singleLogo.scale.set(0.7);

    // 멀티플레이 이미지
    this.multiLogo = game.add.image(
      CANVAS_WIDTH / 2 + 300,
      CANVAS_HEIGHT / 2,
      "spr_multiLogo"
    );
    this.multiLogo.anchor.set(0.5);

    // 싱글플레이 버튼
    this.bt_single = game.add.button(
      CANVAS_WIDTH / 2 - 300,
      600,
      "spr_singleButton",
      this.single,
      this
    );
    this.bt_single.anchor.set(0.5);
    this.bt_single.scale.set(0.5);

    // 멀티플레이 버튼
    this.bt_multi = game.add.button(
      CANVAS_WIDTH / 2 + 300,
      600,
      "spr_multiButton",
      this.multi,
      this
    );
    this.bt_multi.anchor.set(0.5);
    this.bt_multi.scale.set(0.5);
  },

  update() {
    // 애니메이션 효과
    this.bg_background.tilePosition.x -= 6;
    this.singleLogo.angle = Math.cos(game.time.totalElapsedSeconds() * 2) * 5;
    this.multiLogo.angle = Math.sin(game.time.totalElapsedSeconds() * 2) * 5;

    if (this.bt_single.input.pointerOver()) {
      this.bt_single.alpha = 1;
    } else {
      this.bt_single.alpha = 0.8;
    }

    if (this.bt_multi.input.pointerOver()) {
      this.bt_multi.alpha = 1;
    } else {
      this.bt_multi.alpha = 0.8;
    }
  },

  single() {
    sfx_button.play();
    gameMode = "single";
    game.state.start("singleCustom");
  },

  multi() {
    sfx_button.play();
    gameMode = "multi";
    game.state.start("multiCustom");
  },
};

// 튜토리얼 씬

const tutorial = {
  create() {
    // 씬 전환 효과
    this.camera.flash("#000000");

    // 튜토리얼 이미지
    game.add.image(0, 0, "bg_tutorial");

    // 게임플레이 씬 이동 타이머
    game.time.events.add(Phaser.Timer.SECOND * 5, this.startGame);
  },

  startGame() {
    // 게임 모드에 따라 다른 싱글플레이, 멀티플레이 씬으로 이동
    const nextState = gameMode === "single" ? "Game" : "gameMulti";
    this.game.state.start(nextState);
  },
};

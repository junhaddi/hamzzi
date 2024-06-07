// 리소스 로드 씬

// 캔버스 크기 상수
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

// 햄찌 스프라이트 이름 배열
const chr_sprite = [
  "spr_chr_1",
  "spr_chr_2",
  "spr_chr_3",
  "spr_chr_4",
  "spr_chr_5",
  "spr_chr_6",
  "spr_chr_7",
  "spr_chr_8",
  "spr_chr_9",
];

// 햄찌 이름 배열
const chr_name = [
  "곰찌",
  "공룡찌",
  "햄찌",
  "은찌",
  "넛찌",
  "무지개찌",
  "흰찌",
  "토끼찌",
  "파카찌",
];

// 배경 스프라이트 이름 배열
const bg_sprite = ["bg_inGame_1", "bg_inGame_2", "bg_inGame_3", "bg_inGame_4"];

// 배경 이름 배열
const bg_name = ["운동장", "햄스터집", "눈덮인햄스터집", "사탕마을"];

// 게임 환경변수 선언
let gameMode;

let timerSec = "00";
let timerMin = 3;
let orangeScore = 0;
let blueScore = 0;

// 랜덤으로 선택된 햄찌 인덱스
let chr_select_1 = getRandomInt(0, chr_sprite.length - 1);
let chr_select_2 = getRandomInt(0, chr_sprite.length - 1);
let chr_select = getRandomInt(0, chr_sprite.length - 1);

// 선택된 배경 인덱스
let bg_select = 0;

// 오디오 변수
let bgm_inGame;
let sfx_button;
let sfx_cheer;
let sfx_kick;
let sfx_startWhistle;
let sfx_endWhistle;

// 최소값과 최대값 사이의 랜덤 정수를 반환하는 함수
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 모든 스프라이트시트를 로드하는 함수
function loadSpritesheets() {
  const spritesheets = [
    {
      name: "spr_chr_1",
      path: "assets/anim/spr_chr_1.png",
      width: 20,
      height: 20,
      frames: 9,
    },
    {
      name: "spr_chr_2",
      path: "assets/anim/spr_chr_2.png",
      width: 25,
      height: 19,
      frames: 9,
    },
    {
      name: "spr_chr_3",
      path: "assets/anim/spr_chr_3.png",
      width: 20,
      height: 20,
      frames: 9,
    },
    {
      name: "spr_chr_4",
      path: "assets/anim/spr_chr_4.png",
      width: 20,
      height: 20,
      frames: 9,
    },
    {
      name: "spr_chr_5",
      path: "assets/anim/spr_chr_5.png",
      width: 20,
      height: 20,
      frames: 9,
    },
    {
      name: "spr_chr_6",
      path: "assets/anim/spr_chr_6.png",
      width: 20,
      height: 20,
      frames: 9,
    },
    {
      name: "spr_chr_7",
      path: "assets/anim/spr_chr_7.png",
      width: 20,
      height: 20,
      frames: 9,
    },
    {
      name: "spr_chr_8",
      path: "assets/anim/spr_chr_8.png",
      width: 20,
      height: 24,
      frames: 9,
    },
    {
      name: "spr_chr_9",
      path: "assets/anim/spr_chr_9.png",
      width: 20,
      height: 23,
      frames: 9,
    },
    {
      name: "spr_toggle",
      path: "assets/sprites/spr_toggle.png",
      width: 300,
      height: 110,
      frames: 2,
    },
    {
      name: "ef_kick",
      path: "assets/anim/ef_kick.png",
      width: 200,
      height: 179.75,
      frames: 20,
    },
  ];

  spritesheets.forEach((sheet) => {
    game.load.spritesheet(
      sheet.name,
      sheet.path,
      sheet.width,
      sheet.height,
      sheet.frames
    );
  });
}

// 모든 이미지를 로드하는 함수
function loadImages() {
  const images = [
    { name: "spr_logo", path: "assets/sprites/spr_logo.png" },
    { name: "spr_pressAnyKey", path: "assets/sprites/spr_pressAnyKey.png" },
    { name: "spr_singleLogo", path: "assets/sprites/spr_singleLogo.png" },
    { name: "spr_multiLogo", path: "assets/sprites/spr_multiLogo.png" },
    { name: "spr_singleButton", path: "assets/sprites/spr_singleButton.png" },
    { name: "spr_multiButton", path: "assets/sprites/spr_multiButton.png" },
    { name: "spr_arrow", path: "assets/sprites/spr_arrow.png" },
    { name: "spr_back", path: "assets/sprites/spr_back.png" },
    { name: "spr_button", path: "assets/sprites/spr_button.png" },
    { name: "spr_ball", path: "assets/sprites/spr_ball.png" },
    { name: "spr_box", path: "assets/sprites/spr_box.png" },
    { name: "bg_inGame_1", path: "assets/bg/bg_inGame_1.png" },
    { name: "bg_inGame_2", path: "assets/bg/bg_inGame_2.png" },
    { name: "bg_inGame_3", path: "assets/bg/bg_inGame_3.png" },
    { name: "bg_inGame_4", path: "assets/bg/bg_inGame_4.png" },
    { name: "bg_lobby", path: "assets/bg/bg_lobby.png" },
    { name: "bg_tutorial", path: "assets/bg/bg_tutorial.png" },
  ];

  images.forEach((image) => {
    game.load.image(image.name, image.path);
  });
}

// 모든 오디오 파일을 로드하는 함수
function loadAudio() {
  const audios = [
    { name: "bgm_inGame", path: "assets/sound/bgm/bensound-littleidea.mp3" },
    { name: "sfx_cheer", path: "assets/sound/effect/sfx_cheer.mp3" },
    { name: "sfx_kick", path: "assets/sound/effect/sfx_kick.mp3" },
    { name: "sfx_button", path: "assets/sound/effect/sfx_button.mp3" },
    {
      name: "sfx_startWhistle",
      path: "assets/sound/effect/sfx_startWhistle.mp3",
    },
    { name: "sfx_endWhistle", path: "assets/sound/effect/sfx_endWhistle.mp3" },
  ];

  audios.forEach((audio) => {
    game.load.audio(audio.name, audio.path);
  });
}

const boot = {
  preload() {
    // 캔버스 설정
    game.stage.disableVisibilityChange = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setShowAll();
    window.addEventListener("resize", () => this.game.scale.refresh());
    this.game.scale.refresh();

    // 리소스 로드
    loadSpritesheets();
    loadImages();
    loadAudio();

    // PhaserInput 플러그인 추가
    game.plugins.add(PhaserInput.Plugin);

    // 폰트 캐싱
    this.font_cache = game.add.text(0, 0, "", { font: "1px BMJUA" });
  },
  create() {
    // 오디오 초기화
    bgm_inGame = game.add.audio("bgm_inGame");
    sfx_button = game.add.audio("sfx_button");
    sfx_cheer = game.add.audio("sfx_cheer");
    sfx_kick = game.add.audio("sfx_kick");
    sfx_startWhistle = game.add.audio("sfx_startWhistle");
    sfx_endWhistle = game.add.audio("sfx_endWhistle");

    // 메인 씬 이동
    game.state.start("main");
  },
};

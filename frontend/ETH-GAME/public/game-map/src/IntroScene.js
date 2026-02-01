export default class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene");
  }

  create() {
    const { width, height } = this.scale;

    /* =====================
       BACKGROUND
    ====================== */
    this.cameras.main.setBackgroundColor("#070b14");

    const panel = this.add
      .rectangle(width / 2, height / 2, width * 0.8, height * 0.75, 0x0a0e18, 0.97)
      .setStrokeStyle(3, 0x00ffd5, 0.8);

    /* =====================
       GRID OVERLAY
    ====================== */
    const g = this.add.graphics();
    g.lineStyle(1, 0x00ffd5, 0.1);
    for (let x = 0; x < width; x += 32) g.lineBetween(x, 0, x, height);
    for (let y = 0; y < height; y += 32) g.lineBetween(0, y, width, y);

    /* =====================
       TITLE
    ====================== */
    this.add.text(width / 2, height / 2 - 260, "SYSTEM NOTICE", {
      fontFamily: "monospace",
      fontSize: "38px",
      color: "#00ffd5",
      shadow: { color: "#00ffd5", blur: 20, fill: true },
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 220, "CYBER GO NETWORK", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#8899aa",
    }).setOrigin(0.5);

    /* =====================
       NOTICE TEXT
    ====================== */
    const noticeText = [
      "WELCOME TO THE CYBER CITY",
      "",
      "• WEFCO MART",
      "  Access underground MINI GAMES",
      "  Play, score high, and EARN TOKENS",
      "",
      "• DESAT BANK",
      "  Secure storage for your TOKENS",
      "  Exchange tokens for NFT REWARDS",
      "  (ETH Sepolia Network)",
      "",
      "Your survival, skill, and score",
      "define your rewards in this city.",
    ];

    this.add.text(width / 2, height / 2 - 40, noticeText, {
      fontFamily: "monospace",
      fontSize: "17px",
      color: "#ccddee",
      lineSpacing: 14,
      align: "center",
    }).setOrigin(0.5);

    /* =====================
       ACTION PROMPT
    ====================== */
    const prompt = this.add.text(
      width / 2,
      height / 2 + 220,
      "[ PRESS ENTER / SPACE OR CLICK TO CONTINUE ]",
      {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#00ffd5",
      }
    ).setOrigin(0.5);

    /* =====================
       BLINK EFFECT
    ====================== */
    this.tweens.add({
      targets: prompt,
      alpha: 0.3,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    /* =====================
       START GAME
    ====================== */
    const startGame = () => {
      this.cameras.main.fadeOut(500);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("GameScene");
      });
    };

    this.input.keyboard.once("keydown-ENTER", startGame);
    this.input.keyboard.once("keydown-SPACE", startGame);
    this.input.once("pointerdown", startGame);

    this.cameras.main.fadeIn(400);

    console.log("IntroScene (System Notice) loaded");
  }
}

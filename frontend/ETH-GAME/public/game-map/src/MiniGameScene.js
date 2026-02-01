export default class MiniGameScene extends Phaser.Scene {
  constructor() {
    super("MiniGameScene");
  }

  init(data) {
    this.gameMode = data.mode || null;
    this.ended = false;
  }

  preload() {
    // 🎞️ Background video
    this.load.video(
      "minigameBg",
      "assets/unt.mp4",
      "loadeddata",
      false,
      true
    );
  }

  create() {
    const { width, height } = this.scale;

    /* =====================
       VIDEO BACKGROUND
    ====================== */
    this.bg = this.add.video(width / 2, height / 2, "minigameBg");
    this.bg.setLoop(true);
    this.bg.setMute(true);
    this.bg.play();

    // 🔥 Correct cover scaling
    this.resizeVideoToCover(this.bg);

    /* =====================
       START MODE
    ====================== */
    if (!this.gameMode) {
      this.createMenu();
    } else if (this.gameMode === "blocks") {
      this.createBlocksBlast();
    } else if (this.gameMode === "space") {
      this.createSpaceBattle();
    }

    /* =====================
       RESIZE HANDLER
    ====================== */
    this.scale.on("resize", () => {
      if (this.bg) this.resizeVideoToCover(this.bg);
    });
  }

  /* =====================
     VIDEO RESIZE (COVER)
  ====================== */
  resizeVideoToCover(video) {
    const vw = video.video.videoWidth;
    const vh = video.video.videoHeight;

    if (!vw || !vh) return;

    const sw = this.scale.width;
    const sh = this.scale.height;

    const scale = Math.max(sw / vw, sh / vh);

    video.setScale(scale);
    video.setPosition(sw / 2, sh / 2);
  }

  /* =====================
     MENU
  ====================== */
  createMenu() {
    const { width, height } = this.scale;

    this.add.text(width / 2, 80, "MINI GAMES", {
      fontSize: "36px",
      fontFamily: "monospace",
      color: "#00ffd5",
    }).setOrigin(0.5);

    this.add.text(width / 2, 130, "Earn tokens by scoring!", {
      fontSize: "16px",
      fontFamily: "monospace",
      color: "#8899aa",
    }).setOrigin(0.5);

    const games = [
      { id: "blocks", name: "BLOCKS BLAST", desc: "Break blocks, bounce ball" },
      { id: "space", name: "SPACE BATTLE", desc: "Shoot obstacles, dodge!" },
    ];

    games.forEach((g, i) => {
      const y = height / 2 - 40 + i * 140;

      const btn = this.add
        .rectangle(width / 2, y, 340, 100, 0x0d1220, 0.9)
        .setStrokeStyle(2, 0x00ffd5, 0.5)
        .setInteractive({ useHandCursor: true });

      this.add.text(width / 2, y - 15, g.name, {
        fontSize: "20px",
        fontFamily: "monospace",
        color: "#00ffd5",
      }).setOrigin(0.5);

      this.add.text(width / 2, y + 15, g.desc, {
        fontSize: "14px",
        fontFamily: "monospace",
        color: "#8899aa",
      }).setOrigin(0.5);

      btn.on("pointerover", () =>
        btn.setStrokeStyle(2, 0x00ffd5, 1)
      );
      btn.on("pointerout", () =>
        btn.setStrokeStyle(2, 0x00ffd5, 0.5)
      );
      btn.on("pointerdown", () =>
        this.scene.restart({ mode: g.id })
      );
    });

    this.add.text(width / 2, height - 40, "ESC — Back to city", {
      fontSize: "14px",
      fontFamily: "monospace",
      color: "#556677",
    }).setOrigin(0.5);

    this.input.keyboard.once("keydown-ESC", () => {
      this.cameras.main.fadeOut(200);
      this.cameras.main.once("camerafadeoutcomplete", () =>
        this.scene.start("GameScene")
      );
    });
  }

  /* =====================
     BLOCKS BLAST
  ====================== */
  createBlocksBlast() {
    const { width, height } = this.scale;

    const GRID_W = 10;
    const GRID_H = 8;
    const BLOCK_W = 64;
    const BLOCK_H = 24;
    const PADDLE_W = 120;
    const PADDLE_H = 16;
    const BALL_SPEED = 350;

    this.blocksBlast = { score: 0 };

    this.scoreText = this.add.text(width / 2, 30, "SCORE: 0", {
      fontSize: "18px",
      fontFamily: "monospace",
      color: "#00ffd5",
    }).setOrigin(0.5);

    const blockGroup = this.add.group();
    const startX = (width - GRID_W * BLOCK_W) / 2 + BLOCK_W / 2;
    const startY = 100;
    const colors = [0xff0066, 0xff6600, 0xffcc00, 0x00ff88, 0x00aaff];

    for (let row = 0; row < GRID_H; row++) {
      for (let col = 0; col < GRID_W; col++) {
        const bx = startX + col * BLOCK_W;
        const by = startY + row * BLOCK_H;
        const block = this.add.rectangle(
          bx,
          by,
          BLOCK_W - 4,
          BLOCK_H - 2,
          colors[row % colors.length],
          0.9
        );
        block.setData("points", (GRID_H - row) * 10);
        this.physics.add.existing(block, true);
        blockGroup.add(block);
      }
    }

    const paddle = this.add.rectangle(
      width / 2,
      height - 40,
      PADDLE_W,
      PADDLE_H,
      0x00ffd5
    );
    this.physics.add.existing(paddle, true);

    const ball = this.add.circle(width / 2, height - 80, 8, 0xffffff);
    this.physics.add.existing(ball);
    ball.body.setCircle(8);
    ball.body.setBounce(1);
    ball.body.setVelocity(
      Phaser.Math.Between(-120, 120),
      -BALL_SPEED
    );
    ball.body.setCollideWorldBounds(true);

    this.input.on("pointermove", (p) => {
      paddle.x = Phaser.Math.Clamp(
        p.x,
        PADDLE_W / 2,
        width - PADDLE_W / 2
      );
    });

    this.physics.add.collider(ball, paddle);
    this.physics.add.collider(ball, blockGroup, (b, block) => {
      this.blocksBlast.score += block.getData("points");
      this.scoreText.setText("SCORE: " + this.blocksBlast.score);
      block.destroy();
      if (blockGroup.getLength() === 0) this.endMinigame(true);
    });

    this.physics.world.setBounds(0, 0, width, height);
    this.blocksBlast.ball = ball;

    this.input.keyboard.once("keydown-ESC", () =>
      this.endMinigame(false)
    );
  }

  /* =====================
     SPACE BATTLE
  ====================== */
  createSpaceBattle() {
    const { width, height } = this.scale;

    this.spaceBattle = { score: 0, lastShot: 0 };
    this.bulletGroup = this.add.group();
    this.obstacleGroup = this.add.group();

    this.scoreText = this.add.text(width / 2, 30, "SCORE: 0", {
      fontSize: "18px",
      fontFamily: "monospace",
      color: "#00ffd5",
    }).setOrigin(0.5);

    const player = this.add.triangle(
      width / 2,
      height - 80,
      0,
      24,
      12,
      -12,
      24,
      24,
      0xff0066
    );
    this.physics.add.existing(player);
    player.body.setAllowGravity(false);
    player.body.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.obstacleTimer = this.time.addEvent({
      delay: 800,
      loop: true,
      callback: () => {
        const x = Phaser.Math.Between(40, width - 40);
        const obs = this.add.rectangle(x, -20, 40, 40, 0xff6600);
        this.physics.add.existing(obs);
        obs.body.setVelocity(0, 140);
        obs.setData("points", 25);
        this.obstacleGroup.add(obs);
      },
    });

    this.physics.add.overlap(
      this.bulletGroup,
      this.obstacleGroup,
      (b, o) => {
        this.spaceBattle.score += o.getData("points");
        this.scoreText.setText("SCORE: " + this.spaceBattle.score);
        b.destroy();
        o.destroy();
      }
    );

    this.physics.add.overlap(
      player,
      this.obstacleGroup,
      () => this.endMinigame(false)
    );

    this.spaceBattle.player = player;

    this.input.keyboard.once("keydown-ESC", () =>
      this.endMinigame(false)
    );
  }

  update(time) {
    if (
      this.gameMode === "blocks" &&
      this.blocksBlast?.ball?.y > this.scale.height - 10
    ) {
      this.endMinigame(false);
      return;
    }

    if (this.gameMode === "space" && this.spaceBattle) {
      const p = this.spaceBattle.player;
      if (!p) return;

      const speed = 300;
      if (this.cursors.left.isDown) p.body.setVelocityX(-speed);
      else if (this.cursors.right.isDown)
        p.body.setVelocityX(speed);
      else p.body.setVelocityX(0);

      if (this.spaceKey.isDown && time - this.spaceBattle.lastShot > 150) {
        this.spaceBattle.lastShot = time;
        const bullet = this.add.rectangle(p.x, p.y - 20, 4, 12, 0x00ffd5);
        this.physics.add.existing(bullet);
        bullet.body.setVelocity(0, -450);
        this.bulletGroup.add(bullet);
      }

      this.bulletGroup.getChildren().forEach((b) => {
        if (b.active && b.y < -20) b.destroy();
      });
      this.obstacleGroup.getChildren().forEach((o) => {
        if (o.active && o.y > this.scale.height + 20) o.destroy();
      });
    }
  }

  endMinigame(won) {
    if (this.ended) return;
    this.ended = true;

    let score = 0;
    if (this.gameMode === "blocks") score = this.blocksBlast.score;
    if (this.gameMode === "space") score = this.spaceBattle.score;

    const tokensEarned = Math.max(1, Math.floor(score / 50));
    const current = parseInt(
      localStorage.getItem("gameTokens") || "0",
      10
    );
    localStorage.setItem("gameTokens", current + tokensEarned);

    if (this.obstacleTimer) this.obstacleTimer.remove();

    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.8
    );

    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 40,
      won ? "VICTORY!" : "GAME OVER",
      {
        fontSize: "36px",
        fontFamily: "monospace",
        color: won ? "#00ff88" : "#ff0066",
      }
    ).setOrigin(0.5);

    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 10,
      `Score: ${score}`,
      {
        fontSize: "20px",
        fontFamily: "monospace",
        color: "#ffffff",
      }
    ).setOrigin(0.5);

    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 50,
      `+${tokensEarned} tokens earned`,
      {
        fontSize: "18px",
        fontFamily: "monospace",
        color: "#00ffd5",
      }
    ).setOrigin(0.5);

    this.time.delayedCall(2500, () => {
      this.scene.start("MiniGameScene");
    });
  }
}

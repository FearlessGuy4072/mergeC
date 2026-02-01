/**
 * BlocksBlastScene - Standalone block breaker minigame
 * Bounce ball off paddle to break blocks. Earn tokens based on score.
 */
export default class BlocksBlastScene extends Phaser.Scene {

  constructor() {
    super('BlocksBlastScene');
  }

  create() {
    this.ended = false;
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const CX = W / 2;
    const CY = H / 2;

    this.cameras.main.setBackgroundColor('#0a0e18');

    const g = this.add.graphics();
    g.lineStyle(1, 0x00ffd5, 0.08);
    for (let x = 0; x <= W; x += 64) g.lineBetween(x, 0, x, H);
    for (let y = 0; y <= H; y += 48) g.lineBetween(0, y, W, y);

    const GRID_W = Math.min(12, Math.floor(W / 55));
    const GRID_H = 7;
    const BLOCK_W = Math.floor((W - 40) / GRID_W) - 2;
    const BLOCK_H = 22;
    const PADDLE_W = 130;
    const PADDLE_H = 18;
    const BALL_R = 10;
    const BALL_SPEED = 380;

    this.score = 0;
    this.blocksBlast = { score: 0, ball: null, paddle: null };

    this.scoreText = this.add.text(30, 28, 'SCORE: 0', {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#00ffd5'
    }).setOrigin(0, 0.5);

    this.add.text(CX, 28, 'ESC or End Game — Quit', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#556677'
    }).setOrigin(0.5);

    const endBtn = this.add.rectangle(W - 70, 32, 120, 36, 0x1a0a0a, 0.9);
    endBtn.setStrokeStyle(2, 0xff4466, 0.7);
    endBtn.setInteractive({ useHandCursor: true });
    this.add.text(W - 70, 32, 'END GAME', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#ff6688'
    }).setOrigin(0.5);
    endBtn.on('pointerover', () => endBtn.setStrokeStyle(2, 0xff6688, 1));
    endBtn.on('pointerout', () => endBtn.setStrokeStyle(2, 0xff4466, 0.7));
    endBtn.on('pointerdown', () => this.finishGame(false));

    this.input.keyboard.on('keydown-ESC', () => {
      if (!this.ended) this.finishGame(false);
    });

    const startX = (W - GRID_W * (BLOCK_W + 2)) / 2 + BLOCK_W / 2 + 1;
    const startY = 75;
    const colors = [0xff0066, 0xff6600, 0xffcc00, 0x00ff88, 0x00aaff];
    const blocks = [];

    for (let row = 0; row < GRID_H; row++) {
      for (let col = 0; col < GRID_W; col++) {
        const bx = startX + col * (BLOCK_W + 2);
        const by = startY + row * (BLOCK_H + 2);
        const block = this.add.rectangle(bx, by, BLOCK_W, BLOCK_H, colors[row % colors.length], 0.95);
        block.setStrokeStyle(1, 0xffffff, 0.4);
        const points = (GRID_H - row) * 10;
        block.setData('points', points);
        this.physics.add.existing(block, true);
        blocks.push(block);
      }
    }

    const paddleY = H - 50;
    const paddle = this.add.rectangle(CX, paddleY, PADDLE_W, PADDLE_H, 0x00ffd5, 0.95);
    paddle.setStrokeStyle(2, 0x00ff88);
    this.physics.add.existing(paddle, true);
    paddle.body.setImmovable(true);
    this.blocksBlast.paddle = paddle;

    const ball = this.add.circle(CX, paddleY - 30, BALL_R, 0xffffff);
    this.physics.add.existing(ball);
    ball.body.setCircle(BALL_R);
    ball.body.setBounce(1, 1);
    ball.body.setMaxVelocity(BALL_SPEED, BALL_SPEED);
    ball.body.setVelocity(Phaser.Math.Between(-80, 80), -BALL_SPEED);
    ball.body.setCollideWorldBounds(true);
    this.blocksBlast.ball = ball;

    this.input.on('pointermove', (ptr) => {
      const x = this.cameras.main.scrollX + ptr.x;
      paddle.x = Phaser.Math.Clamp(x, PADDLE_W / 2 + 10, W - PADDLE_W / 2 - 10);
    });

    this.physics.add.collider(ball, paddle);

    blocks.forEach((block) => {
      this.physics.add.collider(ball, block, () => {
        if (!block.active) return;
        this.blocksBlast.score += block.getData('points') || 10;
        this.scoreText.setText('SCORE: ' + this.blocksBlast.score);
        block.destroy();
        const remaining = blocks.filter(b => b.active).length;
        if (remaining === 0) this.finishGame(true);
      });
    });

    this.physics.world.setBounds(0, 0, W, H);
    ball.body.setCollideWorldBounds(true);
  }

  update() {
    if (this.ended) return;
    const ball = this.blocksBlast.ball;
    const H = this.cameras.main.height;
    if (ball && ball.active && ball.y > H - 20) {
      this.finishGame(false);
    }
  }

  finishGame(won) {
    if (this.ended) return;
    this.ended = true;

    const score = this.blocksBlast.score || 0;
    const tokensEarned = Math.max(1, Math.floor(score / 50));
    const current = parseInt(localStorage.getItem('gameTokens') || '0', 10);
    localStorage.setItem('gameTokens', String(current + tokensEarned));

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.88).setDepth(2000);
    this.add.rectangle(W / 2, H / 2, 480, 300, 0x0d1220, 0.95).setStrokeStyle(2, 0x00ffd5, 0.6).setDepth(2001);
    this.add.text(W / 2, H / 2 - 80, won ? 'VICTORY!' : 'GAME OVER', {
      fontSize: '38px',
      fontFamily: 'monospace',
      color: won ? '#00ff88' : '#ff4466'
    }).setOrigin(0.5).setDepth(2002);
    this.add.text(W / 2, H / 2 - 20, `Score: ${score}`, {
      fontSize: '22px',
      fontFamily: 'monospace',
      color: '#ffffff'
    }).setOrigin(0.5).setDepth(2002);
    this.add.text(W / 2, H / 2 + 30, `+${tokensEarned} tokens earned!`, {
      fontSize: '18px',
      fontFamily: 'monospace',
      color: '#00ffd5'
    }).setOrigin(0.5).setDepth(2002);
    this.add.text(W / 2, H / 2 + 100, 'Returning to menu...', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#8899aa'
    }).setOrigin(0.5).setDepth(2002);

    this.time.delayedCall(2500, () => {
      this.scene.start('MiniGameScene');
    });
  }
}

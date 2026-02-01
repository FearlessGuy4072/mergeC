export default class GameScene extends Phaser.Scene {

  constructor() {
    super('GameScene');
  }

  preload() {
    // map
    this.load.tilemapTiledJSON('citymap', 'assets/citymap1.tmj');
    this.load.image('groundTiles', 'assets/ground.png');

    // player sprites
    this.load.spritesheet('player-idle', 'assets/player_idle.png', {
      frameWidth: 32,
      frameHeight: 48
    });

    this.load.spritesheet('player-run', 'assets/player_run.png', {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
    this.cameras.main.setBackgroundColor('#583567');
    /* ---------- MAP ---------- */
    const map = this.make.tilemap({ key: 'citymap' });
    const tileset = map.addTilesetImage('ground', 'groundTiles');

    this.groundLayer = map.createLayer('ground', tileset, 0, 0);
    this.wallLayer   = map.createLayer('Walls', tileset, 0, 0);
    this.decorLayer  = map.createLayer('Decor', tileset, 0, 0);
    this.entryLayer  = map.createLayer('entry', tileset, 0, 0);

    this.decorLayer.setDepth(20);
    this.entryLayer.setVisible(false);

    /* ---------- WALL COLLISION ---------- */
    this.wallLayer.setCollisionByProperty({ collides: true });

    /* ---------- ANIMATIONS ---------- */
    this.anims.create({
      key: 'player-idle',
      frames: this.anims.generateFrameNumbers('player-idle', {
        start: 0,
        end: this.textures.get('player-idle').frameTotal - 1
      }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: 'player-run',
      frames: this.anims.generateFrameNumbers('player-run', {
        start: 0,
        end: this.textures.get('player-run').frameTotal - 1
      }),
      frameRate: 12,
      repeat: -1
    });

    /* ---------- PLAYER ---------- */
    this.player = this.physics.add.sprite(
      map.widthInPixels / 2,
      map.heightInPixels / 2,
      'player-idle'
    );
    this.player.scale = 1.5;
    this.player.setDepth(10);
    this.player.play('player-idle');

    /* ---------- PLAYER ↔ WALL COLLIDER ---------- */
    this.physics.add.collider(this.player, this.wallLayer);

    /* ---------- CAMERA ---------- */
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.5);

    /* ---------- INPUT ---------- */
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D');

    /* ---------- ENTRY STATE ---------- */
    this.isTransitioning = false;

    /* ---------- BACK TO MAIN MENU ---------- */
    const backBtn = this.add.rectangle(60, 30, 100, 36, 0x000000, 0.6);
    backBtn.setStrokeStyle(2, 0x00ffd5, 0.6);
    backBtn.setDepth(100);
    backBtn.setScrollFactor(0);
    backBtn.setInteractive({ useHandCursor: true });
    const backText = this.add.text(60, 30, '← BACK', {
      fontSize: '14px',
      fontFamily: 'monospace',
      color: '#efefef'
    }).setOrigin(0.5).setDepth(101).setScrollFactor(0);
    backBtn.on('pointerover', () => { backBtn.setAlpha(0.9); backText.setColor('#ffffff'); });
    backBtn.on('pointerout', () => { backBtn.setAlpha(1); backText.setColor('#00ffd5'); });
    backBtn.on('pointerdown', () => {
      window.location.href = '/';
    });

    console.log('✅ GameScene ready');
  }

  update() {
    if (!this.player) return;

    const speed = 200;
    let vx = 0;
    let vy = 0;
    let isMoving = false;

    // horizontal
    if (this.cursors.left.isDown || this.keys.A.isDown) {
      vx = -speed;
      isMoving = true;
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown || this.keys.D.isDown) {
      vx = speed;
      isMoving = true;
      this.player.setFlipX(false);
    }

    // vertical
    if (this.cursors.up.isDown || this.keys.W.isDown) {
      vy = -speed;
      isMoving = true;
    } else if (this.cursors.down.isDown || this.keys.S.isDown) {
      vy = speed;
      isMoving = true;
    }

    this.player.setVelocity(vx, vy);
    this.player.body.velocity.normalize().scale(speed);

    // animations
    if (isMoving) {
      if (this.player.anims.currentAnim?.key !== 'player-run') {
        this.player.play('player-run', true);
      }
    } else {
      if (this.player.anims.currentAnim?.key !== 'player-idle') {
        this.player.play('player-idle', true);
      }
    }

    /* ---------- ENTRY CHECK ---------- */
    const entryTile = this.entryLayer.getTileAtWorldXY(
      this.player.x,
      this.player.y
    );

    if (entryTile && entryTile.properties.entry) {
      this.enterBuilding(entryTile.properties.type);
    }
  }

  /* ---------- ENTRY HANDLER ---------- */
  enterBuilding(type) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.cameras.main.fadeOut(300);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (type === 'bank') {
        this.scene.start('BankScene');
      } 
      else if (type === 'minigame') {
        this.scene.start('MiniGameScene');
      } 
      else {
        console.warn('Unknown entry type:', type);
        this.isTransitioning = false;
        this.cameras.main.fadeIn(300);
      }
    });
  }
}

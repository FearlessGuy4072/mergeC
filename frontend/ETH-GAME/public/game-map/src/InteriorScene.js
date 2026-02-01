export default class InteriorScene extends Phaser.Scene {
  constructor() {
    super('InteriorScene');
  }

  init(data) {
    this.buildingId = data.buildingId;
  }

  create() {
    this.cameras.main.fadeIn(300);

    this.add.text(100, 100, `Inside ${this.buildingId}`, {
      fontSize: '24px',
      color: '#ffffff'
    });

    // ESC to exit
    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.start('GameScene');
    });
  }
}

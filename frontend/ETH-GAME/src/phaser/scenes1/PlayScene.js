import Phaser from "phaser";

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super("PlayScene");
  }

  create() {
    this.add.text(450, 300, "GAME STARTED 🚀", {
      fontSize: "32px",
      color: "#00ffcc",
    }).setOrigin(0.5);
  }
}

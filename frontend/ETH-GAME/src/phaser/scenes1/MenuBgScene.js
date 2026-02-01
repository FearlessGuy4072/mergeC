import Phaser from "phaser";

export default class MenuBgScene extends Phaser.Scene {
  preload() {
    this.load.image(
      "bg",
      "/assets/cyberpunk-city.gif"
    );
  }

  create() {
    this.bg = this.add.image(0, 0, "bg").setOrigin(0);

    this.resize();
    this.scale.on("resize", this.resize, this);
  }

  resize() {
    const { width, height } = this.scale;
    this.bg.setDisplaySize(width, height);
  }
}

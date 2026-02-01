import Phaser from "phaser";
import MenuBgScene from "./scenes1/MenuBgScene";

let game;

export const startPhaserGame = (parentId) => {
  if (game) return;

  game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: parentId,
    backgroundColor: "#000000",

    scale: {
      mode: Phaser.Scale.RESIZE,
      width: window.innerWidth,
      height: window.innerHeight,
    },

    scene: [MenuBgScene],
  });
};

export const destroyPhaserGame = () => {
  if (game) {
    game.destroy(true);
    game = null;
  }
};

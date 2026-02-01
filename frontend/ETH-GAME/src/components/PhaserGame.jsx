import { useEffect } from "react";
import { startPhaserGame, destroyPhaserGame } from "../phaser/game";

export default function PhaserGame() {
  useEffect(() => {
    startPhaserGame("phaser-container");
    return () => destroyPhaserGame();
  }, []);

  return <div id="phaser-container" />;
}

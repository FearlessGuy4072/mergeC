import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PhaserGame from "./components/PhaserGame";
import "./App.css";

function App() {
  const [started, setStarted] = useState(false);

  // Background style (React handles GIF)
  const bgStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/assets/cyberpunk-city.gif)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="app-root">
      {/* ===== MENU (REACT ONLY) ===== */}
      {!started && (
        <>
          {/* Animated background */}
          <div className="menu-bg" style={bgStyle} />

          {/* UI overlay */}
          <div className="menu-overlay d-flex flex-column align-items-center text-center">

            {/* CYBER GO LOGO */}
            <img
              src={`${process.env.PUBLIC_URL}/assets/ui/cyber-go.png`}
              alt="CYBER GO"
              className="cyber-go-logo mb-5 mt-5"
              draggable="false"
            />

            {/* START HERE BUTTON */}
            <button
                  className="start-btn"
                  onClick={() => {
                    window.location.href = '/game-map/index.html';
                      }}

                  aria-label="Start Game"
                >
                  <div className="start-btn-frame">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/ui/start-here.png`}
                      alt="Start Here"
                      className="start-btn-img"
                      draggable="false"
                    />
                  </div>
                </button>

          </div>
        </>
      )}

      {/* ===== GAME (PHASER ONLY AFTER START) ===== */}
      {started && <PhaserGame />}
    </div>
  );
}

export default App;

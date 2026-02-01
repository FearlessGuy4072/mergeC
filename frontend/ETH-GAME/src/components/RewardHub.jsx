import React, { useState } from "react";
import { shops } from "../data/shops";
import ShopModal from "./ShopModal";
import cityBg from "../assets/cyberpunk-city.gif";
import "../styles/cyberpunk.css";

export default function RewardHub() {
  const [activeShop, setActiveShop] = useState(null);

  return (
    <div className="game-screen">
      {/* Background */}
      <div
        className="city-bg"
        style={{ backgroundImage: `url(${cityBg})` }}
      />

      {/* Neon overlay */}
      <div className="fx-overlay" />

      {/* Top HUD */}
      <div className="hud-top">
        <div className="hud-left">
          <div className="hud-title">NEON DISTRICT</div>
          <div className="hud-sub">Reward Shops • Select a building</div>
        </div>

        <div className="hud-right">
          <div className="hud-chip">
            <div className="chip-label">COINS</div>
            <div className="chip-value">2450</div>
          </div>
          <div className="hud-chip">
            <div className="chip-label">TOKENS</div>
            <div className="chip-value">18</div>
          </div>

          <button className="hud-btn">CONNECT WALLET</button>
        </div>
      </div>

      {/* Shop Markers (placed on top of city) */}
      <div className="map-layer">
        {shops.map((shop) => (
          <button
            key={shop.id}
            className={`shop-marker theme-${shop.theme}`}
            style={shop.position}
            onClick={() => setActiveShop(shop)}
          >
            <div className="marker-sign">{shop.name}</div>
            <div className="marker-sub">{shop.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Bottom mini HUD */}
      <div className="hud-bottom">
        <div className="hint">
          ⚡ Tip: Shops refresh daily. Black Market drops are limited.
        </div>
      </div>

      {/* Modal */}
      {activeShop && (
        <ShopModal shop={activeShop} onClose={() => setActiveShop(null)} />
      )}
    </div>
  );
}

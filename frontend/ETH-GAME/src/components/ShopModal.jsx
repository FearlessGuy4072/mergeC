import React, { useState } from "react";
import ShopCard from "./ShopCard";

export default function ShopModal({ shop, onClose }) {
  const [selected, setSelected] = useState(shop.items[0]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal theme-${shop.theme}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{shop.name}</h2>
            <p className="modal-sub">{shop.subtitle}</p>
          </div>

          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Items List */}
          <div className="items-grid">
            {shop.items.map((item) => (
              <ShopCard
                key={item.id}
                item={item}
                active={selected?.id === item.id}
                onClick={() => setSelected(item)}
              />
            ))}
          </div>

          {/* Preview */}
          <div className="preview-panel">
            <div className="preview-title">{selected.title}</div>
            <div className="preview-rarity">{selected.rarity}</div>

            <div className="preview-price">
              <span className="price">{selected.price}</span>
              <span className="currency">{selected.currency}</span>
            </div>

            <button className="btn-buy">BUY NOW</button>

            {selected.title.includes("NFT") && (
              <p className="nft-hint">
                ⚡ This item is NFT-enabled. Wallet required.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


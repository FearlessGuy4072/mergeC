import React from "react";

export default function ShopCard({ item, active, onClick }) {
  return (
    <button className={`item-card ${active ? "active" : ""}`} onClick={onClick}>
      <div className="item-title">{item.title}</div>
      <div className="item-rarity">{item.rarity}</div>
      <div className="item-price">
        {item.price} <span className="item-currency">{item.currency}</span>
      </div>
    </button>
  );
}

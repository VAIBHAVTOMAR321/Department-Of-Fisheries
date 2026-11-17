import { useState } from "react";
import { ArrowUpRight, MapPin, ShoppingCart } from "lucide-react";
import { getFishImage } from "../data/fishImages";

export default function MarketplaceFishCard({ listing, onAddToCart, cartQuantity = 0 }) {
  const [quantity, setQuantity] = useState(50);
  const available = Math.max(0, Number(listing.qty || 0) - cartQuantity);
  const fish = getFishImage(listing.species);
  const canOrder = available >= 50;

  return (
    <article className="market-fish-card">
      <div className="market-fish-image">
        <img src={fish.image} alt={listing.species} loading="lazy" />
        <span className="market-fresh-badge">Freshwater fish</span>
      </div>
      <div className="market-fish-info">
        <div className="market-fish-meta">
          <span>{listing.grade ? `Grade ${listing.grade}` : listing.category || "Freshwater"}</span>
          <span>{listing.hours > 0 ? `${listing.hours}h freshness` : "Availability to confirm"}</span>
        </div>
        <h3>{listing.species}</h3>
        <div className="market-fish-location"><MapPin size={13} /> {listing.location}</div>
        <div className="market-fish-supplier">Listed by <strong>{listing.supplier}</strong></div>
        <div className="market-fish-price">
          <strong>₹{listing.ask}</strong><span>/ kg</span>
          <small>{listing.qty} kg available</small>
        </div>
        <a className="market-image-credit" href={fish.source} target="_blank" rel="noreferrer">
          Photo: {fish.credit} <ArrowUpRight size={11} />
        </a>
        <div className="market-buy-row">
          <label>
            <span className="visually-hidden">Quantity in kilograms for {listing.species}</span>
            <input
              type="number"
              min="50"
              max={available}
              step="10"
              value={Math.min(quantity, Math.max(50, available))}
              disabled={!canOrder}
              onChange={(event) => {
                const next = Number(event.target.value);
                setQuantity(next >= 50 ? Math.min(next, available) : 50);
              }}
            />
            <span>kg</span>
          </label>
          <button
            type="button"
            disabled={!canOrder}
            onClick={() => onAddToCart(listing, Math.min(quantity, available))}
          >
            <ShoppingCart size={15} /> {canOrder ? "Add to cart" : "Unavailable"}
          </button>
        </div>
        <small className="market-minimum-note">
          {canOrder ? "Minimum order 50 kg" : "Minimum order is 50 kg"}
        </small>
      </div>
    </article>
  );
}

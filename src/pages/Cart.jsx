import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { getFishImage } from "../data/fishImages";

const MINIMUM_ORDER_KG = 50;

function Cart({ cart, listings, user, onUpdateCart, onPlaceOrder }) {
  const [registering, setRegistering] = useState(false);
  const [form, setForm] = useState({
    name: user?.role === "buyer" ? user.name : "",
    email: user?.role === "buyer" ? user.email : "",
    location: user?.role === "buyer" ? user.location : "",
    phone: user?.role === "buyer" ? user.phone || "" : "",
  });
  const [error, setError] = useState("");
  const items = useMemo(
    () =>
      cart
        .map((cartItem) => ({
          ...cartItem,
          listing: listings.find((listing) => listing.id === cartItem.listingId),
        }))
        .filter((cartItem) => cartItem.listing),
    [cart, listings],
  );
  const total = items.reduce(
    (sum, item) => sum + Number(item.listing.ask) * item.quantity,
    0,
  );

  const placeOrder = (event) => {
    event.preventDefault();
    setError("");
    const result = onPlaceOrder(form);
    if (result) setError(result);
  };

  return (
    <main className="container-xl market-cart-page">
      <header className="market-page-heading">
        <span className="dept-section-kicker">UTTARAKHAND FISHERIES MARKETPLACE</span>
        <h1>Your basket</h1>
        <p>Fresh fish from current farmer listings. Minimum order: 50 kg per fish.</p>
      </header>
      {!items.length ? (
        <section className="market-empty-cart">
          <span><ShoppingCart size={26} /></span>
          <h2>Your basket is empty</h2>
          <p>Browse current fish listings and add at least 50 kg to begin an order.</p>
          <Link className="dept-button dept-button-primary" to="/shop">Browse available fish <ArrowRight size={15} /></Link>
        </section>
      ) : (
        <div className="market-cart-layout">
          <section className="market-cart-items" aria-label="Basket items">
            {items.map(({ listing, listingId, quantity }) => {
              const fish = getFishImage(listing.species);
              return (
                <article className="market-cart-line" key={listingId}>
                  <img src={fish.image} alt={[listing.species, listing.size].filter(Boolean).join(" ")} />
                  <div className="market-cart-product">
                    <span>{listing.location}</span>
                    <h2>{listing.species}</h2>
                    <small>
                      {listing.size && `${listing.size} · `}
                      Farmer: {listing.supplier} · ₹{listing.ask}/kg
                    </small>
                  </div>
                  <div className="market-cart-quantity">
                    <button
                      type="button"
                      aria-label={`Decrease ${listing.species} quantity`}
                      disabled={quantity <= MINIMUM_ORDER_KG}
                      onClick={() => onUpdateCart(listingId, Math.max(MINIMUM_ORDER_KG, quantity - 10))}
                    ><Minus size={14} /></button>
                    <span>{quantity} kg</span>
                    <button
                      type="button"
                      aria-label={`Increase ${listing.species} quantity`}
                      disabled={quantity >= Number(listing.qty)}
                      onClick={() => onUpdateCart(listingId, Math.min(Number(listing.qty), quantity + 10))}
                    ><Plus size={14} /></button>
                  </div>
                  <strong className="market-cart-line-total">
                    ₹{(Number(listing.ask) * quantity).toLocaleString("en-IN")}
                  </strong>
                  <button
                    className="market-cart-remove"
                    type="button"
                    aria-label={`Remove ${listing.species} from basket`}
                    onClick={() => onUpdateCart(listingId, 0)}
                  ><Trash2 size={16} /></button>
                </article>
              );
            })}
            <Link className="market-continue-link" to="/shop">← Back to Fish Market</Link>
          </section>

          <aside className="market-order-summary">
            <h2>Order summary</h2>
            <div><span>Fish listings</span><strong>{items.length}</strong></div>
            <div><span>Total quantity</span><strong>{items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString("en-IN")} kg</strong></div>
            <div className="market-summary-total"><span>Estimated total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
            <p>Prices use each farmer’s listed price. After registration, you’ll continue to your dashboard to pay and track delivery.</p>
            {user?.role === "buyer" ? (
              <button className="market-checkout-button" type="button" onClick={placeOrder}>
                Place order <ArrowRight size={16} />
              </button>
            ) : (
              <button className="market-checkout-button" type="button" onClick={() => { setError(""); setRegistering(true); }}>
                Register & continue <ArrowRight size={16} />
              </button>
            )}
            {error && <p className="market-checkout-error" role="alert">{error}</p>}
            <small className="market-demo-note"><CheckCircle2 size={13} /> Demo payment is simulated · no real money is transferred</small>
          </aside>
        </div>
      )}

      {registering && user?.role !== "buyer" && (
        <section className="market-registration">
          <div className="market-registration-heading">
            <span className="dept-section-kicker">BUYER REGISTRATION</span>
            <h2>Where should we send your order?</h2>
            <p>Create a local buyer profile to place and track your fish order.</p>
          </div>
          <form className="market-registration-form" onSubmit={placeOrder}>
            <label>
              Full name
              <input required autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              Email address
              <input type="email" required autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>
            <label>
              Phone number
              <input type="tel" required autoComplete="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </label>
            <label>
              Delivery address / district
              <input required autoComplete="street-address" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
            </label>
            {error && <p className="market-checkout-error" role="alert">{error}</p>}
            <button className="market-checkout-button" type="submit">
              Register & place order <ArrowRight size={16} />
            </button>
            <small>Demo only: your profile and order are saved in this browser.</small>
          </form>
        </section>
      )}
    </main>
  );
}

export default Cart;

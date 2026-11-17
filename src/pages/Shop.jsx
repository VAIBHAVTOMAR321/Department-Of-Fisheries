import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Fish, Search, ShoppingCart } from "lucide-react";
import MarketplaceFishCard from "../components/MarketplaceFishCard";
import { getListings } from "../utils/store";

function Shop({ cart, onAddToCart }) {
  const [searchParams] = useSearchParams();
  const selectedSpecies = searchParams.get("species") || "";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All fish");
  const listings = getListings();
  useEffect(() => {
    setQuery("");
  }, [selectedSpecies]);
  const availableListings = useMemo(() => {
    const uniqueListings = new Map();
    listings.forEach((listing) => {
      if (Number(listing.qty) > 0 && !["Rejected", "Expired", "Sold out"].includes(listing.status)) {
        uniqueListings.set(listing.id, listing);
      }
    });
    return [...uniqueListings.values()];
  }, [listings]);
  const categories = ["All fish", ...new Set(availableListings.map((listing) => listing.category || "Freshwater"))];
  const filteredListings = availableListings.filter((listing) => {
    const matchesText = `${listing.species} ${listing.size || ""} ${listing.supplier} ${listing.location}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory =
      category === "All fish" || (listing.category || "Freshwater") === category;
    return matchesText && matchesCategory;
  });
  const selectedSpeciesListings = selectedSpecies
    ? filteredListings.filter((listing) => listing.species.toLowerCase() === selectedSpecies.toLowerCase())
    : [];
  const otherListings = selectedSpecies
    ? filteredListings.filter((listing) => listing.species.toLowerCase() !== selectedSpecies.toLowerCase())
    : filteredListings;
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const renderListings = (items) => (
    <div className="marketplace-grid">
      {items.map((listing) => (
        <MarketplaceFishCard
          key={listing.id}
          listing={listing}
          onAddToCart={onAddToCart}
          cartQuantity={cart.find((item) => item.listingId === listing.id)?.quantity || 0}
        />
      ))}
    </div>
  );

  return (
    <main className="marketplace-page">
      <section className="marketplace-hero">
        <div className="container-xl marketplace-hero-content">
      
          <h1>Shop Now</h1>
          <p>Order fish directly from current freshwater listings across Uttarakhand.</p>
          <Link to="/cart"><ShoppingCart size={16} /> View basket {cartCount ? `(${cartCount} kg)` : ""}</Link>
        </div>
      </section>
      <section className="container-xl marketplace-content">
        <header className="marketplace-toolbar">
          <div>
            <span className="dept-section-kicker">CURRENT FARMER LISTINGS</span>
            <h2>
              {selectedSpecies
                ? `All fish · ${filteredListings.length} available listings`
                : `${filteredListings.length} available ${filteredListings.length === 1 ? "listing" : "listings"}`}
            </h2>
            <p>
              {selectedSpecies
                ? `${selectedSpecies} listings appear first, followed by other available fish.`
                : "Listings show each fish life stage, supplying farmer and current quantity."}
            </p>
          </div>
          <label className="marketplace-search">
            <Search size={16} />
            <span className="visually-hidden">Search available fish</span>
            <input
              type="search"
              placeholder="Search fish, farmer or district"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </header>
        <div className="marketplace-categories" aria-label="Filter fish category">
          {categories.map((item) => (
            <button
              className={category === item ? "active" : ""}
              type="button"
              key={item}
              onClick={() => setCategory(item)}
            >
              <Fish size={14} /> {item}
            </button>
          ))}
        </div>
        {!filteredListings.length && (
          <div className="marketplace-empty">
            <Fish size={28} />
            <h3>No matching fish listings</h3>
            <p>Try another search or check back when more fish are listed.</p>
          </div>
        )}
        {selectedSpecies && selectedSpeciesListings.length > 0 && (
          <section className="marketplace-listing-section">
            <h2>{selectedSpecies} listings</h2>
            {renderListings(selectedSpeciesListings)}
          </section>
        )}
        {selectedSpecies && selectedSpeciesListings.length === 0 && (
          <section className="marketplace-listing-section">
            <h2>{selectedSpecies} listings</h2>
            <p className="marketplace-listing-note">There are no current listings for {selectedSpecies}.</p>
          </section>
        )}
        {otherListings.length > 0 && (
          <section className="marketplace-listing-section">
            {selectedSpecies && <h2>More fish in All fish</h2>}
            {renderListings(otherListings)}
          </section>
        )}
      </section>
    </main>
  );
}

export default Shop;

import { useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../data/products.js";
import { getFishImage } from "../data/fishImages.js";
import { getListings } from "../utils/store.js";

function Categories() {
  const listings = getListings();
  const [selectedSlug, setSelectedSlug] = useState("");
  const availableListings = listings.filter(
    (listing) =>
      Number(listing.qty) > 0 &&
      !["Rejected", "Expired", "Sold out"].includes(listing.status),
  );
  const selectedCategory = categories.find((category) => category.slug === selectedSlug);
  const selectedFish = selectedCategory ? getFishImage(selectedCategory.name) : null;
  const stageStock = selectedCategory
    ? availableListings
        .filter((listing) => listing.species.toLowerCase() === selectedCategory.name.toLowerCase())
        .reduce((stages, listing) => {
          if (!listing.size) return stages;
          const current = stages.find((stage) => stage.size === listing.size);
          if (current) current.quantity += Number(listing.qty || 0);
          else stages.push({ size: listing.size, quantity: Number(listing.qty || 0) });
          return stages;
        }, [])
    : [];
  const openSpecies = (slug) => {
    setSelectedSlug(slug);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };
  const showAllSpecies = () => {
    setSelectedSlug("");
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className="categories-page">
      {selectedCategory ? (
        <section className="species-detail-hero" aria-live="polite">
          <div className="species-detail-image">
            <img src={selectedCategory.image} alt={selectedCategory.name} />
            <span>FRESHWATER SPECIES</span>
          </div>
          <div className="species-detail-copy">
            <button type="button" className="species-back-link" onClick={showAllSpecies}>
              <i className="bi bi-arrow-left" /> All fish species
            </button>
            <span className="eyebrow">SPECIES PROFILE · UTTARAKHAND</span>
            <h1>{selectedCategory.name}</h1>
            <p>{selectedCategory.description}</p>
            <p className="species-fish-note">{selectedFish.note}</p>
            <div className="species-scientific-name">
              Scientific name <em>{selectedFish.scientificName}</em>
            </div>
            <div className="species-source-credit">
              <span><i className="bi bi-link-45deg" /> Source: {selectedFish.source}</span>
              <span><i className="bi bi-person-fill" /> Credit: {selectedFish.credit}</span>
            </div>
            <h2>Available life stages</h2>
            {stageStock.length ? (
              <div className="species-stage-list">
                {stageStock.map(({ size, quantity }) => (
                  <div key={size}>
                    <strong>{size}</strong>
                    <span>{quantity.toLocaleString("en-IN")} kg listed</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="species-no-stock">There are no current listings for this species.</p>
            )}
            <Link
              className="species-shop-link"
              to={`/shop?species=${encodeURIComponent(selectedCategory.name)}`}
            >
              Browse {selectedCategory.name} listings
              <i className="bi bi-arrow-up-right" />
            </Link>
          </div>
        </section>
      ) : (
        <div className="page-banner category-page-banner">
          <div className="container-xl">
            <span className="eyebrow eyebrow-light">FRESHWATER FISH SPECIES</span>
            <h1>Explore fish and life stages</h1>
            <p>Browse the five species and the fingerling, yearling and brooder listings currently available.</p>
          </div>
        </div>
      )}
      <section className="container-xl section-space">
        <div className="row g-4 category-page-grid">
          {categories.map((category, index) => (
            <div className="col-12 col-md-6" key={category.slug}>
              <button
                className="category-feature-card"
                type="button"
                aria-pressed={selectedSlug === category.slug}
                onClick={() => openSpecies(category.slug)}
              >
                <img src={category.image} alt={category.name} />
                <div className="category-feature-copy">
                  <span>0{index + 1} · {category.count}</span>
                  <h2>{category.name}</h2>
                  <p>{category.description}</p>
                  <div className="category-life-stages">
                    {[...new Set(availableListings
                      .filter((listing) => listing.species.toLowerCase() === category.name.toLowerCase())
                      .map((listing) => listing.size)
                      .filter(Boolean))].map((size) => (
                        <span key={size}>{size}</span>
                      ))}
                  </div>
                  <strong>View species details <i className="bi bi-arrow-up-right ms-2" /></strong>
                </div>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Categories;

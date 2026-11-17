import { Link } from "react-router-dom";
import { categories } from "../data/products.js";
import { getListings } from "../utils/store.js";

function Categories() {
  const listings = getListings();
  return (
    <div className="categories-page">
      <div className="page-banner category-page-banner"><div className="container-xl"><span className="eyebrow eyebrow-light">FRESHWATER FISH SPECIES</span><h1>Explore fish and life stages</h1><p>Browse the five species and the fingerling, yearling and brooder listings currently available.</p></div></div>
      <section className="container-xl section-space">
        <div className="row g-4 category-page-grid">
          {categories.map((category, index) => (
            <div className="col-12 col-md-6" key={category.slug}>
              <Link className="category-feature-card" to="/shop">
                <img src={category.image} alt="" />
                <div className="category-feature-copy">
                  <span>0{index + 1} · {category.count}</span>
                  <h2>{category.name}</h2>
                  <p>{category.description}</p>
                  <div className="category-life-stages">
                    {[...new Set(listings
                      .filter((listing) => listing.species.toLowerCase() === category.name.toLowerCase())
                      .map((listing) => listing.size)
                      .filter(Boolean))].map((size) => (
                        <span key={size}>{size}</span>
                      ))}
                  </div>
                  <strong>Explore category <i className="bi bi-arrow-up-right ms-2" /></strong>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Categories;

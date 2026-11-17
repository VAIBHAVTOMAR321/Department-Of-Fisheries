import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Building2,
  Fish,
  HandCoins,
  MapPinned,
  Sprout,
  Waves,
} from "lucide-react";
import MarketplaceFishCard from "../components/MarketplaceFishCard";
import { getDeliveries, getListings, getUsers } from "../utils/store";
import "../pages/home.css";

const heroSlides = [
  {
    image: new URL("../assets/images/p10.jpeg", import.meta.url).href,
    alt: "Fisheries activity",
    label: "Himalayan waters, thriving communities",
  },
  {
    image: new URL("../assets/images/p38.jpeg", import.meta.url).href,
    alt: "Freshwater fish",
    label: "Responsible freshwater aquaculture",
  },
  {
    image: new URL("../assets/images/p14.jpeg", import.meta.url).href,
    alt: "Fishery produce",
    label: "Supporting livelihoods across Uttarakhand",
  },
];

const initiatives = [
  {
    icon: Fish,
    title: "Fish farming",
    text: "Explore freshwater aquaculture and opportunities for fish farmers.",
    link: "/categories",
    linkText: "Explore fish species",
  },
  {
    icon: Sprout,
    title: "Hatchery & seed support",
    text: "Learn about quality fish seed, hatchery development and technical guidance.",
    link: "/contact",
    linkText: "Request information",
  },
  {
    icon: BookOpenCheck,
    title: "Training & schemes",
    text: "Find department services, training resources and programme information.",
    link: "/about",
    linkText: "View department services",
  },
];

function Home({ onLogin, onAddToCart, cart }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const listings = getListings();
  const deliveries = getDeliveries();
  const users = getUsers();
  const visibleListings = listings.filter(
    (listing) =>
      Number(listing.qty) > 0 &&
      !["Rejected", "Expired", "Sold out"].includes(listing.status),
  );
  const speciesCount = new Set(listings.map((listing) => listing.species)).size;
  const totalStock = listings.reduce(
    (total, listing) => total + Number(listing.qty || 0),
    0,
  );
  const stats = [
    { value: listings.length.toLocaleString("en-IN"), label: "Fish listings", icon: Fish },
    { value: users.length.toLocaleString("en-IN"), label: "Farmers & partners", icon: Building2 },
    { value: speciesCount.toLocaleString("en-IN"), label: "Species represented", icon: Waves },
    { value: `${totalStock.toLocaleString("en-IN")} kg`, label: "Listed fish stock", icon: HandCoins },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="department-home">
      <div className="dept-official-bar">
        <div className="container-xl">
          <span><MapPinned size={14} /> Government of Uttarakhand</span>
          <span>Department of Fisheries</span>
        </div>
      </div>

      <section className="dept-hero">
        <div className="dept-hero-slides" aria-hidden="true">
          {heroSlides.map((slide, index) => (
            <div
              className={`dept-hero-slide${index === activeSlide ? " is-active" : ""}`}
              key={slide.image}
            >
              <img src={slide.image} alt="" loading={index === 0 ? "eager" : "lazy"} />
            </div>
          ))}
        </div>
        <div className="container-xl dept-hero-inner">
          <div className="dept-hero-copy">
            <div className="dept-eyebrow"><span /> FRESHWATER FISHERIES · UTTARAKHAND</div>
            <h1>Healthy waters.<br />Thriving <em>fisheries.</em></h1>
            <p>
              Supporting fish farmers, strengthening rural livelihoods and
              promoting responsible fisheries across the Himalayan state.
            </p>
            <div className="dept-hero-actions">
              <Link className="dept-button dept-button-light" to="/categories">
                Explore fish species <ArrowRight size={16} />
              </Link>
              <button className="dept-button dept-button-outline" type="button" onClick={onLogin}>
                Open fisheries dashboard <ArrowUpRight size={15} />
              </button>
            </div>
            <div className="dept-hero-tags">
              <span><Waves size={15} /> Himalayan rivers</span>
              <span><Fish size={15} /> Freshwater aquaculture</span>
              <span><Sprout size={15} /> Sustainable livelihoods</span>
            </div>
          </div>
          <div className="dept-slide-caption" aria-live="polite">
            <span className="dept-caption-mark"><Waves size={17} /></span>
            <span>{heroSlides[activeSlide].label}</span>
          </div>
          <div className="dept-slide-controls" role="tablist" aria-label="Department highlights">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                className={index === activeSlide ? "active" : ""}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show highlight ${index + 1}`}
                aria-selected={index === activeSlide}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="dept-stats-section" aria-label="Fisheries dashboard snapshot">
        <div className="container-xl">
          <div className="dept-stats-heading">
            <div>
              <span className="dept-section-kicker">FISHERIES AT A GLANCE</span>
              <h2>Activity across the network</h2>
            </div>
            <span className="dept-data-note">Dashboard snapshot · demonstration data</span>
          </div>
          <div className="dept-stats-grid">
            {stats.map(({ value, label, icon: Icon }) => (
              <article className="dept-stat-card" key={label}>
                <span className="dept-stat-icon"><Icon size={20} /></span>
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
          <p className="dept-delivery-note">
            <span className="dept-status-dot" />
            {deliveries.length.toLocaleString("en-IN")} deliveries tracked in the fisheries dashboard
          </p>
        </div>
      </section>

      <section className="dept-species-section">
        <div className="container-xl">
          <div className="dept-section-heading">
            <div>
              <span className="dept-section-kicker">FRESHWATER SPECIES</span>
              <h2>Fish available to order</h2>
              <p>Browse every fish and life-stage listing. Orders require at least 50 kg per listing.</p>
            </div>
            <Link className="dept-text-link" to="/categories">
              View fish directory <ArrowUpRight size={16} />
            </Link>
          </div>
          {visibleListings.length ? (
            <div className="dept-market-grid">
              {visibleListings.map((listing) => (
                <MarketplaceFishCard
                  key={listing.id}
                  listing={listing}
                  onAddToCart={onAddToCart}
                  cartQuantity={cart.find((item) => item.listingId === listing.id)?.quantity || 0}
                />
              ))}
            </div>
          ) : (
            <p className="dept-no-listings">There are no fish listings available to order at the moment.</p>
          )}
        </div>
      </section>

      <section className="dept-services-section">
        <div className="container-xl">
          <div className="dept-section-heading">
            <div>
              <span className="dept-section-kicker">DEPARTMENT SERVICES</span>
              <h2>Support for every step</h2>
              <p>Information and connections for a stronger fisheries sector.</p>
            </div>
          </div>
          <div className="dept-service-grid">
            {initiatives.map(({ icon: Icon, title, text, link, linkText }) => (
              <article className="dept-service-card" key={title}>
                <span><Icon size={21} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link to={link}>{linkText} <ArrowRight size={14} /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dept-contact-banner">
        <div className="container-xl dept-contact-inner">
          <div className="dept-contact-icon"><MapPinned size={22} /></div>
          <div>
            <span className="dept-section-kicker">CONNECT WITH THE DEPARTMENT</span>
            <h2>Building a resilient fisheries sector together.</h2>
            <p>For guidance on fish farming, department services and fisheries programmes in Uttarakhand.</p>
          </div>
          <Link className="dept-button dept-button-primary" to="/contact">
            Contact the department <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;

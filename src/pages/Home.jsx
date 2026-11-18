import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Building2,
  CreditCard,
  Fish,
  HandCoins,
  MapPinned,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  Truck,
  Users,
  Waves,
} from "lucide-react";
import MarketplaceFishCard from "../components/MarketplaceFishCard";
import { categories as fishCategories } from "../data/products.js";
import { getDeliveries, getListings, getUsers } from "../utils/store";
import "../pages/home.css";

const heroSlides = [
  {
    image: new URL("../assets/images/p22.png", import.meta.url).href,
    alt: "Fisheries activity",
    label: "Himalayan waters, thriving communities",
  },
  {
    image: new URL("../assets/images/p1.jpeg", import.meta.url).href,
    alt: "Freshwater fish",
    label: "Responsible freshwater aquaculture",
  },
  {
    image: new URL("../assets/images/p9.jpeg", import.meta.url).href,
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

const marketplaceBenefits = [
  {
    icon: Users,
    title: "Local fisheries network",
    text: "Connect with farmers and hatcheries across Uttarakhand.",
  },
  {
    icon: PackageCheck,
    title: "Clear fish listings",
    text: "Review available species, life stages and quantities.",
  },
  {
    icon: ShieldCheck,
    title: "Order with confidence",
    text: "Check supplier and stock details before adding to your basket.",
  },
  {
    icon: Truck,
    title: "Order updates",
    text: "Follow order and delivery information in the dashboard.",
  },
];

const shoppingSteps = [
  {
    icon: Search,
    title: "Explore fish",
    text: "Browse current listings or choose a species to see what is available.",
    link: "/shop",
    linkText: "Browse listings",
  },
  {
    icon: ShoppingCart,
    title: "Add to your basket",
    text: "Select a listing quantity. Orders require at least 50 kg per listing.",
    link: "/cart",
    linkText: "View basket",
  },
  {
    icon: CreditCard,
    title: "Confirm your order",
    text: "Provide buyer and delivery details to place an order in the demo.",
    link: "/cart",
    linkText: "Review checkout",
  },
  {
    icon: Truck,
    title: "Follow updates",
    text: "View order and delivery updates from your fisheries workspace.",
    link: "/app/orders",
    linkText: "Open orders",
  },
];

function Home({ onLogin, onRegister, onAddToCart, cart }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const listings = getListings();
  const deliveries = getDeliveries();
  const users = getUsers();
  const cartListingCount = cart.length;
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
          <article className="dept-leader-card dept-leader-cm">
            <img
              src={new URL("../assets/images/cm.jpg", import.meta.url).href}
              alt="Shri Pushkar Singh Dhami"
            />
            <div>
              <strong>Shri Pushkar Singh Dhami</strong>
              <span>Hon'ble Chief Minister, Uttarakhand</span>
            </div>
          </article>
          <article className="dept-leader-card dept-leader-minister">
            <img
              src={new URL("../assets/images/Minister.jpg", import.meta.url).href}
              alt="Shri Saurabh Bahuguna"
            />
            <div>
              <strong>Shri Saurabh Bahuguna</strong>
              <span>Hon'ble Cabinet Minister, Fisheries</span>
            </div>
          </article>
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

      <section className="dept-trust-strip" aria-label="Marketplace highlights">
        <div className="container-xl dept-trust-grid">
          {marketplaceBenefits.map(({ icon: Icon, title, text }) => (
            <article className="dept-trust-item" key={title}>
              <span><Icon size={18} /></span>
              <div>
                <strong>{title}</strong>
                <small>{text}</small>
              </div>
            </article>
          ))}
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

      <section className="dept-categories-section">
        <div className="container-xl">
          <div className="dept-section-heading">
            <div>
              <span className="dept-section-kicker">EXPLORE THE MARKET</span>
              <h2>Browse by fish species</h2>
              <p>Choose a species to see matching fish and life-stage listings.</p>
            </div>
            <Link className="dept-text-link" to="/categories">
              View fish directory <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="dept-category-grid">
            {fishCategories.map((category) => (
              <Link
                className="dept-category-card"
                key={category.slug}
                to={`/shop?species=${encodeURIComponent(category.name)}`}
              >
                <img src={category.image} alt="" loading="lazy" />
                <span>{category.count}</span>
                <strong>{category.name}</strong>
                <small>Browse listings <ArrowRight size={13} /></small>
              </Link>
            ))}
          </div>
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
            <div className="dept-section-actions">
              <Link className="dept-text-link" to="/categories">
                View fish directory <ArrowUpRight size={16} />
              </Link>
              <Link className="dept-cart-link" to="/cart" aria-label={`View cart with ${cartListingCount} listings`}>
                <ShoppingCart size={15} /> View cart <span>{cartListingCount}</span>
              </Link>
            </div>
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

      <section className="dept-partner-banner">
        <div className="container-xl dept-partner-inner">
          <div className="dept-partner-copy">
            <span className="dept-section-kicker">A MARKETPLACE THAT GROWS WITH YOU</span>
            <h2>Are you a fish farmer or fisheries partner?</h2>
            <p>
              Explore the farmer and partner workspace to manage listings,
              connect with buyers and support Uttarakhand fisheries.
            </p>
            <button className="dept-button dept-button-primary" type="button" onClick={onRegister}>
              Join as a partner <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="dept-partner-steps" aria-label="Partner workspace steps">
            <div><strong>01</strong><span>Set up your profile</span></div>
            <div><strong>02</strong><span>Manage fish listings</span></div>
            <div><strong>03</strong><span>Coordinate orders</span></div>
          </div>
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

      <section className="dept-how-section" id="marketplace-process">
        <div className="container-xl">
          <div className="dept-section-heading dept-how-heading">
            <div>
              <span className="dept-section-kicker">SIMPLE · CONVENIENT · CONNECTED</span>
              <h2>How ordering works</h2>
              <p>From exploring current listings to following order updates.</p>
            </div>
          </div>
          <div className="dept-how-grid">
            {shoppingSteps.map(({ icon: Icon, title, text, link, linkText }, index) => (
              <article className="dept-how-card" key={title}>
                <strong className="dept-how-number">{String(index + 1).padStart(2, "0")}</strong>
                <span className="dept-how-icon"><Icon size={19} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
                {link === "/app/orders" ? (
                  <button type="button" onClick={onLogin}>{linkText} <ArrowRight size={13} /></button>
                ) : (
                  <Link to={link}>{linkText} <ArrowRight size={13} /></Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dept-order-support">
        <div className="container-xl dept-order-support-inner">
          <div>
            <span className="dept-section-kicker">ORDER SUPPORT</span>
            <h2>Need to check an order?</h2>
            <p>Sign in to the fisheries workspace to review buyer orders and delivery updates.</p>
          </div>
          <button className="dept-button dept-button-light" type="button" onClick={onLogin}>
            Open fisheries dashboard <ArrowUpRight size={15} />
          </button>
        </div>
      </section>

      <section className="dept-initiative-section">
        <div className="container-xl dept-initiative-inner">
          <span className="dept-initiative-seal"><Fish size={26} /></span>
          <div>
            <span className="dept-section-kicker">DEPARTMENT INITIATIVE</span>
            <h2>Strengthening fisheries. Connecting communities.</h2>
            <p>
              This marketplace brings together current fish listings and
              department services to support fisheries communities across
              Uttarakhand.
            </p>
          </div>
          <Link className="dept-text-link" to="/about">
            About the department <ArrowUpRight size={16} />
          </Link>
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

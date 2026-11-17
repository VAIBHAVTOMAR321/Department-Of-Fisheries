import { Link } from "react-router-dom";

function About() {
  const services = [
    ["bi-water", "Freshwater aquaculture", "Information on fish culture practices and opportunities suited to Uttarakhand’s varied water resources."],
    ["bi-people", "Farmer support", "Guidance for fish farmers, hatcheries and local fisheries partners."],
    ["bi-journal-text", "Training & schemes", "A starting point for learning about fisheries training and available department programmes."],
    ["bi-shield-check", "Responsible fisheries", "Promoting sustainable use of aquatic resources and healthy freshwater ecosystems."],
  ];

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-image" />
        <div className="container-xl about-hero-copy">
          <span className="eyebrow eyebrow-light">UTTARAKHAND · FRESHWATER FISHERIES</span>
          <h1>Department of<br /><em>Fisheries</em></h1>
          <p>Working to support sustainable fisheries, aquaculture development and fish-farming livelihoods across Uttarakhand.</p>
        </div>
      </section>
      <section className="container-xl about-intro section-space">
        <div className="about-intro-label">
          <span className="eyebrow">OUR MANDATE</span>
          <h2>Healthy waters.<br />Stronger livelihoods.</h2>
        </div>
        <div>
          <p>Uttarakhand’s rivers, streams and reservoirs provide important opportunities for freshwater fisheries. The Department supports the development of responsible fish culture and the communities who depend on it.</p>
          <p>This portal brings together fisheries information, species references and a demonstration dashboard for listings, partners and deliveries. Programme details should be confirmed with the relevant district fisheries office.</p>
          <Link to="/categories" className="text-link">Explore freshwater species <i className="bi bi-arrow-up-right ms-2" /></Link>
        </div>
      </section>
      <section className="about-values">
        <div className="container-xl">
          <span className="eyebrow eyebrow-light">DEPARTMENT SERVICES</span>
          <h2>Support for the fisheries sector.</h2>
          <div className="row g-4">
            {services.map(([icon, title, copy]) => (
              <div className="col-md-6 col-lg-3" key={title}>
                <div className="value-card">
                  <i className={`bi ${icon}`} />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container-xl about-bottom section-space">
        <div className="about-bottom-photo" />
        <div>
          <span className="eyebrow">FISHERIES IN UTTARAKHAND</span>
          <h2>Local knowledge.<br /><em>Sustainable growth.</em></h2>
          <p>From cold-water trout culture to freshwater carp farming, fisheries can contribute to nutrition, enterprise and rural livelihoods when developed with care for local ecosystems.</p>
          <Link to="/contact" className="btn btn-dark-green">Connect with the department <i className="bi bi-arrow-up-right ms-2" /></Link>
        </div>
      </section>
    </div>
  );
}

export default About;

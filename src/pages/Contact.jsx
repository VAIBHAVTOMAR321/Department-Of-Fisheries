import { Link } from "react-router-dom";

function Contact() {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container-xl">
          <span className="eyebrow eyebrow-light">DEPARTMENT OF FISHERIES · UTTARAKHAND</span>
          <h1>Fisheries support<br />for every <em>district.</em></h1>
          <p>Find guidance on freshwater fish farming, department services and fisheries programmes.</p>
        </div>
      </section>
      <div className="container-xl contact-content">
        <div className="row g-5">
          <div className="col-lg-5 contact-info">
            <span className="eyebrow">GET THE RIGHT GUIDANCE</span>
            <h2>Connect with your district fisheries office.</h2>
            <div className="contact-method">
              <i className="bi bi-geo-alt" />
              <span>
                <strong>For local fisheries information</strong>
                <small>Contact the fisheries office serving your district in Uttarakhand.</small>
              </span>
            </div>
            <div className="contact-method">
              <i className="bi bi-journal-check" />
              <span>
                <strong>For schemes and programme details</strong>
                <small>Confirm current eligibility and application requirements with the department.</small>
              </span>
            </div>
            <div className="contact-promise">
              <i className="bi bi-info-circle" />
              <span>This demonstration portal does not collect enquiries or provide official application services.</span>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="contact-form">
              <span className="eyebrow">FISHERIES INFORMATION</span>
              <h2>Explore the Uttarakhand fisheries portal.</h2>
              <p>Browse freshwater species information or view the demonstration dashboard for listings, partners and fishery activity.</p>
              <div className="d-flex flex-wrap gap-2">
                <Link className="btn btn-dark-green" to="/categories">Explore fish species <i className="bi bi-arrow-up-right ms-2" /></Link>
                <Link className="btn btn-outline-secondary" to="/about">Department services <i className="bi bi-arrow-up-right ms-2" /></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

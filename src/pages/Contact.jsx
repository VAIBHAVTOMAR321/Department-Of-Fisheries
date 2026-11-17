import { useState } from "react";
import { getContactRequests, saveContactRequests } from "../utils/store.js";
import {
  departmentAddress,
  departmentMapEmbedUrl,
  departmentMapUrl,
} from "../data/departmentContact.js";

const CONTACT_EMAIL = "info.fisheriesuk@gmail.com";
const CONTACT_PHONE = "+91 98765 43XXXX";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const submitRequest = (event) => {
    event.preventDefault();
    const request = {
      id: `INQ-${Date.now()}`,
      ...form,
      createdAt: new Date().toISOString(),
    };
    saveContactRequests([request, ...getContactRequests()]);
    setForm({ name: "", email: "", phone: "", message: "" });
    setSubmitted(true);
  };

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
              <i className="bi bi-envelope" />
              <span>
                <strong>Email us</strong>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </span>
            </div>
            <div className="contact-method">
              <i className="bi bi-telephone" />
              <span>
                <strong>Phone</strong>
                <small>{CONTACT_PHONE}</small>
              </span>
            </div>
            <div className="contact-method">
              <i className="bi bi-geo-alt" />
              <span>
                <strong>Department address</strong>
                <a href={departmentMapUrl} target="_blank" rel="noreferrer">
                  {departmentAddress}
                </a>
                <a href={departmentMapUrl} target="_blank" rel="noreferrer">
                  View on Google Maps
                </a>
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
              <span>Phone digits are masked. Contact form requests are saved in this browser for the administrator dashboard.</span>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="contact-form">
              <span className="eyebrow">CONTACT THE DEPARTMENT</span>
              <h2>Send us a request.</h2>
              <p>Share your question and the fisheries team will be able to review it in the admin dashboard.</p>
              {submitted && (
                <div className="contact-submit-success" role="status">
                  Your request has been saved. Thank you for contacting us.
                </div>
              )}
              <form className="contact-request-form" onSubmit={submitRequest}>
                <label>
                  Full name
                  <input
                    className="form-control"
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={(event) => {
                      setSubmitted(false);
                      setForm({ ...form, name: event.target.value });
                    }}
                  />
                </label>
                <label>
                  Email address
                  <input
                    className="form-control"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(event) => {
                      setSubmitted(false);
                      setForm({ ...form, email: event.target.value });
                    }}
                  />
                </label>
                <label>
                  Phone number
                  <input
                    className="form-control"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={form.phone}
                    onChange={(event) => {
                      setSubmitted(false);
                      setForm({ ...form, phone: event.target.value });
                    }}
                  />
                </label>
                <label>
                  How can we help?
                  <textarea
                    className="form-control"
                    rows="4"
                    required
                    value={form.message}
                    onChange={(event) => {
                      setSubmitted(false);
                      setForm({ ...form, message: event.target.value });
                    }}
                  />
                </label>
                <button className="btn btn-dark-green" type="submit">Submit request</button>
                <small>Demo portal: requests are saved in this browser and do not send an email.</small>
              </form>
            </div>
          </div>
        </div>
        <section className="department-map-section" aria-label="Department location map">
          <div>
            <span className="eyebrow">FIND THE DEPARTMENT</span>
            <h2>Visit us in Dehradun</h2>
            <p>{departmentAddress}</p>
            <a href={departmentMapUrl} target="_blank" rel="noreferrer">
              Open in Google Maps <i className="bi bi-arrow-up-right" />
            </a>
          </div>
          <iframe
            title="Department of Fisheries location in Google Maps"
            src={departmentMapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </section>
      </div>
    </div>
  );
}

export default Contact;

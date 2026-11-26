import { useState } from "react";
import { Mail, MessageSquareText, Phone } from "lucide-react";
import { getContactRequests } from "../utils/store.js";
import "./ContactRequests.css";
import { Link } from "react-router-dom";

function ContactRequests() {
  const [requests] = useState(getContactRequests);

  return (
    <main className="contact-requests-page">
      <header className="contact-requests-heading">
        <div>
          <span className="welcome-kicker">DEPARTMENT INBOX</span>
          <h1>Contact requests</h1>
          <p>Enquiries submitted through the public Contact Us form.</p>
        </div>
        <strong>{requests.length} {requests.length === 1 ? "request" : "requests"}</strong>
      </header>

      {requests.length ? (
        <div className="contact-request-list">
          {requests.map((request) => (
            <article className="contact-request-card" key={request.id}>
              <header>
                <div>
                  <span>{request.id}</span>
                  <h2>{request.name}</h2>
                </div>
                <time dateTime={request.createdAt}>
                  {new Date(request.createdAt).toLocaleString("en-IN")}
                </time>
              </header>
              <div className="contact-request-details">
                <Link to={`mailto:${request.email}`}><Mail size={14} /> {request.email}</Link>
                <Link to={`tel:${request.phone}`}><Phone size={14} /> {request.phone}</Link>
              </div>
              <p><MessageSquareText size={15} /> {request.message}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="contact-requests-empty">
          <MessageSquareText size={28} />
          <h2>No contact requests yet</h2>
          <p>New requests submitted through Contact Us will appear here.</p>
        </div>
      )}
    </main>
  );
}

export default ContactRequests;

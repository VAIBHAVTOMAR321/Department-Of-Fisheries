import { Link } from "react-router-dom";

function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <span>
        <i className="bi bi-snow2 me-2" />
        Fresh catch, delivered cold. Free delivery on orders over ₹999.
      </span>
      <Link to="tel:+918001234567">
        Need a hand? <strong>We’re here to help</strong>
      </Link>
    </div>
  );
}

export default AnnouncementBar;

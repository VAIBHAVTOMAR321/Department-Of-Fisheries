import { Link } from "react-router-dom";

function BrandMark({ light = false }) {
  return (
    <Link
      className={`brand-mark${light ? " brand-mark-light" : ""}`}
      to="/"
      aria-label="Department of Fisheries, Uttarakhand home"
    >
      <span className="brand-icon" aria-hidden="true">
        <i className="bi bi-water" />
      </span>
      <span className="brand-name">
        Department of Fisheries
        <small>UTTARAKHAND</small>
      </span>
    </Link>
  );
}

export default BrandMark;

import { Link } from "react-router-dom";
import LogoImage from "./LogoImage.jsx";

function BrandMark({ light = false }) {
  return (
    <Link
      className={`brand-mark${light ? " brand-mark-light" : ""}`}
      to="/"
      aria-label="Department of Fisheries, Uttarakhand home"
    >
      <LogoImage className="brand-logo-image" />
      <span className="brand-name">
        Department of Fisheries
        <small>UTTARAKHAND</small>
      </span>
    </Link>
  );
}

export default BrandMark;

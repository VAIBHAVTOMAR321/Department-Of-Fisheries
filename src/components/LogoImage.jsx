import UKLogo from "../assets/images/uk_logo.jpeg";

function LogoImage({ className = "" }) {
  return <img className={className} src={UKLogo} alt="" aria-hidden="true" />;
}

export default LogoImage;

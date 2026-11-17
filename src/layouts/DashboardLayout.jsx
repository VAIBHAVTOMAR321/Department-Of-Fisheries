import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Activity,
  Bell,
  ChevronDown,
  Fish,
  LayoutDashboard,
  Package,
  Handshake,
  Truck,
  Users,
  Settings,
  LogOut,
  Menu,
  Waves,
  UserRound,
  BarChart3,
  WalletCards,
  ClipboardList,
} from "lucide-react";
import "./DashboardLayout.css";
import LogoImage from "../components/LogoImage.jsx";
const links = [
  ["Overview", "/app", LayoutDashboard],
  ["Fish listings", "/app/listings", Fish],
  ["Negotiations", "/app/negotiations", Handshake],
  ["Payments", "/app/payments", WalletCards],
  ["Deliveries", "/app/deliveries", Truck],
  ["People & suppliers", "/app/people", Users],
  ["Reports & insights", "/app/reports", BarChart3],
  ["Orders", "/app/orders", ClipboardList],
];
export default function DashboardLayout({ user, onLogout, onRoleChange }) {
  const nav = useNavigate();
  const supplierRoles = ["farmer", "hatchery", "dam", "contractor"];
  const visibleLinks =
    user.role === "delivery"
      ? links.filter((x) => ["Overview", "Deliveries"].includes(x[0]))
      : user.role === "buyer"
        ? links.filter((x) => ["Overview", "Orders"].includes(x[0]))
        : supplierRoles.includes(user.role)
        ? links.filter((x) =>
            [
              "Overview",
              "Fish listings",
              "Orders",
              "Negotiations",
              "Payments",
              "Deliveries",
            ].includes(x[0]),
          )
        : user.role === "inventory"
          ? links.filter((x) => x[0] !== "Reports & insights")
          : links;
  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <Link className="brand side-brand" to="/">
          <span className="brand-mark">
            <LogoImage />
          </span>
          <span>
            Department of Fisheries
            <small>UTTARAKHAND · FISHERIES PORTAL</small>
          </span>
        </Link>
        <div className="workspace-label">WORKSPACE</div>
        <div className="side-links">
          {visibleLinks.map(([name, path, Icon]) => (
            <NavLink key={path} end={path === "/app"} to={path}>
              <Icon size={17} />
              {name === "Orders"
                ? user.role === "buyer"
                  ? "My orders"
                  : supplierRoles.includes(user.role)
                    ? "Customer orders"
                    : "Marketplace orders"
                : name}
              {name === "Negotiations" && <b>3</b>}
            </NavLink>
          ))}
        </div>
        <div className="sidebar-bottom">
          <div className="help-card">
            <Waves size={18} />
            <b>Keep the chain fresh</b>
            <p>Monitor freshness windows and reduce post-harvest loss.</p>
          </div>
          <button onClick={onLogout}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <main className="dash-main">
        <header className="dash-topbar">
          <div className="crumb">
            <span>Workspace</span>
            <b>/</b> Overview
          </div>
          <div className="top-actions">
            <span className="live-dot">● Demo environment</span>
            <button className="bell-btn">
              <Bell size={18} />
              <i />
            </button>
            <div className="profile-chip">
              <div className="avatar">{user.name?.[0] || "A"}</div>
              <div>
                <b>{user.name}</b>
                <small>{user.roleLabel}</small>
              </div>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>
        <div className="dash-content">
          <Outlet context={{ user, onRoleChange }} />
        </div>
      </main>
    </div>
  );
}

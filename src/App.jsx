import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Fish,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./styles/global.css";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import DashboardLayout from "./layouts/DashboardLayout";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Modal from "./components/Modal/Modal";

import Overview from "./dashboards/Overview";
import Listings from "./pages/Listings";
import Negotiations from "./pages/Negotiations";
import Deliveries from "./pages/Deliveries";
import People from "./pages/People";
import Reports from "./pages/Reports";
import Payments from "./pages/Payments";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ContactRequests from "./pages/ContactRequests";

import { roles } from "./data/seed";
import {
  getCart,
  getListings,
  getOrders,
  getUsers,
  saveCart,
  saveListings,
  saveOrders,
  saveUsers,
} from "./utils/store";

function AppContent() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("aqua_user"));
    } catch {
      return null;
    }
  });
  const [cart, setCart] = useState(getCart);
  const [dialog, setDialog] = useState("");
  const [role, setRole] = useState("admin");
  const [name, setName] = useState("Administrator");
  const [email, setEmail] = useState("admin@fisheries.demo");
  const demoProfiles = {
    admin: { name: "Administrator", email: "admin@fisheries.demo" },
    buyer: { name: "Fish Buyer", email: "buyer@fisheries.demo" },
    inventory: { name: "Inventory Manager", email: "inventory@demo.com" },
    farmer: { name: "Rajesh Kumar", email: "rajesh@demo.com" },
    hatchery: { name: "Maa Ganga Hatchery", email: "hatchery@demo.com" },
    dam: { name: "Amit Singh", email: "amit@demo.com" },
    contractor: { name: "Riverside Contractors", email: "contractor@demo.com" },
    delivery: { name: "Vikram Rawat", email: "delivery@demo.com" },
  };
  const [userLocation, setUserLocation] = useState("Dehradun, Uttarakhand");

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/app");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  const login = () => {
    const r = roles.find((x) => x.id === role);
    const normalizedEmail = email.trim().toLowerCase();
    const savedBuyer =
      role === "buyer"
        ? getUsers().find(
            (savedUser) =>
              savedUser.role === "buyer" &&
              savedUser.email?.trim().toLowerCase() === normalizedEmail,
          )
        : null;
    const u = {
      ...(savedBuyer || {}),
      name: savedBuyer?.name || name.trim(),
      role,
      roleLabel: r?.label,
      email: normalizedEmail,
      location: savedBuyer?.location || userLocation,
    };
    setUser(u);
    localStorage.setItem("aqua_user", JSON.stringify(u));
    setDialog("");
    navigate("/app");
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("aqua_user");
    navigate("/");
  };
  const openLogin = () => {
    setDialog("login");
    setRole("admin");
    setName(demoProfiles.admin.name);
    setEmail(demoProfiles.admin.email);
  };
  const openRegister = () => {
    setDialog("register");
    setRole("farmer");
    setName(demoProfiles.farmer.name);
    setEmail(demoProfiles.farmer.email);
  };
  const addToCart = (listing, quantity) => {
    const currentListing = getListings().find((item) => item.id === listing.id);
    const inCart = cart.find((item) => item.listingId === listing.id)?.quantity || 0;
    if (!currentListing || quantity < 50 || inCart + quantity > Number(currentListing.qty)) {
      return "This listing no longer has enough stock for that order.";
    }
    const next = cart.some((item) => item.listingId === listing.id)
      ? cart.map((item) =>
          item.listingId === listing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      : [...cart, { listingId: listing.id, quantity }];
    saveCart(next);
    setCart(next);
    return "";
  };
  const updateCart = (listingId, quantity) => {
    const next =
      quantity <= 0
        ? cart.filter((item) => item.listingId !== listingId)
        : cart.map((item) =>
            item.listingId === listingId ? { ...item, quantity } : item,
          );
    saveCart(next);
    setCart(next);
  };
  const placeOrder = (buyerDetails) => {
    const currentListings = getListings();
    const orderItems = [];
    for (const cartItem of cart) {
      const listing = currentListings.find((item) => item.id === cartItem.listingId);
      if (!listing || cartItem.quantity < 50 || cartItem.quantity > Number(listing.qty)) {
        return "A fish listing has changed or no longer has enough stock. Please review your basket.";
      }
      orderItems.push({
        listingId: listing.id,
        species: listing.species,
        size: listing.size,
        quantity: cartItem.quantity,
        unitPrice: Number(listing.ask),
        supplier: listing.supplier,
        supplierLocation: listing.location,
      });
    }
    if (!orderItems.length) return "Your basket is empty.";
    if (!buyerDetails.name || !buyerDetails.email || !buyerDetails.phone || !buyerDetails.location) {
      return "Complete your contact and delivery details to place this order.";
    }

    const registeredUser = {
      id: Date.now(),
      name: buyerDetails.name.trim(),
      role: "buyer",
      roleLabel: "Fish Buyer",
      email: buyerDetails.email.trim().toLowerCase(),
      phone: buyerDetails.phone.trim(),
      location: buyerDetails.location.trim(),
    };
    const order = {
      id: `ORD-${Date.now()}`,
      buyerName: registeredUser.name,
      buyerEmail: registeredUser.email,
      buyerPhone: registeredUser.phone,
      deliveryLocation: registeredUser.location,
      items: orderItems,
      status: "Payment pending",
      paymentStatus: "Pending",
      createdAt: new Date().toISOString(),
    };
    const remainingCart = [];
    const updatedListings = currentListings.map((listing) => {
      const ordered = orderItems.find((item) => item.listingId === listing.id);
      if (!ordered) return listing;
      const quantityLeft = Number(listing.qty) - ordered.quantity;
      if (quantityLeft > 0) return { ...listing, qty: quantityLeft };
      return { ...listing, qty: 0, status: "Sold out" };
    });

    saveOrders([order, ...getOrders()]);
    saveListings(updatedListings);
    saveUsers([
      ...getUsers().filter((existing) => existing.email !== registeredUser.email),
      registeredUser,
    ]);
    saveCart(remainingCart);
    localStorage.setItem("aqua_user", JSON.stringify(registeredUser));
    setUser(registeredUser);
    setCart(remainingCart);
    navigate("/app/payments");
    return "";
  };

  return (
    <>
      {!isDashboard && (
        <Navbar
          onLogin={openLogin}
          onRegister={openRegister}
          cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        />
      )}
      <Routes>
        <Route path="/" element={<Home onLogin={openLogin} onRegister={openRegister} onAddToCart={addToCart} cart={cart} />} />
        <Route path="/shop" element={<Shop cart={cart} onAddToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} listings={getListings()} user={user} onUpdateCart={updateCart} onPlaceOrder={placeOrder} />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route
          path="/app"
          element={
            user ? (
              <DashboardLayout
                user={user}
                onLogout={logout}
                onRoleChange={(r) => {
                  setRole(r);
                  setDialog("login");
                }}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route index element={<Overview />} />
          <Route path="listings" element={<Listings />} />
          <Route path="negotiations" element={<Negotiations />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="payments" element={<Payments />} />
          <Route path="people" element={<People />} />
          <Route path="reports" element={<Reports />} />
          <Route path="orders" element={<Orders />} />
          <Route
            path="contact-requests"
            element={user?.role === "admin" ? <ContactRequests /> : <Navigate to="/app" replace />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isDashboard && <Footer />}

      {dialog && (
        <Modal
          title={dialog === "login" ? "Welcome back" : "Join the fisheries network"}
          onClose={() => setDialog("")}
        >
          <div className="auth-intro">
            <div><Fish size={22} /></div>
            <p>
              {dialog === "login"
                ? "Choose a demo role and enter the workspace. No password or backend is required."
                : "Create a local demo profile to explore the supplier experience."}
            </p>
          </div>
          <form
            className="form-grid auth-form"
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            <label className="full-field">
              Workspace role
              <select
                value={role}
                onChange={(e) => {
                  const nextRole = e.target.value;
                  setRole(nextRole);
                  const savedBuyer =
                    nextRole === "buyer"
                      ? getUsers().filter((savedUser) => savedUser.role === "buyer").slice(-1)[0]
                      : null;
                  const profile = savedBuyer || demoProfiles[nextRole];
                  if (profile) {
                    setName(profile.name);
                    setEmail(profile.email);
                    if (profile.location) setUserLocation(profile.location);
                  }
                }}
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </label>
            <label className="full-field">
              {dialog === "login" ? "Display name" : "Your name / business name"}
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            </label>
            <label className="full-field">
              Email address
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            {dialog === "register" && (
              <label className="full-field">
                Location
                <input required value={userLocation} onChange={(e) => setUserLocation(e.target.value)} />
              </label>
            )}
            <div className="auth-note full-field">
              <ShieldCheck size={15} /> Demo mode · Your activity is saved in this browser only.
            </div>
            <button className="primary-btn full-field">
              {dialog === "login" ? "Enter dashboard" : "Create demo account"} <ArrowRight size={15} />
            </button>
          </form>
        </Modal>
      )}
    </>
    
  );
}

function App() {
  return (
    <Router basename="/fisheriesdemo">
      <AppContent />
    </Router>
  );
}

export default App;
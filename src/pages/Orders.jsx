import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { BadgeCheck, ClipboardList, MapPin, Package } from "lucide-react";
import { getOrders } from "../utils/store";
import { getFishImage } from "../data/fishImages";
import "./Orders.css";

const supplierRoles = ["farmer", "hatchery", "dam", "contractor"];

export default function Orders() {
  const { user } = useOutletContext();
  const [orders] = useState(getOrders());
  const isSupplier = supplierRoles.includes(user.role);
  const isBuyer = user.role === "buyer";
  const visibleOrders = orders.filter((order) => {
    if (isBuyer) return order.buyerEmail === user.email;
    if (isSupplier) return order.items.some((item) => item.supplier === user.name);
    return true;
  });

  return (
    <div className="orders-dashboard">
      <div className="page-heading">
        <div>
          <div className="welcome-kicker">{isBuyer ? "BUYER WORKSPACE" : "FISHERIES MARKETPLACE"}</div>
          <h1>{isBuyer ? "My orders" : isSupplier ? "Customer orders" : "Marketplace orders"}</h1>
          <p>
            {isBuyer
              ? "View your fish orders and the supplying farmers."
              : isSupplier
                ? "Orders placed for your fish listings."
                : "Orders placed by buyers across the fisheries marketplace."}
          </p>
        </div>
      </div>
      {!visibleOrders.length ? (
        <div className="orders-empty">
          <ClipboardList size={28} />
          <h2>No orders yet</h2>
          <p>{isBuyer ? "Orders you place from the marketplace will appear here." : "New marketplace orders will appear here."}</p>
        </div>
      ) : (
        <div className="orders-list">
          {visibleOrders.map((order) => {
            const orderItems = isSupplier
              ? order.items.filter((item) => item.supplier === user.name)
              : order.items;
            const total = orderItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
            return (
              <article className="dashboard-order-card" key={order.id}>
                <header className="dashboard-order-header">
                  <div>
                    <span>ORDER ID</span>
                    <strong>{order.id}</strong>
                  </div>
                  <span className="dashboard-order-status"><BadgeCheck size={14} /> {order.status}</span>
                </header>
                <div className="dashboard-order-buyer">
                  <span><Package size={14} /> {isBuyer ? "Deliver to" : "Buyer"}</span>
                  <strong>{isBuyer ? order.deliveryLocation : order.buyerName}</strong>
                  {!isBuyer && <small>{order.buyerEmail} · {order.buyerPhone}</small>}
                  {isBuyer && <small><MapPin size={12} /> {order.deliveryLocation}</small>}
                </div>
                <div className="dashboard-order-lines">
                  {orderItems.map((item) => {
                    const fish = getFishImage(item.species);
                    return (
                      <div className="dashboard-order-line" key={item.listingId}>
                        <img src={fish.image} alt={[item.species, item.size].filter(Boolean).join(" ")} />
                        <div>
                          <strong>{item.species}</strong>
                          <small>
                            {[item.size, `${item.quantity} kg`, `₹${item.unitPrice}/kg`, `Farmer: ${item.supplier}`]
                              .filter(Boolean)
                              .join(" · ")}
                          </small>
                        </div>
                        <b>₹{(item.quantity * item.unitPrice).toLocaleString("en-IN")}</b>
                      </div>
                    );
                  })}
                </div>
                <footer className="dashboard-order-footer">
                  <span>{new Date(order.createdAt).toLocaleString("en-IN")}</span>
                  <strong><span>Order total</span> ₹{total.toLocaleString("en-IN")}</strong>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

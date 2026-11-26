import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  IndianRupee,
  ShieldCheck,
  WalletCards,
  CheckCircle2,
  Clock3,
  Receipt,
  LockKeyhole,
  Truck,
  Phone,
  CalendarClock,
} from "lucide-react";
import Modal from "../components/Modal/Modal";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import {
  getListings,
  saveListings,
  getPayments,
  savePayments,
  getDeliveries,
  saveDeliveries,
  getOrders,
  saveOrders,
} from "../utils/store";
import "./Payments.css";

const supplierRoles = ["farmer", "hatchery", "dam", "contractor"];
const deliveryTime = (daysAhead, hour) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(hour, 0, 0, 0);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
export default function Payments() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [listings, setListings] = useState(getListings());
  const [payments, setPayments] = useState(getPayments());
  const [deliveries, setDeliveries] = useState(getDeliveries());
  const [orders, setOrders] = useState(getOrders());
  const [selected, setSelected] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [method, setMethod] = useState("UPI");
  const [reference, setReference] = useState("");
  const [payer, setPayer] = useState(user.name || "Department Administrator");
  const [receipt, setReceipt] = useState(null);
  const [assign, setAssign] = useState(null);
  const [assignOrder, setAssignOrder] = useState(null);
  const [deliveryForm, setDeliveryForm] = useState({
    driver: "Vikram Rawat",
    driverPhone: "9876543210",
    driverEmail: "delivery@demo.com",
    destination: "",
    eta: deliveryTime(2, 17),
    pickup: deliveryTime(1, 10),
    coldChain: true,
  });
  const inventory = user.role === "inventory";
  const managerView = ["admin", "inventory"].includes(user.role);
  const visible = listings.filter((x) =>
    managerView
      ? ["Payment pending", "Paid"].includes(x.status)
      : supplierRoles.includes(user.role)
        ? x.supplier === user.name &&
          ["Payment pending", "Paid"].includes(x.status)
        : false,
  );
  const pending = visible.filter((x) => x.status === "Payment pending");
  const paid = visible.filter((x) => x.status === "Paid");
  const marketOrders = orders.filter((order) =>
    managerView
      ? true
      : user.role === "buyer" && order.buyerEmail === user.email,
  );
  const marketPending = marketOrders.filter(
    (order) => order.paymentStatus !== "Paid",
  );
  const marketPaid = marketOrders.filter(
    (order) => order.paymentStatus === "Paid",
  );
  const orderTotal = (order) =>
    order.items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
      0,
    );
  const pendingTotal = pending.reduce(
    (a, x) => a + +(x.agreedPrice || x.offer || x.ask) * x.qty,
    0,
  ) + marketPending.reduce((sum, order) => sum + orderTotal(order), 0);
  const paidTotal = paid.reduce(
    (a, x) => a + +(x.agreedPrice || x.offer || x.ask) * x.qty,
    0,
  ) + marketPaid.reduce((sum, order) => sum + orderTotal(order), 0);
  const visiblePayments =
    user.role === "buyer"
      ? payments.filter((payment) => payment.buyerEmail === user.email)
      : payments;
  const updateListings = (next) => {
    setListings(next);
    saveListings(next);
  };
  const payNow = (e) => {
    e.preventDefault();
    if (!selected) return;
    const rate = +(selected.agreedPrice || selected.offer || selected.ask);
    const rec = {
      id: "TXN-" + Date.now().toString().slice(-8),
      listingId: selected.id,
      species: selected.species,
      supplier: selected.supplier,
      quantity: selected.qty,
      pricePerKg: rate,
      amount: rate * selected.qty,
      method,
      reference: reference.trim() || "DEMO-" + Date.now().toString().slice(-6),
      payer,
      paidAt: new Date().toISOString(),
      status: "Paid",
    };
    updateListings(
      listings.map((x) =>
        x.id === selected.id
          ? {
              ...x,
              status: "Paid",
              paymentStatus: "Paid",
              paymentId: rec.id,
              paidAt: rec.paidAt,
              paymentMethod: method,
            }
          : x,
      ),
    );
    const next = [rec, ...payments];
    setPayments(next);
    savePayments(next);
    setSelected(null);
    setReference("");
    setReceipt(rec);
  };
  const payBuyerOrder = (e) => {
    e.preventDefault();
    if (!selectedOrder || selectedOrder.paymentStatus === "Paid") return;
    const amount = orderTotal(selectedOrder);
    const rec = {
      id: "TXN-" + Date.now().toString().slice(-8),
      orderId: selectedOrder.id,
      species: selectedOrder.items.map((item) => item.species).join(", "),
      supplier: selectedOrder.items
        .map((item) => item.supplier)
        .filter((name, i, all) => all.indexOf(name) === i)
        .join(", "),
      quantity: selectedOrder.items.reduce(
        (sum, item) => sum + Number(item.quantity),
        0,
      ),
      amount,
      method,
      reference: reference.trim() || "DEMO-" + Date.now().toString().slice(-6),
      payer,
      buyerName: selectedOrder.buyerName,
      buyerEmail: selectedOrder.buyerEmail,
      paidAt: new Date().toISOString(),
      status: "Paid",
    };
    const nextOrders = orders.map((order) =>
      order.id === selectedOrder.id
        ? {
            ...order,
            status: "Paid",
            paymentStatus: "Paid",
            paymentId: rec.id,
            paymentMethod: method,
            paidAt: rec.paidAt,
          }
        : order,
    );
    const nextPayments = [rec, ...payments];
    setOrders(nextOrders);
    saveOrders(nextOrders);
    setPayments(nextPayments);
    savePayments(nextPayments);
    setSelectedOrder(null);
    setReference("");
    setReceipt(rec);
  };
  const openAssign = (x) => {
    setAssign(x);
    setDeliveryForm({
      driver: "Vikram Rawat",
      driverPhone: "9876543210",
      driverEmail: "delivery@demo.com",
      destination: `${user.location || "Dehradun"} Central Inventory`,
      eta: deliveryTime(2, 17),
      pickup: deliveryTime(1, 10),
      coldChain: true,
    });
  };
  const openOrderAssign = (order) => {
    setAssignOrder(order);
    setDeliveryForm({
      driver: "Vikram Rawat",
      driverPhone: "9876543210",
      driverEmail: "delivery@demo.com",
      destination: order.deliveryLocation || "",
      eta: deliveryTime(2, 17),
      pickup: deliveryTime(1, 10),
      coldChain: true,
    });
  };
  const assignPartner = (e) => {
    e.preventDefault();
    if (assignOrder) {
      if (deliveries.some((delivery) => delivery.orderId === assignOrder.id)) {
        setAssignOrder(null);
        return;
      }
      const id = "DL-" + Date.now().toString().slice(-7);
      const event = {
        status: "Assigned",
        at: new Date().toISOString(),
        by: user.name,
        note: `Delivery partner ${deliveryForm.driver} assigned for marketplace order ${assignOrder.id}.`,
      };
      const suppliers = [...new Set(assignOrder.items.map((item) => item.supplier))];
      const locations = [...new Set(assignOrder.items.map((item) => item.supplierLocation).filter(Boolean))];
      const shipment = {
        id,
        orderId: assignOrder.id,
        paymentStatus: assignOrder.paymentStatus,
        paymentId: assignOrder.paymentId,
        buyerName: assignOrder.buyerName,
        buyerEmail: assignOrder.buyerEmail,
        buyerPhone: assignOrder.buyerPhone,
        fish: assignOrder.items.map((item) => `${item.species} · ${item.quantity} kg`).join(", "),
        supplier: suppliers.join(", "),
        supplierLocation: locations.join(" / "),
        pickupLocation: locations.join(" / ") || "Supplier pickup",
        destination: assignOrder.deliveryLocation,
        driver: deliveryForm.driver,
        driverPhone: deliveryForm.driverPhone,
        driverEmail: deliveryForm.driverEmail,
        eta: deliveryForm.eta,
        pickup: deliveryForm.pickup,
        status: "Assigned",
        coldChain: deliveryForm.coldChain,
        history: [event],
        createdAt: event.at,
      };
      const nextDeliveries = [shipment, ...deliveries];
      setDeliveries(nextDeliveries);
      saveDeliveries(nextDeliveries);
      const nextOrders = orders.map((order) =>
        order.id === assignOrder.id
          ? { ...order, status: "Delivery assigned", deliveryId: id, deliveryAssignedAt: event.at }
          : order,
      );
      setOrders(nextOrders);
      saveOrders(nextOrders);
      setAssignOrder(null);
      navigate("/app/deliveries");
      return;
    }
    if (!assign) return;
    const id = "DL-" + Date.now().toString().slice(-7);
    const event = {
      status: "Assigned",
      at: new Date().toISOString(),
      by: user.name,
      note: `Delivery partner ${deliveryForm.driver} assigned by Inventory Manager.`,
    };
    const shipment = {
      id,
      listingId: assign.id,
      paymentStatus: assign.paymentStatus || "Paid",
      paymentId: assign.paymentId,
      fish: `${assign.species} · ${assign.qty} kg`,
      supplier: assign.supplier,
      supplierLocation: assign.location,
      pickupLocation: assign.location,
      destination: deliveryForm.destination,
      driver: deliveryForm.driver,
      driverPhone: deliveryForm.driverPhone,
      driverEmail: deliveryForm.driverEmail,
      eta: deliveryForm.eta,
      pickup: deliveryForm.pickup,
      status: "Assigned",
      coldChain: deliveryForm.coldChain,
      history: [event],
      createdAt: event.at,
    };
    const nextDeliveries = [shipment, ...deliveries];
    setDeliveries(nextDeliveries);
    saveDeliveries(nextDeliveries);
    const nextListings = listings.map((x) =>
      x.id === assign.id
        ? { ...x, deliveryId: id, deliveryAssignedAt: event.at }
        : x,
    );
    updateListings(nextListings);
    setAssign(null);
    navigate("/app/deliveries");
  };
  return (
    <div className="payments-page">
      <div className="page-heading">
        <div>
          <div className="welcome-kicker">SECURE DEAL SETTLEMENT</div>
          <h1>Payments & settlements</h1>
          <p>
            {user.role === "buyer"
              ? "Pay for marketplace orders and follow their delivery status from your dashboard."
              : inventory
              ? "Settle farmer deals after final confirmation, monitor buyer payments, and assign deliveries after payment."
              : user.role === "admin"
                ? "Monitor marketplace payments and delivery handover. Inventory Manager manages supplier settlements and delivery assignment."
                : "Track payment and delivery handover for your confirmed fish supply deals."}
          </p>
        </div>
      </div>
      <div className="payment-stats">
        <article>
          <span className="payment-stat-icon amber">
            <Clock3 />
          </span>
          <div>
            <small>PAYMENT PENDING</small>
            <b>₹{pendingTotal.toLocaleString("en-IN")}</b>
            <em>{pending.length + marketPending.length} item(s) awaiting payment</em>
          </div>
        </article>
        <article>
          <span className="payment-stat-icon green">
            <CheckCircle2 />
          </span>
          <div>
            <small>PAID / SETTLED</small>
            <b>₹{paidTotal.toLocaleString("en-IN")}</b>
            <em>{paid.length + marketPaid.length} paid order(s) / deal(s)</em>
          </div>
        </article>
        <article>
          <span className="payment-stat-icon blue">
            <Receipt />
          </span>
          <div>
            <small>TRANSACTIONS</small>
            <b>{visiblePayments.length}</b>
            <em>Demo payment records</em>
          </div>
        </article>
      </div>
      <section className="payment-flow">
        <div className="payment-flow-title">
          <ShieldCheck />
          <div>
            <b>Order settlement workflow</b>
            <span>
              {user.role === "buyer"
                ? "Place order → Buyer payment → Delivery assignment → Tracking → Receipt confirmation"
                : "Buyer payment → Inventory assignment → Delivery tracking → Buyer receipt"}
            </span>
          </div>
        </div>
        <div className="payment-flow-steps">
          <span className="done">{user.role === "buyer" ? "1. Order placed" : "1. Deal confirmed"}</span>
          <i />
          <span className={pending.length + marketPending.length ? "active" : "done"}>2. Payment</span>
          <i />
          <span className={paid.some((deal) => !deliveries.some((delivery) => delivery.listingId === deal.id)) || marketPaid.some((order) => !deliveries.some((delivery) => delivery.orderId === order.id)) ? "active" : "muted"}>
            3. Delivery assignment
          </span>
        </div>
      </section>
      {(managerView || user.role === "buyer") && (
        <section className="market-order-payments">
          <div className="payment-section-head">
            <div>
              <h2>{user.role === "buyer" ? "Your marketplace orders" : "Marketplace buyer orders"}</h2>
              <p>
                {user.role === "buyer"
                  ? "Review payment status and complete payment for your orders."
                  : "Monitor buyer payments and assign delivery partners for paid orders."}
              </p>
            </div>
            <span>{marketPending.length} payment pending</span>
          </div>
          {marketOrders.length ? (
            <div className="pay-deal-list">
              {marketOrders.map((order) => {
                const total = orderTotal(order);
                const shipment = deliveries.find((delivery) => delivery.orderId === order.id);
                return (
                  <article className="pay-deal-card" key={order.id}>
                    <div className="pay-deal-top">
                      <div className="pay-fish-icon">🐟</div>
                      <div className="pay-deal-title">
                        <h3>{order.id}</h3>
                        <p>
                          {order.items.map((item) => `${item.species} · ${item.quantity} kg`).join(", ")}
                        </p>
                      </div>
                      <StatusBadge status={order.paymentStatus === "Paid" ? order.status : "Payment pending"} />
                    </div>
                    <div className="pay-breakdown">
                      <div>
                        <small>{user.role === "buyer" ? "DELIVER TO" : "BUYER"}</small>
                        <b>{user.role === "buyer" ? order.deliveryLocation : order.buyerName}</b>
                      </div>
                      <div>
                        <small>PAYMENT</small>
                        <b>{order.paymentStatus || "Pending"}</b>
                      </div>
                      <div className="pay-total">
                        <small>{order.paymentStatus === "Paid" ? "PAID AMOUNT" : "TOTAL TO PAY"}</small>
                        <b>₹{total.toLocaleString("en-IN")}</b>
                      </div>
                    </div>
                    {managerView && (
                      <p className="market-order-meta">
                        Deliver to: {order.deliveryLocation} · {order.buyerEmail} · {order.buyerPhone}
                      </p>
                    )}
                    <div className="pay-deal-footer">
                      <span>
                        <LockKeyhole size={13} />{" "}
                        {order.paymentStatus === "Paid"
                          ? `Paid via ${order.paymentMethod || "Digital payment"}`
                          : "Payment is required before delivery can be assigned"}
                      </span>
                      {user.role === "buyer" && order.paymentStatus !== "Paid" && (
                        <button
                          className="primary-btn"
                          onClick={() => {
                            setSelectedOrder(order);
                            setPayer(user.name);
                          }}
                        >
                          <IndianRupee size={15} /> Pay ₹{total.toLocaleString("en-IN")}
                        </button>
                      )}
                      {inventory && order.paymentStatus === "Paid" && !shipment && (
                        <button className="primary-btn" onClick={() => openOrderAssign(order)}>
                          <Truck size={15} /> Assign delivery
                        </button>
                      )}
                      {shipment && (
                        <button className="outline-btn" onClick={() => navigate("/app/deliveries")}>
                          <Truck size={14} /> Track {shipment.status}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="payment-empty">
              <WalletCards />
              <h3>{user.role === "buyer" ? "No marketplace orders yet" : "No external buyer orders yet"}</h3>
              <p>
                {user.role === "buyer"
                  ? "Orders placed from the marketplace will appear here for payment and tracking."
                  : "Marketplace orders and their payment and delivery status will appear here."}
              </p>
            </div>
          )}
        </section>
      )}
      {user.role !== "buyer" && <>
      <div className="payment-section-head">
        <div>
          <h2>
            {managerView
              ? "Payment and settlement monitor"
              : "Your confirmed deals"}
          </h2>
          <p>
            {inventory
              ? "Pay the locked price. Delivery assignment becomes available immediately after payment."
              : user.role === "admin"
                ? "Read-only monitoring of payment status and assigned delivery."
                : "Payment status and agreed amount for your supply."}
          </p>
        </div>
        <span>{pending.length} pending</span>
      </div>
      <div className="pay-deal-list">
        {visible.map((x) => {
          const rate = +(x.agreedPrice || x.offer || x.ask),
            amount = rate * Number(x.qty);
          const hasDelivery = deliveries.some((d) => d.listingId === x.id);
          return (
            <article className="pay-deal-card" key={x.id}>
              <div className="pay-deal-top">
                <div className="pay-fish-icon">🐟</div>
                <div className="pay-deal-title">
                  <h3>
                    {x.species} <small>· {x.qty} kg</small>
                  </h3>
                  <p>
                    {x.supplier} · {x.location}
                  </p>
                </div>
                <StatusBadge status={x.status} />
              </div>
              <div className="pay-breakdown">
                <div>
                  <small>AGREED PRICE</small>
                  <b>
                    ₹{rate.toLocaleString("en-IN")}
                    <i>/kg</i>
                  </b>
                </div>
                <div>
                  <small>QUANTITY</small>
                  <b>
                    {Number(x.qty).toLocaleString("en-IN")} <i>kg</i>
                  </b>
                </div>
                <div className="pay-total">
                  <small>
                    {x.status === "Paid" ? "PAID AMOUNT" : "TOTAL TO PAY"}
                  </small>
                  <b>₹{amount.toLocaleString("en-IN")}</b>
                </div>
              </div>
              <div className="pay-deal-footer">
                <span>
                  <LockKeyhole size={13} />{" "}
                  {x.status === "Paid"
                    ? `Paid via ${x.paymentMethod || "Digital payment"}`
                    : "Price locked after Inventory Manager final confirmation"}
                </span>
                {x.status === "Payment pending" && inventory && (
                  <button
                    className="primary-btn"
                    onClick={() => setSelected(x)}
                  >
                    <IndianRupee size={15} /> Pay ₹
                    {amount.toLocaleString("en-IN")}
                  </button>
                )}
                {x.status === "Paid" && inventory && !hasDelivery && (
                  <button className="primary-btn" onClick={() => openAssign(x)}>
                    <Truck size={15} /> Assign delivery partner
                  </button>
                )}
                {x.status === "Paid" && hasDelivery && (
                  <button
                    className="outline-btn"
                    onClick={() => navigate("/app/deliveries")}
                  >
                    View tracking <Truck size={14} />
                  </button>
                )}
                {x.status === "Paid" && !inventory && (
                  <button
                    className="outline-btn"
                    onClick={() => navigate("/app/deliveries")}
                  >
                    Track delivery <Truck size={14} />
                  </button>
                )}
              </div>
            </article>
          );
        })}
        {!visible.length && (
          <div className="payment-empty">
            <WalletCards />
            <h3>No payment items yet</h3>
            <p>
              After the farmer accepts the price and the Inventory Manager gives
              final confirmation, the deal appears here.
            </p>
          </div>
        )}
      </div>
      </>}
      <div className="payment-section-head history-head">
        <div>
          <h2>{user.role === "buyer" ? "Your transaction history" : "Transaction history"}</h2>
          <p>Completed demo settlements and payment references.</p>
        </div>
      </div>
      <div className="transaction-table-wrap">
        <table>
          <thead>
            <tr>
              <th>TRANSACTION</th>
              <th>FISH / SUPPLIER</th>
              <th>PAYMENT METHOD</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visiblePayments.map((p) => (
              <tr key={p.id}>
                <td>
                  <b>{p.id}</b>
                  <small>
                    {new Date(p.paidAt).toLocaleDateString("en-IN")}
                  </small>
                </td>
                <td>
                  <b>{p.species}</b>
                  <small>
                    {p.supplier || p.buyerName || "Marketplace order"} · {p.quantity} kg
                  </small>
                </td>
                <td>{p.method}</td>
                <td>
                  <b>₹{Number(p.amount).toLocaleString("en-IN")}</b>
                </td>
                <td>
                  <span className="settled-label">
                    <CheckCircle2 size={14} /> Paid
                  </span>
                </td>
                <td>
                  <button className="receipt-btn" onClick={() => setReceipt(p)}>
                    Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visiblePayments.length && (
          <div className="transaction-empty">
            No completed transactions yet.
          </div>
        )}
      </div>
      {selectedOrder && (
        <Modal
          title="Complete marketplace order payment"
          onClose={() => setSelectedOrder(null)}
        >
          <div className="checkout-summary">
            <div>
              <span>{selectedOrder.id} · {selectedOrder.items.length} fish item(s)</span>
              <b>₹{orderTotal(selectedOrder).toLocaleString("en-IN")}</b>
            </div>
            <p>
              This demo payment covers the order being delivered to{" "}
              {selectedOrder.deliveryLocation}.
            </p>
          </div>
          <form className="form-grid payment-form" onSubmit={payBuyerOrder}>
            <label className="full-field">
              Payer name
              <input required value={payer} onChange={(e) => setPayer(e.target.value)} />
            </label>
            <label className="full-field">
              Payment method
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option>UPI</option>
                <option>Bank transfer</option>
                <option>Debit / Credit card</option>
                <option>Net banking</option>
              </select>
            </label>
            <label className="full-field">
              Demo transaction reference (optional)
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter UTR / payment reference"
              />
            </label>
            <div className="demo-payment-warning full-field">
              <ShieldCheck size={16} /> Demo mode only: no money is transferred;
              submitting records a simulated successful payment.
            </div>
            <button className="primary-btn full-field">
              <LockKeyhole size={15} /> Confirm demo payment · ₹
              {orderTotal(selectedOrder).toLocaleString("en-IN")}
            </button>
          </form>
        </Modal>
      )}
      {selected && (
        <Modal
          title="Complete supplier payment"
          onClose={() => setSelected(null)}
        >
          <div className="checkout-summary">
            <div>
              <span>
                {selected.species} · {selected.qty} kg
              </span>
              <b>
                ₹
                {(
                  +(selected.agreedPrice || selected.offer || selected.ask) *
                  selected.qty
                ).toLocaleString("en-IN")}
              </b>
            </div>
            <p>
              Agreed rate: ₹
              {selected.agreedPrice || selected.offer || selected.ask}/kg ·
              Supplier: {selected.supplier}
            </p>
          </div>
          <form className="form-grid payment-form" onSubmit={payNow}>
            <label className="full-field">
              Payer / organisation
              <input
                required
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
              />
            </label>
            <label className="full-field">
              Payment method
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option>UPI</option>
                <option>Bank transfer</option>
                <option>Debit / Credit card</option>
                <option>Net banking</option>
              </select>
            </label>
            <label className="full-field">
              Demo transaction reference (optional)
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter UTR / payment reference"
              />
            </label>
            <div className="demo-payment-warning full-field">
              <ShieldCheck size={16} /> Demonstration mode: no real money is
              transferred. Submitting records a simulated successful payment in
              this browser.
            </div>
            <button className="primary-btn full-field">
              <LockKeyhole size={15} /> Confirm demo payment · ₹
              {(
                +(selected.agreedPrice || selected.offer || selected.ask) *
                selected.qty
              ).toLocaleString("en-IN")}
            </button>
          </form>
        </Modal>
      )}
      {(assign || assignOrder) && (
        <Modal
          title="Assign delivery partner"
          onClose={() => {
            setAssign(null);
            setAssignOrder(null);
          }}
        >
          <div className="checkout-summary">
            <div>
              <span>
                {assignOrder
                  ? `${assignOrder.id} · ${assignOrder.items.length} fish item(s)`
                  : `${assign.species} · ${assign.qty} kg`}
              </span>
              <b>Paid</b>
            </div>
            <p>
              Payment is complete. Assign a delivery partner to transport the
              purchase to {assignOrder ? "the buyer's delivery address" : "the inventory receiving location"}.
            </p>
          </div>
          <form className="form-grid" onSubmit={assignPartner}>
            <label className="full-field">
              Delivery partner name
              <input
                required
                value={deliveryForm.driver}
                onChange={(e) =>
                  setDeliveryForm({ ...deliveryForm, driver: e.target.value })
                }
              />
            </label>
            <label>
              Partner phone
              <input
                required
                type="tel"
                value={deliveryForm.driverPhone}
                onChange={(e) =>
                  setDeliveryForm({
                    ...deliveryForm,
                    driverPhone: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Partner login email
              <input
                type="email"
                value={deliveryForm.driverEmail}
                onChange={(e) =>
                  setDeliveryForm({
                    ...deliveryForm,
                    driverEmail: e.target.value,
                  })
                }
              />
            </label>
            <label className="full-field">
              {assignOrder ? "Buyer delivery address" : "Inventory receiving address"}
              <input
                required
                value={deliveryForm.destination}
                onChange={(e) =>
                  setDeliveryForm({
                    ...deliveryForm,
                    destination: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Pickup date & time
              <input
                type="datetime-local"
                required
                value={deliveryForm.pickup}
                onChange={(e) =>
                  setDeliveryForm({ ...deliveryForm, pickup: e.target.value })
                }
              />
            </label>
            <label>
              Estimated arrival
              <input
                type="datetime-local"
                required
                value={deliveryForm.eta}
                onChange={(e) =>
                  setDeliveryForm({ ...deliveryForm, eta: e.target.value })
                }
              />
            </label>
            <label className="check-label full-field">
              <input
                type="checkbox"
                checked={deliveryForm.coldChain}
                onChange={(e) =>
                  setDeliveryForm({
                    ...deliveryForm,
                    coldChain: e.target.checked,
                  })
                }
              />{" "}
              Cold-chain transport required
            </label>
            <div className="demo-payment-warning full-field">
              <CalendarClock size={16} /> The buyer, delivery partner, and
              Inventory Manager can track the package in the Deliveries page.
            </div>
            <button className="primary-btn full-field">
              <Truck size={15} /> Confirm assignment
            </button>
          </form>
        </Modal>
      )}
      {receipt && (
        <Modal title="Payment receipt" onClose={() => setReceipt(null)}>
          <div className="receipt-panel">
            <div className="receipt-success">
              <CheckCircle2 />
              <b>Payment recorded successfully</b>
              <span>Demo transaction receipt</span>
            </div>
            <div className="receipt-amount">
              ₹{Number(receipt.amount).toLocaleString("en-IN")}
            </div>
            {[
              ["Transaction ID", receipt.id],
              ...(receipt.orderId ? [["Marketplace order", receipt.orderId]] : []),
              ["Fish / species", receipt.species],
              ["Supplier / sellers", receipt.supplier || "Marketplace order"],
              ["Quantity", receipt.quantity + " kg"],
              ["Agreed rate", receipt.pricePerKg ? "₹" + receipt.pricePerKg + "/kg" : "Included in order total"],
              ["Payment method", receipt.method],
              ["Reference", receipt.reference],
              ["Paid by", receipt.payer],
              ["Date", new Date(receipt.paidAt).toLocaleString("en-IN")],
            ].map(([a, b]) => (
              <div className="receipt-row" key={a}>
                <span>{a}</span>
                <b>{b}</b>
              </div>
            ))}
            <button
              className="primary-btn full-field"
              onClick={() => setReceipt(null)}
            >
              Done
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

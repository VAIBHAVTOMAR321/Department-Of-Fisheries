import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Truck,
  MapPin,
  Clock,
  Snowflake,
  UserRound,
  CheckCircle2,
  PackageCheck,
  Phone,
  Navigation,
  ClipboardList,
  IndianRupee,
} from "lucide-react";
import {
  getDeliveries,
  saveDeliveries,
  getOrders,
  saveOrders,
  getPayments,
  savePayments,
  getListings,
  saveListings,
} from "../utils/store";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import "./Operations.css";
import "./Deliveries.css";

const shipmentStages = [
  "Assigned",
  "Picked up",
  "In transit",
  "Out for delivery",
  "Delivered",
];
const supplierRoles = ["farmer", "hatchery", "dam", "contractor"];
export default function Deliveries() {
  const { user } = useOutletContext();
  const farmer = supplierRoles.includes(user.role);
  const deliveryRole = user.role === "delivery";
  const manager = ["admin", "inventory"].includes(user.role);
  const inventoryRole = user.role === "inventory";
  const buyerRole = user.role === "buyer";
  const [items, setItems] = useState(getDeliveries());
  const [activeDeliveryType, setActiveDeliveryType] = useState("buyer");
  const visible = useMemo(
    () =>
      items.filter(
        (x) =>
          manager ||
          (farmer
            ? String(x.supplier || "").split(", ").includes(user.name)
            : deliveryRole
              ? x.driver === user.name || x.driverEmail === user.email
              : buyerRole
                ? x.buyerEmail === user.email
                : false),
      ),
    [items, manager, farmer, deliveryRole, buyerRole, user.name, user.email],
  );
  const hasBuyerDeliveries = visible.some((item) => Boolean(item.orderId));
  const hasFarmerDeliveries = visible.some((item) => !item.orderId);
  const showDeliveryTabs = hasBuyerDeliveries && hasFarmerDeliveries;
  const displayedItems = showDeliveryTabs
    ? visible.filter((item) =>
        activeDeliveryType === "buyer" ? Boolean(item.orderId) : !item.orderId,
      )
    : visible;
  const update = (next) => {
    setItems(next);
    saveDeliveries(next);
  };
  const changeStage = (item, nextStage) => {
    if (nextStage === "COD received") {
      confirmCodReceived(item);
      return;
    }
    const recipientStage = item.orderId
      ? "Received by buyer"
      : "Received by inventory";
    const event = {
      status: nextStage,
      at: new Date().toISOString(),
      by: user.name,
      note:
        nextStage === "Delivered"
          ? "Delivery partner marked parcel delivered."
          : nextStage === recipientStage
            ? `${item.orderId ? "Buyer" : "Inventory Manager"} confirmed receipt of the parcel.`
            : `Shipment status updated to ${nextStage}.`,
    };
    update(
      items.map((x) =>
        x.id === item.id
          ? {
              ...x,
              status: nextStage,
              updatedAt: event.at,
              history: [...(x.history || []), event],
            }
          : x,
      ),
    );
    if (item.orderId) {
      const orders = getOrders().map((order) =>
        order.id === item.orderId
          ? {
              ...order,
              status: nextStage,
              deliveryStatus: nextStage,
              ...(nextStage === recipientStage ? { receivedAt: event.at } : {}),
            }
          : order,
      );
      saveOrders(orders);
    }
  };
  const confirmCodReceived = (item) => {
    if (
      !deliveryRole ||
      !item.orderId ||
      item.status !== "Delivered" ||
      item.paymentMethod !== "Cash on delivery" ||
      item.paymentStatus !== "COD pending"
    ) {
      return;
    }
    const paidAt = new Date().toISOString();
    const paymentId = "TXN-" + Date.now().toString().slice(-8);
    const event = {
      status: "COD received",
      at: paidAt,
      by: user.name,
      note: `Cash on delivery of ₹${Number(item.paymentAmount).toLocaleString("en-IN")} collected from ${item.buyerName} by ${user.name} at delivery.`,
    };
    const nextDeliveries = items.map((delivery) =>
      delivery.id === item.id
        ? {
            ...delivery,
            paymentStatus: "COD received",
            paymentId,
            paymentReceivedAt: paidAt,
            paymentReceivedBy: user.name,
            paymentReceiptStatus: "COD received",
            updatedAt: paidAt,
            history: [...(delivery.history || []), event],
          }
        : delivery,
    );
    update(nextDeliveries);
    const nextOrders = getOrders().map((order) =>
      order.id === item.orderId
        ? {
            ...order,
            paymentStatus: "COD received",
            paymentMethod: "Cash on delivery",
            paymentId,
            paidAt,
            paymentReceivedAt: paidAt,
            paymentReceivedBy: user.name,
            paymentReceiptStatus: "COD received",
          }
        : order,
    );
    saveOrders(nextOrders);
    const payments = getPayments();
    if (!payments.some((payment) => payment.orderId === item.orderId)) {
      savePayments([
        {
          id: paymentId,
          orderId: item.orderId,
          species: item.fish,
          supplier: item.supplier,
          quantity: item.paymentQuantity,
          amount: Number(item.paymentAmount),
          method: "Cash on delivery",
          reference: `COD-${item.id}`,
          payer: item.buyerName,
          buyerName: item.buyerName,
          buyerEmail: item.buyerEmail,
          paidAt,
          receivedBy: user.name,
          status: "Paid",
        },
        ...payments,
      ]);
    }
  };
  const confirmSupplierCodPaid = (item) => {
    if (
      !deliveryRole ||
      !item.listingId ||
      item.status !== "Picked up" ||
      item.paymentMethod !== "Cash on delivery" ||
      item.paymentStatus !== "COD pending"
    ) {
      return;
    }
    const paidAt = new Date().toISOString();
    const paymentId = "TXN-" + Date.now().toString().slice(-8);
    const event = {
      status: "Supplier COD paid",
      at: paidAt,
      by: user.name,
      note: `Delivery partner confirmed ₹${Number(item.paymentAmount).toLocaleString("en-IN")} cash paid to ${item.supplier} at pickup.`,
    };
    const nextDeliveries = items.map((delivery) =>
      delivery.id === item.id
        ? {
            ...delivery,
            paymentStatus: "COD received",
            paymentId,
            paymentReceivedAt: paidAt,
            paymentReceivedBy: user.name,
            updatedAt: paidAt,
            history: [...(delivery.history || []), event],
          }
        : delivery,
    );
    update(nextDeliveries);
    const nextListings = getListings().map((listing) =>
      String(listing.id) === String(item.listingId)
        ? {
            ...listing,
            status: "Paid",
            paymentStatus: "COD received",
            paymentId,
            paidAt,
            paymentReceivedAt: paidAt,
            paymentReceivedBy: user.name,
          }
        : listing,
    );
    saveListings(nextListings);
    const payments = getPayments();
    if (!payments.some((payment) => String(payment.listingId) === String(item.listingId))) {
      savePayments([
        {
          id: paymentId,
          listingId: item.listingId,
          species: item.fish,
          supplier: item.supplier,
          quantity: item.paymentQuantity,
          pricePerKg: item.paymentPricePerKg,
          amount: Number(item.paymentAmount),
          method: "Cash on delivery",
          reference: `COD-${item.id}`,
          payer: item.paymentPayer || "Inventory Manager",
          paidAt,
          receivedBy: item.supplier,
          collectedBy: user.name,
          status: "Paid",
        },
        ...payments,
      ]);
    }
  };
  return (
    <div className="ops-page delivery-page">
      <div className="page-heading">
        <div>
          <div className="welcome-kicker">LAST-MILE OPERATIONS</div>
          <h1>
            {buyerRole
              ? "My deliveries"
              : farmer
              ? "Track my delivery"
              : deliveryRole
                ? "My assigned shipments"
                : "Delivery tracking & management"}
          </h1>
          <p>
            {buyerRole
              ? "Follow your paid order from dispatch through delivery and confirm receipt."
              : farmer
              ? "Track your delivery partner, parcel journey and expected arrival date."
              : deliveryRole
                ? "Update shipment milestones as you move each parcel."
                : "Monitor assigned delivery partners and the complete shipment journey."}
          </p>
        </div>
      </div>
      {showDeliveryTabs && (
        <div className="delivery-type-tabs" role="tablist" aria-label="Delivery type">
          <button
            type="button"
            role="tab"
            aria-selected={activeDeliveryType === "buyer"}
            className={activeDeliveryType === "buyer" ? "active" : ""}
            onClick={() => setActiveDeliveryType("buyer")}
          >
            Buyer orders
            <span>{visible.filter((item) => item.orderId).length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeDeliveryType === "farmer"}
            className={activeDeliveryType === "farmer" ? "active" : ""}
            onClick={() => setActiveDeliveryType("farmer")}
          >
            Farmer orders
            <span>{visible.filter((item) => !item.orderId).length}</span>
          </button>
        </div>
      )}
      <div className="ops-summary">
        <div>
          <Truck />
          <b>{displayedItems.length}</b>
          <span>
            {showDeliveryTabs
              ? activeDeliveryType === "buyer"
                ? "Buyer order shipments"
                : "Farmer supply shipments"
              : buyerRole
                ? "Your deliveries"
                : farmer
                  ? "Your shipments"
                  : "Visible shipments"}
          </span>
        </div>
        <div>
          <Navigation />
          <b>
            {
              displayedItems.filter((x) =>
                ["In transit", "Out for delivery", "Picked up"].includes(
                  x.status,
                ),
              ).length
            }
          </b>
          <span>On the way</span>
        </div>
        <div>
          <CheckCircle2 />
          <b>
            {
              displayedItems.filter((x) =>
                ["Delivered", "Received by inventory", "Received by buyer"].includes(x.status),
              ).length
            }
          </b>
          <span>Delivered / received</span>
        </div>
      </div>
      <div className="delivery-list">
        {displayedItems.map((x) => {
          const recipientStage = x.orderId
            ? "Received by buyer"
            : "Received by inventory";
          const stages = [...shipmentStages, recipientStage];
          const terminalStage = recipientStage;
          const buyerCodAwaitingCollection =
            Boolean(x.orderId) &&
            x.paymentMethod === "Cash on delivery" &&
            x.paymentStatus === "COD pending";
          return (
          <article className="delivery-card tracking-card" key={x.id}>
            <div className="delivery-id">
              <div>
                <span>SHIPMENT ID</span>
                <b>{x.id}</b>
              </div>
              <StatusBadge status={x.status} />
            </div>
            <h3>{x.fish}</h3>
            <p className="delivery-flow-label">
              <b>{x.orderId ? "Buyer marketplace order" : "Farmer supply order"}</b>
              {x.orderId
                ? ` · ${x.orderId} · ${x.buyerName}`
                : x.listingId
                  ? ` · Listing ${x.listingId}`
                  : ""}
            </p>
            <div className="tracking-route">
              <div>
                <MapPin size={15} />
                <div>
                  <small>PICKUP FROM</small>
                  <b>{x.pickupLocation || x.supplier}</b>
                </div>
              </div>
              <div className="route-line">
                <i />
              </div>
              <div>
                <MapPin size={15} />
                <div>
                  <small>DELIVER TO</small>
                  <b>
                    {x.destination || x.supplierLocation || "Receiving location"}
                  </b>
                </div>
              </div>
            </div>
            <div className="tracking-info-grid">
              <div>
                <small>DELIVERY PARTNER</small>
                <b>
                  <UserRound size={14} />
                  {x.driver || "Not assigned"}
                </b>
              </div>
              <div>
                <small>CONTACT</small>
                <b>
                  <Phone size={14} />
                  {x.driverPhone || "Not provided"}
                </b>
              </div>
              {x.orderId && (
                <div>
                  <small>BUYER CONTACT</small>
                  <b>
                    <UserRound size={14} />
                    {x.buyerName} · {x.buyerPhone || x.buyerEmail}
                  </b>
                </div>
              )}
              <div>
                <small>ESTIMATED ARRIVAL</small>
                <b>
                  <Clock size={14} />
                  {x.eta
                    ? new Date(x.eta).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Not set"}
                </b>
              </div>
              <div>
                <small>TRANSPORT</small>
                <b>
                  <Snowflake size={14} />
                  {x.coldChain ? "Cold-chain enabled" : "Standard transport"}
                </b>
              </div>
              <div>
                <small>PAYMENT</small>
                <b>
                  <CheckCircle2 size={14} />
                  {x.paymentStatus || "Not recorded"}
                  {x.paymentMethod ? ` · ${x.paymentMethod}` : ""}
                  {x.paymentId ? ` · ${x.paymentId}` : ""}
                </b>
                {x.paymentStatus === "COD pending" && (
                  <small>
                    ₹{Number(x.paymentAmount).toLocaleString("en-IN")} due{" "}
                    {x.listingId ? "to supplier at pickup" : "at delivery"}
                  </small>
                )}
                {x.paymentStatus === "COD received" && (
                  <small>
                    Cash {x.listingId ? "paid to supplier" : "collected from buyer"} by{" "}
                    {x.paymentReceivedBy || "delivery partner"}
                    {x.paymentReceivedAt
                      ? ` · ${new Date(x.paymentReceivedAt).toLocaleString("en-IN")}`
                      : ""}
                  </small>
                )}
              </div>
            </div>
            <div className="tracking-progress">
              <div className="tracking-progress-head">
                <b>
                  <ClipboardList size={15} /> Shipment journey
                </b>
                <span>{x.status}</span>
              </div>
              <div className="tracking-timeline">
                {stages.map((stage, i) => {
                  const current = stages.indexOf(x.status);
                  const done = i <= current;
                  return (
                    <div
                      className={`tracking-stage ${done ? "done" : ""}`}
                      key={stage}
                    >
                      <i />
                      <span>{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {x.history?.length > 0 && (
              <div className="tracking-history">
                <b>Tracking updates</b>
                {[...x.history].reverse().map((h, i) => (
                  <div className="tracking-event" key={`${h.at}-${i}`}>
                    <i />
                    <div>
                      <b>{h.status}</b>
                      <span>{h.note || ""}</span>
                      <small>
                        {h.at
                          ? new Date(h.at).toLocaleString("en-IN")
                          : "Time not recorded"}{" "}
                        · {h.by || "System"}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="tracking-actions">
              {deliveryRole &&
                x.listingId &&
                x.paymentMethod === "Cash on delivery" &&
                x.paymentStatus === "COD pending" &&
                x.status === "Picked up" && (
                  <button
                    className="accept-btn"
                    onClick={() => confirmSupplierCodPaid(x)}
                  >
                    <IndianRupee size={15} /> Confirm supplier cash paid · ₹
                    {Number(x.paymentAmount).toLocaleString("en-IN")}
                  </button>
                )}
              {deliveryRole &&
                (x.status !== "Delivered" ||
                  (buyerCodAwaitingCollection && x.status === "Delivered")) &&
                x.status !== terminalStage && (
                <label>
                  {buyerCodAwaitingCollection && x.status === "Delivered"
                    ? "Update delivery / payment status"
                    : "Update shipment status"}
                  <select
                    value={x.status}
                    onChange={(e) => changeStage(x, e.target.value)}
                  >
                    {stages
                      .filter((s) => s !== terminalStage)
                      .map((s) => {
                        const supplierCashDue =
                          x.listingId &&
                          x.paymentMethod === "Cash on delivery" &&
                          x.paymentStatus === "COD pending";
                        const pickupIndex = shipmentStages.indexOf("Picked up");
                        const stageIndex = shipmentStages.indexOf(s);
                        return (
                          <option
                            key={s}
                            disabled={
                              supplierCashDue &&
                              stageIndex > pickupIndex
                            }
                          >
                            {s}
                          </option>
                        );
                      })}
                    {buyerCodAwaitingCollection && x.status === "Delivered" && (
                      <option value="COD received">
                        Confirm COD received · ₹
                        {Number(x.paymentAmount).toLocaleString("en-IN")}
                      </option>
                    )}
                  </select>
                  {buyerCodAwaitingCollection && x.status === "Delivered" && (
                    <span className="pending-note">
                      Select COD received after collecting cash from the buyer.
                    </span>
                  )}
                </label>
              )}
              {inventoryRole && !x.orderId && x.status === "Delivered" && (
                <button
                  className="accept-btn"
                  onClick={() => changeStage(x, "Received by inventory")}
                >
                  <PackageCheck size={15} /> Confirm inventory received
                </button>
              )}
              {inventoryRole &&
                !x.orderId &&
                x.status !== "Delivered" &&
                x.status !== terminalStage && (
                  <span className="pending-note">
                    Waiting for the delivery partner to mark the parcel delivered.
                  </span>
                )}
              {buyerRole && x.orderId && x.status === "Delivered" && (
                <button
                  className="accept-btn"
                  onClick={() => changeStage(x, "Received by buyer")}
                >
                  <PackageCheck size={15} /> Confirm order received
                </button>
              )}
              {buyerRole &&
                x.orderId &&
                x.status !== "Delivered" &&
                x.status !== terminalStage && (
                  <span className="pending-note">
                    Your order is being handled by the assigned delivery partner.
                  </span>
                )}
              {x.status === terminalStage && (
                <span className="received-confirmed">
                  <CheckCircle2 size={15} /> Receipt confirmed by {x.orderId ? "buyer" : "Inventory Manager"}
                </span>
              )}
              {manager && (
                <span className="manager-monitor-note">
                  Admin / Inventory monitoring enabled · Tracking history
                  retained
                </span>
              )}
            </div>
          </article>
          );
        })}
        {!visible.length && (
          <div className="empty-state">
            <div>🚚</div>
            <h3>No deliveries to show</h3>
            <p>
              {buyerRole
                ? "Paid marketplace orders will appear here after the Inventory Manager assigns a delivery partner."
                : farmer
                ? "Once payment is complete and a delivery partner is assigned, your shipment tracking will appear here."
                : deliveryRole
                  ? "No shipments are assigned to your account yet."
                  : "Paid orders will appear here after a delivery partner is assigned from the Payments page."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

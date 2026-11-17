import { initialDeliveries, initialListings } from "../data/seed";

const read = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export const getListings = () => {
  const rows = read("aqua_listings", initialListings);
  let changed = false;
  const migrated = rows.map((listing) => {
    if (listing.status === "Payment pending" && !listing.finalConfirmedAt) {
      changed = true;
      return {
        ...listing,
        status: "Farmer accepted",
        acceptedPrice: Number(
          listing.acceptedPrice || listing.agreedPrice || listing.offer || listing.ask,
        ),
      };
    }
    return listing;
  });
  if (changed) localStorage.setItem("aqua_listings", JSON.stringify(migrated));
  return migrated;
};

export const saveListings = (listings) =>
  localStorage.setItem("aqua_listings", JSON.stringify(listings));
export const getDeliveries = () => read("aqua_deliveries", initialDeliveries);
export const saveDeliveries = (deliveries) =>
  localStorage.setItem("aqua_deliveries", JSON.stringify(deliveries));
export const getUsers = () =>
  read("aqua_users", [
    { id: 1, name: "Rajesh Kumar", role: "farmer", email: "rajesh@demo.com", location: "Haridwar" },
    { id: 2, name: "Maa Ganga Hatchery", role: "hatchery", email: "hatchery@demo.com", location: "Rishikesh" },
    { id: 3, name: "Amit Singh", role: "dam", email: "amit@demo.com", location: "Tehri" },
    { id: 4, name: "Vikram Rawat", role: "delivery", email: "vikram@demo.com", location: "Dehradun" },
  ]);
export const saveUsers = (users) =>
  localStorage.setItem("aqua_users", JSON.stringify(users));
export const getPayments = () => read("aqua_payments", []);
export const savePayments = (payments) =>
  localStorage.setItem("aqua_payments", JSON.stringify(payments));
export const getOrders = () => read("aqua_orders", []);
export const saveOrders = (orders) =>
  localStorage.setItem("aqua_orders", JSON.stringify(orders));
export const getCart = () => read("aqua_cart", []);
export const saveCart = (cart) =>
  localStorage.setItem("aqua_cart", JSON.stringify(cart));
export const getContactRequests = () => read("aqua_contact_requests", []);
export const saveContactRequests = (requests) =>
  localStorage.setItem("aqua_contact_requests", JSON.stringify(requests));

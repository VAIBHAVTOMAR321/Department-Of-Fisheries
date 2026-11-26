# Department of Fisheries, Uttarakhand

A responsive React + Vite portal demonstration for freshwater fisheries in Uttarakhand. It includes a public information homepage and a local fisheries operations dashboard for fish listings, partners, negotiations and deliveries.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Demo workflow

1. Open **Login** or **Get Started** and choose a role. No password or backend is needed.
2. Browse fish from the public marketplace, add items to the basket and register as a buyer at checkout.
3. Checkout opens the buyer dashboard's **Payments** page. The buyer can record a simulated online payment or choose cash on delivery (COD).
4. The **Inventory Manager** can review payment status and assign delivery for online-paid or COD orders. The **Administrator** can monitor payments and delivery progress.
5. **Delivery Personnel** update shipment milestones and confirm COD cash collection at handoff. Buyers track shipments and confirm receipt; suppliers can also follow shipments for their fish.
6. To use the supply-deal workflow, sign in as **Fish Farmer**, **Hatchery Farmer**, **Dam Farmer** or **River Contractor** to add fish listings, then use the Inventory Manager dashboard to negotiate and manage deals.

## Demo roles

- Administrator
- Inventory Manager
- Fish Farmer
- Hatchery Farmer
- Dam Farmer
- River Contractor
- Delivery Personnel
- Fish Buyer

## Persistence and limitations

Listings, users, orders, payment records and delivery tracking are stored in browser `localStorage`. This is a static frontend demonstration: authentication and payments are simulated, data is local to the browser, and no real payment, messaging, GPS, API, server-side validation or live logistics integrations are connected. Use a backend, secure authentication and appropriate operational controls before production deployment.

## Project structure

```text
src/
  assets/
  components/       # Reusable UI components, each with its own CSS
  dashboards/       # Role-aware overview
  data/             # Demo seed data
  layouts/          # Dashboard shell and navigation
  pages/            # Homepage and marketplace operations pages
  styles/           # Small application-level base stylesheet
  utils/            # localStorage persistence helpers
```

## Supply-deal payment and delivery workflow

1. Fish Farmer submits a fish listing.
2. Inventory Manager starts price negotiation and sends an offer.
3. Fish Farmer accepts the offer or sends a counteroffer.
4. After farmer acceptance, the order status becomes `Farmer accepted`.
5. Only Admin / Inventory Manager can perform `Final confirm order` from Negotiations. This locks the agreed price and moves the deal to `Payment pending`.
6. Inventory Manager records payment in Payments. This project currently simulates payment in localStorage; it does not transfer real money.
7. After payment, Inventory Manager uses `Assign delivery partner` on the paid deal. Partner name, phone, email, destination, pickup time, estimated arrival and cold-chain requirement are recorded.
8. Farmer can view the delivery partner and ETA in Deliveries. Delivery Personnel can update shipment milestones: Assigned, Picked up, In transit, Out for delivery and Delivered.
9. Inventory Manager confirms receipt of the purchased fish. Admin and Inventory Manager can view the complete tracking history in Deliveries.

## Marketplace buyer order workflow

1. A buyer places an order from the public marketplace. Checkout registers the buyer and opens the Payments dashboard.
2. The buyer either completes a simulated online payment or selects COD. Online payments are recorded immediately; COD remains due until the delivery partner confirms collection.
3. Inventory Manager assigns a delivery partner to the buyer's delivery address. The assigned shipment appears in the buyer, supplier, Inventory Manager, Admin and delivery-personnel tracking views.
4. Delivery Personnel update the shipment through Delivered and confirm COD cash collection when applicable. The buyer confirms receipt, and payment and delivery statuses are reflected in the order history.

All workflow data is stored in browser localStorage for this demo. A production deployment should move users, listings, payments, delivery assignments and tracking events to authenticated backend APIs, and integrate a real payment gateway and carrier tracking service.

import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { health, sendEvent } from "./api";

function Page({ title, sessionId, setBackendState }) {
  useEffect(() => {
    // Send page view event
    sendEvent(sessionId, "PAGE_VIEW", { page: title })
      .then(setBackendState)
      .catch((e) => console.error("PAGE_VIEW error", e));
  }, [title, sessionId, setBackendState]);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>{title}</h1>
      <p>Try: Devices → click “View Device” → Compare twice → Add to cart → Checkout.</p>
    </div>
  );
}

function RightPanel({ backendState }) {
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>AI Sales Copilot</h3>
      <div style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.4 }}>
        {backendState?.message || "Waiting for events..."}
      </div>

      <hr style={{ opacity: 0.25, margin: "14px 0" }} />

      <h3>Agent Monitor</h3>
      {backendState?.agent_logs?.length ? (
        backendState.agent_logs.map((a, idx) => (
          <div key={idx} style={{ marginBottom: 12, border: "1px solid #1d2b4a", borderRadius: 10, padding: 10 }}>
            <div style={{ fontWeight: 700 }}>{a.agent}</div>
            <pre style={{ margin: 0, fontSize: 12, overflowX: "auto" }}>
              {JSON.stringify(a, null, 2)}
            </pre>
          </div>
        ))
      ) : (
        <div style={{ fontSize: 13, opacity: 0.8 }}>No agents triggered yet.</div>
      )}
    </div>
  );
}

function Nav() {
  return (
    <div style={{ padding: 16, borderBottom: "1px solid #1d2b4a" }}>
      <Link style={{ color: "white", marginRight: 12 }} to="/">Home</Link>
      <Link style={{ color: "white", marginRight: 12 }} to="/devices">Devices</Link>
      <Link style={{ color: "white", marginRight: 12 }} to="/plans">Plans</Link>
      <Link style={{ color: "white", marginRight: 12 }} to="/cart">Cart</Link>
      <Link style={{ color: "white" }} to="/checkout">Checkout</Link>
    </div>
  );
}

function Shell({ children, backendState }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ flex: 3 }}>
        <Nav />
        {children}
      </div>
      <div style={{ flex: 1, background: "#111827", borderLeft: "1px solid #1d2b4a" }}>
        <RightPanel backendState={backendState} />
      </div>
    </div>
  );
}

export default function App() {
  const sessionId = useMemo(() => "sess-" + Math.random().toString(16).slice(2), []);
  const [backendState, setBackendState] = useState(null);

  useEffect(() => {
    health()
      .then((x) => console.log("Backend health:", x))
      .catch((e) => console.error("Backend not reachable:", e));
  }, []);

  return (
    <BrowserRouter>
      <Shell backendState={backendState}>
        <Routes>
          <Route path="/" element={<Page title="HOME" sessionId={sessionId} setBackendState={setBackendState} />} />
          <Route path="/devices" element={<DevicesPage sessionId={sessionId} setBackendState={setBackendState} />} />
          <Route path="/plans" element={<Page title="PLANS" sessionId={sessionId} setBackendState={setBackendState} />} />
          <Route path="/cart" element={<Page title="CART" sessionId={sessionId} setBackendState={setBackendState} />} />
          <Route path="/checkout" element={<CheckoutPage sessionId={sessionId} setBackendState={setBackendState} />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}

/** Devices page with actions that trigger agents */
function DevicesPage({ sessionId, setBackendState }) {
  const viewDevice = async (id) => {
    const data = await sendEvent(sessionId, "DEVICE_VIEW", { id });
    setBackendState(data);
  };

  const compare = async () => {
    const data = await sendEvent(sessionId, "COMPARE", {});
    setBackendState(data);
  };

  const addToCart = async () => {
    const data = await sendEvent(sessionId, "ADD_TO_CART", { id: "iphone_17_pro" });
    setBackendState(data);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Devices</h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button onClick={() => viewDevice("iphone_17_pro")}>View iPhone 17 Pro</button>
        <button onClick={() => viewDevice("galaxy_s26_ultra")}>View Galaxy S26 Ultra</button>
        <button onClick={compare}>Compare</button>
        <button onClick={compare}>Compare Again</button>
        <button onClick={addToCart}>Add Recommended to Cart</button>
      </div>

      <p style={{ marginTop: 18, opacity: 0.85 }}>
        Click Compare twice → intent should shift to UPGRADE and Copilot message changes.
      </p>
    </div>
  );
}

function CheckoutPage({ sessionId, setBackendState }) {
  const startCheckout = async () => {
    const data = await sendEvent(sessionId, "CHECKOUT", {});
    setBackendState(data);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Checkout</h1>
      <button onClick={startCheckout}>Start Checkout</button>
      <p style={{ marginTop: 14, opacity: 0.85 }}>
        Checkout triggers CheckoutAgent. If you want “hesitation”, we’ll add IDLE event next.
      </p>
    </div>
  );
}
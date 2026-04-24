import React from "react";
import { Link } from "react-router-dom";
import CopilotPanel from "./CopilotPanel";
import AgentMonitor from "./AgentMonitor";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 3, padding: 20 }}>
        <nav style={{ marginBottom: 20 }}>
          <Link to="/">Home</Link> |{" "}
          <Link to="/devices">Devices</Link> |{" "}
          <Link to="/plans">Plans</Link> |{" "}
          <Link to="/cart">Cart</Link> |{" "}
          <Link to="/checkout">Checkout</Link>
        </nav>

        {children}
      </div>

      <div style={{ flex: 1, padding: 20, background: "#111827" }}>
        <CopilotPanel />
        <AgentMonitor />
      </div>
    </div>
  );
}
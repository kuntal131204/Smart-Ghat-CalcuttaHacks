import React, { useEffect, useState, useRef } from "react";
import LiveChart from "./LiveChart";
import Logo from "./Logo";


const API_URL = "http://localhost:5000/data"; // backend

export default function App() {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        setData(json);
        if (json && json.length) setLatest(json[json.length - 1]);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
    intervalRef.current = setInterval(fetchData, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const timestamps = data.map((d) => new Date(d.time).toLocaleTimeString());
  const pH = data.map((d) => d.pH);
  const turb = data.map((d) => d.turbidity);

  return (
    <div className="container">
  <header className="app-header">
    <div className="app-banner">
      <div className="logo-wrap">
       <Logo size={44} />
       </div>
      <div>
        <h1>Smart Ghat — Live Dashboard</h1>
        <p className="subtitle">Realtime simulated readings from ghats</p>
        <p className="tagline">
          Empowering heritage through smart water monitoring 🌊
        </p>

      </div>
    </div>
  </header>

{/* Live connection + last updated indicator */}
<div className="status-bar">
  <div className={`status-led ${data.length ? "on" : "off"}`}></div>
  <span className="status-text">
    {data.length
      ? `Live Connection • Last updated: ${new Date().toLocaleTimeString()}`
      : "Waiting for data..."}
  </span>
</div>

      <section className="cards">
        <div className="card">
          <h3>Latest Ghat</h3>
          <p className="large">{latest ? latest.ghat : "—"}</p>
        </div>

        <div className="card">
          <h3>Water pH</h3>
          <p className={`large ${latest && (latest.pH < 6.8 || latest.pH > 8.5 ? "bad" : "good")}`}>
            {latest ? latest.pH : "—"}
          </p>
          <small>Safe ~6.8–8.5</small>
        </div>

        <div className="card">
          <h3>Turbidity (NTU)</h3>
          <p className={`large ${latest && latest.turbidity > 70 ? "bad" : "good"}`}>
            {latest ? latest.turbidity : "—"}
          </p>
          <small>Lower is cleaner</small>
        </div>

        <div className="card">
          <h3>Lighting</h3>
          <p className={`large ${latest && latest.lighting === "ON" ? "good" : "bad"}`}>
            {latest ? latest.lighting : "—"}
          </p>
          <small>Night lighting status</small>
        </div>
      </section>

      <section className="chart-section">
        <LiveChart labels={timestamps} pH={pH} turbidity={turb} />
      </section>

      <section className="feed">
        <h3>Recent Readings</h3>
        <ul>
          {data.slice().reverse().map((d, i) => (
            <li key={i}>
              <strong>{new Date(d.time).toLocaleTimeString()}</strong> — {d.ghat} — pH: {d.pH} —
              turbidity: {d.turbidity} — lighting: {d.lighting}
            </li>
          ))}
        </ul>
      </section>

      <footer>
        <small>Backend: http://localhost:5000</small>
      </footer>
    </div>
  );
}

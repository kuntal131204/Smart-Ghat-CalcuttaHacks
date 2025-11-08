// frontend/src/CitizenPortal.jsx
import React, { useEffect, useState, useRef } from "react";
import { FiCamera, FiMapPin, FiUpload } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Adjust if your backend is on LAN or deployed
const API_BASE = "http://localhost:5000";

export default function CitizenPortal() {
  const [ghatData, setGhatData] = useState([]);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    name: "",
    message: "",
    category: "Cleanliness",
    urgency: "Medium",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [coords, setCoords] = useState(null);
  const inputRef = useRef();

  useEffect(() => {
    fetch(`${API_BASE}/data`).then((r) => r.json()).then((d) => setGhatData(d.slice(-5)));
    fetch(`${API_BASE}/feedback`).then((r) => r.json()).then((d) => setReports(d || []));
  }, []);

  // Try to auto-get geolocation
  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.info("Geolocation not supported. You can still submit without location.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCoords({ lat: p.coords.latitude, lng: p.coords.longitude });
        toast.success("Location captured ✓");
      },
      (err) => {
        console.warn(err);
        toast.error("Could not get location (permission denied or unavailable).");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // file selection
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return setFile(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // submit handler (multipart/form-data)
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!form.name || !form.message) {
      toast.error("Please add your name and a short message.");
      return;
    }

    setSending(true);

    // build form data
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("message", form.message);
    fd.append("category", form.category);
    fd.append("urgency", form.urgency);
    if (coords) {
      fd.append("lat", coords.lat);
      fd.append("lng", coords.lng);
    }
    if (file) fd.append("image", file);

    // optimistic UI
    const optimistic = {
      id: "temp-" + Date.now(),
      name: form.name,
      message: form.message,
      category: form.category,
      urgency: form.urgency,
      image: preview ? preview : null,
      time: new Date().toISOString(),
      pending: true,
    };
    setReports((s) => [optimistic, ...s]);
    setForm({ name: "", message: "", category: "Cleanliness", urgency: "Medium" });
    setFile(null);
    setPreview(null);

    try {
      const res = await fetch(`${API_BASE}/feedback`, { method: "POST", body: fd });
      const data = await res.json();
      // replace optimistic with server response
      setReports((s) => [data.feedback, ...s.filter((r) => r.id !== optimistic.id)]);
      toast.success("Report submitted. Thank you!");
    } catch (e) {
      console.error(e);
      // mark optimistic failed
      setReports((s) => s.map((r) => (r.id === optimistic.id ? { ...r, failed: true } : r)));
      toast.error("Failed to send report. Check connection.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="citizen-page container">
      <ToastContainer position="top-right" theme="dark" />
      <div className="citizen-top">
        <div>
          <h2>🌊 Citizen Portal</h2>
          <p className="subtitle">See ghat health and quickly report issues with photo & location.</p>
        </div>

        <div className="quick-stats">
          <div className="stat">
            <div className="stat-val">{ghatData[ghatData.length-1]?.ghat ?? "—"}</div>
            <div className="stat-label">Latest Ghat</div>
          </div>
          <div className="stat">
            <div className="stat-val">{ghatData[ghatData.length-1]?.pH ?? "—"}</div>
            <div className="stat-label">pH</div>
          </div>
          <div className="stat">
            <div className="stat-val">{ghatData[ghatData.length-1]?.turbidity ?? "—"}</div>
            <div className="stat-label">Turbidity</div>
          </div>
        </div>
      </div>

      <div className="report-panel">
        <form onSubmit={handleSubmit} className="report-form">
          <div className="row">
            <input
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Cleanliness</option>
              <option>Blocked Drain</option>
              <option>Lighting</option>
              <option>Water Pollution</option>
              <option>Other</option>
            </select>
          </div>

          <textarea
            placeholder="Describe the issue briefly (what/where/why)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={3}
          />

          <div className="row controls">
            <label className="file-btn">
              <FiCamera /> {file ? "Change Photo" : "Add Photo"}
              <input ref={inputRef} type="file" accept="image/*" capture="environment" onChange={onFile} />
            </label>

            <button type="button" className="loc-btn" onClick={captureLocation}>
              <FiMapPin /> {coords ? "Location Captured" : "Capture Location"}
            </button>

            <select className="urgency" value={form.urgency} onChange={(e)=>setForm({...form, urgency: e.target.value})}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <button className="submit-btn" disabled={sending} type="submit">
              {sending ? "Sending..." : <><FiUpload /> Submit</>}
            </button>
          </div>

          {preview && (
            <div className="preview">
              <img src={preview} alt="preview" />
            </div>
          )}
        </form>

        <div className="reports-list">
          <h3>Recent Reports</h3>
          {reports.length === 0 && <p className="muted">No reports yet — be the first to report.</p>}
          {reports.map((r) => (
            <div key={r.id} className={`report-card ${r.pending ? "pending" : ""} ${r.failed ? "failed" : ""}`}>
              <div className="report-meta">
                <strong>{r.name}</strong>
                <span className="time">{new Date(r.time).toLocaleString()}</span>
              </div>
              <div className="report-body">
                <div className="tag">{r.category} • {r.urgency}</div>
                <p>{r.message}</p>
                {r.image && <img src={r.image.startsWith("http") ? r.image : `${API_BASE}${r.image}`} alt="rep" />}
                {r.pending && <div className="pending-pill">Sending…</div>}
                {r.failed && <div className="failed-pill">Failed — retry later</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

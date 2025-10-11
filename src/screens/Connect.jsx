// src/screens/Connect.jsx
import { useEffect, useState } from "react";

export default function Connect() {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Waiting for connection...");
  const [checks, setChecks] = useState({ wifi: false, portal: false });
  const [isOnline, setIsOnline] = useState(true);

  async function pingInternetOnce(timeoutMs = 1000) {
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), timeoutMs);
      const res = await fetch(`/api/ping?t=${Date.now()}`, {
        method: "GET",
        mode: "cors",
        signal: ctrl.signal,
      });
      clearTimeout(to);
      return res.status === 204; // 204 = online
    } catch {
      return false; // offline
    }
  }

  // continuously update online status
  useEffect(() => {
    let active = true;
    async function loop() {
      while (active) {
        const online = await pingInternetOnce();
        setIsOnline(online);
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
    loop();
    return () => {
      active = false;
    };
  }, []);

  // react to checkbox changes
  useEffect(() => {
    async function evaluate() {
      const allChecked = checks.wifi && checks.portal;
      if (!allChecked) {
        setIsConnected(false);
        setStatus("Waiting for connection...");
        return;
      }
      if (allChecked && !isOnline) {
        setTimeout(() => {
          setIsConnected(true);
          setStatus("Connected! ✅");
        }, 1000);
      } else if (allChecked && isOnline) {
        setTimeout(() => {
          setStatus(
            "⚠️ Connection problem. Forget the network “floto_cam” and retry the steps again"
          );
          setChecks({ wifi: false, portal: false });
          setIsConnected(false);
        }, 1000);
      }
    }
    evaluate();
  }, [checks, isOnline]);

  function toggle(key) {
    setChecks((c) => ({ ...c, [key]: !c[key] }));
  }

  return (
    <main style={styles.wrap}>
      <section style={styles.card}>
        <h1 style={styles.h1}>Connect to Camera</h1>
        <img
          src="/assets/wifi.png"
          alt="Wi-Fi instructions"
          style={styles.img}
        />
        <p style={styles.intro}>Check the following steps after you complete them:</p>
        <ul style={styles.list}>
          <li style={styles.item}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={checks.wifi}
                onChange={() => toggle("wifi")}
              />{" "}
              Go to your Wi-Fi settings and select the Wi-Fi: <b>floto_cam</b>.
            </label>
          </li>
          <li style={styles.item}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={checks.portal}
                onChange={() => toggle("portal")}
              />{" "}
              <b>Wait 5–10 s for a captive portal to launch.</b> Then, tap “Cancel” → “Use without
              Internet”.
            </label>
          </li>
        </ul>

        <p style={styles.status}>{status}</p>

        {isConnected && (
          <div style={styles.ctaRow}>
            <button
              onClick={() => window.open("http://floto.cam", "_blank")}
              style={styles.btn}
            >
              Launch Camera App
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#fafafa",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    padding: 16,
  },
  card: {
    width: "min(720px,92vw)",
    background: "#fff",
    color: "#000",
    borderRadius: 16,
    boxShadow: "0 8px 30px rgba(0,0,0,.06)",
    padding: 24,
  },
  h1: { marginTop: 0, marginBottom: 12 },
  img: {
    width: "100%",
    height: "auto",
    maxHeight: "60vh",
    borderRadius: 12,
    border: "1px solid #eee",
    marginBottom: 16,
    objectFit: "contain",
  },
  intro: { fontWeight: 500, marginBottom: 8 },
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: { margin: "8px 0" },
  label: { cursor: "pointer", lineHeight: 1.5 },
  status: { color: "#444", fontSize: 14, textAlign: "center", marginTop: 12 },
  ctaRow: { display: "grid", placeItems: "center", marginTop: 16 },
  btn: {
    padding: "12px 18px",
    border: 0,
    borderRadius: 8,
    background: "#000",
    color: "#fff",
    cursor: "pointer",
    minWidth: 220,
  },
};

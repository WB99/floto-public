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
      return res.status === 204; // online
    } catch {
      return false; // offline
    }
  }

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
          setIsConnected(false);
          setTimeout(() => {
            setChecks({ wifi: false, portal: false });
            setStatus("Waiting for connection...");
          }, 5000);
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
        <h2 style={styles.h2}>Connect to Camera</h2>

        <div style={styles.imgBox}>
          <img
            src="/assets/wifi.png"
            alt="Wi-Fi instructions"
            style={styles.img}
          />
        </div>

        <div style={styles.switcher}>
          {/* Checklist section */}
          <div
            style={{
              ...styles.sectionLayer,
              opacity: isConnected ? 0 : 1,
              pointerEvents: isConnected ? "none" : "auto",
            }}
          >
            <p style={styles.intro}>
              Check the following steps after you complete them:
            </p>
            <ul style={styles.list}>
              <li style={styles.item}>
                <label style={styles.label}>
                  <input
                    type="checkbox"
                    checked={checks.wifi}
                    onChange={() => toggle("wifi")}
                    style={styles.checkbox}
                  />{" "}
                  1. Go to your Wi-Fi settings and select the Wi-Fi:{" "}
                  <b>floto_cam</b>.
                </label>
              </li>
              <li style={styles.item}>
                <label style={styles.label}>
                  <input
                    type="checkbox"
                    checked={checks.portal}
                    onChange={() => toggle("portal")}
                    style={styles.checkbox}
                  />{" "}
                  2. <b>Wait 5–10 s for a captive portal to launch.</b> Then,
                  tap “Cancel” → “Use without Internet”.
                </label>
              </li>
            </ul>

            {/* Default status */}
            <div style={styles.statusBox}>
              <p style={styles.status}>{status}</p>
            </div>
          </div>

          {/* Launch button section */}
          <div
            style={{
              ...styles.sectionLayer,
              opacity: isConnected ? 1 : 0,
              pointerEvents: isConnected ? "auto" : "none",
            }}
          >
            <div style={styles.ctaColumn}>
              <p style={styles.statusConnected}>{status}</p>
              <button
                onClick={() => window.open("http://floto.cam", "_blank")}
                style={styles.btn}
              >
                Launch Camera App
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    width: "100vw",
    overflowX: "hidden",
    display: "grid",
    placeItems: "center",
    background: "#fafafa",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    padding: "4vw",
    boxSizing: "border-box",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: 720,
    background: "#fff",
    color: "#000",
    borderRadius: 16,
    boxShadow: "0 8px 30px rgba(0,0,0,.06)",
    padding: "8vw 6vw", // extra vertical padding
    boxSizing: "border-box",
    overflow: "visible", // ensure text never clips
  },
  h2: { marginTop: 0, marginBottom: 16 },
  imgBox: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 12,
    marginBottom: 20,
  },
  img: {
    width: "100%",
    height: "auto",
    maxHeight: "38vh", // reduced size, 25% smaller
    display: "block",
    border: "1px solid #eee",
    objectFit: "contain",
  },
  switcher: {
    position: "relative",
    minHeight: 280, // more breathing room to prevent clipping
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    transition: "opacity 0.35s ease",
  },
  intro: { fontWeight: 500, marginBottom: 8 },
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: { margin: "8px 0" },
  label: { cursor: "pointer", lineHeight: 1.5 },
  checkbox: {
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    width: 18,
    height: 18,
    border: "1.5px solid #ccc",
    borderRadius: 4,
    background: "#fff",
    display: "inline-block",
    verticalAlign: "middle",
    position: "relative",
    marginRight: 6,
  },
  statusBox: {
    marginTop: 28,
    marginBottom: 60, // large padding so text never touches bottom edge
    width: "100%",
    textAlign: "center",
  },
  status: {
    color: "#444",
    fontSize: 14,
    textAlign: "center",
  },
  ctaColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    paddingTop: 20,
    paddingBottom: 60, // ensure enough bottom space for longer warning text
  },
  statusConnected: {
    color: "#444",
    fontSize: 15,
    fontWeight: 500,
    textAlign: "center",
  },
  btn: {
    padding: "14px 20px",
    border: 0,
    borderRadius: 8,
    background: "#000",
    color: "#fff",
    cursor: "pointer",
    minWidth: 240,
    fontSize: 16,
    display: "block",
    margin: "0 auto",
  },
};

// add checkmark indicator for styled checkboxes
const styleTag = document.createElement("style");
styleTag.innerHTML = `
input[type="checkbox"][style]::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 5px;
  width: 4px;
  height: 9px;
  border: solid #000;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
}
input[type="checkbox"][style]:checked::after {
  opacity: 1;
}
`;
document.head.appendChild(styleTag);

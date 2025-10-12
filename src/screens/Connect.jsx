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
      return res.status === 204;
    } catch {
      return false;
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
  }, [checks, isOnline]);

  function toggle(key) {
    setChecks((c) => ({ ...c, [key]: !c[key] }));
  }

  return (
    <main style={styles.wrap}>
      <section style={styles.card}>
        <div style={styles.inner}>
          <h2 style={styles.h2}>Connect to Camera</h2>

          <div style={styles.imgBox}>
            <img
              src="/assets/wifi.png"
              alt="Wi-Fi instructions"
              style={styles.img}
            />
          </div>

          <div style={styles.content}>
            {!isConnected ? (
              <>
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
                <p style={styles.status}>{status}</p>
              </>
            ) : (
              <div style={styles.ctaColumn}>
                <p style={styles.statusConnected}>{status}</p>
                <button
                  onClick={() => window.open("http://floto.cam", "_blank")}
                  style={styles.btn}
                >
                  Launch Camera App
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  wrap: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fafafa",
    overflow: "hidden",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    color: "#000",
  },
  card: {
    width: "92vw",
    height: "88vh",
    background: "#fff",
    color: "#000",
    borderRadius: 20,
    boxShadow: "0 8px 30px rgba(0,0,0,.06)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "4vw",
    boxSizing: "border-box",
    color: "#000",
  },
  h2: {
    fontSize: "clamp(20px, 4vw, 26px)",
    margin: 0,
    textAlign: "left",
    color: "#000",
  },
  imgBox: {
    width: "100%",
    flex: "0 0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: "100%",
    height: "auto",
    maxHeight: "32vh",
    objectFit: "contain",
    borderRadius: 12,
    border: "1px solid #eee",
  },
  content: {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "left",
    color: "#000",
  },
  intro: {
    fontWeight: 500,
    fontSize: "clamp(13px, 3vw, 15px)",
    marginBottom: "2vw",
    color: "#000",
  },
  list: { listStyle: "none", padding: 0, margin: 0, color: "#000" },
  item: { margin: "1.6vw 0" },
  label: {
    cursor: "pointer",
    lineHeight: 1.5,
    fontSize: "clamp(13px, 3vw, 15px)",
    color: "#000",
  },
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
  status: {
    marginTop: "3vh",
    textAlign: "center",
    color: "#444",
    fontSize: "clamp(13px, 2.8vw, 15px)",
  },
  ctaColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2.5vh",
    color: "#000",
  },
  statusConnected: {
    color: "#000",
    fontSize: "clamp(14px, 3vw, 16px)",
    fontWeight: 500,
    textAlign: "center",
  },
  btn: {
    padding: "12px 18px",
    border: 0,
    borderRadius: 8,
    background: "#000",
    color: "#fff", // keep text white for contrast
    cursor: "pointer",
    minWidth: 200,
    fontSize: "clamp(14px, 3vw, 16px)",
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
* { color: #000 !important; }
button, button * { color: #fff !important; } /* preserve white text inside black buttons */
html, body { background: #fafafa !important; }
`;
document.head.appendChild(styleTag);

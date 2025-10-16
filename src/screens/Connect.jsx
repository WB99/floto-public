// src/screens/Connect.jsx
import { useEffect, useState } from "react";

export default function Connect() {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState("Waiting for connection...");
  const [checks, setChecks] = useState({ wifi: false, portal: false });
  const [isOnline, setIsOnline] = useState(true);
  const [platform, setPlatform] = useState("ios");

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

  function renderInstructions() {
    const StepsBlock = (
      <>
        <p style={styles.intro}>Check the following steps after you complete them:</p>
        <ul style={styles.list}>
          <li style={styles.item}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={checks.wifi}
                onChange={() => toggle("wifi")}
                style={styles.checkbox}
              />{" "}
              {platform === "ios"
                ? (
                    <>
                      1. Go to your Wi-Fi settings and select the Wi-Fi: <b>floto_cam</b>.
                    </>
                  )
                : "1. Android instructions placeholder – step 1."}
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
              {platform === "ios"
                ? (
                    <>
                      2. <b>Wait 5–10 s for a captive portal to launch.</b> Then, tap
                      “Cancel” → “Use without Internet”.
                    </>
                  )
                : "2. Android instructions placeholder – step 2."}
            </label>
          </li>
        </ul>
        <div style={styles.statusBox}>
          <p style={styles.status}>{status}</p>
        </div>
      </>
    );

    const ConnectedBlock = (
      <div style={styles.ctaColumn}>
        <p style={styles.statusConnected}>{status}</p>
        <button
          id="launchBtn"
          onClick={() => window.open("http://floto.cam", "_blank")}
          style={styles.btn}
        >
          Launch Camera App
        </button>
      </div>
    );

    return (
      <>
        <div style={styles.imgBox}>
          <div style={styles.imgRow}>
            <img
              src="/assets/ios-wifi-1.png"
              alt="Wi-Fi step 1"
              style={styles.dualImg}
            />
            <img
              src="/assets/ios-wifi-2.png"
              alt="Wi-Fi step 2"
              style={styles.dualImg}
            />
          </div>
        </div>
        <div style={styles.content}>{!isConnected ? StepsBlock : ConnectedBlock}</div>
      </>
    );
  }

  return (
    <main style={styles.wrap}>
      <section style={styles.card}>
        <div style={styles.inner}>
          <h2 style={styles.h2}>📷 Connect to Camera</h2>
          <p style={styles.subtext}>Select your OS</p>

          <div style={styles.segmentedWrapper}>
            <div style={styles.segmented}>
              <button
                className={`seg-btn ${platform === "ios" ? "active" : ""}`}
                onClick={() => setPlatform("ios")}
                style={styles.segment}
              >
                iOS
              </button>
              <button
                className={`seg-btn ${platform === "android" ? "active" : ""}`}
                onClick={() => setPlatform("android")}
                style={styles.segment}
              >
                Android
              </button>
            </div>
          </div>

          {renderInstructions()}
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
    alignItems: "flex-start",
    background: "#fafafa",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    color: "#000",
    paddingTop: "2vh",
  },
  card: {
    width: "94vw",
    height: "94vh",
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
    justifyContent: "flex-start",
    padding: "3.5vw",
    boxSizing: "border-box",
  },
  h2: {
    fontSize: "clamp(20px, 4.5vw, 28px)",
    margin: 0,
    textAlign: "center",
  },
  subtext: {
    fontSize: "clamp(12px, 3vw, 14px)",
    fontWeight: 700,
    marginTop: "0.3vh",
    marginBottom: "0.6vh",
    textAlign: "center",
  },
  segmentedWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "0.6vh",
  },
  segmented: {
    display: "flex",
    width: "170px",
    borderRadius: 10,
    border: "1.5px solid #000",
    overflow: "hidden",
  },
  segment: {
    flex: 1,
    padding: "6px 0",
    background: "#fff",
    border: "none",
    fontSize: "clamp(12px, 2.9vw, 14px)",
    color: "#000",
    cursor: "pointer",
    fontWeight: 700,
    textAlign: "center",
  },
  imgBox: {
    width: "100%",
    flex: "0 0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "0.6vh",
    paddingBottom: "0.2vh",
  },
  imgRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1vw",
    width: "100%",
    height: "100%",
  },
  dualImg: {
    width: "48%",
    height: "auto",
    maxHeight: "50vh",
    objectFit: "contain",
    borderRadius: 12,
    border: "1px solid #eee",
  },
  content: {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "left",
    marginTop: "0.4vh",
  },
  intro: {
    fontWeight: 700,
    fontSize: "clamp(14px, 3.4vw, 16px)",
    marginBottom: "2vw",
  },
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: { margin: "1.3vw 0" },
  label: {
    cursor: "pointer",
    lineHeight: 1.5,
    fontSize: "clamp(14px, 3.4vw, 16px)",
  },
  checkbox: {
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    width: 18,
    height: 18,
    border: "1.5px solid #ccc",
    borderRadius: 5,
    background: "#fff",
    display: "inline-block",
    verticalAlign: "middle",
    position: "relative",
    marginRight: 8,
  },
  statusBox: {
    minHeight: 26,
    display: "grid",
    placeItems: "center",
    marginTop: "1.4vh",
  },
  status: {
    textAlign: "center",
    color: "#444",
    fontSize: "clamp(14px, 3.2vw, 16px)",
    margin: 0,
  },
  ctaColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.2vh",
    marginTop: "1vh",
  },
  statusConnected: {
    color: "#000",
    fontSize: "clamp(15px, 3.4vw, 17px)",
    fontWeight: 700,
    textAlign: "center",
    margin: 0,
  },
  btn: {
    padding: "12px 20px",
    border: 0,
    borderRadius: 10,
    background: "#000",
    color: "#fff",
    cursor: "pointer",
    minWidth: 200,
    fontSize: "clamp(15px, 3.4vw, 17px)",
  },
};

const styleTag = document.createElement("style");
styleTag.innerHTML = `
.seg-btn.active { background:#000 !important; color:#fff !important; }
#launchBtn, #launchBtn * { color:#fff !important; }
input[type="checkbox"][style]::after {
  content:""; position:absolute; top:2px; left:6px; width:5px; height:10px;
  border:solid #000; border-width:0 2px 2px 0; transform:rotate(45deg); opacity:0;
}
input[type="checkbox"][style]:checked::after { opacity:1; }
html,body { background:#fafafa; margin:0; padding:0; overflow:hidden; }
`;
document.head.appendChild(styleTag);

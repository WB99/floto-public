import { useEffect, useState } from "react";

export default function Connect() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let active = true;

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
        // Only 204 counts as "online". Anything else => treat as offline.
        return res.status === 204;
      } catch {
        // Network error / timeout => offline
        return false;
      }
    }

    function probePiOnce(timeoutMs = 2000) {
        console.log("In probe`PiOnce");
      return new Promise((resolve) => {
        const img = new Image();
        let settled = false;

        const timer = setTimeout(() => {
          if (!settled) {
            settled = true;
            img.onload = img.onerror = null;
            resolve(false);
          }
        }, timeoutMs);

        img.onload = () => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            img.onload = img.onerror = null;
            resolve(true);
          }
        };
        img.onerror = () => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            img.onload = img.onerror = null;
            resolve(false);
          }
        };
        // img.src = `http://floto.cam/probe.jpg?t=${Date.now()}`;
        img.src = `http://200.200.200.1/probe.jpg?t=${Date.now()}`;

      });
    }

    async function run() {
      // Phase 1: keep pinging the internet until it goes offline
    //   while (active) {
    //     const online = await pingInternetOnce(1000);
    //     if (!online) break;
    //     await new Promise((r) => setTimeout(r, 1000));
    //   }

      // Phase 2: once offline, keep probing the Pi until reachable
      while (active) {
        const ok = await probePiOnce(2000);
        if (ok) {
          setIsConnected(true);
          return;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    run();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main style={styles.wrap}>
      <section style={styles.card}>
        <h1 style={styles.h1}>Connect to Camera</h1>

        <img
          src="/assets/wifi.png"
          alt="Wi-Fi instructions"
          style={styles.img}
        />

        <ol style={styles.list}>
          <li>Go to your Wi-Fi settings and select the Wi-Fi: “floto_cam”.</li>
          <li>
            Wait 5–10s to connect. A captive portal should launch.
          </li>
          <li>On the captive portal, tap “Cancel” → “Use without Internet”.</li>
          <li>
            Return to this page. A button to launch the camera app should appear below.
          </li>
        </ol>
        <p>
           ⚠️ Trouble connecting? Forget the network "floto_cam" and reconnect to try again.
        </p>

        <p id="status" style={styles.status}>
          {isConnected ? "Connected ✅" : "Waiting for connection..."}
        </p>

        {isConnected && (
          <div style={styles.ctaRow}>
            <button
              id="launchBtn"
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
  list: {
    margin: "0 0 12px 20px",
    padding: 0,
    lineHeight: 1.5,
  },
  status: { color: "#444", fontSize: 14, textAlign: "center", marginTop: 8 },
  ctaRow: { display: "grid", placeItems: "center", marginTop: 12 },
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

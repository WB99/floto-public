import { useEffect, useState } from "react";

export default function Screen1({ onNext }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkConnectivity() {
      const probe = "https://cp.cloudflare.com/generate_204";

      while (active) {
        try {
          const ctrl = new AbortController();
          const timeout = setTimeout(() => ctrl.abort(), 1000);

          const res = await fetch(`${probe}?t=${Date.now()}`, {
            method: "GET",
            mode: "cors",
            signal: ctrl.signal,
          });
          clearTimeout(timeout);

          // success = still online
          if (res.status === 204) {
            setIsOnline(true);
          } else {
            throw new Error("bad");
          }
        } catch {
          // failure = offline, likely joined Pi Wi-Fi
          setIsOnline(false);
        }

        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    checkConnectivity();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section style={styles.card}>
      <h1 style={styles.h1}>Select Wi-Fi</h1>
      <img src="/assets/wifi.png" alt="Wi-Fi Settings" style={styles.img} />
      <p style={styles.p}>
        Go to Wi-Fi settings → select “floto_cam”. Then come back to this page.
      </p>
      <p id="status" style={styles.status}>
        {isOnline ? "Waiting for connection..." : "Click Next to confirm connection"}
      </p>

      {!isOnline && (
        <div style={styles.row}>
          <button id="nextBtn" onClick={onNext} style={styles.btn}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}

const styles = {
  card: {
    width: "min(680px,92vw)",
    background: "#fff",
    color: "#000",
    borderRadius: 16,
    boxShadow: "0 8px 30px rgba(0,0,0,.06)",
    padding: 24,
    textAlign: "center",
  },
  h1: { marginTop: 0 },
  img: {
    width: "100%",
    height: "auto",
    maxHeight: "60vh",
    borderRadius: 12,
    border: "1px solid #eee",
    marginBottom: 16,
    objectFit: "contain",
  },
  p: { margin: "12px 0", lineHeight: 1.4, color: "#000" },
  status: { color: "#666", fontSize: 14 },
  row: {
    display: "flex",
    justifyContent: "center",
    marginTop: 12,
  },
  btn: {
    padding: "10px 18px",
    border: 0,
    borderRadius: 8,
    background: "#000",
    color: "#fff",
    cursor: "pointer",
  },
};

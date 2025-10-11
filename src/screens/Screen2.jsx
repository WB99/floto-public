import { useEffect, useState } from "react";

export default function Screen2({ onBack }) {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let active = true;

        function pingPi() {
            return new Promise((resolve) => {
                const img = new Image();
                let done = false;

                const timer = setTimeout(() => {
                    if (!done) {
                        done = true;
                        console.log("⏰ Probe timed out");
                        img.onload = img.onerror = null;
                        resolve(false);
                    }
                }, 2000);

                img.onload = () => {
                    if (!done) {
                        done = true;
                        clearTimeout(timer);
                        img.onload = img.onerror = null;
                        console.log("✅ Probe loaded successfully");
                        resolve(true);
                    }
                };

                img.onerror = (e) => {
                    if (!done) {
                        done = true;
                        clearTimeout(timer);
                        img.onload = img.onerror = null;
                        console.log("❌ Probe error", e);
                        resolve(false);
                    }
                };
                img.src = `http://200.200.200.1/probe.jpg?t=${Date.now()}`;
            });
        }

        async function loop() {
            while (active) {
                const ok = await pingPi();
                if (ok) {
                    setIsConnected(true);
                    return;
                }
                await new Promise((r) => setTimeout(r, 1500));
            }
        }

        loop();
        return () => {
            active = false;
        };
    }, []);

    return (
        <section style={styles.card}>
            <h1 style={styles.h1}>Confirm Connection</h1>
            <img
                src='/assets/captive_portal.png'
                alt='Captive Portal'
                style={styles.img}
            />
            <p style={styles.p}>
                Wait 5–10 s for the captive portal to launch. Tap “Cancel” →
                “Use Without Internet”.
            </p>
            <p id='status2' style={styles.status}>
                {isConnected ? "Connected!" : "Connecting..."}
            </p>

            <div style={styles.row}>
                <button onClick={onBack} style={styles.btnOutline}>
                    Back
                </button>

                {isConnected && (
                    <button
                        id='launchBtn'
                        onClick={
                            () => window.open("http://floto.cam", "_blank")
                            // window.open("http://200.200.200.1", "_blank")
                        }
                        style={styles.btn}
                    >
                        Launch Camera App
                    </button>
                )}
            </div>
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
        gap: 12,
        justifyContent: "space-between",
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
    btnOutline: {
        padding: "10px 18px",
        border: "1px solid #ccc",
        borderRadius: 8,
        background: "#fff",
        color: "#111",
        cursor: "pointer",
    },
};

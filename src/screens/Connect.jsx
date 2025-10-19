// src/screens/Connect.jsx
import { useEffect, useState } from "react";

export default function Connect() {
    const [status, setStatus] = useState("🛜 Waiting for connection…");
    const [pingFailures, setPingFailures] = useState(0);
    const [connected, setConnected] = useState(false);

    async function pingInternetOnce(timeoutMs = 2500) {
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
        let shouldPing = document.visibilityState === "visible";
        function handleVisibilityChange() {
            shouldPing = document.visibilityState === "visible";
        }
        document.addEventListener("visibilitychange", handleVisibilityChange);

        async function loop() {
            while (active) {
                if (shouldPing) {
                    const online = await pingInternetOnce();
                    if (!online) {
                        setPingFailures((prev) => {
                            const next = prev + 1;
                            if (next === 1) setStatus("⚙️ Connecting…");
                            if (next >= 2) {
                                setStatus("✅ Connected!");
                                setConnected(true);
                            }
                            return next;
                        });
                    } else {
                        setPingFailures(0);
                        setStatus("🛜 Waiting for connection…");
                    }
                }
                await new Promise((r) => setTimeout(r, 1500));
            }
        }
        loop();
        return () => {
            active = false;
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []);

    return (
        <main style={styles.wrap}>
            <section style={styles.card}>
                <div style={styles.container}>
                    {/* Fixed header zone */}
                    <div style={styles.headerZone}>
                        <div style={styles.imgBox}>
                            <img
                                src='/assets/camera-wifi.png'
                                alt='Camera Wi-Fi Icon'
                                style={styles.singleImg}
                            />
                        </div>
                        <h2 style={styles.h2}>Connect to Camera</h2>
                    </div>

                    {/* Scrollable / flexible content zone */}
                    <div style={styles.contentZone}>
                        {!connected ? (
                            <>
                                <p style={styles.text}>Follow these steps:</p>
                                <div style={styles.instructionCard}>
                                    <p style={styles.text}>
                                        ⚙️ Settings → Connect 🛜 <b>floto_cam</b>
                                    </p>
                                </div>

                                <div style={styles.arrowBox}>
                                    <img
                                        src='/assets/down-arrow.png'
                                        alt='Down Arrow'
                                        style={styles.arrowImg}
                                    />
                                </div>

                                <div style={styles.instructionCard}>
                                    <div style={styles.osBlock}>
                                        <p style={styles.text}>
                                            <img
                                                src='/assets/apple-logo.png'
                                                alt='Apple'
                                                style={styles.inlineIcon}
                                            />{" "}
                                            Wait for popup
                                            <br />
                                            <img
                                                src='/assets/click.png'
                                                alt='Click'
                                                style={styles.clickIcon}
                                            />{" "}
                                            “Use without Internet”
                                        </p>
                                    </div>

                                    <div style={styles.orRow}>
                                        <div style={styles.orLine}></div>
                                        <span style={styles.orText}>OR</span>
                                        <div style={styles.orLine}></div>
                                    </div>

                                    <div style={styles.osBlock}>
                                        <p style={styles.text}>
                                            <img
                                                src='/assets/android-logo.png'
                                                alt='Android'
                                                style={styles.inlineIcon}
                                            />{" "}
                                            Wait for popup/notification
                                            <br />
                                            <img
                                                src='/assets/click.png'
                                                alt='Click'
                                                style={styles.clickIcon}
                                            />{" "}
                                            "Connect”
                                        </p>
                                    </div>
                                </div>

                                <p
                                    style={{
                                        ...styles.status,
                                        ...(status.includes("Connected")
                                            ? styles.statusConnected
                                            : styles.statusBlink),
                                    }}
                                >
                                    {status}
                                </p>
                            </>
                        ) : (
                            <div style={styles.connectedBlock}>
                                <p style={styles.statusConnected}>{status}</p>
                                <button
                                    onClick={() =>
                                        window.open(
                                            "http://floto.cam",
                                            "_blank"
                                        )
                                    }
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
        alignItems: "flex-start",
        background: "#fafafa",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        color: "#000",
        paddingTop: "2vh",
    },
    card: {
        width: "92vw",
        height: "92vh",
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 6px 24px rgba(0,0,0,.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    headerZone: {
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "1vh",
    },
    contentZone: {
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: "2vh",
    },
    imgBox: {
        display: "flex",
        justifyContent: "center",
        marginTop: "0.5vh",
        marginBottom: "0.5vh",
    },
    singleImg: {
        height: "auto",
        maxHeight: "17vh",
        objectFit: "contain",
    },
    h2: {
        fontSize: "clamp(24px, 5vw, 30px)",
        margin: "0vh 0 1vh 0",
        fontWeight: 800,
        textAlign: "center",
    },
    instructionCard: {
        width: "88%",
        background: "#EBEBEB",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "1.5vh 3vw",
        marginTop: "1vh",
        marginBottom: "1vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    },
    text: {
        fontSize: "clamp(15px, 4.2vw, 24px)",
        margin: 0,
        lineHeight: 1.4,
        color: "#333",
    },
    arrowBox: {
        marginTop: "1vh",
    },
    arrowImg: {
        width: "26px",
        height: "26px",
        opacity: 0.8,
    },
    osBlock: {
        textAlign: "center",
        marginBottom: "1.2vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    inlineIcon: {
        height: "1em",
        width: "auto",
        verticalAlign: "middle",
        marginRight: "4px",
    },
    clickIcon: {
        height: "1.4em",
        width: "auto",
        verticalAlign: "middle",
        marginRight: "4px",
    },
    orRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        gap: "10px",
        marginTop: "0.8vh",
        marginBottom: "1.5vh",
    },
    orLine: {
        flexGrow: 1,
        height: "1px",
        backgroundColor: "#555",
        opacity: 0.6,
        maxWidth: "30%",
    },
    orText: {
        fontSize: "clamp(14px, 3.2vw, 15px)",
        color: "#555",
        fontWeight: 600,
        whiteSpace: "nowrap",
    },
    status: {
        fontSize: "clamp(16px, 3.8vw, 18px)",
        fontWeight: 600,
        marginTop: "2vh",
        textAlign: "center",
    },
    statusBlink: { animation: "fadeBlink 1s infinite" },
    statusConnected: {
        fontSize: "clamp(18px, 3.8vw, 20px)",
        fontWeight: 700,
        marginTop: "2vh",
    },
    connectedBlock: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2vh",
        marginTop: "3vh",
    },
    btn: {
        padding: "12px 20px",
        border: 0,
        borderRadius: 10,
        background: "#000",
        color: "#fff",
        cursor: "pointer",
        minWidth: 200,
        fontSize: "clamp(16px, 3.8vw, 18px)",
    },
};

const styleTag = document.createElement("style");
styleTag.innerHTML = `
@keyframes fadeBlink {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}
html,body { background:#fafafa; margin:0; padding:0; }
`;
document.head.appendChild(styleTag);

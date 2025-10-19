// src/screens/Connect.jsx
import { useEffect, useState } from "react";

export default function Connect() {
    const [status, setStatus] = useState("🛜 Waiting for connection…");
    const [pingFailures, setPingFailures] = useState(0);
    const [connected, setConnected] = useState(false);

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
            // return true;
        } catch {
            return false;
        }
    }

    useEffect(() => {
        let active = true;
        async function loop() {
            while (active) {
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
                await new Promise((r) => setTimeout(r, 1500));
            }
        }
        loop();
        return () => {
            active = false;
        };
    }, []);

    return (
        <main style={styles.wrap}>
            <section style={styles.card}>
                <div style={connected ? styles.innerCenter : styles.inner}>
                    <div style={styles.imgBox}>
                        <img
                            src="/assets/camera-wifi.png"
                            alt="Camera Wi-Fi Icon"
                            style={styles.singleImg}
                        />
                    </div>
                    <h2 style={styles.h2}>Connect to Camera</h2>

                    {!connected ? (
                        <>
                            {/* Step 1 Card */}
                            <div style={styles.instructionCard}>
                                <h3 style={styles.cardHeader}>1</h3>
                                <p style={styles.text}>
                                    ⚙️ <b>Settings</b> → Connect 🛜 <b>floto_cam</b>
                                </p>
                            </div>

                            <div style={styles.arrowBox}>
                                <img
                                    src="/assets/down-arrow.png"
                                    alt="Down Arrow"
                                    style={styles.arrowImg}
                                />
                            </div>

                            {/* Step 2 Card */}
                            <div style={styles.instructionCard}>
                                <h3 style={styles.cardHeader}>2</h3>

                                <div style={styles.osBlock}>
                                    <p style={styles.subHeader}>
                                        <img
                                            src="/assets/apple-logo.png"
                                            alt="Apple"
                                            style={styles.inlineIcon}
                                        />{" "}
                                        iOS
                                    </p>
                                    <p style={styles.text}>
                                        Wait for <b>captive portal</b>
                                        <br />
                                        ↳{" "}
                                        <img
                                            src="/assets/click.png"
                                            alt="Click"
                                            style={styles.clickIcon}
                                        />{" "}
                                        <b>Cancel</b> →{" "}
                                        <b>“Use without Internet”</b>
                                    </p>
                                </div>

                                <div style={styles.orRow}>
                                    <div style={styles.orLine}></div>
                                    <span style={styles.orText}>OR</span>
                                    <div style={styles.orLine}></div>
                                </div>

                                <div style={styles.osBlock}>
                                    <p style={styles.subHeader}>
                                        <img
                                            src="/assets/android-logo.png"
                                            alt="Android"
                                            style={styles.inlineIcon}
                                        />{" "}
                                        Android
                                    </p>
                                    <p style={styles.text}>
                                        <b>"Limited/No internet”</b> popup/notification
                                        <br />
                                        ↳{" "}
                                        <img
                                            src="/assets/click.png"
                                            alt="Click"
                                            style={styles.clickIcon}
                                        />{" "}
                                        <b>“Always connect”</b> /{" "}
                                        <b>“Connect anyway”</b>
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
                        <div style={styles.connectedCenterBlock}>
                            <p style={styles.statusConnected}>{status}</p>
                            <button
                                onClick={() =>
                                    window.open("http://floto.cam", "_blank")
                                }
                                style={styles.btn}
                            >
                                Launch Camera App
                            </button>
                        </div>
                    )}
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
        overflow: "visible" // allow internal scrollbars to show
    },
    card: {
        width: "92vw",
        height: "92vh",
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 6px 24px rgba(0,0,0,.08)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowY: "auto", // enable vertical scrolling within card
        overflowX: "hidden",
    },
    inner: {
        width: "100%",
        height: "auto", // allow flexible content height
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "3vw",
        boxSizing: "border-box",
    },
    innerCenter: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
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
        margin: "0vh 0 0.5vh 0",
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
        textAlign: "center",
    },
    cardHeader: {
        fontSize: "clamp(18px, 5.5vw, 28px)",
        margin: "0 0 0.3vh 0",
        fontWeight: 800,
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
        textAlign: "left",
        marginBottom: "1.2vh",
    },
    subHeader: {
        fontSize: "clamp(15px, 4.5vw, 26px)",
        color: "#000",
        fontWeight: 700,
        marginTop: "0.6vh",
        marginBottom: "0.4vh",
        display: "flex",
        alignItems: "center",
        gap: "6px",
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
        gap: "10px",
        margin: "0.6vh 0 0.8vh 0",
    },
    orLine: {
        flex: 1,
        height: "1px",
        backgroundColor: "#555",
        opacity: 0.6,
    },
    orText: {
        fontSize: "clamp(14px, 3.2vw, 15px)",
        color: "#555",
        fontWeight: 600,
    },
    status: {
        fontSize: "clamp(16px, 3.8vw, 18px)",
        fontWeight: 600,
        marginTop: "2vh",
        textAlign: "center",
    },
    statusBlink: {
        animation: "fadeBlink 1s infinite",
    },
    statusConnected: {
        fontSize: "clamp(18px, 3.8vw, 20px)",
        fontWeight: 700,
        marginTop: "2vh",
    },
    connectedCenterBlock: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        gap: "2vh",
        textAlign: "center",
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

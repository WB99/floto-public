// src/screens/Connect.jsx
import { useEffect, useState } from "react";

export default function Connect() {
    const [status, setStatus] = useState("🛜 Waiting for connection...");
    const [done1, setDone1] = useState(false);
    const [done2, setDone2] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [showBlink, setShowBlink] = useState(true);

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
            return res.status === 204; // true = online, false = offline
        } catch {
            return false;
        }
    }

    // ping every 2 seconds
    useEffect(() => {
        let active = true;
        async function loop() {
            while (active) {
                const online = await pingInternetOnce();
                setIsOnline(online);
                await new Promise((r) => setTimeout(r, 2000));
            }
        }
        loop();
        return () => {
            active = false;
        };
    }, []);

    // status text and connection logic
    useEffect(() => {
        let hintTimer;
        let revertTimer;

        // default state
        if (!done1 && !done2) {
            setStatus("🛜 Waiting for connection...");
            setShowBlink(true);
        }

        // after first done pressed
        if (done1 && !done2) {
            setStatus("⚙️ Connecting...");
            setShowBlink(true);
            hintTimer = setTimeout(() => {
                if (!done2) {
                    setStatus(
                        "💡Didn't see any popup or notification? Turn off Do Not Disturb mode or wait a little longer"
                    );
                    setShowBlink(false);
                    // revert after 10s
                    revertTimer = setTimeout(() => {
                        setStatus("🛜 Waiting for connection...");
                        setShowBlink(true);
                        setDone2(false);
                    }, 10000);
                }
            }, 5000);
        }

        // both done pressed
        if (done1 && done2) {
            if (isOnline) {
                setStatus("⚠️ Connection error. Forget the network and try again");
                setShowBlink(false);
                // revert after 10s and reset buttons
                revertTimer = setTimeout(() => {
                    setStatus("🛜 Waiting for connection...");
                    setShowBlink(true);
                    setDone1(false);
                    setDone2(false);
                }, 7000);
            } else {
                setStatus("✅ Connected!");
                setIsConnected(true);
                setShowBlink(false);
            }
        }

        return () => {
            clearTimeout(hintTimer);
            clearTimeout(revertTimer);
        };
    }, [done1, done2, isOnline]);

    function handleDone(which) {
        if (which === 1 && !done1) setDone1(true);
        if (which === 2 && !done2) setDone2(true);
    }

    return (
        <main style={styles.wrap}>
            <section style={styles.card}>
                <div style={isConnected ? styles.innerCenter : styles.inner}>
                    <div style={styles.imgBox}>
                        <img
                            src="/assets/camera-wifi.png"
                            alt="Camera Wi-Fi Icon"
                            style={styles.singleImg}
                        />
                    </div>
                    <h2 style={styles.h2}>Connect to Camera</h2>

                    {!isConnected ? (
                        <>
                            {/* Step 1 Card */}
                            <div style={styles.instructionCard}>
                                <p style={styles.text}>
                                    Connect 🛜 <b>floto_cam</b>
                                </p>
                                <button
                                    style={{
                                        ...styles.btn,
                                        background: done1 ? "#333" : "#000",
                                    }}
                                    onClick={() => handleDone(1)}
                                    disabled={done1}
                                >
                                    {done1 ? "✅" : "Done"}
                                </button>
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
                                <div style={styles.osBlock}>
                                    <p style={styles.text}>
                                        <img
                                            src="/assets/apple-logo.png"
                                            alt="Apple"
                                            style={styles.inlineIcon}
                                        />{" "}
                                        Wait for popup
                                        <br />
                                        <img
                                            src="/assets/click.png"
                                            alt="Click"
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
                                            src="/assets/android-logo.png"
                                            alt="Android"
                                            style={styles.inlineIcon}
                                        />{" "}
                                        Wait for popup/notification
                                        <br />
                                        <img
                                            src="/assets/click.png"
                                            alt="Click"
                                            style={styles.clickIcon}
                                        />{" "}
                                        "Connect”
                                    </p>
                                </div>

                                <button
                                    style={{
                                        ...styles.btn,
                                        background: done2 ? "#333" : "#000",
                                    }}
                                    onClick={() => handleDone(2)}
                                    disabled={done2}
                                >
                                    {done2 ? "✅" : "Done"}
                                </button>
                            </div>

                            <p
                                style={{
                                    ...styles.status,
                                    ...(showBlink ? styles.statusBlink : {}),
                                }}
                            >
                                {status}
                            </p>
                        </>
                    ) : (
                        <div style={styles.connectedCenterBlock}>
                            <p style={styles.statusConnected}>✅ Connected!</p>
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
        overflow: "visible",
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
        overflowY: "auto",
        overflowX: "hidden",
    },
    inner: {
        width: "100%",
        height: "auto",
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    },
    text: {
        fontSize: "clamp(15px, 4.2vw, 24px)",
        margin: 0,
        marginBottom: "0.6vh",
        lineHeight: 1.4,
        color: "#333",
        textAlign: "center",
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
        justifyContent: "center",
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
        margin: "0.8vh 0",
    },
    orLine: {
        width: "30%",
        height: "1px",
        backgroundColor: "#555",
        opacity: 0.6,
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
        minWidth: 160,
        fontSize: "clamp(16px, 3.8vw, 18px)",
        marginTop: "1vh",
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

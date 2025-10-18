// src/screens/Connect.jsx
import { useEffect, useState } from "react";

export default function Connect() {
    const [isConnected, setIsConnected] = useState(false);
    const [status, setStatus] = useState("🛜 Waiting for connection...");
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

        if (platform === "android" && checks.wifi && !checks.portal) {
            setStatus("🛜 Waiting for connection...");
            const hintTimer = setTimeout(() => {
                setStatus(
                    "💡 Didn't see anything for step 2? Turn off Do Not Disturb mode & look out for notifications."
                );
                const revertTimer = setTimeout(() => {
                    setStatus("🛜 Waiting for connection...");
                }, 5000);
                return () => clearTimeout(revertTimer);
            }, 3000);
            return () => clearTimeout(hintTimer);
        }

        if (!allChecked) {
            setIsConnected(false);
            setStatus("🛜 Waiting for connection...");
            return;
        }

        if (allChecked && !isOnline) {
            setTimeout(() => {
                setIsConnected(true);
                setStatus("✅ Connected!");
            }, 1000);
        } else if (allChecked && isOnline) {
            setTimeout(() => {
                setStatus(
                    "⚠️ Connection problem. Forget the network “floto_cam” and retry the steps again"
                );
                setIsConnected(false);
                setTimeout(() => {
                    setChecks({ wifi: false, portal: false });
                    setStatus("🛜 Waiting for connection...");
                }, 5000);
            }, 1000);
        }
    }, [checks, isOnline, platform]);

    function toggle(key) {
        setChecks((c) => ({ ...c, [key]: !c[key] }));
    }

    function renderInstructions() {
        const StepsBlock = (
            <>
                <h2 style={styles.cta}>☑️ Check boxes when done</h2>
                <ul style={styles.list}>
                    <li style={styles.item}>
                        <label style={styles.label}>
                            <input
                                type='checkbox'
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
                                type='checkbox'
                                checked={checks.portal}
                                onChange={() => toggle("portal")}
                                style={styles.checkbox}
                            />{" "}
                            {platform === "ios" ? (
                                <>
                                    2.{" "}
                                    <b>
                                        Wait 5–10 s for a captive portal to
                                        launch.
                                    </b>{" "}
                                    Then, tap “Cancel” → “Use without Internet”.
                                </>
                            ) : (
                                <>
                                    2. When you see a{" "}
                                    <b>pop-up or notification</b> like{" "}
                                    <b>"Internet may not be available"</b> or{" "}
                                    <b>"Limited connectivity"</b>, tap{" "}
                                    <b>"Always connect"</b> or{" "}
                                    <b>"Connect anyway"</b>.
                                </>
                            )}
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
                    id='launchBtn'
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
                    <img
                        src='/assets/wifi-icon.png'
                        alt='Wi-Fi Icon'
                        style={styles.singleImg}
                    />
                </div>
                <div style={styles.content}>
                    {!isConnected ? StepsBlock : ConnectedBlock}
                </div>
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
                                className={`seg-btn ${
                                    platform === "ios" ? "active" : ""
                                }`}
                                onClick={() => setPlatform("ios")}
                                style={styles.segment}
                            >
                                iOS
                            </button>
                            <button
                                className={`seg-btn ${
                                    platform === "android" ? "active" : ""
                                }`}
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
        overflow: "auto",
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
        fontSize: "clamp(24px, 5vw, 32px)",
        margin: 0,
        textAlign: "center",
        fontWeight: 800,
    },
    cta: {
        fontSize: "clamp(24px, 5vw, 32px)",
        whiteSpace: "nowrap",
        margin: 0,
        textAlign: "center",
        fontWeight: 800,
        color: "red",
        textDecoration: "underline",
        textDecorationColor: "red",
        textDecorationThickness: "2px",
    },
    subtext: {
        fontSize: "clamp(14px, 3.2vw, 16px)",
        fontWeight: 700,
        marginTop: "0.3vh",
        marginBottom: "0.6vh",
        textAlign: "center",
    },
    segmentedWrapper: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "1vh",
    },
    segmented: {
        display: "flex",
        width: "180px",
        borderRadius: 10,
        border: "1.5px solid #000",
        overflow: "hidden",
    },
    segment: {
        flex: 1,
        padding: "7px 0",
        background: "#fff",
        border: "none",
        fontSize: "clamp(14px, 3.2vw, 16px)",
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
        paddingTop: "1vh",
        paddingBottom: "0.8vh",
    },
    singleImg: {
        width: "35%",
        height: "auto",
        maxHeight: "25vh",
        objectFit: "contain",
    },
    content: {
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        textAlign: "left",
        marginTop: "1vh",
    },
    list: { listStyle: "none", padding: 0, margin: 0 },
    item: { margin: "2vh 0" },
    label: {
        cursor: "pointer",
        lineHeight: 1.6,
        fontSize: "clamp(16px, 3.8vw, 18px)",
    },
    checkbox: {
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
        width: 22,
        height: 22,
        border: "2px solid #ccc",
        borderRadius: 5,
        background: "#fff",
        display: "inline-block",
        verticalAlign: "middle",
        position: "relative",
        marginRight: 10,
        boxShadow: "0 0 8px rgba(255,0,0,0.5)",
        animation: "blink-red 1.2s infinite",
        transition: "all 0.25s ease",
    },
    statusBox: {
        minHeight: 30,
        display: "grid",
        placeItems: "center",
        marginTop: "2vh",
    },
    status: {
        textAlign: "center",
        color: "#444",
        fontSize: "clamp(16px, 3.5vw, 18px)",
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
        fontSize: "clamp(18px, 3.8vw, 20px)",
        fontWeight: 700,
        textAlign: "center",
        margin: 0,
    },
    btn: {
        padding: "14px 22px",
        border: 0,
        borderRadius: 10,
        background: "#000",
        color: "#fff",
        cursor: "pointer",
        minWidth: 220,
        fontSize: "clamp(16px, 3.8vw, 18px)",
    },
};

const styleTag = document.createElement("style");
styleTag.innerHTML = `
.seg-btn.active { background:#000 !important; color:#fff !important; }
#launchBtn, #launchBtn * { color:#fff !important; }

@keyframes blink-red {
  0% { box-shadow: 0 0 4px rgba(255,0,0,0.5); }
  50% { box-shadow: 0 0 14px rgba(255,0,0,0.9); }
  100% { box-shadow: 0 0 4px rgba(255,0,0,0.5); }
}

@keyframes glow-green {
  0% { box-shadow: 0 0 5px rgba(0,255,0,0.4); }
  50% { box-shadow: 0 0 14px rgba(0,255,0,0.9); }
  100% { box-shadow: 0 0 5px rgba(0,255,0,0.4); }
}

input[type="checkbox"][style]::after {
  content:"";
  position:absolute;
  top:2px;
  left:6px;
  width:6px;
  height:11px;
  border:solid #000;
  border-width:0 3px 3px 0;
  transform:rotate(45deg);
  opacity:0;
}

/* When checked */
input[type="checkbox"][style]:checked {
  border-color: #0f0 !important;
  animation: glow-green 1.5s infinite !important;
  box-shadow: 0 0 10px rgba(0,255,0,0.7) !important;
}

input[type="checkbox"][style]:checked::after {
  opacity:1;
}

html,body { background:#fafafa; margin:0; padding:0; overflow:auto; }
`;
document.head.appendChild(styleTag);

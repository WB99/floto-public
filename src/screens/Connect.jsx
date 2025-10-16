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
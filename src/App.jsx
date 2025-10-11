// import { useState } from "react";
// import Screen1 from "./screens/Screen1.jsx";
// import Screen2 from "./screens/Screen2.jsx";

// export default function App() {
//   const [step, setStep] = useState(1);

//   return (
//     <main style={styles.wrap}>
//       {step === 1 && <Screen1 onNext={() => setStep(2)} />}
//       {step === 2 && <Screen2 onBack={() => setStep(1)} />}
//     </main>
//   );
// }

// const styles = {
//   wrap: {
//     minHeight: "100vh",
//     display: "grid",
//     placeItems: "center",
//     background: "#fafafa",
//     fontFamily: "system-ui, sans-serif",
//     padding: 16,
//   },
// };

import Connect from "./screens/Connect.jsx";

export default function App() {
  return <Connect />;
}

import { Routes, Route, Navigate } from "react-router-dom";

import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Processing from "./pages/Processing";
import Success from "./pages/Success";
import Failed from "./pages/Failed";
import PaymentDetails from "./pages/PaymentDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/checkout" replace />} />

      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment/:paymentId" element={<Payment />} />
      <Route path="/processing/:paymentId" element={<Processing />} />
      <Route path="/success/:paymentId" element={<Success />} />
      <Route path="/failed/:paymentId" element={<Failed />} />
      <Route
        path="/payment-details/:paymentId"
        element={<PaymentDetails />}
      />
    </Routes>
  );
}

export default App;
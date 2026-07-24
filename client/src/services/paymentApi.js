import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Create a new payment record.
 * POST /api/payments
 */
export const createPayment = async (paymentData) => {
  const response = await api.post("/payments", paymentData);
  return response.data;
};

/**
 * Fetch a single payment by its paymentId.
 * GET /api/payments/:paymentId
 */
export const getPayment = async (paymentId) => {
  const response = await api.get(`/payments/${paymentId}`);
  return response.data;
};

/**
 * Submit payment credentials and process the payment.
 * POST /api/payments/:paymentId/process
 */
export const processPayment = async (paymentId, paymentData) => {
  const response = await api.post(
    `/payments/${paymentId}/process`,
    paymentData
  );
  return response.data;
};

export default api;
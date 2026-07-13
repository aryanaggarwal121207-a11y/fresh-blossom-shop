/**
 * Payment abstraction layer.
 *
 * Provides a provider-agnostic interface so the checkout flow does not depend
 * on any single gateway. A Razorpay implementation is stubbed and ready to be
 * wired up: set VITE_RAZORPAY_KEY_ID and add the server-side order/verify
 * endpoints. Cash on Delivery is fully handled locally.
 */
export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod";

export const PAYMENT_METHODS: { value: PaymentMethod; label: string; description: string }[] = [
  { value: "upi", label: "UPI", description: "Google Pay, PhonePe, Paytm & more" },
  { value: "card", label: "Credit / Debit Card", description: "Visa, Mastercard, RuPay" },
  { value: "netbanking", label: "Net Banking", description: "All major banks" },
  { value: "wallet", label: "Wallets", description: "Paytm, Amazon Pay, etc." },
  { value: "cod", label: "Cash on Delivery", description: "Pay when your order arrives" },
];

export interface PaymentIntentInput {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  customerEmail?: string;
  customerName?: string;
}

export interface PaymentResult {
  success: boolean;
  status: "paid" | "pending" | "failed";
  reference?: string;
  message?: string;
}

export interface PaymentProvider {
  readonly name: string;
  pay(input: PaymentIntentInput): Promise<PaymentResult>;
}

/** Cash on Delivery — no gateway needed. */
export const codProvider: PaymentProvider = {
  name: "cod",
  async pay() {
    return { success: true, status: "pending", message: "Order placed. Pay on delivery." };
  },
};

/**
 * Razorpay provider skeleton. Integration steps (later):
 * 1. Create a server route that creates a Razorpay order (uses RAZORPAY_KEY_SECRET).
 * 2. Open Razorpay checkout with VITE_RAZORPAY_KEY_ID + returned order id.
 * 3. Verify the payment signature server-side before marking the order paid.
 */
export const razorpayProvider: PaymentProvider = {
  name: "razorpay",
  async pay(input) {
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!keyId) {
      // Not configured yet — treat online payment as pending so the order flow still works.
      return {
        success: true,
        status: "pending",
        message: "Payment gateway not configured — order recorded as pending.",
      };
    }
    // TODO: launch Razorpay checkout here once server endpoints exist.
    return { success: true, status: "pending", reference: `rzp_${input.orderId}` };
  },
};

export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  return method === "cod" ? codProvider : razorpayProvider;
}
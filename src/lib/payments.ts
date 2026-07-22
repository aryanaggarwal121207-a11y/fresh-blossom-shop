/**
 * Payment abstraction layer.
 *
 * Provides a provider-agnostic interface so the checkout flow does not depend
 * on any single gateway. A Razorpay implementation is stubbed and ready to be
 * wired up: set VITE_RAZORPAY_KEY_ID and add the server-side order/verify
 * endpoints. Cash on Delivery is fully handled locally.
 */
import { supabase } from "@/integrations/supabase/client";
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
async function loadRazorpay() {
  if ((window as any).Razorpay) return true;

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

  export const razorpayProvider: PaymentProvider = {
  name: "razorpay",

  async pay(input) {
    console.log("PAY FUNCTION STARTED");
    console.log("1. pay() called", input);

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    console.log("2. Key ID:", keyId);

    const loaded = await loadRazorpay();
    console.log("3. Razorpay SDK loaded:", loaded);

    if (!loaded) {
      return {
        success: false,
        status: "failed",
        message: "Failed to load Razorpay.",
      };
    }

    
    if (!keyId) {
      return {
        success: false,
        status: "failed",
        message: "Razorpay Key ID is missing.",
      };
    }

    const { data, error } = await supabase.functions.invoke(
      "create-razorpay-order",
      {
        body: {
          amount: Math.round(input.amount * 100), // paise
        },
      }
    );

console.log("4. Edge Function response:", data, error);
    
    if (error) {
      return {
        success: false,
        status: "failed",
        message: error.message,
      };
    }

    return new Promise((resolve) => {
      const options = {
        key: keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Daksherb",
        description: "Order Payment",
        order_id: data.id,

       handler: async function (response: any) {
  console.log("Razorpay response:", response);

  const { data: verifyData, error: verifyError } =
    await supabase.functions.invoke("verify-razorpay-payment", {
      body: {
        orderId: input.orderId,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      },
    });

  console.log("Verify response:", verifyData, verifyError);

  if (verifyError || !verifyData?.success) {
    resolve({
      success: false,
      status: "failed",
      message: "Payment verification failed.",
    });
    return;
  }

  resolve({
    success: true,
    status: "paid",
    reference: response.razorpay_payment_id,
  });
},

        modal: {
          ondismiss: function () {
            resolve({
              success: false,
              status: "failed",
              message: "Payment cancelled.",
            });
          },
        },

        prefill: {
          name: input.customerName ?? "",
          email: input.customerEmail ?? "",
        },

        theme: {
          color: "#f472b6",
        },
      };

      console.log("5. Opening Razorpay...");
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    });
  },
};
  

export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  return method === "cod" ? codProvider : razorpayProvider;
}

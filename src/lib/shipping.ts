/**
 * Shipping abstraction layer.
 *
 * Designed around the flow: Order -> Shipment -> Tracking so a real provider
 * (Shiprocket) can be connected later without touching the checkout/order code.
 * The Shiprocket implementation is stubbed on purpose.
 */
export interface ShipmentInput {
  orderId: string;
  orderNumber: string;
  weightKg?: number;
  address: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface ShipmentResult {
  provider: string;
  trackingNumber?: string;
  status: "created" | "pending" | "failed";
  message?: string;
}

export interface TrackingEvent {
  status: string;
  location?: string;
  timestamp: string;
}

export interface ShippingProvider {
  readonly name: string;
  createShipment(input: ShipmentInput): Promise<ShipmentResult>;
  track(trackingNumber: string): Promise<TrackingEvent[]>;
}

/**
 * Shiprocket provider skeleton. To connect later:
 * 1. Add SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD secrets.
 * 2. Create a server route to authenticate and create shipments.
 * 3. Call it from here and persist the returned tracking number on the order.
 */
export const shiprocketProvider: ShippingProvider = {
  name: "shiprocket",
  async createShipment() {
    return {
      provider: "shiprocket",
      status: "pending",
      message: "Shiprocket not connected yet — shipment will be created manually.",
    };
  },
  async track() {
    return [];
  },
};

export const DELIVERY_OPTIONS = [
  { value: "standard", label: "Standard Delivery", eta: "4–6 business days", fee: 0 },
  { value: "express", label: "Express Delivery", eta: "1–2 business days", fee: 79 },
] as const;

export type DeliveryOption = (typeof DELIVERY_OPTIONS)[number]["value"];
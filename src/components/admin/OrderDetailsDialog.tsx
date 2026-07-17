<DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle>{order.order_number}</DialogTitle>
  </DialogHeader>

  <div className="grid gap-6 lg:grid-cols-2">

    {/* Shipping Address */}
    <div className="rounded-xl border p-4">
      <h3 className="mb-3 text-lg font-semibold">
        Shipping Address
      </h3>

      <div className="space-y-1 text-sm">
        <p><strong>Name:</strong> {address?.name || "-"}</p>
        <p><strong>Phone:</strong> {address?.phone || "-"}</p>
        <p><strong>Address:</strong> {address?.line1 || "-"}</p>

        {address?.line2 && <p>{address.line2}</p>}

        <p>
          {address?.city || "-"}, {address?.state || "-"}
        </p>

        <p>
          {address?.postalCode || address?.pincode || "-"}
        </p>

        <p>{address?.country || "India"}</p>
      </div>
    </div>

    {/* Payment */}
    <div className="rounded-xl border p-4">
      <h3 className="mb-3 text-lg font-semibold">
        Payment Details
      </h3>

      <div className="space-y-2 text-sm">
        <p><strong>Payment Method:</strong> {order.payment_method}</p>
        <p><strong>Payment Status:</strong> {order.payment_status}</p>
        <p><strong>Order Status:</strong> {order.status}</p>
        <p><strong>Delivery:</strong> {order.delivery_option}</p>
      </div>
    </div>

  </div>

  {/* Products */}
  <div className="mt-6">
    <h3 className="mb-3 text-lg font-semibold">
      Ordered Products
    </h3>

    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-xl border p-4"
        >
          <div className="flex items-center gap-4">

            <img
              src={item.image_url}
              alt={item.product_name}
              className="h-20 w-20 rounded-lg object-cover"
            />

            <div>
              <p className="font-semibold">
                {item.product_name}
              </p>

              <p className="text-sm text-muted-foreground">
                Quantity: {item.quantity}
              </p>

              <p className="text-sm text-muted-foreground">
                Unit Price: {formatINR(Number(item.unit_price))}
              </p>
            </div>

          </div>

          <div className="text-right">
            <p className="font-semibold">
              {formatINR(
                Number(item.unit_price) * Number(item.quantity)
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Summary */}
  <div className="mt-6 rounded-xl border p-4">
    <h3 className="mb-3 text-lg font-semibold">
      Order Summary
    </h3>

    <div className="space-y-2">

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{formatINR(Number(order.subtotal))}</span>
      </div>

      <div className="flex justify-between">
        <span>Shipping</span>
        <span>{formatINR(Number(order.shipping_fee))}</span>
      </div>

      <div className="flex justify-between">
        <span>Discount</span>
        <span>-{formatINR(Number(order.discount))}</span>
      </div>

      <div className="flex justify-between border-t pt-3 text-lg font-bold">
        <span>Total</span>
        <span>{formatINR(Number(order.total))}</span>
      </div>

    </div>
  </div>
</DialogContent>

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, Store, Truck, CreditCard, Banknote } from "lucide-react";
import { apiFetch } from "@/lib/api";

const BOUTIQUES = [
  "Lumora Flagship — Gulberg, Lahore",
  "Lumora Studio — Clifton, Karachi",
  "Lumora Sanctuary — F-6 Markaz, Islamabad",
];

export default function CheckoutPage({
  cart,
  user,
  checkoutMeta,
  onRequireAuth,
  onClearCart,
}) {
  const navigate = useNavigate();

  const [deliveryMethod, setDeliveryMethod] = useState(
    checkoutMeta?.deliveryMethod || "delivery"
  );
  const [customerName, setCustomerName] = useState(null);
  const [customerEmail, setCustomerEmail] = useState(null);
  const customerNameValue = customerName ?? user?.name ?? "";
  const customerEmailValue = customerEmail ?? user?.email ?? "";
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [postalCode, setPostalCode] = useState("");
  const [pickupLocation, setPickupLocation] = useState(BOUTIQUES[0]);
  const [paymentMethod, setPaymentMethod] = useState("card-sandbox");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const promoCode = checkoutMeta?.promoCode || null;
  const discount = promoCode === "LUMORA15" ? subtotal * 0.15 : 0;
  const shipping =
    deliveryMethod === "pickup" || subtotal >= 75 || subtotal === 0 ? 0 : 8;
  const total = Math.max(0, subtotal - discount + shipping);

  if (!user) {
    return (
      <main className="min-h-[70vh] bg-[#FFFEF2] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-[#EAE6DC] p-8 text-center space-y-4">
          <h1 className="font-serif text-3xl font-normal">
            Sign in to continue
          </h1>
          <p className="text-[13px] text-[#57534E]">
            Please sign in or create a Lumora account to securely place your
            order and track its status.
          </p>
          <button
            type="button"
            onClick={() =>
              onRequireAuth("Sign in or create an account to complete checkout.")
            }
            className="w-full bg-[#333333] hover:bg-[#1A1A1A] text-white py-3.5 text-[13px] cursor-pointer"
          >
            Sign in / Create account
          </button>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#FFFEF2] flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-3xl font-normal">
            Your bag is empty
          </h1>
          <Link
            to="/category/all"
            className="inline-block bg-[#333333] text-white px-8 py-3 text-[13px]"
          >
            Browse formulations
          </Link>
        </div>
      </main>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        customerName: customerNameValue,
        customerEmail: customerEmailValue,
        deliveryMethod,
        shippingAddress:
          deliveryMethod === "delivery"
            ? { street, city, country, postalCode }
            : { street: pickupLocation, city: "In-Store Pickup", country: "PK", postalCode: "" },
        items: cart.map((item) => ({
          productId: item._id,
          selectedVariant: item.selectedVariant || "",
          quantity: item.quantity,
        })),
        samples: checkoutMeta?.samples || [],
        giftOptions: checkoutMeta?.giftOptions || {
          bagSelected: false,
          addMessage: false,
          message: "",
        },
        promoCode,
        paymentMethod,
      };

      const data = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      onClearCart();
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFEF2] text-[#252525] py-6 sm:py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 sm:pb-6 mb-7 sm:mb-10 border-b border-[#E2DDD2]">
          <h1 className="font-serif text-3xl md:text-4xl font-normal">
            Checkout
          </h1>
          <span className="inline-flex items-center gap-2 text-[12px] text-[#57534E]">
            <Lock className="w-3.5 h-3.5" />
            Server-verified checkout
          </span>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-start"
        >
          {/* LEFT 7 COLS: Delivery + Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Delivery Method */}
            <section className="bg-white border border-[#EAE6DC] p-4 sm:p-6 space-y-5">
              <h2 className="text-[16px] font-medium">1. Delivery method</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`border p-4 flex items-center gap-3 text-left cursor-pointer ${
                    deliveryMethod === "delivery"
                      ? "border-2 border-[#252525]"
                      : "border-[#D4CFC4]"
                  }`}
                >
                  <Truck className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium">Standard Delivery</p>
                    <p className="text-[11px] text-[#66635B]">
                      Free over $75 ($8 otherwise)
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`border p-4 flex items-center gap-3 text-left cursor-pointer ${
                    deliveryMethod === "pickup"
                      ? "border-2 border-[#252525]"
                      : "border-[#D4CFC4]"
                  }`}
                >
                  <Store className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium">Pick up in store</p>
                    <p className="text-[11px] text-[#66635B]">
                      Complimentary • Ready in 2 hrs
                    </p>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <input
                  type="text"
                  required
                  placeholder="Full name*"
                  value={customerNameValue}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="border border-[#D4CFC4] px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#252525]"
                />
                <input
                  type="email"
                  required
                  placeholder="Email address*"
                  value={customerEmailValue}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="border border-[#D4CFC4] px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#252525]"
                />
              </div>

              {deliveryMethod === "delivery" ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    required
                    placeholder="Street address*"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full border border-[#D4CFC4] px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#252525]"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="City*"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="border border-[#D4CFC4] px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#252525]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Country*"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="border border-[#D4CFC4] px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#252525]"
                    />
                    <input
                      type="text"
                      placeholder="Postal code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="border border-[#D4CFC4] px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-[#252525]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[12px] text-[#57534E] mb-1.5">
                    Select Boutique Location
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full border border-[#D4CFC4] px-3.5 py-2.5 text-[13px] bg-white focus:outline-none"
                  >
                    {BOUTIQUES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </section>

            {/* 2. Payment Method */}
            <section className="bg-white border border-[#EAE6DC] p-4 sm:p-6 space-y-5">
              <h2 className="text-[16px] font-medium">2. Payment method</h2>

              <div className="space-y-3">
                <label
                  className={`block border p-4 cursor-pointer ${
                    paymentMethod === "card-sandbox"
                      ? "border-2 border-[#252525]"
                      : "border-[#D4CFC4]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3 text-[13px] font-medium">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "card-sandbox"}
                        onChange={() => setPaymentMethod("card-sandbox")}
                        className="accent-[#252525]"
                      />
                      <CreditCard className="w-4 h-4" />
                      Card Payment (Demo Sandbox)
                    </span>
                    <span className="text-[11px] text-[#9C6D3E]">
                      Test mode — no real charge
                    </span>
                  </div>

                  {paymentMethod === "card-sandbox" && (
                    <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#EAE6DC]">
                      <input
                        type="text"
                        defaultValue="4242 •••• •••• 4242"
                        readOnly
                        className="col-span-3 sm:col-span-1 border border-[#D4CFC4] bg-[#FAF8F2] px-3 py-2 text-[12px]"
                      />
                      <input
                        type="text"
                        defaultValue="12/28"
                        readOnly
                        className="border border-[#D4CFC4] bg-[#FAF8F2] px-3 py-2 text-[12px]"
                      />
                      <input
                        type="text"
                        defaultValue="424"
                        readOnly
                        className="border border-[#D4CFC4] bg-[#FAF8F2] px-3 py-2 text-[12px]"
                      />
                    </div>
                  )}
                </label>

                <label
                  className={`flex items-center gap-3 border p-4 cursor-pointer text-[13px] font-medium ${
                    paymentMethod === "cod"
                      ? "border-2 border-[#252525]"
                      : "border-[#D4CFC4]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-[#252525]"
                  />
                  <Banknote className="w-4 h-4" />
                  <span>Cash on Delivery (COD)</span>
                </label>
              </div>

              {error && <p className="text-[12px] text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#333333] hover:bg-[#1A1A1A] disabled:opacity-50 text-white py-4 text-[13px] font-medium transition-colors cursor-pointer"
              >
                {submitting
                  ? "Processing order..."
                  : `Place order — $${total.toFixed(2)}`}
              </button>
            </section>
          </div>

          {/* RIGHT 5 COLS: Order Summary */}
          <aside className="lg:col-span-5 bg-white border border-[#EAE6DC] p-4 sm:p-6 space-y-5">
            <h2 className="text-[18px] font-medium">Order Summary</h2>

            <div className="divide-y divide-[#EAE6DC]">
              {cart.map((item) => (
                <div
                  key={item.cartKey}
                  className="py-3.5 flex items-center justify-between gap-4 text-[13px]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover bg-[#F7F5EE]"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-[12px] text-[#66635B]">
                        {item.selectedVariant || "Standard"} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {checkoutMeta?.samples?.length > 0 && (
              <p className="text-[12px] text-[#57534E] border-t border-[#EAE6DC] pt-3">
                + {checkoutMeta.samples.length} complimentary sample(s) included
              </p>
            )}

            <div className="border-t border-[#EAE6DC] pt-4 space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#9C6D3E]">
                  <span>Promo ({promoCode})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-[16px] font-medium pt-3 border-t border-[#EAE6DC]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
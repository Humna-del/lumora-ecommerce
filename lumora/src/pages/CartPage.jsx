import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
  Info,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  X,
  Minus,
  Plus,
} from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import GiftOptionsSheet from "@/components/store/GiftOptionsSheet";

const SAMPLES = [
  {
    id: "smp-1",
    name: "Moroccan Neroli Lotion",
    desc: "A light facial hydrator that absorbs swiftly.",
    image: "/photos/x1.jpg",
  },
  {
    id: "smp-2",
    name: "Parsley Seed Masque",
    desc: "A clay-based formulation that refreshes skin.",
    image: "/photos/x2.jpg",
  },
  {
    id: "smp-3",
    name: "Lucent Facial Refiner",
    desc: "A gentle yet effective exfoliating polish.",
    image: "/photos/x3.jpg",
  },
  {
    id: "smp-4",
    name: "Seeking Silence Hydrator",
    desc: "A calm moisturising lotion for sensitive skin.",
    image: "/photos/x4.jpg",
  },
  {
    id: "smp-5",
    name: "Geranium Body Balm",
    desc: "A citrus-scented nourishing hand and body cream.",
    image: "/photos/x5.jpg",
  },
];

export default function CartPage({
  cart,
  catalogProducts = [],
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  onProceedToCheckout,
}) {
  const navigate = useNavigate();

  // Samples state (max 3)
  const [samplesOpen, setSamplesOpen] = useState(true);
  const [selectedSamples, setSelectedSamples] = useState([]);
  const [sampleOffset, setSampleOffset] = useState(0);

  // Gift options state
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [giftOptions, setGiftOptions] = useState({
    bagSelected: false,
    addMessage: false,
    message: "",
  });

  // Order summary accordions
  const [giftCardOpen, setGiftCardOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(true);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleSample = (id) => {
    setSelectedSamples((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 3) return prev; // Max 3 complimentary samples
      return [...prev, id];
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal === 0 || subtotal >= 75 ? 0 : 8;
  const discount = appliedPromo === "LUMORA15" ? subtotal * 0.15 : 0;
  const estimatedTotal = Math.max(0, subtotal - discount + shipping);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === "LUMORA15") {
      setAppliedPromo("LUMORA15");
      setPromoError("");
    } else {
      setAppliedPromo(null);
      setPromoError("Invalid code. Try LUMORA15 for 15% off.");
    }
  };

  const recommendations = useMemo(() => {
    const inCart = new Set(cart.map((i) => i._id));
    return catalogProducts.filter((p) => !inCart.has(p._id)).slice(0, 4);
  }, [cart, catalogProducts]);

  const giftSummary = [
    giftOptions.bagSelected && "Recycled Cotton Bag",
    giftOptions.addMessage && "Gift message",
  ]
    .filter(Boolean)
    .join(" + ");

  return (
    <main className="min-h-screen bg-[#FFFEF2] text-[#252525] py-6 sm:py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Top Notice Banner */}
        <div className="bg-[#F6F5E4] px-3 sm:px-4 py-3 mb-8 sm:mb-10 flex items-center justify-center gap-3 text-[12px] sm:text-[13px] text-[#252525]">
          <Info className="w-4 h-4 shrink-0" />
          <p>
            A fleeting 15% reduction in The Lumora Gift Gathering using code{" "}
            <strong className="font-medium">LUMORA15</strong> at checkout.
          </p>
        </div>

        {/* Heading */}
        <div className="flex items-baseline gap-3 mb-8">
          <h1 className="font-serif text-3xl md:text-[36px] font-normal">
            Your Cart
          </h1>
          <span className="text-[14px] text-[#66635B]">
            ({totalItems} {totalItems === 1 ? "item" : "items"})
          </span>
        </div>

        {/* 2-Column Main Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          {/* LEFT 8 COLUMNS */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Complimentary Samples Accordion */}
            <div className="bg-white border border-[#EAE6DC] p-4 sm:p-6">
              <button
                type="button"
                onClick={() => setSamplesOpen((p) => !p)}
                className="flex items-center justify-between w-full text-left cursor-pointer"
              >
                <div>
                  <h2 className="text-[15px] font-medium">
                    Add your complimentary samples
                  </h2>
                  <p className="text-[13px] text-[#66635B] mt-0.5">
                    You have {selectedSamples.length}/3 samples selected
                  </p>
                </div>
                {samplesOpen ? (
                  <ChevronUp className="w-5 h-5 stroke-[1.5]" />
                ) : (
                  <ChevronDown className="w-5 h-5 stroke-[1.5]" />
                )}
              </button>

              {samplesOpen && (
                <div className="mt-6">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setSampleOffset((p) => Math.max(0, p - 1))}
                      disabled={sampleOffset === 0}
                      className="hidden md:flex absolute -left-3 top-1/3 z-10 p-1 text-[#252525] disabled:opacity-25 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
                      {SAMPLES.slice(sampleOffset, sampleOffset + 4).map(
                        (smp) => {
                          const checked = selectedSamples.includes(smp.id);
                          const disabled =
                            !checked && selectedSamples.length >= 3;
                          return (
                            <label
                              key={smp.id}
                              className={`block border p-3 transition-colors ${
                                checked
                                  ? "border-[#252525]"
                                  : "border-transparent hover:border-[#D4CFC4]"
                              } ${
                                disabled ? "opacity-45 cursor-not-allowed" : "cursor-pointer"
                              }`}
                            >
                              <div className="flex items-start gap-2 mb-3">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  disabled={disabled}
                                  onChange={() => toggleSample(smp.id)}
                                  className="mt-0.5 w-4 h-4 accent-[#252525]"
                                />
                                <div className="aspect-square w-full bg-[#F7F5EE] overflow-hidden">
                                  <img
                                    src={smp.image}
                                    alt={smp.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </div>
                              <p className="text-[13px] font-medium leading-snug mb-1">
                                {smp.name}
                              </p>
                              <p className="text-[12px] text-[#66635B] line-clamp-2">
                                {smp.desc}
                              </p>
                            </label>
                          );
                        }
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSampleOffset((p) =>
                          Math.min(SAMPLES.length - 4, p + 1)
                        )
                      }
                      disabled={sampleOffset >= SAMPLES.length - 4}
                      className="hidden md:flex absolute -right-3 top-1/3 z-10 p-1 text-[#252525] disabled:opacity-25 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[#66635B] mt-5">
                    While supplies last.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Cart Items List */}
            {cart.length === 0 ? (
              <div className="bg-white border border-[#EAE6DC] p-12 text-center">
                <p className="text-[15px] text-[#57534E] mb-5">
                  Your cart is currently empty.
                </p>
                <Link
                  to="/category/all"
                  className="inline-block bg-[#333333] hover:bg-[#1A1A1A] text-white px-8 py-3 text-[13px]"
                >
                  Explore formulations
                </Link>
              </div>
            ) : (
              <div className="bg-white border border-[#EAE6DC] divide-y divide-[#EAE6DC]">
                {cart.map((item) => (
                  <div key={item.cartKey} className="p-4 sm:p-6 flex gap-3 sm:gap-5">
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="w-24 h-24 bg-[#F7F5EE] shrink-0 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <button
                            type="button"
                            onClick={() => navigate(`/product/${item._id}`)}
                            className="text-[15px] font-semibold hover:underline text-left cursor-pointer"
                          >
                            {item.name}
                          </button>
                          <p className="text-[13px] text-[#66635B] mt-0.5 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <Bookmark className="w-4 h-4 text-[#57534E] stroke-[1.5]" />
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartKey)}
                            aria-label="Remove item"
                            className="text-[#57534E] hover:text-[#252525] cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
                        <span className="text-[13px] text-[#57534E]">
                          {item.selectedVariant || "Standard"}
                        </span>

                        <div className="flex items-center gap-8">
                          {/* Quantity Stepper */}
                          <div className="relative inline-flex items-center border border-[#D4CFC4] px-2 py-1.5">
                            <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-[#66635B]">
                              Quantity
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartKey, -1)}
                              className="p-1 hover:opacity-60 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-[13px]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartKey, 1)}
                              className="p-1 hover:opacity-60 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <p className="text-[15px] w-20 text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Add Gift Options Trigger Row */}
            <button
              type="button"
              onClick={() => setIsGiftOpen(true)}
              className="w-full bg-white border border-[#EAE6DC] hover:border-[#252525] px-6 py-4 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div>
                <span className="text-[14px] font-medium">
                  Add gift options
                </span>
                {giftSummary && (
                  <p className="text-[12px] text-[#9C6D3E] mt-0.5">
                    {giftSummary}
                  </p>
                )}
              </div>
              <span className="inline-flex items-center gap-1.5 text-[13px]">
                <span>{giftSummary ? "Edit" : "Select"}</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </div>

          {/* RIGHT 4 COLUMNS: Order Summary */}
          <aside className="lg:col-span-4 bg-white border border-[#EAE6DC] p-4 sm:p-6 space-y-5">
            <h2 className="text-[18px] font-medium">Order summary</h2>

            <div className="space-y-3 text-[13px] pb-4 border-b border-[#EAE6DC]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-[#9C6D3E]">
                  <span>Promo ({appliedPromo} — 15%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="inline-flex items-center gap-1.5">
                  Shipping
                  <Info className="w-3.5 h-3.5 text-[#57534E]" />
                </span>
                <span>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-[#66635B]">
                <span>Estimated Tax</span>
                <span>$0.00</span>
              </div>
            </div>

            {/* Redeem Gift Card Accordion */}
            <div className="border-b border-[#EAE6DC] pb-4">
              <button
                type="button"
                onClick={() => setGiftCardOpen((p) => !p)}
                className="flex items-center justify-between w-full text-[14px] font-medium cursor-pointer"
              >
                <span>Redeem Gift Card</span>
                {giftCardOpen ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
              {giftCardOpen && (
                <div className="mt-3 flex">
                  <input
                    type="text"
                    placeholder="Gift card code"
                    className="flex-1 border border-[#D4CFC4] px-3 py-2 text-[13px] focus:outline-none"
                  />
                  <button
                    type="button"
                    className="bg-[#333333] text-white px-4 text-[12px] cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Add a Promo Code Accordion */}
            <div className="border-b border-[#EAE6DC] pb-4">
              <button
                type="button"
                onClick={() => setPromoOpen((p) => !p)}
                className="flex items-center justify-between w-full text-[14px] font-medium cursor-pointer"
              >
                <span>Add a promo code</span>
                {promoOpen ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>

              {promoOpen && (
                <form onSubmit={handleApplyPromo} className="mt-3 space-y-2">
                  <div className="flex">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Enter your promo code"
                      className="flex-1 border border-[#D4CFC4] px-3 py-2.5 text-[13px] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-[#333333] hover:bg-[#1A1A1A] text-white px-5 text-[13px] font-medium cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-red-700">{promoError}</p>
                  )}
                  {appliedPromo && (
                    <p className="text-[11px] text-[#9C6D3E]">
                      Code {appliedPromo} applied!
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Estimated Total */}
            <div className="flex items-center justify-between text-[16px] font-medium pt-1">
              <span>Estimated total</span>
              <span>${estimatedTotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() =>
                onProceedToCheckout({
                  samples: selectedSamples,
                  giftOptions,
                  promoCode: appliedPromo,
                  deliveryMethod: "delivery",
                })
              }
              className="w-full bg-[#333333] hover:bg-[#1A1A1A] disabled:opacity-40 text-white py-3.5 text-[13px] font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Proceed to checkout
            </button>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() =>
                onProceedToCheckout({
                  samples: selectedSamples,
                  giftOptions,
                  promoCode: appliedPromo,
                  deliveryMethod: "pickup",
                })
              }
              className="w-full bg-[#333333] hover:bg-[#1A1A1A] disabled:opacity-40 text-white py-3.5 text-[13px] font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Pick up in store instead
            </button>

            <p className="text-[12px] text-[#57534E] text-center pt-1">
              or 4 interest-free payments of ${(estimatedTotal / 4).toFixed(2)}
            </p>

            {/* Secure Payment Badges */}
            <div className="pt-5 border-t border-[#EAE6DC]">
              <p className="text-[14px] font-medium mb-1.5">Secure payment</p>
              <p className="text-[11px] text-[#66635B] leading-relaxed mb-4">
                All transactions are encrypted and verified server-side via
                permitted payment methods:
              </p>

              <div className="grid grid-cols-4 gap-2 text-[10px] font-semibold tracking-wider text-center">
                {[
                  "VISA",
                  "MASTERCARD",
                  "AMEX",
                  "DISCOVER",
                  "APPLE PAY",
                  "PAYPAL",
                  "UNIONPAY",
                  "COD",
                ].map((method) => (
                  <div
                    key={method}
                    className="border border-[#D4CFC4] bg-[#FAF8F2] py-2 px-1 text-[#252525]"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom "You May Also Like" */}
        <section className="mt-20 pt-14 border-t border-[#E2DDD2]">
          <h2 className="text-2xl font-normal mb-10">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                align="left"
                onAddToCart={onAddToCart}
                onQuickView={(p) => navigate(`/product/${p._id}`)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Right-side Gift Options Sheet */}
      <GiftOptionsSheet
        open={isGiftOpen}
        onOpenChange={setIsGiftOpen}
        giftOptions={giftOptions}
        onApply={setGiftOptions}
      />
    </main>
  );
}
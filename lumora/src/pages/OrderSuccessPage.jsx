import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Check } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch(`/orders/${id}`)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <main className="min-h-[70vh] bg-[#FFFEF2] flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="text-sm text-red-700">{error}</p>
          <Link to="/" className="underline text-sm">
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-[70vh] bg-[#FFFEF2] flex items-center justify-center text-sm text-[#66635B]">
        Retrieving your order receipt...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFEF2] text-[#252525] py-14 px-6">
      <div className="max-w-2xl mx-auto bg-white border border-[#EAE6DC] p-8 md:p-12 space-y-8">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#252525] text-white">
            <Check className="w-6 h-6" />
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-normal">
            Thank you, {order.customerName}
          </h1>
          <p className="text-[13px] text-[#57534E]">
            Your order has been confirmed and recorded in our dispatch archive.
          </p>
          <p className="text-[12px] text-[#9C6D3E] font-medium">
            Order Reference: #{order._id.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-4 border-y border-[#EAE6DC] py-5 text-[12px]">
          <div>
            <p className="text-[#66635B] mb-1">Delivery Method</p>
            <p className="font-medium capitalize">{order.deliveryMethod}</p>
            <p className="text-[#57534E] mt-0.5">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}
            </p>
          </div>
          <div>
            <p className="text-[#66635B] mb-1">Payment Status</p>
            <p className="font-medium capitalize">
              {order.paymentStatus} ({order.paymentMethod})
            </p>
            <p className="text-[#57534E] mt-0.5">
              Status: {order.orderStatus}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-[13px]"
            >
              <span>
                {item.name} ({item.selectedVariant}) × {item.quantity}
              </span>
              <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-[#EAE6DC] pt-4 space-y-1.5 text-[13px]">
          <div className="flex justify-between text-[#57534E]">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[#9C6D3E]">
              <span>Promo ({order.promoCode})</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-[#57534E]">
            <span>Shipping</span>
            <span>
              {order.shippingFee === 0 ? "Free" : `$${order.shippingFee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-[16px] font-medium pt-2">
            <span>Total</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-4 text-center">
          <Link
            to="/"
            className="inline-block bg-[#333333] hover:bg-[#1A1A1A] text-white px-10 py-3.5 text-[13px] transition-colors"
          >
            Return to storefront
          </Link>
        </div>
      </div>
    </main>
  );
}
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Check, X, Minus, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import ProductCard from "@/components/store/ProductCard";

export default function CartDrawer({
  open,
  onOpenChange,
  cart,
  catalogProducts = [],
  justAdded,
  onUpdateQuantity,
  onAddToCart,
}) {
  const navigate = useNavigate();

  // Suggest 2 products not currently in the cart
  const recommendations = useMemo(() => {
    const inCartIds = new Set(cart.map((item) => item._id));
    return catalogProducts.filter((p) => !inCartIds.has(p._id)).slice(0, 2);
  }, [cart, catalogProducts]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleGoToProduct = (product) => {
    onOpenChange(false);
    navigate(`/product/${product._id}`);
  };

  const handleGoToCartPage = () => {
    onOpenChange(false);
    navigate("/cart");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-[440px] p-0 flex flex-col bg-white text-[#252525] rounded-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2DDD2]">
          <div className="flex items-center gap-3">
            {justAdded && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#D8D3C8] text-white">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            )}
            <SheetTitle className="text-[16px] font-medium">
              {justAdded ? "Added to cart" : "My cart"}
            </SheetTitle>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close cart drawer"
            className="p-1 hover:opacity-70 cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="py-10 text-center text-[14px] text-[#66635B]">
              Your cart is currently empty.
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.cartKey}
                  className="border border-transparent hover:border-[#252525] p-3 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Clickable Thumbnail */}
                    <button
                      type="button"
                      onClick={() => handleGoToProduct(item)}
                      className="w-16 h-16 bg-[#F7F5EE] shrink-0 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </button>

                    {/* Item Details + Quantity Stepper */}
                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleGoToProduct(item)}
                        className="text-left text-[14px] font-semibold hover:underline cursor-pointer"
                      >
                        {item.name}
                      </button>

                      {item.description && (
                        <p className="text-[12px] text-[#66635B] line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      )}

                      {item.selectedVariant && (
                        <p className="text-[12px] text-[#252525] mt-1.5">
                          {item.selectedVariant}
                        </p>
                      )}

                      <div className="flex items-end justify-between gap-4 mt-4">
                        {/* Floating Quantity Box */}
                        <div className="relative inline-flex items-center border border-[#D4CFC4] px-2 py-1.5">
                          <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-[#66635B]">
                            Quantity
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartKey, -1)}
                            aria-label="Decrease quantity"
                            className="p-1 text-[#252525] hover:opacity-60 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-[13px]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartKey, 1)}
                            aria-label="Increase quantity"
                            className="p-1 text-[#252525] hover:opacity-60 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <p className="text-[14px] font-normal">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reused ProductCard for "You May Also Like" */}
          <div className="pt-2 border-t border-[#E2DDD2]">
            <h3 className="text-[18px] font-normal mb-5">
              You May Also Like
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {recommendations.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  align="left"
                  onAddToCart={onAddToCart}
                  onQuickView={handleGoToProduct}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-6 border-t border-[#E2DDD2] bg-white space-y-2.5">
          {cart.length > 0 && (
            <div className="flex items-center justify-between text-[13px] pb-2">
              <span className="text-[#66635B]">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoToCartPage}
            className="w-full bg-[#333333] hover:bg-[#1A1A1A] text-white py-3.5 text-[13px] font-medium transition-colors cursor-pointer"
          >
            Go to my cart
          </button>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full border border-[#D4CFC4] hover:border-[#252525] bg-white text-[#252525] py-3.5 text-[13px] font-medium transition-colors cursor-pointer"
          >
            Continue shopping
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
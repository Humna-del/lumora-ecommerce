import { useState } from "react";
import { Bookmark } from "lucide-react";

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  buttonText = "Add to cart",
  align = "center", // "center" for homepage, "left" for category grid
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const hasVariants = product.variants && product.variants.length > 0;
  const activeVariant = hasVariants
    ? product.variants[selectedVariantIndex]
    : null;
  const displayPrice = activeVariant ? activeVariant.price : product.price;

  const handleAdd = () => {
    onAddToCart({
      ...product,
      price: displayPrice,
      selectedVariant: activeVariant ? activeVariant.label : product.format || "",
    });
  };

  return (
    <div
      className={`group flex flex-col h-full ${
        align === "left" ? "text-left" : "text-center"
      }`}
    >
      {/* Badge + Bookmark */}
      <div className="flex items-center justify-between min-h-[24px] px-1 mb-2">
        <span className="text-xs font-medium text-[#9C6D3E]">
          {product.badge || ""}
        </span>

        <button
          type="button"
          onClick={() => setIsBookmarked((prev) => !prev)}
          aria-label="Save item"
          className="text-[#252525] hover:opacity-70 transition-opacity cursor-pointer"
        >
          <Bookmark
            className={`w-4 h-4 stroke-[1.5] ${
              isBookmarked ? "fill-[#252525]" : ""
            }`}
          />
        </button>
      </div>

      {/* Image + Smooth Hover Swap */}
      <button
        type="button"
        onClick={() => onQuickView && onQuickView(product)}
        className="relative aspect-[4/4] w-full bg-[#F7F5EE]/60 overflow-hidden mb-5 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product.name} lifestyle`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        )}
      </button>

      {/* Info */}
      <div className="flex flex-col flex-1">
        <h3 className="text-[15px] font-semibold text-[#252525] mb-1.5">
          {product.name}
        </h3>

        <p className="text-[13px] text-[#57534E] leading-relaxed mb-4 min-h-[40px]">
          {product.description}
        </p>

        <div className="mt-auto">
          {/* Size Dropdown (shown when variants exist, like on Category Page) */}
          {hasVariants ? (
            <div className="relative border border-[#D4CFC4] mb-3 bg-transparent">
              <span className="absolute -top-2 left-3 bg-[#FFFEF2] px-1 text-[11px] text-[#66635B]">
                Size
              </span>
              <select
                value={selectedVariantIndex}
                onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
                className="w-full bg-transparent px-3 py-2.5 text-[13px] text-[#252525] focus:outline-none cursor-pointer"
              >
                {product.variants.map((v, idx) => (
                  <option key={v.label} value={idx}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              {product.sizeLabel && (
                <p className="text-[12px] text-[#7A766D] mb-0.5">
                  {product.sizeLabel}
                </p>
              )}
              {product.format && (
                <p className="text-[13px] text-[#252525] mb-3">
                  {product.format}
                </p>
              )}
            </>
          )}

          <p className="text-[15px] text-[#252525] mb-4">
            ${displayPrice.toFixed(2)}
          </p>

          <button
            type="button"
            onClick={handleAdd}
            className="w-full bg-[#333333] hover:bg-[#1A1A1A] text-white py-3.5 text-[13px] font-medium transition-colors cursor-pointer"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";

export default function ProductCarousel({
  title,
  subtitle,
  products,
  onAddToCart,
  onQuickView,
  bgClass = "bg-[#FFFEF2]",
  buttonText = "Add to cart",
  footerCta,
  onFooterCtaClick,
}) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;
  const maxIndex = Math.max(0, products.length - visibleCount);
  const canScroll = products.length > visibleCount;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className={`py-16 md:py-24 ${bgClass}`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-serif text-3xl md:text-[40px] font-normal text-[#252525] mb-3">
            {title}
          </h2>
          <p className="text-[14px] text-[#57534E] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Smooth Sliding Track */}
        <div className="relative">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canScroll || startIndex === 0}
            aria-label="Previous products"
            className="hidden md:flex absolute -left-8 top-[38%] -translate-y-1/2 z-10 p-2 text-[#252525] disabled:opacity-25 hover:opacity-70 transition-opacity cursor-pointer disabled:cursor-default"
          >
            <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
          </button>

          <div className="overflow-x-auto md:overflow-hidden">
            <div
              style={{ "--prod-offset": `-${startIndex * (100 / 3)}%` }}
              className="flex -mx-4 transition-transform duration-500 ease-out md:[transform:translateX(var(--prod-offset))]"
            >
              {products.map((product) => (
                <div
                  key={product._id}
                  className="w-[85%] sm:w-[48%] md:w-1/3 shrink-0 px-4"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    onQuickView={onQuickView}
                    buttonText={buttonText}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canScroll || startIndex >= maxIndex}
            aria-label="Next products"
            className="hidden md:flex absolute -right-8 top-[38%] -translate-y-1/2 z-10 p-2 text-[#252525] disabled:opacity-25 hover:opacity-70 transition-opacity cursor-pointer disabled:cursor-default"
          >
            <ChevronRight className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Optional Bottom "Discover more ->" CTA */}
        {footerCta && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={onFooterCtaClick}
              className="inline-flex items-center gap-6 border border-[#B5B0A4] px-8 py-3.5 text-[13px] font-medium text-[#252525] hover:bg-[#252525] hover:text-white hover:border-[#252525] transition-colors duration-300 cursor-pointer"
            >
              <span>{footerCta}</span>
              <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
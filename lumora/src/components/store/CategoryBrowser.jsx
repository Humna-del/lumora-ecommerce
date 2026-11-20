import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/data/categories";

export default function CategoryBrowser({ onSelectCategory }) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 5;
  const maxIndex = Math.max(0, CATEGORIES.length - visibleCount);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-16 md:py-20 bg-[#EBE7DD]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <h2 className="font-serif text-3xl md:text-[38px] font-normal text-[#252525] mb-10">
          Browse by category
        </h2>

        <div className="relative">
          {/* Left Arrow (<) */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={startIndex === 0}
            aria-label="Previous categories"
            className="hidden md:flex absolute -left-8 top-[42%] -translate-y-1/2 z-10 p-2 text-[#252525] disabled:opacity-25 hover:opacity-70 transition-opacity cursor-pointer disabled:cursor-default"
          >
            <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
          </button>

          {/* Viewport hides overflowing cards */}
          <div className="overflow-x-auto md:overflow-hidden">
            {/* Sliding Track: moves smoothly by 20% (1/5) per click on desktop */}
            <div
              style={{ "--slide-offset": `-${startIndex * 20}%` }}
              className="flex -mx-2 transition-transform duration-500 ease-out md:[transform:translateX(var(--slide-offset))]"
            >
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="w-[70%] sm:w-[42%] md:w-1/5 shrink-0 px-2"
                >
                  <button
                    type="button"
                    onClick={() => onSelectCategory && onSelectCategory(cat)}
                    className="group w-full text-left cursor-pointer"
                  >
                    <div className="aspect-[5/4] w-full bg-[#DDD8CC] overflow-hidden mb-3">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <p className="text-[14px] text-[#252525] group-hover:underline underline-offset-4">
                      {cat.name}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow (>) */}
          <button
            type="button"
            onClick={handleNext}
            disabled={startIndex >= maxIndex}
            aria-label="Next categories"
            className="hidden md:flex absolute -right-8 top-[42%] -translate-y-1/2 z-10 p-2 text-[#252525] disabled:opacity-25 hover:opacity-70 transition-opacity cursor-pointer disabled:cursor-default"
          >
            <ChevronRight className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}
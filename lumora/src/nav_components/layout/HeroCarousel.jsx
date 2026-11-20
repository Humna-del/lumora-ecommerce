import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { heroSlides } from "@/data/heroSlides";

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === heroSlides.length - 1 ? 0 : prev + 1
    );
  };

  const activeSlide = heroSlides[currentIndex];

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-[#252525]">
      {/* Render ALL slides stacked, crossfading opacity smoothly */}
      {heroSlides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
            }`}
          >
            {slide.mediaType === "video" ? (
              <video
                src={slide.mediaSrc}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={slide.mediaSrc}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        );
      })}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/65 via-black/20 to-black/35 pointer-events-none" />

      {/* Left Arrow (<) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-7 h-7 stroke-[1.5]" />
      </button>

      {/* Right Arrow (>) */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
      >
        <ChevronRight className="w-7 h-7 stroke-[1.5]" />
      </button>

      {/* Bottom Centered Text (fades smoothly via key on text block) */}
      <div
        key={activeSlide.id}
        className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-6 text-center text-white animate-in fade-in duration-700"
      >
        <p className="text-xs md:text-sm tracking-wide mb-2.5 text-white/90">
          {activeSlide.eyebrow}
        </p>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-[52px] font-normal leading-tight mb-4">
          {activeSlide.title}
        </h1>

        <p className="text-sm md:text-base font-light text-white/90 mb-7">
          {activeSlide.subtitle}
        </p>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-8 border border-white/80 px-10 py-3.5 text-sm font-medium text-white hover:bg-white hover:text-[#252525] transition-colors duration-300 cursor-pointer"
        >
          <span>{activeSlide.ctaText}</span>
          <ArrowRight className="w-4 h-4 stroke-[1.5]" />
        </button>
      </div>
    </section>
  );
}
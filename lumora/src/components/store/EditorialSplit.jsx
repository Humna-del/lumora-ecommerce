import { ArrowRight } from "lucide-react";

export default function EditorialSplit({
  eyebrow,
  title,
  description,
  ctaText,
  image,
  imagePosition = "right", // "left" or "right"
  bgClass = "bg-[#DFDCD2]",
  onCtaClick,
}) {
  const isImageLeft = imagePosition === "left";

  return (
    <section className={`py-14 md:py-20 ${bgClass}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-0">
        {/* Image Side (7 of 12 columns, bleeds cleanly to the screen edge) */}
        <div
          className={`lg:col-span-7 ${
            isImageLeft ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div className="aspect-[16/10] w-full bg-[#CFCAC0] overflow-hidden">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Text Side (5 of 12 columns) */}
        <div
          className={`lg:col-span-5 px-6 md:px-12 lg:px-16 xl:px-24 ${
            isImageLeft ? "lg:order-2" : "lg:order-1"
          }`}
        >
          {eyebrow && (
            <p className="text-[13px] font-medium text-[#252525] mb-3">
              {eyebrow}
            </p>
          )}

          <h2 className="font-serif text-3xl md:text-[40px] font-normal leading-tight text-[#252525] mb-4">
            {title}
          </h2>

          <p className="text-[14px] text-[#45433E] leading-relaxed mb-8 max-w-md">
            {description}
          </p>

          <button
            type="button"
            onClick={onCtaClick}
            className="inline-flex items-center justify-between gap-10 border border-[#B5B0A4] px-7 py-3.5 text-[13px] font-medium text-[#252525] hover:bg-[#252525] hover:text-white hover:border-[#252525] transition-colors duration-300 cursor-pointer"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}
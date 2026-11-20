import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { DEFAULT_FILTERS, FILTER_SECTIONS } from "@/lib/filterProducts";

export default function FilterDrawer({
  open,
  onOpenChange,
  appliedFilters,
  filterOptions,
  onApply,
}) {
  const [draft, setDraft] = useState(appliedFilters);
  const [openSections, setOpenSections] = useState({ price: true, skinType: true });

  useEffect(() => {
    if (open) setDraft(appliedFilters);
  }, [open, appliedFilters]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleOption = (key, value) => {
    setDraft((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
      };
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-full sm:max-w-[380px] p-0 flex flex-col bg-white text-[#252525] rounded-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2DDD2]">
          <SheetTitle className="text-[15px] font-medium">Filter by</SheetTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-1.5 text-[13px] hover:opacity-70 cursor-pointer"
          >
            <span>Cancel</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Accordions */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E2DDD2]">
          {/* Price Accordion */}
          <div className="px-6 py-4">
            <button
              type="button"
              onClick={() => toggleSection("price")}
              className="flex items-center justify-between w-full text-[14px] font-medium cursor-pointer"
            >
              <span>Price</span>
              {openSections.price ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {openSections.price && (
              <div className="pt-5 pb-2 space-y-4">
                <input
                  type="range"
                  min={0}
                  max={300}
                  value={draft.maxPrice}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      maxPrice: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#252525] cursor-pointer"
                />
                <div className="flex items-center gap-3">
                  <div className="flex-1 border border-[#D4CFC4] px-3 py-2">
                    <span className="block text-[10px] text-[#7A766D]">Min.</span>
                    <input
                      type="number"
                      min={0}
                      value={draft.minPrice}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          minPrice: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-full text-[13px] focus:outline-none"
                    />
                  </div>
                  <span className="text-[#7A766D]">–</span>
                  <div className="flex-1 border border-[#D4CFC4] px-3 py-2">
                    <span className="block text-[10px] text-[#7A766D]">Max.</span>
                    <input
                      type="number"
                      min={0}
                      value={draft.maxPrice}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          maxPrice: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-full text-[13px] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Tag Accordions (Skin type, Skin concern, Form, Ingredients, Aroma) */}
          {FILTER_SECTIONS.map((section) => {
            const opts = filterOptions[section.key] || [];
            const isOpen = !!openSections[section.key];
            return (
              <div key={section.key} className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => toggleSection(section.key)}
                  className="flex items-center justify-between w-full text-[14px] font-medium cursor-pointer"
                >
                  <span>{section.label}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {isOpen && (
                  <div className="pt-4 flex flex-wrap gap-2">
                    {opts.map(({ value, count }) => {
                      const active = draft[section.key].includes(value);
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleOption(section.key, value)}
                          className={`border px-3 py-1.5 text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                            active
                              ? "border-[#252525] bg-[#252525] text-white"
                              : "border-[#D4CFC4] text-[#252525] hover:border-[#252525]"
                          }`}
                        >
                          {value} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sticky Footer: RESET ALL + APPLY */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2DDD2] bg-white">
          <button
            type="button"
            onClick={() => setDraft(DEFAULT_FILTERS)}
            className="text-[12px] font-medium uppercase tracking-wider hover:underline cursor-pointer"
          >
            Reset all
          </button>

          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onOpenChange(false);
            }}
            className="inline-flex items-center gap-3 bg-[#333333] hover:bg-[#1A1A1A] text-white px-7 py-3 text-[12px] font-medium uppercase tracking-wider cursor-pointer"
          >
            <span>Apply</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
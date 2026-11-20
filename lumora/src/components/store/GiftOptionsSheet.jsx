import { useState } from "react";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export default function GiftOptionsSheet({
  open,
  onOpenChange,
  giftOptions,
  onApply,
}) {
  const [draft, setDraft] = useState(null);
  const options = draft ?? giftOptions;

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) setDraft(null);
    onOpenChange(nextOpen);
  };

  const handleApply = () => {
    onApply({
      bagSelected: options.bagSelected,
      addMessage: options.addMessage,
      message: options.addMessage ? options.message.trim() : "",
    });
    handleOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-[400px] p-0 flex flex-col bg-white text-[#252525] rounded-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2DDD2]">
          <SheetTitle className="text-[16px] font-medium">
            Add gift options
          </SheetTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="p-1 hover:opacity-70 cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Body Options */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Recycled Cotton Bag Option */}
          <label className="flex items-center justify-between gap-4 border border-[#E2DDD2] p-4 cursor-pointer hover:border-[#252525] transition-colors">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={options.bagSelected}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...(prev ?? giftOptions),
                    bagSelected: e.target.checked,
                  }))
                }
                className="w-4 h-4 accent-[#252525] cursor-pointer"
              />
              <div className="w-10 h-10 bg-[#F7F5EE] overflow-hidden shrink-0">
                <img
                  src="/images/cat-gifts.jpg"
                  alt="Cotton Bag"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-[13px]">Lumora Recycled Cotton Bag</span>
            </div>
            <span className="text-[13px] text-[#57534E]">Free</span>
          </label>

          {/* Gift Message Option */}
          <div className="border border-[#E2DDD2] p-4 space-y-3">
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={options.addMessage}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...(prev ?? giftOptions),
                      addMessage: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-[#252525] cursor-pointer"
                />
                <span className="text-[13px]">Add a message</span>
              </div>
              <span className="text-[13px] text-[#57534E]">Free</span>
            </label>

            {options.addMessage && (
              <textarea
                rows={3}
                maxLength={200}
                value={options.message}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...(prev ?? giftOptions),
                    message: e.target.value,
                  }))
                }
                placeholder="Write a personal note for the recipient..."
                className="w-full border border-[#D4CFC4] p-3 text-[13px] focus:outline-none focus:border-[#252525]"
              />
            )}
          </div>
        </div>

        {/* Sticky Apply Button */}
        <div className="p-6 border-t border-[#E2DDD2]">
          <button
            type="button"
            onClick={handleApply}
            className="w-full bg-[#333333] hover:bg-[#1A1A1A] text-white py-3.5 text-[13px] font-medium transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
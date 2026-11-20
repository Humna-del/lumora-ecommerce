export default function MegaMenu({ data, onClose, onNavigate }) {
  if (!data) return null;

  return (
    <div className="bg-white text-[#252525] border-t border-[#E2DDD2] shadow-md">
      <div className="max-w-[1440px] mx-auto px-8 py-10 grid grid-cols-12 gap-8">
        {/* Column 1: Category links */}
        <div className="col-span-3">
          <h3 className="text-[13px] font-semibold mb-4">Category</h3>
          <ul className="space-y-2.5 text-[13px]">
            {data.categories.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate ? onNavigate(cat) : onClose();
                  }}
                  className="text-left hover:underline underline-offset-4 cursor-pointer"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Notable formulations */}
        <div className="col-span-3">
          <h3 className="text-[13px] font-semibold mb-4">
            Notable formulations
          </h3>
          <ul className="space-y-2.5 text-[13px]">
            {data.notable.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-left hover:underline underline-offset-4 cursor-pointer"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Columns 3 & 4: Two editorial image cards */}
        <div className="col-span-6 grid grid-cols-2 gap-6">
          {data.featured.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={onClose}
              className="group text-left cursor-pointer"
            >
              <div className="aspect-[16/10] w-full bg-[#F3EFE6] overflow-hidden mb-3">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-[13px] group-hover:underline underline-offset-4">
                {card.title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
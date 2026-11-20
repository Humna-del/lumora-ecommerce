import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";

const SUGGESTED_TERMS = [
  "Cleansers",
  "Hydrators",
  "Gift Card",
  "Gifts",
  "Botanical Hand Balm",
];

export default function SearchPanel({ isOpen, products = [], onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const matchingProducts = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) return [];

    return products
      .filter((product) =>
        [product.name, product.description, product.category]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(searchTerm))
      )
      .slice(0, 5);
  }, [products, query]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (matchingProducts[0]) {
      handleProductSelect(matchingProducts[0]);
    }
  };

  const handleProductSelect = (product) => {
    navigate(`/product/${product._id}`);
    setQuery("");
    onClose();
  };

  return (
    <div className="bg-white text-[#252525] border-t border-[#E2DDD2] shadow-md">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-8 pb-12">
        {/* Search Input Row */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-between gap-4 pb-6 border-b border-transparent"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
            }}
            placeholder="I'm looking for..."
            autoFocus
            className="w-full bg-transparent text-2xl md:text-3xl font-light text-[#252525] placeholder:text-[#7A766D] focus:outline-none"
          />

          <button
            type="submit"
            aria-label="Submit search"
            className="p-2 text-[#252525] hover:opacity-70 transition-opacity cursor-pointer shrink-0"
          >
            <Search className="w-6 h-6 stroke-[1.5]" />
          </button>
        </form>

        {query.trim() ? (
          <div className="mt-6 max-w-xl">
            <p className="text-[13px] font-medium text-[#252525] mb-3">
              Matching products
            </p>
            {matchingProducts.length > 0 ? (
              <ul className="space-y-3">
                {matchingProducts.map((product) => (
                  <li key={product._id}>
                    <button
                      type="button"
                      onClick={() => handleProductSelect(product)}
                      className="flex w-full items-center gap-4 text-left hover:bg-[#F7F5EE] p-2 transition-colors cursor-pointer"
                    >
                      <img
                        src={product.image}
                        alt=""
                        className="w-14 h-14 object-cover bg-[#F7F5EE]"
                      />
                      <span className="flex-1">
                        <span className="block text-[13px] font-medium text-[#252525]">
                          {product.name}
                        </span>
                        <span className="block text-[12px] text-[#66635B]">
                          {product.category}
                        </span>
                      </span>
                      <span className="text-[13px] text-[#252525]">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-[#66635B]">
                No matching products found.
              </p>
            )}
          </div>
        ) : (
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-[260px]">
              <p className="text-[13px] font-medium text-[#252525] mb-3">
                Suggested
              </p>
              <ul className="space-y-2.5 text-[14px] text-[#57534E]">
                {SUGGESTED_TERMS.map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      onClick={() => setQuery(term)}
                      className="hover:text-[#252525] hover:underline underline-offset-4 transition-colors cursor-pointer text-left"
                    >
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
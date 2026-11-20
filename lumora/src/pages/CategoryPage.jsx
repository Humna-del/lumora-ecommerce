import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { SlidersHorizontal } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import {
  DEFAULT_FILTERS,
  getFilterOptions,
  filterAndSortProducts,
} from "@/lib/filterProducts";
import ProductCard from "@/components/store/ProductCard";
import FilterDrawer from "@/components/store/FilterDrawer";

export default function CategoryPage({
  products = [],
  onAddToCart,
  onQuickView,
}) {
  const { slug = "all" } = useParams();
  const navigate = useNavigate();

  const [filterState, setFilterState] = useState({
    slug,
    filters: DEFAULT_FILTERS,
  });
  const filters =
    filterState.slug === slug ? filterState.filters : DEFAULT_FILTERS;
  const setFilters = (nextFilters) => {
    setFilterState({
      slug,
      filters:
        typeof nextFilters === "function" ? nextFilters(filters) : nextFilters,
    });
  };
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Scroll to top when switching category; filter state is keyed by slug.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const activeCategory = CATEGORIES.find((c) => c.slug === slug);
  const categoryTitle = activeCategory ? activeCategory.name : "All Formulations";

  // Products belonging to the selected category (or all)
  const categoryProducts = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((p) => p.category === activeCategory.name);
  }, [activeCategory, products]);

  const filterOptions = useMemo(
    () => getFilterOptions(categoryProducts),
    [categoryProducts]
  );

  const visibleProducts = useMemo(
    () => filterAndSortProducts(categoryProducts, filters, sortBy),
    [categoryProducts, filters, sortBy]
  );

  return (
    <main className="min-h-screen bg-[#FFFEF2] text-[#252525] py-6 sm:py-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="text-[12px] text-[#66635B] mb-6 flex items-center gap-2">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-[#252525]">{categoryTitle}</span>
        </nav>

        {/* Horizontal Category Chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto mb-7 pb-1">
          <button
            type="button"
            onClick={() => navigate("/category/all")}
            className={`shrink-0 px-3.5 py-2 text-[12px] border transition-colors cursor-pointer ${
              slug === "all"
                ? "border-[#252525] font-medium"
                : "border-[#D4CFC4] text-[#57534E] hover:border-[#252525]"
            }`}
          >
            All Category
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(`/category/${cat.slug}`)}
              className={`shrink-0 px-3.5 py-2 text-[12px] border transition-colors cursor-pointer ${
                slug === cat.slug
                  ? "border-[#252525] font-medium"
                  : "border-[#D4CFC4] text-[#57534E] hover:border-[#252525]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Toolbar: Category Title + All Filters | Product Count + Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-8 sm:mb-10 border-b border-[#E2DDD2]">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <h1 className="font-serif text-2xl md:text-3xl font-normal">
              {categoryTitle}
            </h1>

            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="inline-flex items-center gap-2 text-[13px] font-medium hover:opacity-70 cursor-pointer"
            >
              <span>All filters</span>
              <SlidersHorizontal className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          <div className="flex items-center justify-between md:justify-start gap-4 text-[13px]">
            <span className="text-[#66635B] pr-4 border-r border-[#D4CFC4]">
              {visibleProducts.length} products
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-[#66635B]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-medium text-[#252525] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name-asc">Product name: A to Z</option>
                <option value="name-desc">Product name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4-Column Product Grid */}
        {visibleProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[15px] text-[#57534E] mb-4">
              No formulations match the selected filters.
            </p>
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="border border-[#252525] px-6 py-2.5 text-[13px] cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-10 sm:gap-y-14">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                align="left"
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Left Filter Sidebar */}
      <FilterDrawer
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        appliedFilters={filters}
        filterOptions={filterOptions}
        onApply={setFilters}
      />
    </main>
  );
}
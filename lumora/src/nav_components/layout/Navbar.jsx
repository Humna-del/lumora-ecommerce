import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Menu, X } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/data/navigation";
import MegaMenu from "@/nav_components/layout/MegaMenu";
import SearchPanel from "@/nav_components/layout/SearchPanel";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export default function Navbar({
  cartCount = 0,
  alwaysSolid = false,
  products = [],
  user,
  onOpenAuth,
  onOpenCart,
}) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuCategory, setMobileMenuCategory] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Navbar stays white if hovered, a MegaMenu is open, OR Search is open
  const isLight =
    alwaysSolid || isHovered || activeMenu !== null || isSearchOpen;

  const activeCategoryData = NAVIGATION_ITEMS.find(
    (item) => item.label === activeMenu
  );

  const handleCategoryClick = (label) => {
    setIsSearchOpen(false); // Close search if switching to a category
    setActiveMenu((prev) => (prev === label ? null : label));
  };

  const handleToggleSearch = () => {
    setActiveMenu(null); // Close MegaMenu if opening search
    setIsSearchOpen((prev) => !prev);
  };

  const handleCategoryNavigation = (categoryName) => {
    const slug = categoryName
      .toLowerCase()
      .replace(/^shop all\s+/, "")
      .replace(/&/g, "")
      .trim()
      .replace(/\s+/g, "-");
    const categorySlug =
      slug === "all-formulations" || slug === "all"
        ? "all"
        : slug;
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
    navigate(`/category/${categorySlug}`);
  };

  return (
    <header
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveMenu(null);
      }}
      className={`${
        alwaysSolid ? "relative" : "absolute"
      } top-0 left-0 right-0 z-30 transition-colors duration-300 ${
        isLight
          ? "bg-white text-[#252525] border-b border-[#E2DDD2]"
          : "bg-transparent text-white"
      }`}
    >
      {/* ---------------- MOBILE NAVBAR ---------------- */}
      <div className="flex xl:hidden items-center justify-between px-4 sm:px-6 py-4">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
          className="cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="font-serif text-2xl tracking-tight font-medium">
          Lumora.
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleToggleSearch}
            aria-label={isSearchOpen ? "Close search" : "Search"}
            className="cursor-pointer"
          >
            {isSearchOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open cart, ${cartCount} ${
              cartCount === 1 ? "item" : "items"
            }`}
            className="flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-medium ${
                isLight
                  ? "bg-[#252525] text-white"
                  : "border border-white text-white"
              }`}
            >
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* ---------------- DESKTOP 2-ROW NAVBAR ---------------- */}
      <div className="hidden xl:block max-w-[1440px] mx-auto px-8">
        {/* ROW 1 */}
        <div className="grid grid-cols-3 items-center pt-4 pb-2 text-[13px]">
          <div className="flex items-center gap-6">
            <a href="#stores" className="hover:opacity-70 transition-opacity">
              Stores
            </a>
            <a href="#service" className="hover:opacity-70 transition-opacity">
              Customer service
            </a>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="font-serif text-[34px] leading-none tracking-tight font-normal"
            >
              Lumora.
            </Link>
          </div>

          <div className="flex items-center justify-end gap-6">
            <button type="button" className="hover:opacity-70 transition-opacity cursor-pointer">
              Email sign up
            </button>
            <button
              type="button"
              onClick={onOpenAuth}
              className="hover:opacity-70 transition-opacity cursor-pointer"
            >
              {user ? user.name : "Account"}
            </button>
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
            >
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-medium transition-colors ${
                  isLight
                    ? "bg-[#252525] text-white"
                    : "border border-white text-white"
                }`}
              >
                {cartCount}
              </span>
              <span>My cart</span>
            </button>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="flex items-center justify-between pt-2 pb-0">
          <nav className="flex items-center gap-4 xl:gap-6 text-[13px] whitespace-nowrap">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = activeMenu === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleCategoryClick(item.label)}
                  className={`py-3 border-b-2 transition-colors cursor-pointer ${
                    isActive
                      ? "border-[#252525] font-medium"
                      : "border-transparent hover:border-current"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Search... / Close Toggle Button */}
          <button
            type="button"
            onClick={handleToggleSearch}
            className={`mb-2 flex items-center gap-2.5 text-[13px] px-4 py-2 min-w-[140px] cursor-pointer transition-colors ${
              isLight
                ? "border-l border-[#E2DDD2] text-[#252525] hover:opacity-70"
                : "border border-white/80 text-white hover:bg-white/10"
            }`}
          >
            {isSearchOpen ? (
              <>
                <X className="w-4 h-4 shrink-0" />
                <span className="font-medium">Close</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 shrink-0" />
                <span>Search...</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* REUSABLE MEGA MENU DROPDOWN */}
      <MegaMenu
        data={activeCategoryData}
        onClose={() => setActiveMenu(null)}
        onNavigate={handleCategoryNavigation}
      />

      <Sheet
        open={isMobileMenuOpen}
        onOpenChange={(open) => {
          setIsMobileMenuOpen(open);
          if (!open) setMobileMenuCategory(null);
        }}
      >
        <SheetContent
          side="left"
          showCloseButton
          className="w-full sm:max-w-[400px] gap-0 rounded-none bg-[#FFFEF2] p-0 text-[#252525]"
        >
          <div className="border-b border-[#E2DDD2] px-6 py-5">
            <SheetTitle className="font-serif text-2xl font-normal">
              Lumora.
            </SheetTitle>
          </div>
          <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-6 py-3">
            {NAVIGATION_ITEMS.map((item) => {
              const isExpanded = mobileMenuCategory === item.label;
              return (
                <div key={item.label} className="border-b border-[#E2DDD2]">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileMenuCategory(isExpanded ? null : item.label)
                    }
                    aria-expanded={isExpanded}
                    className="flex w-full items-center justify-between py-4 text-left text-[15px]"
                  >
                    {item.label}
                    <span className="text-xl leading-none" aria-hidden="true">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </button>
                  {isExpanded && (
                    <ul className="space-y-3 pb-4 pl-3 text-[13px] text-[#57534E]">
                      {item.categories.map((category) => (
                        <li key={category}>
                          <button
                            type="button"
                            onClick={() => handleCategoryNavigation(category)}
                            className="text-left hover:text-[#252525]"
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-4 text-left text-[15px]"
            >
              {user ? user.name : "Account"}
            </button>
          </nav>
        </SheetContent>
      </Sheet>

      {/* SEARCH OVERLAY PANEL */}
      <SearchPanel
        isOpen={isSearchOpen}
        products={products}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}
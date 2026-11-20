import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Bookmark, Plus, Minus, Star } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductReviews from "@/components/store/ProductReviews";

export default function ProductDetailPage({
  allProducts = [],
  onAddToCart,
  user,
  onRequireAuth,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = allProducts.find((p) => p._id === id);

  const gallery = useMemo(() => {
    if (!product) return [];
    const imgs = [product.image, product.hoverImage].filter(Boolean);
    return imgs.length ? imgs : ["/images/kit-1.jpg"];
  }, [product]);

  const variants = useMemo(() => {
    if (!product) return [];
    if (product.variants?.length) return product.variants;
    return [{ label: product.format || "Standard", price: product.price }];
  }, [product]);

  const [viewState, setViewState] = useState({
    id,
    activeImage: 0,
    selectedVariantIdx: 0,
    purchaseType: "one-time",
    openFaq: null,
  });
  const currentViewState =
    viewState.id === id
      ? viewState
      : {
          id,
          activeImage: 0,
          selectedVariantIdx: 0,
          purchaseType: "one-time",
          openFaq: null,
        };
  const updateViewState = (key, value) => {
    setViewState((previous) => {
      const current =
        previous.id === id
          ? previous
          : {
              id,
              activeImage: 0,
              selectedVariantIdx: 0,
              purchaseType: "one-time",
              openFaq: null,
            };
      return { ...current, [key]: value };
    });
  };
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { activeImage, selectedVariantIdx, purchaseType, openFaq } =
    currentViewState;
  const activeVariant = variants[selectedVariantIdx] || variants[0];
  const basePrice = activeVariant?.price ?? 0;
  const finalPrice =
    purchaseType === "subscription" ? basePrice * 0.9 : basePrice;

  const suggestedPartners = useMemo(
    () =>
      product
        ? allProducts
            .filter(
              (p) =>
                p.collectionGroup === "catalog" && p._id !== product._id
            )
            .slice(0, 2)
        : [],
    [allProducts, product]
  );

  const faqs = product
    ? [
        {
          q: `Can I purchase refills of ${product.name}?`,
          a: "Selected formulations are available in refill formats to reduce single-use packaging.",
        },
        {
          q: `How long will one bottle of ${product.name} last?`,
          a: "With daily use, a standard 500 mL vessel typically lasts three to four months.",
        },
        {
          q: `How should I use ${product.name}?`,
          a: "Dispense a modest amount into damp hands, work into a gentle lather, and rinse thoroughly with warm water.",
        },
        {
          q: `Is ${product.name} vegan and cruelty free?`,
          a: "Yes. All Lumora formulations are 100% vegan and never tested on animals.",
        },
      ]
    : [];

  const handleMainAdd = () => {
    if (!product || !activeVariant) return;
    onAddToCart({
      ...product,
      price: Number(finalPrice.toFixed(2)),
      selectedVariant: `${activeVariant.label}${
        purchaseType === "subscription" ? " (Subscription)" : ""
      }`,
    });
  };

  if (!product) {
    return (
      <main className="min-h-screen py-24 text-center text-sm">
        Loading formulation...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFEF2] text-[#252525] py-6 sm:py-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="text-[12px] text-[#66635B] mb-6 sm:mb-8 flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span>&gt;</span>
          <Link to="/category/all" className="hover:underline">
            {product.category}
          </Link>
          <span>&gt;</span>
          <span className="text-[#252525]">{product.name}</span>
        </nav>

        {/* Top 2-Column Split: Gallery + Purchase Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 sm:pb-16">
          {/* LEFT 7 COLS: Gallery + Thumbnails */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#9C6D3E]">
                {product.badge || ""}
              </span>
              <button
                type="button"
                onClick={() => setIsBookmarked((p) => !p)}
                aria-label="Save item"
                className="cursor-pointer"
              >
                <Bookmark
                  className={`w-4 h-4 stroke-[1.5] ${
                    isBookmarked ? "fill-[#252525]" : ""
                  }`}
                />
              </button>
            </div>

            <div className="aspect-[4/4] w-full bg-[#F7F5EE] overflow-hidden mb-4">
              <img
                src={gallery[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-3">
              {gallery.map((src, idx) => (
                <button
                  key={src + idx}
                  type="button"
                  onClick={() => updateViewState("activeImage", idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 bg-[#F7F5EE] overflow-hidden border-2 cursor-pointer ${
                    activeImage === idx
                      ? "border-[#252525]"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT 5 COLS: Details & Suggested Partners */}
          <div className="lg:col-span-5">
            <h1 className="font-serif text-3xl md:text-[34px] font-normal mb-2">
              {product.name}
            </h1>
            <p className="text-xl font-normal mb-4">${finalPrice.toFixed(2)}</p>
            <p className="text-[14px] text-[#57534E] leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Star link */}
            <a
              href="#reviews"
              className="inline-flex items-center gap-2 text-[12px] mb-6 hover:underline"
            >
              <span className="flex items-center gap-0.5">
                {[1, 2, 3, 4].map((n) => (
                  <Star key={n} className="w-3.5 h-3.5 fill-[#252525]" />
                ))}
                <Star className="w-3.5 h-3.5 text-[#CFCAC0]" />
              </span>
              <span className="text-[#9C6D3E] underline">4.3 (24)</span>
            </a>

            {/* Variant Size Boxes */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {variants.map((v, idx) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => updateViewState("selectedVariantIdx", idx)}
                  className={`border py-3 px-2 text-center transition-colors cursor-pointer ${
                    selectedVariantIdx === idx
                      ? "border-2 border-[#252525] font-medium"
                      : "border-[#D4CFC4] text-[#57534E] hover:border-[#252525]"
                  }`}
                >
                  <span className="block text-[13px]">{v.label}</span>
                  <span className="block text-[12px] text-[#66635B]">
                    ${v.price.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>

            {/* One-time vs Subscription */}
            <div className="border border-[#D4CFC4] divide-y divide-[#D4CFC4] mb-5 text-[13px]">
              <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                <input
                  type="radio"
                  name="purchaseType"
                  checked={purchaseType === "one-time"}
                  onChange={() => updateViewState("purchaseType", "one-time")}
                  className="accent-[#252525]"
                />
                <span className="font-medium">One-time purchase</span>
              </label>

              <label className="flex items-center justify-between px-4 py-3 cursor-pointer">
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="purchaseType"
                    checked={purchaseType === "subscription"}
                    onChange={() =>
                      updateViewState("purchaseType", "subscription")
                    }
                    className="accent-[#252525]"
                  />
                  <span>Replenishment subscription</span>
                </span>
                <span className="text-[11px] text-[#9C6D3E]">Save 10%</span>
              </label>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleMainAdd}
              className="w-full bg-[#333333] hover:bg-[#1A1A1A] text-white py-3.5 text-[13px] font-medium transition-colors mb-4 cursor-pointer"
            >
              ${finalPrice.toFixed(2)} — Add to cart
            </button>

            <div className="bg-[#F6F3E3] p-3.5 text-[12px] text-[#45433E] leading-relaxed mb-10">
              Complimentary botanical samples and carbon-neutral delivery
              included with every Lumora order.
            </div>

            {/* Suggested Partners */}
            <div>
              <h2 className="text-[18px] font-normal mb-5">
                Suggested partners
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {suggestedPartners.map((partner) => (
                  <div
                    key={partner._id}
                    className="flex flex-col text-left border border-[#EAE6DC] p-3"
                  >
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${partner._id}`)}
                      className="aspect-square w-full bg-[#F7F5EE] overflow-hidden mb-3 cursor-pointer"
                    >
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </button>
                    <p className="text-[13px] font-medium mb-1">
                      {partner.name}
                    </p>
                    <p className="text-[12px] text-[#66635B] mb-3">
                      ${partner.price.toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        onAddToCart({
                          ...partner,
                          selectedVariant: partner.variants?.[0]?.label || "",
                        })
                      }
                      className="mt-auto w-full border border-[#252525] py-2 text-[12px] hover:bg-[#252525] hover:text-white transition-colors cursor-pointer"
                    >
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description / Ingredients / Packaging Tabs (shadcn Tabs) */}
        <section className="py-12 border-t border-[#E2DDD2]">
          <Tabs defaultValue="description" className="w-full">
            <TabsList
              variant="line"
              className="w-full justify-start gap-6 md:gap-16 overflow-x-auto border-b border-[#E2DDD2] rounded-none bg-transparent p-0 mb-8"
            >
              <TabsTrigger
                value="description"
                className="rounded-none px-0 pb-3 text-[15px] cursor-pointer"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="ingredients"
                className="rounded-none px-0 pb-3 text-[15px] cursor-pointer"
              >
                Ingredients
              </TabsTrigger>
              <TabsTrigger
                value="packaging"
                className="rounded-none px-0 pb-3 text-[15px] cursor-pointer"
              >
                Packaging and recycling
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="description"
              className="text-[14px] text-[#45433E] leading-relaxed max-w-3xl space-y-3"
            >
              <p>{product.description}</p>
              <p>
                Formulated for frequent use, balanced with pure botanical
                extracts to cleanse and restore without compromise.
              </p>
              <div className="pt-2 space-y-1 text-[13px]">
                <p>
                  <strong className="font-medium text-[#252525]">
                    Skin feel:
                  </strong>{" "}
                  Cleansed, refreshed
                </p>
                {product.aroma && (
                  <p>
                    <strong className="font-medium text-[#252525]">
                      Aroma:
                    </strong>{" "}
                    {product.aroma}
                  </p>
                )}
                {product.ingredients?.length > 0 && (
                  <p>
                    <strong className="font-medium text-[#252525]">
                      Key ingredients:
                    </strong>{" "}
                    {product.ingredients.join(", ")}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="ingredients"
              className="text-[14px] text-[#45433E] leading-relaxed max-w-3xl"
            >
              <p>
                Water (Aqua), Sodium Laureth Sulfate, Cocamidopropyl
                Hydroxysultaine,{" "}
                {product.ingredients?.length
                  ? product.ingredients.join(", ")
                  : "Botanical Extracts"}
                , Phenoxyethanol, Citric Acid, Tocopherol.
              </p>
            </TabsContent>

            <TabsContent
              value="packaging"
              className="text-[14px] text-[#45433E] leading-relaxed max-w-3xl"
            >
              <p>
                Housed in UV-protective amber glass or recyclable post-consumer
                PET to preserve botanical potency. Please rinse and recycle
                locally.
              </p>
            </TabsContent>
          </Tabs>
        </section>

        {/* Frequently Asked Questions */}
        <section className="py-14 border-t border-[#E2DDD2]">
          <h2 className="font-serif text-2xl md:text-3xl font-normal mb-8">
            Frequently asked questions
          </h2>

          <div className="divide-y divide-[#E2DDD2] border-y border-[#E2DDD2]">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q}>
                  <button
                    type="button"
                    onClick={() =>
                      updateViewState("openFaq", isOpen ? null : idx)
                    }
                    className="flex items-center justify-between w-full py-4 text-left text-[14px] hover:opacity-75 cursor-pointer"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <Minus className="w-4 h-4 shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="pb-4 text-[13px] text-[#57534E] leading-relaxed max-w-3xl">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Customer Reflections (Reviews) */}
        <ProductReviews
          productId={product._id}
          productName={product.name}
          user={user}
          onRequireAuth={onRequireAuth}
        />
      </div>
    </main>
  );
}
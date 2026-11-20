import { useState, useEffect, useMemo } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router";
import { apiFetch } from "@/lib/api";
import AnnouncementBar from "@/nav_components/layout/AnnouncementBar";
import Navbar from "@/nav_components/layout/Navbar";
import HeroCarousel from "@/nav_components/layout/HeroCarousel";
import Footer from "@/nav_components/layout/Footer";
import ProductCarousel from "@/components/store/ProductCarousel";
import CategoryBrowser from "@/components/store/CategoryBrowser";
import EditorialSplit from "@/components/store/EditorialSplit";
import RecommendedReading from "@/components/store/RecommendedReading";
import BackToTop from "@/components/store/BackToTop";
import CartDrawer from "@/components/store/CartDrawer";
import AuthDialog from "@/components/store/AuthDialog";
import CategoryPage from "@/pages/CategoryPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authPrompt, setAuthPrompt] = useState("");

  // Live products from MongoDB
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    apiFetch("/products")
      .then((data) => setAllProducts(data.products || []))
      .catch((err) => console.error("Failed to fetch products:", err))
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    apiFetch("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const openAuthWithPrompt = (msg = "") => {
    setAuthPrompt(msg);
    setIsAuthOpen(true);
  };

  const featuredKits = useMemo(
    () => allProducts.filter((p) => p.collectionGroup === "featured-kit"),
    [allProducts]
  );
  const curatedSets = useMemo(
    () => allProducts.filter((p) => p.collectionGroup === "curated-set"),
    [allProducts]
  );
  const catalogProducts = useMemo(
    () => allProducts.filter((p) => p.collectionGroup === "catalog"),
    [allProducts]
  );

  // Cart state (automatically drops any old fake non-MongoDB IDs)
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("lumora_cart")) || [];
      return saved.filter((item) => /^[a-f\d]{24}$/i.test(item._id));
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Shared checkout extras (passed from CartPage -> CheckoutPage in Part 2)
  const [checkoutMeta, setCheckoutMeta] = useState({
    samples: [],
    giftOptions: { bagSelected: false, addMessage: false, message: "" },
    promoCode: null,
  });

  useEffect(() => {
    localStorage.setItem("lumora_cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product) => {
    const variant = product.selectedVariant || product.format || "";
    const cartKey = `${product._id}__${variant}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        { ...product, selectedVariant: variant, cartKey, quantity: 1 },
      ];
    });

    setJustAdded(true);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartKey, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (cartKey) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#FFFEF2] text-[#252525]">
      <AnnouncementBar />

      <div className="relative">
        <Navbar
          cartCount={totalCartItems}
          alwaysSolid={!isHome}
          products={allProducts}
          user={user}
          onOpenAuth={() => openAuthWithPrompt("")}
          onOpenCart={() => {
            setJustAdded(false);
            setIsCartOpen(true);
          }}
        />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroCarousel />

                {loadingProducts ? (
                  <div className="py-24 text-center text-sm text-[#66635B]">
                    Loading formulations...
                  </div>
                ) : (
                  <ProductCarousel
                    title="Festive Gift Kits"
                    subtitle="Discover perfectly presented kits containing formulations for the hands and body, fragrances, skin care, and gifts for the home."
                    products={featuredKits}
                    onAddToCart={handleAddToCart}
                    onQuickView={(p) => navigate(`/product/${p._id}`)}
                  />
                )}

                <CategoryBrowser
                  onSelectCategory={(cat) => navigate(`/category/${cat.slug}`)}
                />

                <EditorialSplit
                  eyebrow="The Gift Finder"
                  title="An end to aimless searching"
                  description="Should you be feeling lost in your efforts to find a suitable present, simply answer a few questions and our guide will point the way."
                  ctaText="Consult The Gift Finder"
                  image="/photos/split-gift.jpg"
                  imagePosition="right"
                  bgClass="bg-[#DFDCD2]"
                  onCtaClick={() => navigate("/category/gifts")}
                />

                <ProductCarousel
                  title="Curated Sets"
                  subtitle="Exclusive to Lumora, these thoughtfully composed sets include complementary formulations to enhance your daily regimens—or those of a chosen recipient."
                  products={curatedSets}
                  onAddToCart={handleAddToCart}
                  onQuickView={(p) => navigate(`/product/${p._id}`)}
                  bgClass="bg-[#DFDCD2]"
                  buttonText="Add all to cart"
                  footerCta="Discover more"
                  onFooterCtaClick={() => navigate("/category/all")}
                />

                <EditorialSplit
                  eyebrow="The Journal"
                  title="A time to embrace"
                  description="Heading home for the quiet season—with armfuls of aromatic gifts to bestow upon cherished recipients. Explore our seasonal stories and find the perfect present."
                  ctaText="Read more"
                  image="/photos/split-journal.jpg"
                  imagePosition="left"
                  bgClass="bg-[#DFDCD2]"
                  onCtaClick={() => navigate("/category/all")}
                />

                <RecommendedReading />
              </>
            }
          />

          <Route
            path="/category/:slug"
            element={
              <CategoryPage
                products={catalogProducts}
                onAddToCart={handleAddToCart}
                onQuickView={(p) => navigate(`/product/${p._id}`)}
              />
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProductDetailPage
                allProducts={allProducts}
                onAddToCart={handleAddToCart}
                user={user}
                onRequireAuth={openAuthWithPrompt}
              />
            }
          />

          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                catalogProducts={catalogProducts}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onAddToCart={handleAddToCart}
                onProceedToCheckout={(meta) => {
                  if (!user) {
                    setCheckoutMeta(meta);
                    openAuthWithPrompt(
                      "Please sign in or create an account to complete your order."
                    );
                    return;
                  }
                  setCheckoutMeta(meta);
                  navigate("/checkout");
                }}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                user={user}
                checkoutMeta={checkoutMeta}
                onRequireAuth={openAuthWithPrompt}
                onClearCart={() => setCart([])}
              />
            }
          />
          <Route path="/order/:id" element={<OrderSuccessPage />} />
        </Routes>
      </div>

      <Footer />
      <BackToTop />

      <CartDrawer
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        cart={cart}
        catalogProducts={catalogProducts}
        justAdded={justAdded}
        onUpdateQuantity={handleUpdateQuantity}
        onAddToCart={handleAddToCart}
      />
      <AuthDialog
        open={isAuthOpen}
        onOpenChange={setIsAuthOpen}
        user={user}
        onAuthSuccess={setUser}
        onLogout={() => setUser(null)}
        promptMessage={authPrompt}
      />
    </div>
  );
}

export default App;

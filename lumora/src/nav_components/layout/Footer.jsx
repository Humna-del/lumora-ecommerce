import { useState } from "react";
import { Lock, Droplet, Gift } from "lucide-react";
import { apiFetch } from "@/lib/api";

const SUPPORT_LINKS = [
  "Contact us",
  "FAQs",
  "Shipping",
  "Returns",
  "Track your order",
  "Replenishment subscriptions",
  "Terms of use",
];

const ABOUT_LINKS = [
  "Our story",
  "Foundation",
  "Careers",
  "Corporate Gifts",
  "Privacy policy",
  "Accessibility Statement",
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || !agreed) return;

    setIsSubmitting(true);
    setSubscribeError("");
    try {
      await apiFetch("/subscribers", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), phone: phone.trim() }),
      });
      setSubscribed(true);
      setEmail("");
      setPhone("");
    } catch (error) {
      setSubscribeError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#252525] text-[#FAF8F4]">
      {/* Top 3-Item Trust Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-7 grid grid-cols-1 md:grid-cols-3 gap-6 text-[13px] text-[#FAF8F4]/90">
          <div className="flex items-center justify-center gap-3">
            <Lock className="w-4 h-4 stroke-[1.5]" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Droplet className="w-4 h-4 stroke-[1.5]" />
            <span>Complimentary samples</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Gift className="w-4 h-4 stroke-[1.5]" />
            <span>Complimentary gift wrapping</span>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left 3 Link Columns */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Column 1 */}
          <div>
            <h3 className="text-[13px] font-medium border-b border-white/60 pb-3 mb-4">
              Orders and support
            </h3>
            <ul className="space-y-2.5 text-[12px] text-[#E5E1D8]">
              {SUPPORT_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:underline underline-offset-4">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-[13px] font-medium border-b border-white/60 pb-3 mb-4">
              About
            </h3>
            <ul className="space-y-2.5 text-[12px] text-[#E5E1D8]">
              {ABOUT_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:underline underline-offset-4">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-[13px] font-medium border-b border-white/60 pb-3 mb-4">
              Sustainability
            </h3>
            <p className="text-[12px] text-[#E5E1D8] leading-relaxed">
              All Lumora formulations are vegan, and we do not test our
              ingredients on animals. We are committed to responsible botanical
              sourcing and recyclable amber glass packaging.{" "}
              <a href="#" className="underline underline-offset-4">
                Learn more
              </a>
            </p>
          </div>
        </div>

        {/* Right Newsletter & Socials */}
        <div className="lg:col-span-5">
          <h3 className="text-[13px] font-medium mb-4">
            Subscribe to Lumora communications
          </h3>

          {subscribed ? (
            <div className="border border-white/30 p-5 text-[13px] text-[#FAF8F4]">
              Thank you for subscribing to Lumora communications.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address*"
                className="w-full bg-[#D8D5CB] text-[#252525] placeholder:text-[#57534E] px-4 py-3 text-[13px] focus:outline-none"
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full bg-[#D8D5CB] text-[#252525] placeholder:text-[#57534E] px-4 py-3 text-[13px] focus:outline-none"
              />

              <label className="flex items-start gap-3 pt-1 text-[11px] text-[#C8C3B8] leading-relaxed cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                  className="mt-1 accent-[#FAF8F4] cursor-pointer"
                />
                <span>
                  By submitting this form, I agree to receive promotional and
                  editorial communications from Lumora and acknowledge the{" "}
                  <a href="#" className="underline underline-offset-2">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              {subscribeError && (
                <p role="alert" className="text-[12px] text-red-300">
                  {subscribeError}
                </p>
              )}

              <div className="border-t border-white/25 pt-4 mt-4">
                <p className="text-[12px] font-medium mb-2">
                  Receive email communications
                </p>
                <p className="text-[11px] text-[#C8C3B8] leading-relaxed mb-4">
                  You may unsubscribe at any time via the link included in our
                  emails.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#3B3B3B] hover:bg-white hover:text-[#252525] text-white px-7 py-2.5 text-[13px] font-medium transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-5 mt-8 text-[12px] text-[#E5E1D8]">
            <a href="#" className="hover:underline underline-offset-4">
              Instagram
            </a>
            <a href="#" className="hover:underline underline-offset-4">
              LinkedIn
            </a>
            <a href="#" className="hover:underline underline-offset-4">
              Pinterest
            </a>
            <a href="#" className="hover:underline underline-offset-4">
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Legal Strip */}
      <div className="border-t border-white/25">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#C8C3B8]">
          <p>© 2026 Lumora. Crafted as a full-stack portfolio storefront.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="hover:underline underline-offset-4">
              Terms &amp; Conditions
            </a>
            <span>•</span>
            <a href="#" className="hover:underline underline-offset-4">
              Site Map
            </a>
            <span>•</span>
            <a href="#" className="hover:underline underline-offset-4">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
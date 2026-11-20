import { useState, useEffect, useMemo } from "react";
import { Search, Star, MessageSquare } from "lucide-react";
import { apiFetch } from "@/lib/api";

const TOPIC_PILLS = ["smell", "satisfaction", "cleansing", "refreshing", "ingredients", "quality"];

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-[#252525]">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${
            n <= rating ? "fill-[#252525]" : "text-[#CFCAC0]"
          }`}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ productId, productName, user, onRequireAuth }) {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [visibleCount, setVisibleCount] = useState(4);

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!productId) return;
    apiFetch(`/products/${productId}`)
      .then((data) => setReviews(data.reviews || []))
      .catch(() => setReviews([]));
  }, [productId]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return "5.0";
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let list = reviews.filter((r) => {
      if (ratingFilter !== "all" && r.rating !== Number(ratingFilter)) return false;
      if (selectedTopic && !(r.topics || []).includes(selectedTopic)) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          (r.title || "").toLowerCase().includes(q) ||
          r.body.toLowerCase().includes(q) ||
          r.authorName.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (sortBy === "highest") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === "lowest") list = [...list].sort((a, b) => a.rating - b.rating);
    return list;
  }, [reviews, ratingFilter, selectedTopic, searchTerm, sortBy]);

  const handleToggleForm = () => {
    if (!user) {
      onRequireAuth("Please sign in or create an account to leave a reflection.");
      return;
    }
    setShowForm((p) => !p);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    setSubmitError("");
    try {
      const data = await apiFetch(`/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          authorName: user.name,
          rating: newRating,
          title: newTitle || `Reflection on ${productName}`,
          body: newBody,
        }),
      });
      setReviews((prev) => [data.review, ...prev]);
      setNewTitle("");
      setNewBody("");
      setShowForm(false);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <section id="reviews" className="py-14 border-t border-[#E2DDD2]">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h2 className="text-xl font-normal text-[#252525]">
          Customer reflections
        </h2>
        <button
          type="button"
          onClick={handleToggleForm}
          className="border border-[#252525] px-5 py-2 text-[12px] hover:bg-[#252525] hover:text-white transition-colors cursor-pointer"
        >
          {showForm ? "Close form" : "Write a reflection"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddReview}
          className="border border-[#D4CFC4] bg-[#F7F5EE] p-6 mb-10 space-y-4 max-w-xl"
        >
          <p className="text-[12px] text-[#57534E]">
            Posting as <strong className="text-[#252525]">{user?.name}</strong>
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[13px]">Rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setNewRating(n)} className="cursor-pointer">
                <Star className={`w-4 h-4 ${n <= newRating ? "fill-[#252525]" : "text-[#CFCAC0]"}`} />
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Headline"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-white border border-[#D4CFC4] px-3 py-2 text-[13px] focus:outline-none"
          />
          <textarea
            required
            rows={3}
            placeholder="Share your thoughts on this formulation..."
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            className="w-full bg-white border border-[#D4CFC4] px-3 py-2 text-[13px] focus:outline-none"
          />
          {submitError && <p className="text-[12px] text-red-700">{submitError}</p>}
          <button type="submit" className="bg-[#333333] text-white px-6 py-2.5 text-[12px] cursor-pointer">
            Submit reflection
          </button>
        </form>
      )}

      {/* Rating Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#E2DDD2]">
        <div className="md:col-span-5 space-y-2">
          <p className="text-[13px] text-[#57534E] mb-3">Summary</p>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-[12px]">
                <span className="w-12 text-[#57534E]">{star} stars</span>
                <div className="flex-1 h-2 bg-[#DFDCD2] overflow-hidden">
                  <div style={{ width: `${pct}%` }} className="h-full bg-[#333333]" />
                </div>
                <span className="w-6 text-right text-[#57534E]">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="md:col-span-7">
          <p className="text-[13px] text-[#57534E] mb-3">Overall sentiment</p>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-light">{avgRating}</span>
            <div>
              <StarRow rating={Math.round(Number(avgRating))} />
              <p className="text-[12px] text-[#9C6D3E] mt-1 underline">
                {reviews.length} reflections
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="py-6 border-b border-[#E2DDD2] space-y-4">
        <div className="flex items-center border-b border-[#D4CFC4] max-w-sm pb-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search topics and reflections"
            className="w-full bg-transparent text-[13px] focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#9C6D3E]" />
        </div>

        <div className="flex flex-wrap gap-2">
          {TOPIC_PILLS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setSelectedTopic((prev) => (prev === topic ? "" : topic))}
              className={`border px-3 py-1.5 text-[12px] cursor-pointer ${
                selectedTopic === topic
                  ? "border-[#252525] bg-[#252525] text-white"
                  : "border-[#D4CFC4] hover:border-[#252525]"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-[12px]">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="border border-[#D4CFC4] bg-transparent px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all">Rating: All</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[#D4CFC4] bg-transparent px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="recent">Sort by: Most recent</option>
            <option value="highest">Sort by: Highest rated</option>
            <option value="lowest">Sort by: Lowest rated</option>
          </select>
        </div>
      </div>

      {/* Review List */}
      {filteredReviews.length === 0 ? (
        <p className="py-10 text-[13px] text-[#66635B]">
          No reflections yet for this formulation. Be the first to share one.
        </p>
      ) : (
        <div className="divide-y divide-[#E2DDD2]">
          {filteredReviews.slice(0, visibleCount).map((rev) => (
            <div key={rev._id} className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3 text-[12px] text-[#57534E]">
                <p className="font-medium text-[#252525]">{rev.authorName}</p>
              </div>
              <div className="md:col-span-9 space-y-2">
                <StarRow rating={rev.rating} />
                {rev.title && <h3 className="text-[15px] font-medium">{rev.title}</h3>}
                <p className="text-[12px] text-[#7A766D]">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
                <p className="text-[13px] text-[#45433E] leading-relaxed">{rev.body}</p>
                {rev.reply && (
                  <div className="mt-4 border border-[#CFCAC0] p-4 bg-[#FAF8F2]">
                    <p className="text-[12px] font-medium flex items-center gap-2 mb-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Response from Lumora:
                    </p>
                    <p className="text-[12px] text-[#57534E]">{rev.reply}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {visibleCount < filteredReviews.length && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="bg-[#333333] hover:bg-[#1A1A1A] text-white px-10 py-3 text-[13px] cursor-pointer"
          >
            Load more
          </button>
        </div>
      )}
    </section>
  );
}
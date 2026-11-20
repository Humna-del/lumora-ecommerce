import { ARTICLES } from "@/data/articles";

export default function RecommendedReading({ onSelectArticle }) {
  return (
    <section className="py-16 md:py-24 bg-[#DFDCD2]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <h2 className="font-serif text-3xl md:text-[38px] font-normal text-[#252525] mb-10">
          Recommended reading
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {ARTICLES.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => onSelectArticle && onSelectArticle(article)}
              className="group text-left cursor-pointer"
            >
              {/* Landscape Image */}
              <div className="aspect-[16/10] w-full bg-[#CFCAC0] overflow-hidden mb-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Meta + Title + Read Time */}
              <p className="text-[12px] font-medium text-[#252525] mb-1.5">
                {article.category}
              </p>

              <h3 className="text-[16px] font-normal text-[#252525] mb-1.5 group-hover:underline underline-offset-4">
                {article.title}
              </h3>

              <p className="text-[13px] text-[#66635B]">{article.readTime}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
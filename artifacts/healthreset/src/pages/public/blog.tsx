import { Link } from "wouter";
import { useListBlogs } from "@workspace/api-client-react";
import { format } from "date-fns";

export default function Blog() {
  const { data: blogs = [], isLoading } = useListBlogs();

  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-40 px-6 md:px-12 mx-auto max-w-[1600px] w-full">
      <div className="max-w-3xl mb-16 md:mb-24">
        <span className="text-[12px] tracking-[0.2em] uppercase text-olive">— Editorial</span>
        <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-[-0.03em] text-ink md:text-7xl">
          Think better. <br /><em className="italic text-olive/90">Eat smarter</em>.
        </h1>
        <p className="mt-6 text-lg text-ink/75 leading-relaxed">
          Reflections on clinical nutrition, lifestyle medicine, and sustainable behavior change.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="w-full aspect-[4/3] bg-bone rounded-[20px]"></div>
              <div className="h-8 bg-bone rounded w-3/4"></div>
              <div className="h-4 bg-bone rounded w-full"></div>
              <div className="h-4 bg-bone rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {blogs.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group flex flex-col gap-5">
              <div className="relative overflow-hidden rounded-[20px] aspect-[4/3] bg-bone">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink/20 font-display text-2xl">
                    Editorial
                  </div>
                )}
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-500" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase text-ink/50">
                  <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                  <span className="h-px w-4 bg-ink/30" />
                  <span>By {post.author}</span>
                </div>
                <h2 className="font-display text-2xl tracking-tight text-ink group-hover:text-olive transition-colors">
                  {post.title}
                </h2>
                <p className="text-ink/70 text-sm leading-relaxed line-clamp-3">
                  {post.summary}
                </p>
                <div className="mt-2 text-[11px] tracking-[0.1em] uppercase text-terracotta group-hover:text-olive transition-colors flex items-center gap-2">
                  Read article <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border border-ink/10 rounded-[32px] bg-bone/30">
          <p className="text-lg text-ink/60">No articles found.</p>
        </div>
      )}
    </div>
  );
}

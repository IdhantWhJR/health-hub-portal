import { useParams, Link } from "wouter";
import { useGetBlog, getGetBlogQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";

export default function BlogDetail() {
  const params = useParams();
  const id = Number(params.id);
  
  const { data: post, isLoading } = useGetBlog(id, {
    query: { enabled: !!id, queryKey: getGetBlogQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 md:pt-44 px-6 md:px-12 mx-auto max-w-[800px] w-full animate-pulse">
        <div className="h-4 bg-bone rounded w-32 mb-6"></div>
        <div className="h-12 bg-bone rounded w-full mb-6"></div>
        <div className="w-full aspect-[16/9] bg-bone rounded-[32px] mb-12"></div>
        <div className="space-y-4">
          <div className="h-4 bg-bone rounded w-full"></div>
          <div className="h-4 bg-bone rounded w-full"></div>
          <div className="h-4 bg-bone rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-44 pb-24 px-6 text-center">
        <h1 className="font-display text-4xl text-ink">Article not found</h1>
        <Link href="/blog" className="mt-6 inline-block text-olive uppercase tracking-widest text-sm hover:underline">
          ← Back to editorial
        </Link>
      </div>
    );
  }

  return (
    <article className="pt-32 pb-32 md:pt-44 md:pb-48">
      <div className="mx-auto max-w-[800px] px-6 md:px-12 text-center mb-16">
        <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.18em] uppercase text-ink/50 mb-8">
          <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
          <span className="h-px w-6 bg-ink/30" />
          <span>By {post.author}</span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em] text-ink mb-8 text-balance">
          {post.title}
        </h1>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full border border-ink/10 text-[10px] tracking-[0.1em] uppercase text-ink/60 bg-bone/30">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {post.imageUrl && (
        <div className="mx-auto max-w-[1200px] px-4 md:px-8 mb-16 md:mb-24">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full aspect-[21/9] object-cover rounded-[32px] shadow-sm"
          />
        </div>
      )}

      <div className="mx-auto max-w-[700px] px-6 md:px-0">
        <div className="prose prose-lg md:prose-xl prose-p:text-ink/80 prose-p:leading-relaxed prose-headings:font-display prose-headings:font-normal prose-headings:text-ink max-w-none">
          {post.content ? (
            post.content.split('\n').map((paragraph, idx) => (
              paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
            ))
          ) : (
            <p className="italic text-ink/50">No content provided.</p>
          )}
        </div>
        
        <div className="mt-24 pt-12 border-t border-ink/10 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase text-ink/60 hover:text-ink transition-colors">
            <span>←</span> Read more articles
          </Link>
        </div>
      </div>
    </article>
  );
}

import { useParams, Link } from "wouter";
import { useGetRecipe, getGetRecipeQueryKey } from "@workspace/api-client-react";

export default function RecipeDetail() {
  const params = useParams();
  const id = Number(params.id);
  
  const { data: recipe, isLoading } = useGetRecipe(id, {
    query: { enabled: !!id, queryKey: getGetRecipeQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 md:pt-44 px-6 md:px-12 mx-auto max-w-[1000px] w-full animate-pulse">
        <div className="h-10 bg-bone rounded w-2/3 mb-6"></div>
        <div className="w-full aspect-[21/9] bg-bone rounded-[32px] mb-12"></div>
        <div className="h-4 bg-bone rounded w-full mb-2"></div>
        <div className="h-4 bg-bone rounded w-5/6"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="pt-44 pb-24 px-6 text-center">
        <h1 className="font-display text-4xl text-ink">Recipe not found</h1>
        <Link href="/recipes" className="mt-6 inline-block text-olive uppercase tracking-widest text-sm hover:underline">
          ← Back to recipes
        </Link>
      </div>
    );
  }

  return (
    <article className="pt-32 pb-32 md:pt-44 md:pb-48">
      <div className="mx-auto max-w-[1000px] px-6 md:px-12">
        <Link href="/recipes" className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-ink/50 hover:text-ink transition-colors mb-12">
          <span>←</span> Back to recipes
        </Link>

        <h1 className="font-display text-5xl md:text-7xl leading-[1.02] tracking-[-0.02em] text-ink mb-8">
          {recipe.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-[12px] tracking-[0.1em] uppercase text-ink/60 mb-12 border-y border-ink/10 py-6">
          {recipe.prepTime && (
            <div className="flex flex-col gap-1">
              <span className="text-ink/40 text-[10px]">Prep Time</span>
              <span className="text-ink">{recipe.prepTime}</span>
            </div>
          )}
          {recipe.cookTime && (
            <div className="flex flex-col gap-1">
              <span className="text-ink/40 text-[10px]">Cook Time</span>
              <span className="text-ink">{recipe.cookTime}</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex flex-col gap-1">
              <span className="text-ink/40 text-[10px]">Servings</span>
              <span className="text-ink">{recipe.servings}</span>
            </div>
          )}
        </div>
      </div>

      {recipe.imageUrl && (
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 mb-16 md:mb-24">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full aspect-[16/9] object-cover rounded-[32px] shadow-sm"
          />
        </div>
      )}

      <div className="mx-auto max-w-[1000px] px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div className="md:col-span-4">
          <h3 className="font-display text-2xl tracking-tight text-ink mb-6">Ingredients</h3>
          <ul className="space-y-4">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, idx) => (
                <li key={idx} className="flex items-start gap-3 text-ink/80 text-sm md:text-base">
                  <span className="text-terracotta mt-1.5 text-[8px]">●</span>
                  <span>{ingredient}</span>
                </li>
              ))
            ) : (
              <li className="text-ink/50 italic text-sm">No ingredients listed.</li>
            )}
          </ul>
        </div>

        <div className="md:col-span-8 md:pl-8">
          <h3 className="font-display text-2xl tracking-tight text-ink mb-6">Method</h3>
          <div className="prose prose-lg prose-p:text-ink/80 prose-p:leading-relaxed prose-headings:font-display prose-headings:font-normal prose-headings:text-ink max-w-none">
            {recipe.content ? (
              recipe.content.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
              ))
            ) : (
              <p className="italic text-ink/50">No instructions provided.</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

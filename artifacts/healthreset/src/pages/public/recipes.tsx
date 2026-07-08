import { Link } from "wouter";
import { useListRecipes } from "@workspace/api-client-react";
import { format } from "date-fns";

export default function Recipes() {
  const { data: recipes = [], isLoading } = useListRecipes();

  return (
    <div className="pt-32 pb-24 md:pt-44 md:pb-40 px-6 md:px-12 mx-auto max-w-[1600px] w-full">
      <div className="max-w-3xl mb-16 md:mb-24">
        <span className="text-[12px] tracking-[0.2em] uppercase text-olive">— Recipes</span>
        <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-[-0.03em] text-ink md:text-7xl">
          Nourish your <em className="italic text-olive/90">body</em>.
        </h1>
        <p className="mt-6 text-lg text-ink/75 leading-relaxed">
          A collection of evidence-based, wholesome recipes designed to support metabolic
          and hormonal health, without compromising on flavor.
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
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="group flex flex-col gap-5">
              <div className="relative overflow-hidden rounded-[20px] aspect-[4/3] bg-bone">
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink/20 font-display text-2xl">
                    Recipe
                  </div>
                )}
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-500" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-2xl tracking-tight text-ink group-hover:text-olive transition-colors">
                  {recipe.title}
                </h2>
                <div className="flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase text-ink/50">
                  {recipe.prepTime && <span>Prep: {recipe.prepTime}</span>}
                  {recipe.prepTime && recipe.servings && <span className="h-px w-4 bg-ink/30" />}
                  {recipe.servings && <span>{recipe.servings} Servings</span>}
                </div>
                <p className="mt-1 text-ink/70 text-sm leading-relaxed line-clamp-2">
                  {recipe.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border border-ink/10 rounded-[32px] bg-bone/30">
          <p className="text-lg text-ink/60">No recipes found.</p>
        </div>
      )}
    </div>
  );
}

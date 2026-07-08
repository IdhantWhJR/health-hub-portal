import { useState, useEffect } from "react";
import { useListRecipes, useCreateRecipe, useUpdateRecipe, useDeleteRecipe, getListRecipesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import * as Dialog from "@radix-ui/react-dialog";

export default function AdminRecipes() {
  const queryClient = useQueryClient();
  const { data: recipes = [], isLoading } = useListRecipes({ all: "true" }, {
    query: { queryKey: getListRecipesQueryKey({ all: "true" }) }
  });
  const deleteRecipe = useDeleteRecipe();
  const updateRecipe = useUpdateRecipe();

  const [editingRecipe, setEditingRecipe] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipe.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListRecipesQueryKey({ all: "true" }) });
        }
      });
    }
  };

  const togglePublish = (id: number, published: boolean) => {
    updateRecipe.mutate({ id, data: { published: !published } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRecipesQueryKey({ all: "true" }) });
      }
    });
  };

  const openEdit = (recipe: any) => {
    setEditingRecipe(recipe);
    setIsDialogOpen(true);
  };

  const openCreate = () => {
    setEditingRecipe(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-ink">Recipes</h1>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 bg-ink text-cream px-4 py-2 rounded-full text-sm hover:bg-olive transition-colors"
        >
          <Plus className="w-4 h-4" /> New Recipe
        </button>
      </div>

      <div className="bg-cream border border-ink/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-ink/50">Loading...</div>
        ) : recipes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-bone/30 text-[11px] tracking-wider uppercase text-ink/60 border-b border-ink/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {recipes.map(recipe => (
                  <tr key={recipe.id} className="hover:bg-bone/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-ink">
                      {recipe.title}
                    </td>
                    <td className="px-6 py-4 text-ink/60">
                      {format(new Date(recipe.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => togglePublish(recipe.id, recipe.published)}
                          className="focus:outline-none"
                          title={recipe.published ? "Unpublish" : "Publish"}
                        >
                          {recipe.published ? (
                            <CheckCircle2 className="w-5 h-5 text-olive" />
                          ) : (
                            <XCircle className="w-5 h-5 text-ink/30" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openEdit(recipe)} className="text-ink/50 hover:text-ink transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(recipe.id)} className="text-ink/50 hover:text-terracotta transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-ink/50">No recipes found.</div>
        )}
      </div>

      <RecipeFormDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        recipe={editingRecipe} 
      />
    </div>
  );
}

function RecipeFormDialog({ isOpen, onClose, recipe }: { isOpen: boolean, onClose: () => void, recipe?: any }) {
  const queryClient = useQueryClient();
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    imageUrl: "",
    ingredients: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    content: "",
    published: false,
  });

  useEffect(() => {
    if (isOpen) {
      if (recipe) {
        setFormData({
          title: recipe.title || "",
          summary: recipe.summary || "",
          imageUrl: recipe.imageUrl || "",
          ingredients: recipe.ingredients ? recipe.ingredients.join("\n") : "",
          prepTime: recipe.prepTime || "",
          cookTime: recipe.cookTime || "",
          servings: recipe.servings?.toString() || "",
          content: recipe.content || "",
          published: recipe.published || false,
        });
      } else {
        setFormData({
          title: "",
          summary: "",
          imageUrl: "",
          ingredients: "",
          prepTime: "",
          cookTime: "",
          servings: "",
          content: "",
          published: false,
        });
      }
    }
  }, [isOpen, recipe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      servings: formData.servings ? parseInt(formData.servings, 10) : undefined,
      ingredients: formData.ingredients.split("\n").map(s => s.trim()).filter(Boolean)
    };

    if (recipe) {
      updateRecipe.mutate({ id: recipe.id, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListRecipesQueryKey({ all: "true" }) });
          onClose();
        }
      });
    } else {
      createRecipe.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListRecipesQueryKey({ all: "true" }) });
          onClose();
        }
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cream w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-xl border border-ink/10 p-8 z-50">
          <Dialog.Title className="font-display text-3xl mb-6">
            {recipe ? "Edit Recipe" : "New Recipe"}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-[11px] tracking-wider uppercase text-ink/60">Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-bone/30 border border-ink/10 rounded-xl px-4 py-2 focus:outline-none focus:border-olive" 
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[11px] tracking-wider uppercase text-ink/60">Summary</label>
                <textarea 
                  value={formData.summary}
                  onChange={e => setFormData({...formData, summary: e.target.value})}
                  rows={2}
                  className="w-full bg-bone/30 border border-ink/10 rounded-xl px-4 py-2 focus:outline-none focus:border-olive resize-none" 
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[11px] tracking-wider uppercase text-ink/60">Image URL</label>
                <input 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full bg-bone/30 border border-ink/10 rounded-xl px-4 py-2 focus:outline-none focus:border-olive" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] tracking-wider uppercase text-ink/60">Prep Time</label>
                <input 
                  value={formData.prepTime}
                  onChange={e => setFormData({...formData, prepTime: e.target.value})}
                  placeholder="e.g. 15 mins"
                  className="w-full bg-bone/30 border border-ink/10 rounded-xl px-4 py-2 focus:outline-none focus:border-olive" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] tracking-wider uppercase text-ink/60">Cook Time</label>
                <input 
                  value={formData.cookTime}
                  onChange={e => setFormData({...formData, cookTime: e.target.value})}
                  placeholder="e.g. 30 mins"
                  className="w-full bg-bone/30 border border-ink/10 rounded-xl px-4 py-2 focus:outline-none focus:border-olive" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] tracking-wider uppercase text-ink/60">Servings</label>
                <input 
                  type="number"
                  value={formData.servings}
                  onChange={e => setFormData({...formData, servings: e.target.value})}
                  className="w-full bg-bone/30 border border-ink/10 rounded-xl px-4 py-2 focus:outline-none focus:border-olive" 
                />
              </div>
              <div className="space-y-2 flex items-center h-full pt-6 gap-3">
                <input 
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={e => setFormData({...formData, published: e.target.checked})}
                  className="w-5 h-5 accent-olive"
                />
                <label htmlFor="published" className="text-sm">Published</label>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-[11px] tracking-wider uppercase text-ink/60">Ingredients (One per line)</label>
                <textarea 
                  value={formData.ingredients}
                  onChange={e => setFormData({...formData, ingredients: e.target.value})}
                  rows={4}
                  className="w-full bg-bone/30 border border-ink/10 rounded-xl px-4 py-2 focus:outline-none focus:border-olive resize-none" 
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <label className="text-[11px] tracking-wider uppercase text-ink/60">Content / Method</label>
                <textarea 
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  rows={8}
                  className="w-full bg-bone/30 border border-ink/10 rounded-xl px-4 py-2 focus:outline-none focus:border-olive resize-none" 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-ink/10">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-2 rounded-full border border-ink/20 hover:bg-bone transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={createRecipe.isPending || updateRecipe.isPending}
                className="px-6 py-2 rounded-full bg-ink text-cream hover:bg-olive transition-colors disabled:opacity-50"
              >
                {createRecipe.isPending || updateRecipe.isPending ? "Saving..." : "Save Recipe"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, recipesTable } from "@workspace/db";
import {
  ListRecipesQueryParams,
  CreateRecipeBody,
  GetRecipeParams,
  UpdateRecipeParams,
  UpdateRecipeBody,
  DeleteRecipeParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/admin-auth";

const router: IRouter = Router();

// GET /recipes — list published (or all if ?all=true and admin)
router.get("/recipes", async (req, res): Promise<void> => {
  const query = ListRecipesQueryParams.safeParse(req.query);
  const showAll =
    query.success && query.data.all === "true" &&
    (() => {
      const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
      const auth = req.headers["authorization"] as string | undefined;
      return secret && auth === `Bearer ${secret}`;
    })();

  const rows = await db
    .select()
    .from(recipesTable)
    .where(showAll ? undefined : eq(recipesTable.published, true))
    .orderBy(desc(recipesTable.createdAt));

  res.json(rows);
});

// POST /recipes — create (admin only)
router.post("/recipes", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateRecipeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const [recipe] = await db
    .insert(recipesTable)
    .values({
      title: data.title,
      summary: data.summary ?? "",
      content: data.content ?? "",
      imageUrl: data.imageUrl ?? null,
      ingredients: data.ingredients ?? [],
      prepTime: data.prepTime ?? null,
      cookTime: data.cookTime ?? null,
      servings: data.servings ?? null,
      published: data.published ?? false,
    })
    .returning();

  res.status(201).json(recipe);
});

// GET /recipes/:id
router.get("/recipes/:id", async (req, res): Promise<void> => {
  const params = GetRecipeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [recipe] = await db
    .select()
    .from(recipesTable)
    .where(eq(recipesTable.id, params.data.id));

  if (!recipe) {
    res.status(404).json({ error: "Recipe not found" });
    return;
  }

  // Unpublished recipes are only visible to admin
  if (!recipe.published) {
    const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
    const auth = req.headers["authorization"] as string | undefined;
    if (!secret || auth !== `Bearer ${secret}`) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }
  }

  res.json(recipe);
});

// PUT /recipes/:id — update (admin only)
router.put("/recipes/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateRecipeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateRecipeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const updateFields: Record<string, unknown> = {};
  if (data.title !== undefined) updateFields.title = data.title;
  if (data.summary !== undefined) updateFields.summary = data.summary;
  if (data.content !== undefined) updateFields.content = data.content;
  if (data.imageUrl !== undefined) updateFields.imageUrl = data.imageUrl;
  if (data.ingredients !== undefined) updateFields.ingredients = data.ingredients;
  if (data.prepTime !== undefined) updateFields.prepTime = data.prepTime;
  if (data.cookTime !== undefined) updateFields.cookTime = data.cookTime;
  if (data.servings !== undefined) updateFields.servings = data.servings;
  if (data.published !== undefined) updateFields.published = data.published;

  const [recipe] = await db
    .update(recipesTable)
    .set(updateFields)
    .where(eq(recipesTable.id, params.data.id))
    .returning();

  if (!recipe) {
    res.status(404).json({ error: "Recipe not found" });
    return;
  }

  res.json(recipe);
});

// DELETE /recipes/:id — delete (admin only)
router.delete("/recipes/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteRecipeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(recipesTable).where(eq(recipesTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;

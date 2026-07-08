import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, blogsTable } from "@workspace/db";
import {
  ListBlogsQueryParams,
  CreateBlogBody,
  GetBlogParams,
  UpdateBlogParams,
  UpdateBlogBody,
  DeleteBlogParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/admin-auth";

const router: IRouter = Router();

// GET /blogs — list published (or all if ?all=true and admin)
router.get("/blogs", async (req, res): Promise<void> => {
  const query = ListBlogsQueryParams.safeParse(req.query);
  const showAll =
    query.success && query.data.all === "true" &&
    (() => {
      const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
      const auth = req.headers["authorization"] as string | undefined;
      return secret && auth === `Bearer ${secret}`;
    })();

  const rows = await db
    .select()
    .from(blogsTable)
    .where(showAll ? undefined : eq(blogsTable.published, true))
    .orderBy(desc(blogsTable.createdAt));

  res.json(rows);
});

// POST /blogs — create (admin only)
router.post("/blogs", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateBlogBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const [blog] = await db
    .insert(blogsTable)
    .values({
      title: data.title,
      summary: data.summary ?? "",
      content: data.content ?? "",
      imageUrl: data.imageUrl ?? null,
      author: data.author ?? "Dr. Shweta Tripathi",
      tags: data.tags ?? [],
      published: data.published ?? false,
    })
    .returning();

  res.status(201).json(blog);
});

// GET /blogs/:id
router.get("/blogs/:id", async (req, res): Promise<void> => {
  const params = GetBlogParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [blog] = await db
    .select()
    .from(blogsTable)
    .where(eq(blogsTable.id, params.data.id));

  if (!blog) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  // Unpublished posts are only visible to admin
  if (!blog.published) {
    const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
    const auth = req.headers["authorization"] as string | undefined;
    if (!secret || auth !== `Bearer ${secret}`) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }
  }

  res.json(blog);
});

// PUT /blogs/:id — update (admin only)
router.put("/blogs/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateBlogParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateBlogBody.safeParse(req.body);
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
  if (data.author !== undefined) updateFields.author = data.author;
  if (data.tags !== undefined) updateFields.tags = data.tags;
  if (data.published !== undefined) updateFields.published = data.published;

  const [blog] = await db
    .update(blogsTable)
    .set(updateFields)
    .where(eq(blogsTable.id, params.data.id))
    .returning();

  if (!blog) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json(blog);
});

// DELETE /blogs/:id — delete (admin only)
router.delete("/blogs/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteBlogParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(blogsTable).where(eq(blogsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;

import type { Express } from "express";
import app from "../src/app.js";

// Vercel treats a default-exported request handler as a serverless function.
// Express apps are valid (req, res) handlers, so we can export it directly.
const handler: Express = app;
export default handler;

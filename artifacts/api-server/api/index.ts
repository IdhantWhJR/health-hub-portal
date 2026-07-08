import app from "../src/app";

// Vercel treats a default-exported request handler as a serverless function.
// Express apps are valid (req, res) handlers, so we can export it directly.
export default app;

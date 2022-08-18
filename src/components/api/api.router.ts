import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api:
 *   get:
 *     description: Welcome to ROOST REST API
 *     responses:
 *       200:
 *         description: Returns a welcome string.
 */
router.get("", async (_req, res) => {
  return res.json("Welcome to Twitter REST API");
});

export { router as apiRouter };

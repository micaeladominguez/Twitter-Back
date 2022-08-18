import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { logger } from "@/logger";

import { router } from "./routers";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Twitter",
    version: "1.0.0",
    description: ".",
  },
  // security: [{ bearerAuth: [] }]
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: [
    "./src/components/users/controllers/users.router.ts",
    "./src/components/api/controllers/api.router.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Add APIs
app.use("/api", router);

const port = process.env.PORT || "5000";
app.listen({ port }, () => {
  logger.info(`🚀  Server ready at http://localhost:${port}`);
});

import express from "express";
import { subscribeNewsletter } from "../controllers/subscriberController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { subscriberSchema } from "../validators/storeValidator.js";

const router = express.Router();

router.post("/", validate(subscriberSchema), subscribeNewsletter);

export default router;
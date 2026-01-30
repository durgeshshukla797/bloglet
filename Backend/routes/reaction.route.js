import { Router } from "express";
import { 
  getReactionStatus,
  getPublicReactionCounts
} from "../controller/reaction.controller.js";

import { verifyJwt } from "../middleware/auth.middleware.js";
const router = Router();

// Public route - no authentication required
router.get("/blogs/:blogId/reactions/public", getPublicReactionCounts);

// Protected route - requires authentication
router.get("/blogs/:blogId/reactions", verifyJwt, getReactionStatus);

export default router;
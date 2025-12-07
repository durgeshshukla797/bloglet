import { Router } from "express";
import { 
  dislikeBlog,
  removeDislike
} from "../controller/disLike.controller.js";

import { verifyJwt } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/blogs/:blogId/dislike",verifyJwt,dislikeBlog);
router.delete("/blogs/:blogId/dislike",verifyJwt,removeDislike);
export default router;
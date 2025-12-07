import { Router } from "express";
import { 
  likeBlog,
  removeLike
} from "../controller/like.controller.js";

import { verifyJwt } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/blogs/:blogId/like",verifyJwt,likeBlog);
router.delete("/blogs/:blogId/like",verifyJwt,removeLike);
export default router;

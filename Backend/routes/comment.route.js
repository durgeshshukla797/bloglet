import { Router } from "express";
import { 
  createComment,
  deleteComment,
  getBlogComments,
  getCommentCounts,
  updateComment
} from "../controller/comment.controller.js";

import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/blogs/:blogId/comments",verifyJwt,createComment);
router.put("/comments/:commentId",verifyJwt,updateComment);
router.delete("/comments/:commentId",verifyJwt,deleteComment);
router.get("/blogs/:blogId/comments",getBlogComments);
router.get( "/blogs/:blogId/comments-count", getCommentCounts);

export default router;

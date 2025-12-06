import { Router } from "express";
import { 
  createBlog,
  getAllBlogs,
  getBlogById,
  getPublicBlogs,
  updateBlog,
  deleteBlog 
} from "../controller/blog.controller.js";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.post( "/blogs",
  verifyJwt,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  createBlog
);
router.put(
  "/blogs/:blogId",
  verifyJwt,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  updateBlog
);

router.get("/blogs", verifyJwt, getAllBlogs);
router.get("/blogs/:blogId", getBlogById);
router.get("/public-blogs", getPublicBlogs);
router.delete("/blogs/:blogId", verifyJwt, deleteBlog);

export default router;

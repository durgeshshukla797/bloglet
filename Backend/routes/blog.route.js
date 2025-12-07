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

router.post( "/",
  verifyJwt,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  createBlog
);
router.put(
  "/:blogId",
  verifyJwt,
   upload.single('coverImage'),
  updateBlog
);

router.get("/", verifyJwt, getAllBlogs);
router.get("/public", getPublicBlogs);
router.get("/:blogId", getBlogById);
router.delete("/:blogId", verifyJwt, deleteBlog);

export default router;
// till now we have:

// router.get("/:blogId", getBlogById);
// router.get("/public", getPublicBlogs);


// When you request GET /blogs/public, Express matches /:blogId first, and "public" becomes req.params.blogId.

// Then in getBlogById, Mongoose tries to cast "public" to an ObjectId → Cast error.

// 🔹 How to fix

// Move the /public route above /:blogId:

// router.get("/public", getPublicBlogs);  // must come first
// router.get("/:blogId", getBlogById);    // dynamic route comes last
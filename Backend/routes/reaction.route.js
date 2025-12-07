import { Router } from "express";
import { 
  getReactionStatus
} from "../controller/reaction.controller.js";

import { verifyJwt } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/blogs/:blogId/reactions",verifyJwt,getReactionStatus);


export default router;
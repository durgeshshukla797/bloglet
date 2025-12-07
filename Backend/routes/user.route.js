import { Router } from "express";
import { 
  register,
  login,
  logout,
  refreshToken
} from "../controller/user.controller.js";

import { verifyJwt } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/register",register);
router.post("/login", login);
router.post("/logout",verifyJwt, logout);
router.post("/refreshtoken",refreshToken);

export default router;

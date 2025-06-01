import express from "express";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authMiddleware } from "../middlewares/jwt.auth.js";
import { getUserSchema, loginSchema, registerUserSchema } from "../Validations/user.validation.js";
import { getUser, loginUser, registerUser, changeUserName } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", validateRequest(getUserSchema), getUser);
router.post("/register", validateRequest(registerUserSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.post("/updatename", validateRequest(registerUserSchema), authMiddleware, changeUserName)

export default router;
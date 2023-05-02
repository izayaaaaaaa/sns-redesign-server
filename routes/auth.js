import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login); // "/auth/login" index.js + auth.js 

export default router;
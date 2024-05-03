import express from "express";
import { testUser } from "../controller/user.controller.js";

const router = express.Router();

router.get("/test", testUser);

export default router;

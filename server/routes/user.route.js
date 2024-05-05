import express from "express";
import { deleteUser, updateUser } from "../controller/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);

export default router;

import express from "express";
import { deleteUser, getUserListing, signout, updateUser, getUser } from "../controller/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);
router.get("/signout", signout);
router.get("/listing/:id", verifyUser, getUserListing);
router.get("/:id", verifyUser, getUser);

export default router;

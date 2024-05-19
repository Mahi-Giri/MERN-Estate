import express from "express";
import { createListing, deleteListing, updateListing, getListing } from "../controller/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const routes = express.Router();

routes.post("/create", verifyUser, createListing);
routes.delete("/delete/:id", verifyUser, deleteListing);
routes.put("/update/:id", verifyUser, updateListing);
routes.get("/get/:id", getListing);

export default routes;

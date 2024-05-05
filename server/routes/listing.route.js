import express from "express";
import { createListing } from "../controller/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const routes = express.Router();

routes.post("/create", verifyUser, createListing);

export default routes;

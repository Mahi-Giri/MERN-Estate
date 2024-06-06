import { raw } from "express";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));

    if (req.user.id !== listing.userRef) return next(errorHandler(401, "You can only delete your own listing"));

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));

    if (req.user.id !== listing.userRef) return next(errorHandler(401, "You can only update your own listing"));

    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedListing);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return next(errorHandler(404, "Listing not found"));
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.params.startIndex) || 0;

        let isOffer = req.query.isOffer;
        if (isOffer === undefined || isOffer === false) {
            isOffer = {
                $in: [false, true],
            };
        }

        let isFurnished = req.query.isFurnished;
        if (isFurnished === undefined || isFurnished === false) {
            isFurnished = {
                $in: [false, true],
            };
        }

        let isParking = req.query.isParking;
        if (isParking === undefined || isParking === false) {
            isParking = {
                $in: [false, true],
            };
        }

        let type = req.query.type;
        if (type === undefined || type === "all") {
            type = {
                $in: ["sale", "rent"],
            };
        }

        const searchTerm = req.query.searchTerm || "";
        const sort = req.query.sort || "createAt";
        const order = req.query.order || "desc";

        const listing = await Listing.find({
            name: {
                $regex: searchTerm,
                $options: "i",
            },
            isOffer,
            isFurnished,
            isParking,
            type,
        })
            .sort({
                [sort]: order,
            })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

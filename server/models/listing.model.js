import { Schema, model } from "mongoose";

const listingSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        regularPrice: {
            type: Number,
            required: true,
        },

        discountPrice: {
            type: Number,
            required: true,
        },

        bathRooms: {
            type: Number,
            required: true,
        },

        bedRooms: {
            type: Number,
            required: true,
        },

        isFurnished: {
            type: Boolean,
            required: true,
        },

        isParking: {
            type: Boolean,
            required: true,
        },

        type: {
            type: String,
            required: true,
        },

        isOffer: {
            type: Boolean,
            required: true,
        },

        imageURLs: {
            type: Array,
            required: true,
        },

        userRef: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Listing = model("Listing", listingSchema);

export default Listing;

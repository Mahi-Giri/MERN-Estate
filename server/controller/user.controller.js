import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You do not have permission to update this user"));

    try {
        if (req.body.password) req.body.password = bcryptjs.hashSync(req.body.password, 10);

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },
            {
                new: true,
            }
        );

        const { password, ...rest } = updatedUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You do not have permission to delete this user"));

    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("Access_Token");
        res.status(200).json("User deleted successfully");
    } catch (error) {
        next(error);
    }
};

export const signout = async (req, res, next) => {
    try {
        res.clearCookie("Access_Token");
        res.status(200).json("User signed out successfully");
    } catch (error) {
        next(error);
    }
};

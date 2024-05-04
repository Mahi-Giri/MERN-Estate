import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemon from "nodemon";

export const signup = async (req, res, next) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) return res.status(400).json(errorHandler(400, "Please fill in all fields"));

    const hashPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        password: hashPassword,
        email,
    });

    try {
        await newUser.save();
        return res.status(200).json("User created successfully");
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(errorHandler(400, "Please fill in all fields"));

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "User not found"));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Invalid Credentials"));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

        const { password: pass, ...rest } = validUser._doc;

        res.cookie("Access_Token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        })
            .status(200)
            .json(rest);
    } catch (error) {
        next(error);
    }
};



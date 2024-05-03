import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

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

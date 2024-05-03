import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose
    .connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Connected to Mongoose server");
    })
    .catch((err) => {
        console.log(`Unable to connect mongoDB server ${err}`);
    });

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

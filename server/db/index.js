import { connect } from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        const connectionResponse = await connect(`${process.env.MONGO_CONNECTION_STRING}/${DB_NAME}`);
        console.log(`Connect to the host ${connectionResponse.connection.host}`);
    } catch (error) {
        console.log(`Unable to connect mongoDB server ${err}`);
        process.exit(1);
    }
};

export default connectDB;

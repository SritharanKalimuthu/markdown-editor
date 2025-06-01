import mongoose from "mongoose";

const MAX_RETRY = 3;
const RETRY_DELAY = 3000;

let retry = 0;

const connectDB = async() =>{
    const connect = async () =>{
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI,{
                serverSelectionTimeoutMS: 10000,
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            retry = 0;
        }catch(err){
            console.log(`Error in connecting to MongoDB: ${err.message}. Retrying in ${RETRY_DELAY / 1000} seconds.`);

            if(retry<MAX_RETRY){
                retry+=1;
                setTimeout(connect, RETRY_DELAY);
            }else{
                console.error(`Failed to connect to MongoDB after ${MAX_RETRY} attempts. Exiting...`);
                process.exit(1);
            }
        }
    }

    connect();

    // Handle process exit
    process.on("SIGINT", () => {
        mongoose.connection.close(() => {
            console.log("MongoDB connection closed through app termination");
            process.exit(0);
        });
    });
}

export default connectDB;
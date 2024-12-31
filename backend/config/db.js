import mongoose from "mongoose";

export const connectDB = () => {
	mongoose
		.connect(process.env.MONGO_URI)
		.then((conn) => {
			console.log(`MongoDB Connected : ${conn.connection.host}`);
			console.log(`Using database: ${conn.connection.name}`);
		})
		.catch((error) => {
			console.log(`Error : ${error.message}`);
			process.exit(1); // process code 1 means exit with failure, 0 means success
		});
};

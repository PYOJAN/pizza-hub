import app from "./app";
import mongoose, { connect } from "mongoose";
import env from "./config";

const connectToDatabase = async () => {

  try {
    console.log('Connecting database.....')
    const connection = await connect(env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Server start if database is successfully connected.
    const PORT = env.PORT;
    app.listen(PORT, () => {
      console.log(
        `💽MongoDB connected successfully \n🚀 Server start on http://localhost:${PORT}`
      );
    });

    return connection;
  } catch (error) {
    console.log("Failed to connect to MongoDB:", err.message);
    // Stop the server if the connection fails
    process.exit(1);
  }
};

// Handle database connection errors
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

connectToDatabase();
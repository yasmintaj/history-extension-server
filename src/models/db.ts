import mongoose from "mongoose";

export const initDbConnection = () =>
  mongoose.connect("mongodb://localhost:27017/sessionRecord", (err) => {
    if (!err) {
      console.log("MongoDB connection succeeded.");
    } else {
      console.log(
        "Error in MongoDB connection : " + JSON.stringify(err, undefined, 2)
      );
    }
  });

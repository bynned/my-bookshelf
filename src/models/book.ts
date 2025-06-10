import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  id: String,
  title: String,
  authors: [String],
  thumbnail: String,
});

export default mongoose.models.Book || mongoose.model("Book", BookSchema);

import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: String, required: true }, // ISO date string (YYYY-MM-DD)
    time: { type: String, required: true }, // HH:mm
    location: { type: String, required: true },
    organizerName: { type: String, required: true },
    eventBanner: { type: String }, // file path
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);

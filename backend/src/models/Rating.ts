import mongoose, { Document, Schema } from "mongoose";

export interface IRating extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    bookId: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    }
  },
  {
    timestamps: true
  }
);

ratingSchema.index(
  { userId: 1, bookId: 1 },
  { unique: true }
);

const Rating = mongoose.model<IRating>(
  "Rating",
  ratingSchema
);

export default Rating
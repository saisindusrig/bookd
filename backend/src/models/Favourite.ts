import mongoose, {Document, Schema} from "mongoose";
export interface IFavourite extends Document {
    userId: mongoose.Types.ObjectId;
    bookId: string;
    createdAt: Date;
}
const favouriteSchema = new Schema<IFavourite>(
    {
        userId:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        bookId:{
            type: String,
            required:true

        }
    },
        {timestamps:true}
    
)
favouriteSchema.index(
  { userId: 1, bookId: 1 },
  { unique: true }
);
const Favourite = mongoose.model<IFavourite>(
    "Favourite",
    favouriteSchema
);
export default Favourite;
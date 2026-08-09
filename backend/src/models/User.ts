import mongoose, {Document, Schema} from "mongoose";
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
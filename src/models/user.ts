import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  fullName: string;
  image: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

// Updated User schema
const UserSchema: Schema<User> = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;

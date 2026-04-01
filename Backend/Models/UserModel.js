import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique:[true,"Email already existed"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profileImageUrl: {
      type: String,
    },
    role: {
      type: String,
      enum: ["AUTHOR", "USER", "ADMIN"],
      required: [true, "{Value} is an invalid role"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: false,
    versionKey: false,
  },
);

// hash password before saving when it has been modified
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

//create model
export const UserTypeModel = model("user", userSchema);
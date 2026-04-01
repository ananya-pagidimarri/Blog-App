import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../Models/UserModel.js";
import {config} from 'dotenv'
config()

//register function
export const register = async (userObj) => {
  if (!userObj.password || userObj.password.trim() === "") {
    const err = new Error("Password is required");
    err.status = 400;
    throw err;
  }
  //Create document
  const userDoc = new UserTypeModel(userObj);
  //validate for emprty passwords
  await userDoc.validate();
  //save
  const created = await userDoc.save();
  //convert document to object to remove password
  const newUserObj = created.toObject();
  //remove password
  delete newUserObj.password;
  //return user obj without password
  return newUserObj;
};

//authenticate function
export const authenticate = async ({ email, password }) => {
    //check user with email & role
  const user = await UserTypeModel.findOne({ email});
  if (!user) {
    const err = new Error("Invalid email");
    err.status = 401;
    throw err;
  }
  //if user valid ,but blocked by admin

  //compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 401;
    throw err;
  }

  //generate token
  const token = jwt.sign({ userId: user._id, 
    role: user.role, email: user.email }, 
    process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  const userObj = user.toObject();
  delete userObj.password;

  // return both the safe user object for clients and the original
  // mongoose document so callers can perform document operations
  return { token, user: userObj, userDoc: user };
};
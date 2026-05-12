import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../Models/UserModel.js";
import { config } from "dotenv";

config();


// ✅ REGISTER FUNCTION
export const register = async (userObj) => {

  // validate password
  if (!userObj.password || userObj.password.trim() === "") {
    const err = new Error("Password is required");
    err.status = 400;
    throw err;
  }

  // validate email
  if (!userObj.email || userObj.email.trim() === "") {
    const err = new Error("Email is required");
    err.status = 400;
    throw err;
  }

  // check existing user
  const existingUser = await UserTypeModel.findOne({
    email: userObj.email
  });

  if (existingUser) {
    const err = new Error("Email already exists");
    err.status = 409;
    throw err;
  }

  // create document
  const userDoc = new UserTypeModel(userObj);

  // validate mongoose schema
  await userDoc.validate();

  // save user
  const createdUser = await userDoc.save();

  // remove password before sending response
  const newUserObj = createdUser.toObject();
  delete newUserObj.password;

  return newUserObj;
};



// ✅ AUTHENTICATE FUNCTION
export const authenticate = async ({ email, password }) => {

  // validate fields
  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.status = 400;
    throw err;
  }

  // find user
  const user = await UserTypeModel.findOne({ email });

  // invalid email
  if (!user) {
    const err = new Error("Invalid email");
    err.status = 401;
    throw err;
  }

  // blocked user check
  if (!user.isActive) {
    const err = new Error("Your account is blocked");
    err.status = 403;
    throw err;
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 401;
    throw err;
  }

  // check JWT secret
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY missing in environment variables");
  }

  // generate token
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h"
    }
  );

  // remove password
  const userObj = user.toObject();
  delete userObj.password;

  // return response
  return {
    token,
    user: userObj,
    userDoc: user
  };
};
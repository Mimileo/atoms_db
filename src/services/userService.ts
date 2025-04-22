import { isValidObjectId } from "mongoose";


import User, { IUser } from "../models/Users";

export const signUp = async (data: Partial<IUser>) => {
  // Check if email or username already exists
  const existingEmail = await User.findOne({ email: data.email });
  if (existingEmail) {
    throw new Error("Email already in use.");
  }

  const existingUsername = await User.findOne({ username: data.username });
  if (existingUsername) {
    throw new Error("Username already in use.");
  }

  // Create and save user
  const user = new User(data);
  await user.save();

  // Return user data without password
  const userWithoutPassword = await User.findById(user._id)
    .select("-password");

  return userWithoutPassword;
};



export const updateUser = async (id: string, data: Partial<IUser>) => {
  return await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
};


export const findUserById = async (id: string) => {

    try {
        if (!id) {
           throw new Error('Invalid id');
        }

        if (!isValidObjectId(id)) {
            throw new Error('Invalid id');
        }

        const user = await User.findById(id).select('-password');
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllUsers = async () => {
  return await User.find().select('-password');
};

export const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};

export const getUserByEmail = async (email: string) => {
  return await User.findOne({ email }).select('-password');
};

export const getUserByUsername = async (username: string) => {
  return await User.findOne({ username }).select('-password');
};




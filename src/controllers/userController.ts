import { Request, Response, NextFunction } from 'express';
import User from '../models/Users';
import { findUserById, getAllUsers, signUp } from '../services/userService';

export const signUpController = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      roles,
      dob,
      schoolName,
    } = req.body;

    if (!firstName || !lastName || !username || !email || !password || !dob || !roles) {
      return res.status(400).json({
        message: "Missing required fields.",
      });
    }

    const user = await signUp({
      firstName,
      lastName,
      username,
      email,
      password,
      roles,
      dob,
      schoolName, 
    });

    return res.status(201).json({
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.error("Error signing up user:", error);
    return res.status(400).json({
      message: error || "Failed to create account",
    });
  }
};

// Read all users
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Read a user by id
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
         message: 'Id is required' 
      });
    
    }

    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({
         message: 'User not found'
      });
    
    }
    return res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update an user by id
export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
  
    const { id, data } = req.body;
    
    const user= User.findById(id).select('-password').lean();
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

   User.findByIdAndUpdate(id, 
    data, 
    { new: true }
  );
  
  } catch (error) {
    next(error);
  }
};

// Delete an user by id
export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ message: 'Invalid id' });
      return;
    }

    const user = User.findById(id).select('-password').lean();
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    User.findByIdAndDelete(id);

    res.json({ message: 'User  with id ' + id + ' deleted successfully' });
   
  } catch (error) {
    next(error);
  }
};
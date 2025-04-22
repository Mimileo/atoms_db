import { User } from "../models/Users";
import VerifyCode from "../models/verifyCode";
import VerificationCodeType  from "../types/verifyCodeType";
import Session from "../models/session";
export type CreateAccountParams = {
    email: string;
    password: string;
    userAgent: string;
};

export const createAccount = async ( data: CreateAccountParams) => {
    // verify user does not exist
    const existingUser = await User.exists({
         email: data.email 
    });

    if (existingUser) {
        throw new Error("User already exists");
    };

    // create user
    const user = await User.create({
        email: data.email,
        password: data.password
    });

    // create verification token
    
    const verificationToken = await VerifyCode.create({
        userId: user._id,
        type: VerificationCodeType.EmailVerification,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    });


    // send verification email




    // create seession
    const session = await Session.create({
        userId: user._id,
        userAgent: data.userAgent,
    });

    // sign access token and refresh token

    // return user and tokens
}

export const login = () => {}

export const logout = () => {}

export const refresh = () => {}
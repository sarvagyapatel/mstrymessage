import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifiedByUsername) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username is already taken"
                }),
                {
                    status: 400
                }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "User already exists with this email"
                    }),
                    {
                        status: 400
                    }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date(Date.now() + 3600000);

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.username = username;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = expiryDate;

                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: true, // because sending otp to requires resend premium
                isAcceptingMessages: true,
                message: []
            });

            await newUser.save();
        }

        // Send verification email
        // console.log("routes", username, email, verifyCode)
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        // console.log(emailResponse)

        if (!emailResponse.success) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: emailResponse.message
                }),
                {
                    status: 500
                } 
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "User registered successfully, please login"
            }),
            {
                status: 200
            }
        );

    } catch (error) {
        console.log("Error registering user", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error registering user"
            }),
            {
                status: 500
            }
        );
    }
}

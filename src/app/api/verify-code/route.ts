import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json();

        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json(
                {
                    status: false,
                    message: "user not found"
                },
                {
                    status: 400
                }
            )
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (!isCodeValid) {
            return Response.json(
                {
                    status: false,
                    message: "Invalid verification code"
                },
                {
                    status: 400
                }
            )
        }

        if (!isCodeExpired) {
            return Response.json(
                {
                    status: false,
                    message: "Verification code expired"
                },
                {
                    status: 500
                }
            )
        }

        user.isVerified = true;
        await user.save();

        return Response.json(
            {
                status: true,
                message: "User successfully verified"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.error("ERROR verifying code", error)
        return Response.json(
            {
                success: false,
                message: "ERROR verifying code"
            },
            {
                status: 500
            }
        )
    }
}


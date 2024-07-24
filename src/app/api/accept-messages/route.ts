import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth"

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User;
    if (!session || !session?.user) {
        return Response.json(
            {
                status: false,
                message: "Not authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id;
    // console.log(userId)

    try {

        const { acceptMessages } = await request.json();
        console.log(acceptMessages)

        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessages: acceptMessages
        }, { new: true })

        console.log(updatedUser)

        if (!updatedUser) {
            return Response.json(
                {
                    status: false,
                    message: "falied to update user status to accept messages"
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                status: true,
                message: "Message acceptence status updated successfully"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("falied to update user status to accept messages")
        return Response.json(
            {
                status: false,
                message: "falied to update user status to accept messages"
            },
            {
                status: 500
            }
        )
    }
}


export async function GET(request: Request) {
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User;
    if (!session || !session?.user) {
        return Response.json(
            {
                status: false,
                message: "Not authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json(
                {
                    status: false,
                    message: "user not found"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                status: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
                message: "Message acceptence status updated successfully"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Failed to fetch status of accepting messages")
        return Response.json(
            {
                status: false,
                message: "Failed to fetch status of accepting messages"
            },
            {
                status: 500
            }
        )
    }
}
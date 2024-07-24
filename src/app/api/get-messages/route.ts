import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth"
import mongoose from "mongoose";


export async function GET(request: Request) {
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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId,
                },
            },
            {
                $unwind: "$message"
            },
            {
                $sort: {
                    'message.createdAt': -1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    messages: {
                        $push: '$message'
                    }
                }
            }
        ])

        if (!user || user.length === 0) {
            return Response.json(
                {
                    status: false,
                    message: "user not found"
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                status: true,
                messages: user[0].messages,
                message: "All messages found"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.error("Unexpected error occured", error)
        return Response.json(
            {
                status: false,
                message: "Unexpected error occured"
            },
            {
                status: 500
            }
        )
    }
}
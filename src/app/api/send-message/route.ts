import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from '@/model/User.model'

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne(username);

        if (!username) {
            return Response.json(
                {
                    status: false,
                    message: "User does not exist"
                },
                {
                    status: 401
                }
            )
        }

        const acceptingStatus = user?.isAcceptingMessages;

        if (!acceptingStatus) {
            return Response.json(
                {
                    status: false,
                    message: "user is not accepting responses"
                },
                {
                    status: 403
                }
            )
        }
        const createdAt = new Date()
        const newMessage = { content, createdAt }

        user.message.push(newMessage as Message)
        await user.save();

        return Response.json(
            {
                status: true,
                message: "Message sent Successfully"
            },
            {
                status: 401
            }
        )
    } catch (error) {
        console.error("Message cannot be sent", error)
        return Response.json(
            {
                status: false,
                message: "Message cannot be sent"
            },
            {
                status: 500
            }
        )
    }
}
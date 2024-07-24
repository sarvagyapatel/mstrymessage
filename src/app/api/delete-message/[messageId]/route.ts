import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import { User } from "next-auth"


export async function DELETE(request: Request, {params}:{params: {messageId: string}}){
    const messageId = params.messageId;
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if(!session || !session?.user){
        return Response.json(
            {
                status: false,
                message: "Unauthorised user"
            },
            {
                status: 401
            }
        )
    }

    try {
        const updatedMessage = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {message: {_id: messageId}}}
        )

        if(updatedMessage.modifiedCount == 0){
            return Response.json(
                {
                    status: false,
                    message: "Message cannot be deleted or does not exist"
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                status: true,
                message: "Message deleated"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return Response.json(
            {
                status: false,
                message: "Error occured during deletion"
            },
            {
                status: 500
            }
        )
    }

}
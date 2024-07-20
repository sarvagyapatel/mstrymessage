import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import {z} from 'zod'

const UsernamequerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    await dbConnect();
      //localhost:3000/api/cuu?username=sarvagya?phone:android
    try { 
         const {searchParams} = new URL(request.url)
         const queryParam = {
            username: searchParams.get('username')
         }
         //validate with zod
        const result = UsernamequerySchema.safeParse(queryParam)

        console.log(queryParam)

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors.length > 0? usernameErrors.join(',') : "Invalid Query Parameter"
                },
                {   
                    status: 400
                }
            )
        }

        const {username} = result.data;

        const existingVerifiedUser = await UserModel.findOne({username, isVerified:true})

        if(existingVerifiedUser){
            return Response.json(
                {
                    status: false,
                    message: "Username already exists try different"
                },
                {
                    status: 400
                }
            )
        }

        return Response.json(
            {
                status: true,
                message: "Username available"
            },
            {
                status: 200
            }
        )
     
    } catch (error) {
        console.error("ERROR checking the username", error)
        return Response.json(
            {
                success: false,
                message: "ERROR checking username"
            },
            {
                status: 500
            }
        )
    }
}
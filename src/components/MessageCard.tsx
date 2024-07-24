'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User.model"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"


type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}


function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const { toast } = useToast()

    const handleDeleteConfirm = async () => {
        const messageId: string = message._id as string     // check typescript syntax
        onMessageDelete(messageId)
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`)
        toast({
            title: response.data.message
        })
        
    }
    const messageDate: string = message.createdAt as unknown as string;
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-row justify-between">
                <CardTitle>{message.content}</CardTitle>

                <AlertDialog>
                    <AlertDialogTrigger asChild >
                        <div className="flex flex-row items-center justify-center">
                            <Button variant="destructive" >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </div>

                <CardDescription>{messageDate}</CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
        </Card>

    )
}

export default MessageCard
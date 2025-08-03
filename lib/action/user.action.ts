"use server"
import {connectToDb} from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import {revalidatePath} from "next/cache";

interface Params{
    userId:string;
    name:string;
    bio:string;
    username:string;
    path:string;
    image:string;
}


export async function updateUser({userId,name,bio,username,path,image}:Params):Promise<void> {

    try {
       await connectToDb();
        await User.findOneAndUpdate(
            {id:userId},
        {
            username:username.toLowerCase(),
            name,
            bio,
            image,
            onboarded: true,
        },
            {upsert: true},
        )
        if(path =='/profile/edit') revalidatePath(path)
    }
    catch (error:any) {

        throw new Error(`Failed to update user ${error.message}`);
    }
}

export const fetchUser = async (userId:string) => {

    try {
        await connectToDb();
        return await User.findOne({id:userId});



    }
    catch (error:any) {
        throw new Error(`Failed to fetch user ${error.message}`);
    }
}
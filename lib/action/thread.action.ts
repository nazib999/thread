"use server"

import {connectToDb} from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import {revalidatePath} from "next/cache";
import Thread from "@/lib/models/thread.model";

interface Params{
    text:string;
    author:string;
    communityId:string | null;
    path:string;
}

export const createThread = async ({text,author,communityId,path}:Params)=>{
    try {
        await connectToDb();

        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });

        await User.findByIdAndUpdate(author,{
            $push: {threads: createdThread._id},
        })

        revalidatePath(path);
    }
    catch (error:unknown) {
        throw new Error(`Failed to create thread: ${error.message}`);
    }

}

export  async  function fetchPosts(pageNumber = 1, pageSize = 10) {
    try {
        await  connectToDb();
        const skip = (pageNumber - 1) * pageSize;
        const postsQuery =  Thread.find({parentId:{$in:[null,undefined]}})
            .sort({createdAt: 'desc'})
            .skip(skip)
            .limit(pageSize)
            .populate({path:'author', model:User})
            .populate({
                path:'children',
                populate: {
                    path:'author',
                    model: User,
                    select:"_id parentId name image"
                }
            })

        const totalPostsCount = await Thread.countDocuments({parentId:{$in:[null,undefined]},
        });
        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > (skip + posts.length);

        return {posts, isNext}


    } catch (error:unknown) {
        throw new Error(`Failed to fetch posts: ${error.message}`);
    }
}

export async function fetchThreadById(id: string) {
    try {
        await connectToDb();
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id name image',
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id name image',
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id name parentId image',
                        },
                    },
                ],
            }).exec()


        return thread;
    } catch (error: unknown) {
        throw new Error(`Failed to fetch thread by id: ${error.message}`);
    }
}

export async function addCommentToThread(threadId: string, commentText: string, userId: string,path: string) {


    try {
        await connectToDb();

        const originalThread = await Thread.findById(threadId);
        if (!originalThread) {
            throw new Error('Thread not found');
        }
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })

        const savedComment = await commentThread.save();

        originalThread.children.push(savedComment._id);
        await originalThread.save();
        revalidatePath(path);
    }

        catch(error: unknown) {
            throw new Error(`Failed to add comment: ${error.message}`);
        }

}
import { redirect } from 'next/navigation';
import React from 'react';

import Comment from '@/components/Comment';
import ThreadCard from '@/components/ThreadCard';

import { fetchUser } from '@/lib/action/user.action';
import { fetchThreadById } from '@/lib/action/thread.action';
import { currentUser } from '@clerk/nextjs/server';

export const revalidate = 0;

interface UserInfo {
    _id: string;
    onboarded: boolean;
    // other fields if needed
}

interface Author {
    _id: string;
    name?: string;
    image?: string;
    username?: string;
    // etc.
}

interface Thread {
    _id: string;
    parentId: string | null;
    text?: string;
    author: Author | null;
    community?: string;
    createdAt?: string;
    children: Thread[];
    // any other fields used by ThreadCard
}



async function page({ params }: { params: { id: string } }) {
    if (!params.id) return null;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = (await fetchUser(user.id)) as UserInfo;
    if (!userInfo?.onboarded) redirect('/onboarding');

    const thread = (await fetchThreadById(params.id)) as Thread | null;
    if (!thread) return null;

    return (
        <section className="relative">
            <div>
                <ThreadCard
                    id={thread._id}
                    currentUserId={user.id}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>

            <div className="mt-7">
                <Comment
                    threadId={params.id}
                    currentUserImg={user.imageUrl}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className="mt-10">
                {thread.children.map((childItem: Thread) => (
                    <ThreadCard
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={user.id}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.community}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    );
}

export default page;

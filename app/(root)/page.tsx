import React from 'react';
import { fetchPosts } from '@/lib/action/thread.action';
import { currentUser } from '@clerk/nextjs/server';
import ThreadCard from '@/components/ThreadCard';

const Page = async () => {
    const user = await currentUser();
    const result = await fetchPosts(1, 30);

    return (
        <div>
            <h1 className="head-text text-left">Home</h1>

            <section className="mt-9 flex flex-col gap-10">
                {result.posts.map((post) => (
                    <ThreadCard
                        key={post._id}
                        id={post._id} // already stringified in fetchPosts
                        currentUserId={user?.id || ''}
                        parentId={post.parentId }
                        content={post.text}
                        author={post.author} // should be plain object with string _id
                        createdAt={post.createdAt}
                        community={post.community}
                        comments={post.children ?? []}
                    />
                ))}
                {!result.posts.length && <p className="no-result">No posts yet.</p>}
            </section>
        </div>
    );
};

export default Page;

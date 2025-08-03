import React from 'react'
import {currentUser} from "@clerk/nextjs/server";
import AccountProfile from "@/components/AccountProfile";

const Page =async () => {
    const user = await currentUser();
    const userInfo = {};

    const userData = {
        id: user?.id,
        objectId: userInfo?.id,
        username: user?.username || userInfo?.username,
        name: user?.firstName || userInfo?.name ||'',
        bio:userInfo?.bio || '',
        image: user?.imageUrl || userInfo?.image ,
    }
    return (
        <main className={'mx-auto h-screen flex max-w-3xl flex-col justify-start px-10 py-20'}>
            <h1 className={'head-text'}>Onboarding</h1>
            <p className={'text-light-2 text-base-regular'}>Complete your profile to use Thrends</p>

            <section className={'mt-9 bg-dark-2 p-10 '}>
                <AccountProfile user={userData} btnTitle={'Continue'}/>
            </section>
        </main>
    )
}
export default Page

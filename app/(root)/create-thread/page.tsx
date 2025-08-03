
import {currentUser} from "@clerk/nextjs/server";
import {fetchUser} from "@/lib/action/user.action";
import {redirect} from "next/navigation";
import PostThread from "@/components/PostThread";
 const Page = async () => {

    const user = await currentUser();

    if (!user) {
        return null;
    }

    const userInfo = await fetchUser(user.id);

    if(!userInfo?.onboarded) redirect('/onboarding');
    return (
        <div className={''}>

            <h1 className={''}>
                Create a Thread
            </h1>
            <PostThread userId={userInfo._id.toString()}/>
        </div>
    )
}

export default Page
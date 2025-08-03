"use client"

import Image from "next/image";

interface Props{
    user:{
        id:string,
        objectId:string,
        username:string,
        name:string,
        bio:string,
        image:string
    };
    btnTitle:string;
}


import { z } from "zod"

const formSchema = z.object({
    profile_photo:z.string().url().nonempty(),
    name: z.string().min(2).max(50),
    bio: z.string().max(1000),
    username: z.string().min(2).max(50),
})
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import {isBase64Image} from "@/lib/utils";
import {useUploadThing} from "@/lib/uploadthing";
import {updateUser} from "@/lib/action/user.action";
import {usePathname, useRouter} from "next/navigation";

const AccountProfile = ({user,btnTitle}:Props) => {

const [files,setFiles] = useState<File[]>([]);
const {startUpload} = useUploadThing('media');
const pathname = usePathname();
const router = useRouter()
// 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profile_photo: user?.image || "",
            username: user?.username || "",
            name: user?.name || "",
            bio: user?.bio || ""
        }
    })

    // 2. Define a submit handler.
    const onSubmit=async (values: z.infer<typeof formSchema>)=> {

        const blob = values.profile_photo;

        const hasImageChanged = isBase64Image(blob);

        if(hasImageChanged){
            const imgRes = await startUpload(files);

            if(imgRes && imgRes[0].url){
               values.profile_photo = imgRes[0].url;
            }
        }
        await updateUser({
            name: values.name,
            username:values.username,
            bio:values.bio,
            image:values.profile_photo,
            userId:user.id,
            path:pathname
        })
        if(pathname==='/profile/edit'){
            router.back()
        }
        else {
            router.push('/');
        }
    }

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        e.preventDefault()
        const file = e.target.files?.[0];
        if (file && e.target.files?.length) {
            const reader = new FileReader();
            setFiles(Array.from(e.target.files));
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10  justify-start">
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({field}) => (
                        <FormItem className={'flex items-center gap-4'}>
                            <FormLabel className={'account-form_image-label'}>
                                {field.value?(
                                    <Image src={field.value} alt={'photo'} width={100} height={100} priority className={'rounded-full object-contain'}/>
                                ):(
                                    <Image src={'/assets/profile.svg'} alt={'photo'} width={24} height={24} className={'object-contain'}/>
                                )}
                            </FormLabel>
                            <FormControl className={'flex-1 text-base-semibold'}>
                                <Input type={'file'} accept={'image/*'} className={'account-form_image-input'}
                                placeholder={'upload profile photo'}
                                onChange={(e) => handleImage(e,field.onChange)}/>
                            </FormControl>


                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem className={'flex flex-col gap-4 w-full'}>
                            <FormLabel className={'text-base-semibold text-light-2'}>
                                Name
                            </FormLabel>
                            <FormControl className={'flex-1 text-base-semibold'}>
                                <Input type={'text'} {...field} className={'account-form_input no-focus'}/>
                            </FormControl>


                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({field}) => (
                        <FormItem className={'flex flex-col gap-4 w-full'}>
                            <FormLabel className={'text-base-semibold text-light-2'}>
                                UserName
                            </FormLabel>
                            <FormControl className={'flex-1 text-base-semibold'}>
                                <Input type={'text'} {...field} className={'account-form_input no-focus'}/>
                            </FormControl>


                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({field}) => (
                        <FormItem className={'flex flex-col gap-4 w-full'}>
                            <FormLabel className={'text-base-semibold text-light-2'}>
                                Bio
                            </FormLabel>
                            <FormControl className={'flex-1 text-base-semibold'}>
                                <Textarea rows={10} {...field} className={'account-form_input no-focus'}/>
                            </FormControl>


                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default AccountProfile

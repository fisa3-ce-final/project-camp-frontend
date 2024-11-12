"use client";
import { signOut } from "next-auth/react";
import { FC, useEffect } from "react";

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
    useEffect(() => {
        signOut({
            redirect: true,
            callbackUrl: process.env.NEXT_PUBLIC_HOST + "/api/auth/logout",
        });
    }, []);
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
    );
};

export default Page;

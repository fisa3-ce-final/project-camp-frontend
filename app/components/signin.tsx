"use client";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";

import { FC } from "react";

interface SigninProps {}

const Signin: FC<SigninProps> = ({}) => {
    return (
        <Button
            size={"lg"}
            onClick={() => signIn("cognito", { callbackUrl: "/main" })}
            className="px-8 py-4 mt-4 bg-yellow-400 text-gray-900 hover:bg-yellow-500"
        >
            로그인
        </Button>
    );
};

export default Signin;

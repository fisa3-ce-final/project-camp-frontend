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
        >
            로그인
        </Button>
    );
};

export default Signin;

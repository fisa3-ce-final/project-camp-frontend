"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

import { FC } from "react";

interface SigninProps {
    className?: string;
    text?: string;
}

const Signin: FC<SigninProps> = ({ className, ...props }) => {
    return (
        <Link
            onClick={() => signIn("cognito", { callbackUrl: "/main" })}
            href="#"
            className={cn(
                "inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-150 ease-in-out",
                className // 추가: 외부 클래스 병합
            )}
        >
            {props.text ?? "가입하기"}
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        </Link>
    );
};

export default Signin;

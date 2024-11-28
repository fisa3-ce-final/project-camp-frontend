"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

import { FC } from "react";

interface SigninProps {}

const Signin: FC<SigninProps> = ({}) => {
    return (
        <Link
            onClick={() => signIn("cognito", { callbackUrl: "/main" })}
            href="#"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-150 ease-in-out"
        >
            둘러보기
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        </Link>
    );
};

export default Signin;

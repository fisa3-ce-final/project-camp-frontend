"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { FC } from "react";

interface SignoutProps {}

const Signout: FC<SignoutProps> = ({}) => {
    return (
        <Button
            size={"lg"}
            onClick={() =>
                signOut({
                    callbackUrl:
                        process.env.NEXT_PUBLIC_HOST + "/api/auth/logout",
                })
            }
        >
            로그아웃
        </Button>
    );
};

export default Signout;

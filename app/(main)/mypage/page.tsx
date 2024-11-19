// app/mypage/page.tsx (Server Component)
import { FC } from "react";
import { MyPage } from "./mypage";
import { UserGetResponse } from "@/app/types/user-get-response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { redirect, RedirectType } from "next/navigation";

// 서버에서 사용자 데이터를 미리 패칭하는 함수
async function getUserData(): Promise<UserGetResponse | null> {
    const data = await getServerSession(authOptions);

    const res = await fetch(process.env.BACKEND_URL + "/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.user.id_token}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        console.error("데이터 패칭 오류:", res.statusText);
        redirect("/logout");
    }
    let result: UserGetResponse | null = null;

    try {
        result = await res.json();
    } catch (error) {
        result = null;
    }

    return result;
}

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
    const userData = await getUserData();
    if (userData === null) {
        redirect("/logout");
    }

    return (
        <>
            <MyPage userData={userData} />
        </>
    );
};

export default Page;

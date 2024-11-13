// app/mypage/page.tsx (Server Component)
import { FC } from "react";
import { MyPage } from "./mypage";
import { UserGetResponse } from "@/app/types/user-get-response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

// 서버에서 사용자 데이터를 미리 패칭하는 함수
async function getUserData(): Promise<UserGetResponse | null> {
    const data = await getServerSession(authOptions);

    const res = await fetch(process.env.BACKEND_URL + "/user", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.user.id_token}`,
        },
        cache: "no-cache",
    });

    if (!res.ok) {
        console.error("데이터 패칭 오류:", res.statusText);
        return null;
    }

    return res.json();
}

interface PageProps {}

const Page: FC<PageProps> = async ({}) => {
    // 서버사이드에서 사용자 데이터를 받아옴
    const userData = await getUserData();
    // console.log("userData", userData);
    return (
        <>
            <MyPage userData={userData} />
        </>
    );
};

export default Page;

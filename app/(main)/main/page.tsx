// app/main/page.tsx

import { FC } from "react";
import RentalPage from "./rental-page";
import { RentalPageData } from "@/app/types/rental-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { redirect } from "next/navigation";

interface MainPageProps {
    searchParams: {
        [key: string]: string | string[];
    };
}

const MainPage: FC<MainPageProps> = async ({ searchParams }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
        redirect("/auth/signin");
    }

    // URL에서 쿼리 파라미터 추출
    const query = Array.isArray(searchParams.query)
        ? searchParams.query[0]
        : searchParams.query || "";
    const category = Array.isArray(searchParams.category)
        ? searchParams.category[0]
        : searchParams.category || "ALL";
    const page = Array.isArray(searchParams.page)
        ? parseInt(searchParams.page[0], 10)
        : parseInt(searchParams.page || "1", 10);

    // API 엔드포인트 결정
    let apiUrl = "";
    if (query.trim() !== "") {
        // 검색 API 사용
        apiUrl = `${
            process.env.BACKEND_URL
        }/rental-items/search/${encodeURIComponent(query.trim())}?page=${
            page - 1
        }&size=10`;
    } else {
        // 카테고리 기반 API 사용
        apiUrl = `${
            process.env.BACKEND_URL
        }/rental-items/category/${category}?page=${page - 1}&size=10`;
    }

    // 데이터 가져오기
    const response = await fetch(apiUrl, {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${session.user.id_token}`,
        },
    });

    if (!response.ok) {
        // 오류 처리 (예: 사용자에게 오류 메시지 표시)
        throw new Error(`Failed to fetch rental items: ${response.statusText}`);
    }

    const data: RentalPageData = await response.json();

    return (
        <RentalPage
            rentalPageData={data}
            idToken={session.user.id_token!}
            initialSearchQuery={query}
            initialCategory={category}
            initialPage={page}
        />
    );
};

export default MainPage;

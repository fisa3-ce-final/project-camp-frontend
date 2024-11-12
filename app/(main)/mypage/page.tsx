"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import Signout from "@/app/components/signout";
import { UserGetResponse } from "@/app/types/user-get-response";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

export default function MypagePage() {
    const [userData, setUserData] = useState<UserGetResponse | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const { data } = useSession();

    useEffect(() => {
        if (!data) {
            return;
        }

        fetch("/backend/users/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data?.user.id_token}`,
            },
        })
            .then((res) => res.json())
            .then((data: UserGetResponse) => {
                setUserData(data);
                setNickname(data.nickname);
                setPhone(data.phone);
                setAddress(data.address);
                setAvatar(data.imageUrl);
            })
            .catch((error) =>
                console.error("사용자 정보 가져오기 실패:", error)
            );
    }, [data]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatar(URL.createObjectURL(file));
        }
    };

    const handleCouponMoreClick = () => alert("쿠폰 보유 현황 더보기");
    const handleRentMoreClick = () => alert("대여중인 물품 더보기");
    const handleLendMoreClick = () => alert("빌려준 물품 더보기");
    const handleOrderHistoryClick = () => alert("주문 내역 더보기");

    if (!userData) {
        return (
            <div className="flex justify-center h-[2000px] bg-gray-100 p-8">
                <div className="w-full max-w-3xl space-y-8">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="w-32 h-32 rounded-full" />
                        <div className="flex-1 space-y-4 py-1">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-6 w-1/2" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-1/3 mt-6" />
                    <Skeleton className="h-6 w-2/3 mt-6" />
                    <Skeleton className="h-6 w-1/2 mt-6" />
                    <Skeleton className="h-6 w-1/4 mt-6" />
                    <div className="flex justify-between mt-6">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center h-full bg-gray-100">
            <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md space-y-10">
                {/* 내 정보 섹션 */}
                <section className="flex items-center justify-between space-x-6">
                    <Avatar className="w-32 h-32 rounded-full bg-gray-300 shrink-0">
                        <AvatarImage
                            src={avatar || undefined}
                            alt="아바타"
                            className="w-full h-full object-cover rounded-full"
                        />
                        <AvatarFallback className="w-full h-full flex items-center justify-center text-2xl font-bold text-white bg-gray-400 rounded-full">
                            CL
                        </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <label
                            htmlFor="avatarUpload"
                            className="relative cursor-pointer flex-shrink-0"
                        >
                            <input
                                type="file"
                                id="avatarUpload"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer"
                            />
                            <div className="absolute top-[-3.5rem] left-[-3.5rem] p-1 bg-gray-700 rounded-full text-white">
                                <Pencil size={20} />
                            </div>
                        </label>
                    )}
                    <div className="flex-1 space-y-2">
                        <h2 className="text-2xl font-bold">닉네임</h2>
                        {isEditing ? (
                            <Input
                                type="text"
                                value={nickname}
                                onChange={handleNicknameChange}
                                className="mt-2 text-xl p-3"
                            />
                        ) : (
                            <p className="text-xl mt-2">{nickname}</p>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleEditToggle}
                        className="h-12"
                    >
                        {isEditing ? "저장" : "수정"}
                    </Button>
                </section>

                {/* 이메일 표시 */}
                <section className="border-t pt-4">
                    <h2 className="text-lg font-bold">이메일</h2>
                    <p className="text-lg">{userData.email}</p>
                </section>

                {/* 핸드폰 번호 */}
                <section className="border-t pt-4">
                    <h2 className="text-lg font-bold">핸드폰 번호</h2>
                    {isEditing ? (
                        <Input
                            type="text"
                            value={phone}
                            onChange={handlePhoneChange}
                            className="mt-2 text-lg p-2"
                        />
                    ) : (
                        <p className="text-lg mt-2">{phone}</p>
                    )}
                </section>

                {/* 주소 */}
                <section className="border-t pt-4">
                    <h2 className="text-lg font-bold">주소</h2>
                    {isEditing ? (
                        <Input
                            type="text"
                            value={address}
                            onChange={handleAddressChange}
                            className="mt-2 text-lg p-2"
                        />
                    ) : (
                        <p className="text-lg mt-2">{address}</p>
                    )}
                </section>

                {/* 쿠폰 보유 현황 */}
                <section className="flex justify-between items-center border-t pt-4">
                    <h2 className="text-lg font-bold">쿠폰 보유 현황</h2>
                    <Button
                        variant="outline"
                        className="w-24"
                        onClick={handleCouponMoreClick}
                    >
                        더보기
                    </Button>
                </section>

                {/* 대여중인 물품 버튼 */}
                <section className="flex justify-between items-center border-t pt-4">
                    <h2 className="text-lg font-bold">대여중인 물품</h2>
                    <Button
                        variant="outline"
                        className="w-24"
                        onClick={handleRentMoreClick}
                    >
                        더보기
                    </Button>
                </section>

                {/* 빌려준 물품 버튼 */}
                <section className="flex justify-between items-center border-t pt-4">
                    <h2 className="text-lg font-bold">빌려준 물품</h2>
                    <Button
                        variant="outline"
                        className="w-24"
                        onClick={handleLendMoreClick}
                    >
                        더보기
                    </Button>
                </section>

                {/* 주문 내역 버튼 */}
                <section className="flex justify-between items-center border-t pt-4">
                    <h2 className="text-lg font-bold">주문 내역</h2>
                    <Button
                        variant="outline"
                        className="w-24"
                        onClick={handleOrderHistoryClick}
                    >
                        더보기
                    </Button>
                </section>

                {/* 로그아웃 버튼 */}
                <section className="flex justify-center mt-8 border-t pt-4">
                    <Signout />
                </section>
            </div>
        </div>
    );
}

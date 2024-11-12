"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import Signout from "@/app/components/signout";

export default function MypagePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState("캠핑러버");
    const [email] = useState("camper@example.com"); // 이메일은 수정 불가
    const [phone, setPhone] = useState("010-1234-5678");
    const [address, setAddress] = useState("서울시 강남구 캠핑로 123");
    const [avatar, setAvatar] = useState<string | null>(null); // 아바타 이미지 상태
    const [couponCount] = useState(5);

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

    const handleCouponClick = () => {
        // 쿠폰 보유 현황 버튼 클릭 시 동작 설정
    };

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
                            {/* 연필 아이콘 */}
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
                    <p className="text-lg">{email}</p>
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

                {/* 쿠폰 보유 현황 버튼 */}
                <section className="flex justify-between items-center border-t pt-4">
                    <h2 className="text-lg font-bold">쿠폰 보유</h2>
                    <Button variant="outline" onClick={handleCouponClick}>
                        {couponCount}장
                    </Button>
                </section>

                {/* 대여중인 물품 버튼 */}
                <section className="flex justify-between items-center border-t pt-4">
                    <h2 className="text-lg font-bold">대여중인 물품</h2>
                    <Button variant="outline" className="w-24">
                        더보기
                    </Button>
                </section>

                {/* 빌려준 물품 버튼 */}
                <section className="flex justify-between items-center border-t pt-4">
                    <h2 className="text-lg font-bold">빌려준 물품</h2>
                    <Button variant="outline" className="w-24">
                        더보기
                    </Button>
                </section>

                {/* 주문 내역 버튼 */}
                <section className="flex justify-between items-center border-t pt-4">
                    <h2 className="text-lg font-bold">주문 내역</h2>
                    <Button variant="outline" className="w-24">
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

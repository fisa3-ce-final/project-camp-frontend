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
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface MyPageProps {
    userData: UserGetResponse | null;
}

export function MyPage({ userData }: MyPageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(userData?.nickname ?? "");
    const [phone, setPhone] = useState(userData?.phone ?? "");
    const [address, setAddress] = useState(userData?.address ?? "");
    const [avatar, setAvatar] = useState(userData?.imageUrl ?? "");
    const { data: session } = useSession() as { data: Session };

    // 임시 상태 (수정 모드 중에 변경사항을 임시로 저장)
    const [tempNickname, setTempNickname] = useState(nickname);
    const [tempPhone, setTempPhone] = useState(phone);
    const [tempAddress, setTempAddress] = useState(address);
    const [avatarFile, setAvatarFile] = useState<File | null>(null); // 이미지 파일 상태
    const [isDeleting, setIsDeleting] = useState(false); // 삭제 상태

    const router = useRouter();

    const handleEditToggle = () => {
        if (isEditing) {
            // 수정 모드를 종료하고 저장할 경우
            handleSave();
        } else {
            // 수정 모드 진입 시 현재 상태를 임시 저장 상태로 설정
            setTempNickname(nickname);
            setTempPhone(phone);
            setTempAddress(address);
            setAvatarFile(null); // 기존 파일 초기화
        }
        setIsEditing((prev) => !prev);
    };

    const handleCancelEdit = () => {
        // 원래 값으로 되돌리고 편집 모드 종료
        setTempNickname(nickname);
        setTempPhone(phone);
        setTempAddress(address);
        setAvatarFile(null); // 파일 초기화
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append("nickname", tempNickname);
            formData.append("phone", tempPhone);
            formData.append("address", tempAddress);
            if (avatarFile) {
                formData.append("imageFile", avatarFile); // 이미지 파일 추가
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_HOST}/backend/user`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${session?.user.id_token}`,
                        // 'Content-Type'을 설정하지 마세요. FormData는 자동으로 설정됩니다.
                    },
                    body: formData,
                    cache: "no-cache",
                }
            );
            if (response.ok) {
                // 변경사항을 최종 저장
                setNickname(tempNickname);
                setPhone(tempPhone);
                setAddress(tempAddress);
                if (avatarFile) {
                    // 서버에서 반환된 새로운 이미지 URL을 사용하도록 수정 필요
                    const data = await response.json();
                    setAvatar(data.imageUrl || avatar); // 서버 응답에 따라 조정
                }
                setAvatarFile(null);
                setIsEditing(false);
            } else {
                console.error("Failed to save changes");
            }
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempNickname(e.target.value);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempPhone(e.target.value);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempAddress(e.target.value);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file); // 선택한 파일을 상태에 저장
            setAvatar(URL.createObjectURL(file)); // 미리보기용 URL 설정
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "정말 계정을 삭제하시겠습니까? 되돌릴 수 없습니다."
        );
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_HOST}/backend/user`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${session?.user.id_token}`,
                    },
                    cache: "no-cache",
                }
            );

            if (response.ok) {
                alert("계정이 성공적으로 삭제되었습니다.");
                router.push("/logout"); // 추가된 부분: /logout 페이지로 이동
            } else {
                const errorData = await response.json();
                console.error("Failed to delete account:", errorData);
                alert("계정 삭제에 실패했습니다. 나중에 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("계정 삭제 중 오류가 발생했습니다.");
        } finally {
            setIsDeleting(false);
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
                    <div className="relative">
                        <Avatar className="w-32 h-32 rounded-full bg-gray-300 shrink-0">
                            <AvatarImage
                                src={avatar || undefined}
                                alt="아바타"
                                className="w-32 h-32 object-cover rounded-full"
                            />
                            <AvatarFallback className="w-32 h-32 flex items-center justify-center text-2xl font-bold text-white bg-gray-400 rounded-full">
                                <Image
                                    src="/logo-img.png"
                                    alt="아바타"
                                    width={128}
                                    height={128}
                                    className="w-32 h-32 object-cover rounded-full"
                                />
                            </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                            <label
                                htmlFor="avatar-upload"
                                className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-md"
                            >
                                <Pencil className="w-4 h-4 text-gray-600" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        )}
                    </div>
                    <div className="flex-1 space-y-2">
                        <h2 className="text-2xl font-bold">닉네임</h2>
                        {isEditing ? (
                            <Input
                                type="text"
                                value={tempNickname}
                                onChange={handleNicknameChange}
                                className="mt-2 text-xl p-3"
                            />
                        ) : (
                            <p className="text-xl mt-2">{nickname}</p>
                        )}
                    </div>
                    {isEditing ? (
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={handleSave}
                                className="h-12"
                            >
                                확인
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCancelEdit}
                                className="h-12"
                            >
                                취소
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={handleEditToggle}
                            className="h-12"
                        >
                            수정
                        </Button>
                    )}
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
                            value={tempPhone}
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
                            value={tempAddress}
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

                {/* 관리자 버튼 */}
                {userData.role === "ADMIN" && (
                    <section className="flex justify-center mt-8 border-t pt-4">
                        <Link href="/admin">
                            <Button>관리자 대시보드</Button>
                        </Link>
                    </section>
                )}

                {/* 로그아웃 버튼 */}
                <section className="flex justify-center mt-8 border-t pt-4">
                    <Signout />
                </section>

                {/* 로그아웃 및 계정 삭제 버튼 */}
                <section className="flex flex-col items-center mt-8 border-t pt-4 space-y-4">
                    <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        className="h-12 w-full max-w-xs"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "삭제 중..." : "계정 삭제"}
                    </Button>
                </section>
            </div>
        </div>
    );
}

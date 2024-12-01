"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
    Pencil,
    User,
    Mail,
    Phone,
    MapPin,
    Gift,
    ShoppingBag,
    Package,
    Upload,
    LogOut,
    AlertTriangle,
} from "lucide-react";
import Signout from "@/app/components/signout";

interface UserData {
    nickname: string;
    email: string;
    phone: string;
    address: string;
    imageUrl: string;
    role: string;
}

const fetchUserData = async (token: string): Promise<UserData> => {
    const response = await fetch("/backend/user", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch user data");
    return response.json();
};

const updateUserData = async (
    token: string,
    formData: FormData
): Promise<UserData> => {
    const response = await fetch("/backend/user", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    if (!response.ok) throw new Error("Failed to update user data");
    return response.json();
};

const deleteAccount = async (token: string): Promise<void> => {
    const response = await fetch("/backend/user", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to delete account");
};

export function MyPage() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tempUserData, setTempUserData] = useState<UserData | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.id_token) {
            loadUserData();
        }
    }, [session]);

    const loadUserData = async () => {
        if (!session?.user?.id_token) return;
        try {
            const data = await fetchUserData(session.user.id_token);
            setUserData(data);
            setTempUserData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("사용자 정보를 불러오는데 실패했습니다.");
        }
    };

    const handleEditToggle = () => {
        if (isEditing) {
            handleSave();
        } else {
            setTempUserData(userData);
            setAvatarFile(null);
        }
        setIsEditing(!isEditing);
    };
    const handleSave = async () => {
        if (!session?.user?.id_token || !tempUserData) return;
        try {
            const formData = new FormData();
            formData.append("nickname", tempUserData.nickname);
            formData.append("phone", tempUserData.phone);
            formData.append("address", tempUserData.address);
            if (avatarFile) {
                formData.append("imageFile", avatarFile);
            }

            const updatedData = await updateUserData(
                session.user.id_token,
                formData
            );
            updatedData.email = userData?.email!; // Keep the email unchanged
            setUserData(updatedData);

            // Ensure the new image URL is reflected immediately
            if (avatarFile && updatedData.imageUrl) {
                setUserData((prev) => ({
                    ...prev!,
                    imageUrl: `${
                        updatedData.imageUrl
                    }?t=${new Date().getTime()}`, // Cache-busting query
                }));
            }

            setIsEditing(false);
            toast.success("프로필이 성공적으로 업데이트되었습니다.");
        } catch (error) {
            console.error("Error updating user data:", error);
            toast.error("프로필 업데이트에 실패했습니다.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!session?.user?.id_token) return;
        const confirmed = window.confirm(
            "정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        );
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            await deleteAccount(session.user.id_token);
            toast.success("계정이 성공적으로 삭제되었습니다.");
            router.push("/logout");
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error("계정 삭제에 실패했습니다.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (!userData) {
        return (
            <div className="flex justify-center h-full bg-gray-100 min-h-screen ">
                <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md space-y-10">
                    {/* <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div> */}
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center min-h-screen bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md space-y-10"
            >
                <div className="flex justify-end items-center mb-6">
                    <Button
                        variant={isEditing ? "default" : "outline"}
                        onClick={handleEditToggle}
                        className="px-6 py-2 text-lg"
                    >
                        {isEditing ? "저장" : "프로필 수정"}
                    </Button>
                </div>

                <motion.section className="text-center">
                    <div className="relative inline-block">
                        <Avatar className="w-32 h-32 mx-auto mb-4">
                            <AvatarImage
                                src={
                                    avatarFile
                                        ? URL.createObjectURL(avatarFile)
                                        : userData.imageUrl
                                }
                                alt="프로필 이미지"
                            />

                            <AvatarFallback>
                                <User className="w-12 h-12 text-gray-400" />
                            </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                            <label
                                htmlFor="avatar-upload"
                                className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-md"
                            >
                                <Upload className="w-4 h-4 text-gray-600" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        e.target.files &&
                                        setAvatarFile(e.target.files[0])
                                    }
                                />
                            </label>
                        )}
                    </div>
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div
                                key="editing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {userData.role === "ADMIN" && (
                                    <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
                                        관리자
                                    </span>
                                )}
                                <Input
                                    type="text"
                                    value={tempUserData?.nickname}
                                    onChange={(e) =>
                                        setTempUserData({
                                            ...tempUserData!,
                                            nickname: e.target.value,
                                        })
                                    }
                                    className="text-2xl font-bold text-center mt-2"
                                />
                            </motion.div>
                        ) : (
                            <motion.h2
                                key="display"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-2xl font-bold mt-2 flex items-center justify-center gap-3"
                            >
                                {userData.role === "ADMIN" && (
                                    <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
                                        관리자
                                    </span>
                                )}
                                {userData.nickname}
                            </motion.h2>
                        )}
                    </AnimatePresence>
                </motion.section>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Mail className="mr-2" /> 이메일
                        </CardTitle>
                    </CardHeader>
                    <CardContent>{userData.email}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Phone className="mr-2" /> 핸드폰 번호
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isEditing ? (
                            <Input
                                type="text"
                                value={tempUserData?.phone}
                                onChange={(e) =>
                                    setTempUserData({
                                        ...tempUserData!,
                                        phone: e.target.value,
                                    })
                                }
                            />
                        ) : (
                            userData.phone
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <MapPin className="mr-2" /> 주소
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isEditing ? (
                            <Input
                                type="text"
                                value={tempUserData?.address}
                                onChange={(e) =>
                                    setTempUserData({
                                        ...tempUserData!,
                                        address: e.target.value,
                                    })
                                }
                            />
                        ) : (
                            userData.address
                        )}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/mypage/coupons")}
                        className="py-6 text-lg"
                    >
                        <Gift className="mr-2 h-6 w-6" /> 쿠폰 보유 현황
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/mypage/orders")}
                        className="py-6 text-lg"
                    >
                        <ShoppingBag className="mr-2 h-6 w-6" /> 주문 내역
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/mypage/rentals")}
                        className="py-6 text-lg"
                    >
                        <Package className="mr-2 h-6 w-6" /> 대여중인 물품
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/mypage/items")}
                        className="py-6 text-lg"
                    >
                        <Upload className="mr-2 h-6 w-6" /> 등록한 물품
                    </Button>
                </div>

                {userData.role === "ADMIN" && (
                    <Link href="/admin" className="block w-full">
                        <Button className="w-full py-6 text-lg">
                            관리자 대시보드
                        </Button>
                    </Link>
                )}

                <div className="flex justify-between">
                    <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="px-6 py-2"
                    >
                        <AlertTriangle className="mr-2" />
                        {isDeleting ? "탈퇴 중..." : "회원 탈퇴"}
                    </Button>
                    <Signout />
                </div>
            </motion.div>
        </div>
    );
}

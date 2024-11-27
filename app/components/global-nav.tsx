// components/GlobalNav.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, MessageSquare, Bell, User, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Signout from "./signout";
import { useQuery } from "@tanstack/react-query";

async function fetchCartQuantity(idToken: string): Promise<number> {
    const response = await fetch("/backend/cart-items/quantity", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
        },
        cache: "no-cache",
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

export function GlobalNav({ idToken }: { idToken: string }) {
    const {
        data: cartQuantity,
        error,
        isError,
        isLoading,
    } = useQuery({
        queryKey: ["cartQuantity"],
        queryFn: () => fetchCartQuantity(idToken),
    });

    return (
        <nav className="bg-gray-100 border-t border-gray-200 md:border-t-0 md:border-b p-4 flex justify-between items-center md:justify-center relative">
            {/* Company Logo - only visible on desktop */}
            <div className="hidden md:block absolute left-4">
                <Link href="/" className="flex">
                    <Image
                        src="/logo-img.png"
                        alt="Company Logo"
                        width={40}
                        height={40}
                    />
                    <Image
                        src="/logo-text.png"
                        alt="Company Logo Text"
                        width={120}
                        height={40}
                        className="ml-2"
                    />
                </Link>
            </div>

            {/* Centered Navigation Links */}
            <div className="flex justify-around w-full md:ml-auto md:w-auto space-x-8">
                <Link
                    href="/main"
                    className="flex flex-col items-center md:flex-row md:space-x-2"
                >
                    <Home className="w-6 h-6" />
                    <span>렌탈</span>
                </Link>
                {/* Uncomment if needed
                <Link
                    href="/community/free"
                    className="flex flex-col items-center md:flex-row md:space-x-2"
                >
                    <MessageSquare className="w-6 h-6" />
                    <span>커뮤니티</span>
                </Link>
                <Link
                    href="/alarm"
                    className="flex flex-col items-center md:flex-row md:space-x-2"
                >
                    <Bell className="w-6 h-6" />
                    <span>알림</span>
                </Link>
                */}
                <Link
                    href="/cart"
                    className="flex flex-col items-center md:flex-row md:space-x-2 relative"
                >
                    <ShoppingCart className="w-6 h-6" />
                    <span>
                        장바구니{!cartQuantity ? "()" : `(${cartQuantity})`}
                    </span>
                    {/* Optionally, display error message */}
                    {error && (
                        <span className="absolute top-0 right-0 text-xs text-red-500">
                            (!)
                        </span>
                    )}
                </Link>
                <Link
                    href="/mypage"
                    className="flex flex-col items-center md:flex-row md:space-x-2"
                >
                    <User className="w-6 h-6" />
                    <span>마이페이지</span>
                </Link>
            </div>
        </nav>
    );
}

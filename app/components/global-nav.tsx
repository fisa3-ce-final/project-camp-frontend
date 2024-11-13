// components/GlobalNav.tsx
import Link from "next/link";
import { Home, MessageSquare, Bell, User, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Signout from "./signout";

export function GlobalNav() {
    return (
        <nav className="bg-gray-100 border-t border-gray-200 md:border-t-0 md:border-b p-4 flex justify-between items-center md:justify-center relative">
            {/* Company Logo - only visible on desktop */}
            <div className="hidden md:block absolute left-4">
                <Link href="/" className="flex">
                    {/* <Image
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
                    /> */}
                    <Image
                        src="/logo-with-text.png"
                        alt="Company Logo"
                        width={80}
                        height={40}
                    />
                </Link>
            </div>

            {/* Centered Navigation Links */}
            <div className="flex justify-around w-full  md:ml-auto md:w-auto space-x-8">
                <Link
                    href="/main"
                    className="flex flex-col items-center md:flex-row md:space-x-2"
                >
                    <Home className="w-6 h-6" />
                    <span>제품</span>
                </Link>
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
                <Link
                    href="/cart"
                    className="flex flex-col items-center md:flex-row md:space-x-2"
                >
                    <ShoppingCart className="w-6 h-6" />
                    <span>장바구니</span>
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

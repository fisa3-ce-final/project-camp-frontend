// components/GlobalNav.tsx
import Link from "next/link";
import { Home, MessageSquare, Bell, User } from "lucide-react";
import Image from "next/image";

export function GlobalNav() {
    return (
        <nav className="bg-gray-100 border-t border-gray-200 md:border-t-0 md:border-b p-4 flex justify-between items-center md:justify-center relative">
            {/* Company Logo - only visible on desktop */}
            <div className="hidden md:block absolute left-4">
                <Link href="/">
                    <Image
                        src="/logo.png"
                        alt="Company Logo"
                        width={40}
                        height={40}
                    />
                </Link>
            </div>

            {/* Centered Navigation Links */}
            <div className="flex justify-around w-full md:w-auto space-x-8">
                <Link
                    href="/main"
                    className="flex flex-col items-center md:flex-row md:space-x-2"
                >
                    <Home className="w-6 h-6" />
                    <span>렌탈</span>
                </Link>
                <Link
                    href="/community"
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
                    <span>알람</span>
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

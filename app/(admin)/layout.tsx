import { GlobalNav } from "@/app/components/global-nav";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Calendar,
    Clipboard,
    Gift,
    Home,
    LogOut,
    Inbox,
    Search,
    Settings,
    User2,
    ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { UserGetResponse } from "../types/user-get-response";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth-options";
import { redirect } from "next/navigation";

const items = [
    {
        title: "대시보드",
        url: "/admin",
        icon: Home,
    },
    {
        title: "물품 관리",
        url: "/admin/inventory",
        icon: Clipboard,
    },
    {
        title: "대여 관리",
        url: "/admin/rentals",
        icon: Calendar,
    },
    {
        title: "쿠폰 관리",
        url: "/admin/coupons",
        icon: Gift,
    },
];

// 드롭다운 메뉴 설정
const dropdownItems = [
    {
        title: "홈",
        url: "/",
        icon: Home,
    },
    {
        title: "로그아웃",
        url: "/logout",
        icon: LogOut,
    },
];

// async function getUserData(): Promise<UserGetResponse | null> {
//     const data = await getServerSession(authOptions);

//     const res = await fetch(process.env.BACKEND_URL + "/user", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${data?.user.id_token}`,
//         },
//         cache: "no-store",
//     });

//     if (!res.ok) {
//         console.error("데이터 패칭 오류:", res.statusText);
//         redirect("/logout");
//     }
//     let result: UserGetResponse | null = null;

//     try {
//         result = await res.json();
//     } catch (error) {
//         result = null;
//     }

//     return result;
// }

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);

    return (
        <section>
            <SidebarProvider>
                {" "}
                <Sidebar>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Application</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton>
                                            <User2 /> {session?.user.email}
                                            <ChevronUp className="ml-auto" />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        side="top"
                                        className="w-[--radix-popper-anchor-width]"
                                    >
                                        <Link href="/main">
                                            <DropdownMenuItem>
                                                <span>홈으로 </span>
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href="/logout">
                                            <DropdownMenuItem>
                                                <span>로그아웃</span>
                                            </DropdownMenuItem>
                                        </Link>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <main className="w-full">
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </section>
    );
}

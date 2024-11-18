import { GlobalNav } from "@/app/components/global-nav";
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

const items = [
    {
        title: "대시보드",
        url: "/admin",
        icon: Home,
    },
    {
        title: "물품관리",
        url: "/admin/inventory",
        icon: Clipboard,
    },
    {
        title: "대여관리",
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

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
                                            <User2 /> Username
                                            <ChevronUp className="ml-auto" />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        side="top"
                                        className="w-[--radix-popper-anchor-width]"
                                    >
                                        <DropdownMenuItem>
                                            <span>Account</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span>Billing</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <span>Sign out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <main>
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </section>
    );
}

import { GlobalNav } from "@/app/components/global-nav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth-options";

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    return (
        <section>
            {/* Global Navigation for Desktop */}
            <header className="hidden md:block">
                <GlobalNav idToken={session?.user.id_token!} />
            </header>
            {/* Main Content */}

            <main className="flex-1 pb-20 md:p-0">{children}</main>

            {/* Global Navigation for Mobile */}
            <footer className="md:hidden fixed bottom-0 w-full z-10">
                <GlobalNav idToken={session?.user.id_token!} />
            </footer>
        </section>
    );
}

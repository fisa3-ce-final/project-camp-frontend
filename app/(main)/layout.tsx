import { GlobalNav } from "@/app/components/global-nav";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth-options";

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    return (
        <section className="flex flex-col min-h-screen">
            {/* Global Navigation */}
            <header className="z-10 bg-white">
                <GlobalNav idToken={session?.user.id_token!} />
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer (if needed) */}
            <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
                © 2024 우리캠핑. All rights reserved.
            </footer>
        </section>
    );
}

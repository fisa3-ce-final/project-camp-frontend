import { GlobalNav } from "@/app/components/global-nav";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section>
            {/* Global Navigation for Desktop */}
            <header className="hidden md:block">
                <GlobalNav />
            </header>
            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Global Navigation for Mobile */}
            <footer className="md:hidden fixed bottom-0 w-full">
                <GlobalNav />
            </footer>
        </section>
    );
}

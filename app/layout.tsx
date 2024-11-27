import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import AuthProvider from "./lib/auth-provider";
import { ReactQueryProviders } from "./lib/react-query-providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "캠피파이",
    description: "캠핑 장비 대여 서비스. 캠피파이!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" suppressHydrationWarning={true}>
            <body className={inter.className}>
                <ReactQueryProviders>
                    <AuthProvider>{children}</AuthProvider>
                </ReactQueryProviders>
                <Toaster />
            </body>
        </html>
    );
}

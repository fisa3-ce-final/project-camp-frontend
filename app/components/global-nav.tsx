"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, ShoppingCart, User, Menu, X } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {
        data: cartQuantity,
        error,
        isError,
        isLoading,
    } = useQuery({
        queryKey: ["cartQuantity"],
        queryFn: () => fetchCartQuantity(idToken),
    });

    const navItems = [
        { href: "/main", icon: Home, label: "렌탈" },
        {
            href: "/cart",
            icon: ShoppingCart,
            label: "장바구니",
            quantity: cartQuantity,
        },
        { href: "/mypage", icon: User, label: "마이페이지" },
    ];

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex-shrink-0 flex items-center"
                        >
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
                                className="ml-2 hidden sm:block"
                            />
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition duration-150 ease-in-out"
                            >
                                <item.icon className="w-5 h-5 mr-2" />
                                <span>{item.label}</span>
                                {item.quantity !== undefined && (
                                    <span className="ml-1 text-xs font-semibold bg-red-500 text-white rounded-full px-2 py-1">
                                        {item.quantity}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X
                                    className="block h-6 w-6"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Menu
                                    className="block h-6 w-6"
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="md:hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition duration-150 ease-in-out"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <item.icon className="w-5 h-5 mr-2" />
                                    <span>{item.label}</span>
                                    {item.quantity !== undefined && (
                                        <span className="ml-1 text-xs font-semibold bg-red-500 text-white rounded-full px-2 py-1">
                                            {item.quantity}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

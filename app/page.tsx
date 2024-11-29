"use client";

import { motion } from "framer-motion";
import { ArrowRight, Tent, Users, Map, Sun, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Signin from "./components/signin";

export default function LandingPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    return (
        <div className="bg-white text-gray-800">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/camping-hero.webp"
                        alt="Camping scene"
                        layout="fill"
                        objectFit="cover"
                        quality={100}
                    />
                </div>

                <motion.div
                    className="relative z-10 flex flex-col items-center justify-center max-w-3xl px-6 py-10 bg-black bg-opacity-50 rounded-lg text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* 텍스트 섹션 */}
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold mb-4 text-white"
                        variants={itemVariants}
                    >
                        우리캠핑
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl mb-6 text-gray-100"
                        variants={itemVariants}
                    >
                        자연 속에서 특별한 순간을 만들어보세요. 우리캠핑과
                        함께라면 누구나 쉽고 즐겁게 캠핑을 즐길 수 있습니다.
                    </motion.p>
                    <motion.div variants={itemVariants}>
                        <Signin text="시작하기" />
                    </motion.div>
                </motion.div>

                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 1,
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                >
                    <ChevronDown className="w-8 h-8 text-gray-300" />
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        우리캠핑만의 특별함
                    </motion.h2>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <FeatureCard
                            icon={<Tent className="w-12 h-12 text-green-600" />}
                            title="최고급 장비"
                            description="품질과 안전이 검증된 최상의 캠핑 장비를 제공합니다."
                        />
                        <FeatureCard
                            icon={
                                <Users className="w-12 h-12 text-green-600" />
                            }
                            title="전문가 지원"
                            description="경험 많은 캠핑 전문가들이 24시간 지원합니다."
                        />
                        <FeatureCard
                            icon={<Map className="w-12 h-12 text-green-600" />}
                            title="다양한 장소"
                            description="아름다운 자연 속 엄선된 캠핑장을 소개합니다."
                        />
                        <FeatureCard
                            icon={<Sun className="w-12 h-12 text-green-600" />}
                            title="모든 계절"
                            description="사계절 내내 즐길 수 있는 캠핑 프로그램을 제공합니다."
                        />
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-green-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">
                        지금 바로 캠핑을 시작해보세요
                    </h2>
                    <p className="text-xl mb-8">
                        우리캠핑과 함께라면 누구나 캠핑 전문가가 될 수 있습니다.
                    </p>
                    <Signin
                        text="둘러보기"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-100 transition duration-150 ease-in-out"
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 text-gray-600 py-8">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                            <h3 className="text-lg font-semibold mb-2">
                                우리캠핑
                            </h3>
                            <p className="text-sm">
                                자연과 함께하는 특별한 경험
                            </p>
                        </div>
                        <div className="w-full md:w-1/3 mb-6 md:mb-0">
                            <h4 className="text-sm font-semibold mb-2">링크</h4>
                            <ul className="text-sm">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-green-600"
                                    >
                                        서비스 소개
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-green-600"
                                    >
                                        이용 방법
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-green-600"
                                    >
                                        자주 묻는 질문
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/3">
                            <h4 className="text-sm font-semibold mb-2">
                                고객 지원
                            </h4>
                            <p className="text-sm">
                                이메일: support@uricamping.com
                            </p>
                            <p className="text-sm">전화: 02-1234-5678</p>
                        </div>
                    </div>
                    <div className="mt-8 text-center text-sm">
                        &copy; 2024 우리캠핑. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-center mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
            <p className="text-gray-600 text-center">{description}</p>
        </motion.div>
    );
}

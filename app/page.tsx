// app/page.tsx
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Tent, Bed, Utensils, Moon, Sofa, Flame } from "lucide-react";
import Signin from "./components/signin";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-800">
            {/* Hero Section */}
            <section
                className="w-full h-screen flex flex-col justify-center items-center text-center bg-cover bg-center relative"
                style={{
                    backgroundImage: 'url("/landing.webp")',
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                <div className="relative z-10 text-white p-6 max-w-2xl">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 text-yellow-300">
                        캠핑을 손쉽게 시작하세요
                    </h1>
                    <p className="text-lg md:text-2xl mb-8 text-gray-200">
                        편리하고 고품질의 캠핑 장비를 지금 바로 대여해 보세요.
                    </p>
                    <Signin />
                </div>
            </section>

            {/* Camping Categories Section */}
            <section className="w-full py-16 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
                        캠핑 용품 카테고리
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        <CategoryCard
                            name="텐트"
                            icon={
                                <Tent className="h-10 w-10 mx-auto text-gray-800" />
                            }
                        />
                        <CategoryCard
                            name="배낭"
                            icon={
                                <Bed className="h-10 w-10 mx-auto text-gray-800" />
                            }
                        />
                        <CategoryCard
                            name="취사도구"
                            icon={
                                <Utensils className="h-10 w-10 mx-auto text-gray-800" />
                            }
                        />
                        <CategoryCard
                            name="침낭"
                            icon={
                                <Moon className="h-10 w-10 mx-auto text-gray-800" />
                            }
                        />
                        <CategoryCard
                            name="캠핑가구"
                            icon={
                                <Sofa className="h-10 w-10 mx-auto text-gray-800" />
                            }
                        />
                        <CategoryCard
                            name="조명"
                            icon={
                                <Flame className="h-10 w-10 mx-auto text-gray-800" />
                            }
                        />
                    </div>
                </div>
            </section>

            {/* Additional Features Section */}
            <section className="w-full py-16 bg-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
                        왜 우리와 함께 해야 할까요?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            title="고품질 장비"
                            description="안전하고 편안한 캠핑을 위한 최고 품질의 장비를 제공합니다."
                        />
                        <FeatureCard
                            title="편리한 픽업/반납"
                            description="간편하게 장비를 픽업하고 반납할 수 있습니다."
                        />
                        <FeatureCard
                            title="합리적인 가격"
                            description="품질을 유지하면서도 최고의 가격을 제공합니다."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-8 bg-gray-800 text-gray-300 text-center">
                <p>&copy; 2024 캠핑 렌탈 서비스. 모든 권리 보유.</p>
                <div className="flex justify-center mt-4">
                    <a
                        href="#terms"
                        className="text-gray-400 mx-4 hover:text-gray-100"
                    >
                        서비스 이용약관
                    </a>
                    <a
                        href="#privacy"
                        className="text-gray-400 mx-4 hover:text-gray-100"
                    >
                        개인정보 처리방침
                    </a>
                    <a
                        href="#contact"
                        className="text-gray-400 mx-4 hover:text-gray-100"
                    >
                        연락처
                    </a>
                </div>
            </footer>
        </div>
    );
}

// CategoryCard Component using Shadcn UI
function CategoryCard({ name, icon }: any) {
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center p-4 bg-white">
                {icon}
                <p className="mt-2 text-lg font-medium text-gray-700">{name}</p>
            </CardContent>
        </Card>
    );
}

// FeatureCard Component using Shadcn UI
function FeatureCard({ title, description }: any) {
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-800">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-gray-600">
                    {description}
                </CardDescription>
            </CardContent>
        </Card>
    );
}

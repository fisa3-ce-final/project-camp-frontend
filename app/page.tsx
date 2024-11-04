import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import TestButton from "@/app/components/test-button";
import { TestForm } from "@/app/components/test-form";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50">
            {/* Hero Section */}
            <section className="w-full h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-indigo-600 to-indigo-400 text-white p-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    Welcome to Our Service
                </h1>
                <p className="text-lg md:text-2xl mb-8">
                    Discover the future of [Your Service or Product] today.
                </p>
                <Link href="/main">
                    <Button size="lg">Get Started</Button>
                </Link>
            </section>
            {/* <TestButton /> */}
            {/* <TestForm /> */}

            {/* Feature Section */}
            <section className="w-full py-16 bg-white text-gray-800 p-6">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                    Our Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature Card 1 */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Feature One</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                A brief description of your first amazing
                                feature.
                            </CardDescription>
                        </CardContent>
                    </Card>
                    {/* Feature Card 2 */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Feature Two</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                A brief description of your second amazing
                                feature.
                            </CardDescription>
                        </CardContent>
                    </Card>
                    {/* Feature Card 3 */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Feature Three</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                A brief description of your third amazing
                                feature.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-8 bg-gray-800 text-gray-300 text-center">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
                <div className="flex justify-center mt-4">
                    <a
                        href="#terms"
                        className="text-gray-400 mx-4 hover:text-white"
                    >
                        Terms of Service
                    </a>
                    <a
                        href="#privacy"
                        className="text-gray-400 mx-4 hover:text-white"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="#contact"
                        className="text-gray-400 mx-4 hover:text-white"
                    >
                        Contact Us
                    </a>
                </div>
            </footer>
        </div>
    );
}

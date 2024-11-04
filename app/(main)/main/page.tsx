// app/page.tsx
import { MainSidebar } from "@/app/components/main-sidebar";
import { MainItemCard } from "@/app/components/main-item-card";

export default function Home() {
    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Sidebar - visible by default on desktop */}
            <aside className="hidden md:block w-full md:w-1/4 bg-gray-100 p-4 border-b md:border-b-0 md:border-r">
                <MainSidebar />
            </aside>

            {/* Main content area */}
            <main className="flex-1 p-4">
                <h1 className="text-xl font-bold mb-4">렌탈 목록</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MainItemCard
                        name="2인용 돔텐트"
                        category="텐트"
                        price="15,000원/일"
                    />
                    <MainItemCard
                        name="4인용 리빙쉘"
                        category="텐트"
                        price="25,000원/일"
                    />
                    <MainItemCard
                        name="침낭"
                        category="침낭"
                        price="5,000원/일"
                    />
                    <MainItemCard
                        name="캠핑 테이블"
                        category="캠핑가구"
                        price="7,000원/일"
                    />
                </div>
            </main>
        </div>
    );
}

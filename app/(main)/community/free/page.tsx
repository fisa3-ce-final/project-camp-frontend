"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Post {
    id: number;
    title: string;
    content: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    viewCount: number;
    likes: number;
}

interface PageInfo {
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}

export default function CommunityTabsPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [selectedTab, setSelectedTab] = useState("free");
    const [searchQuery, setSearchQuery] = useState("");

    // API 호출을 위한 함수
    const fetchPosts = async (category: string, page: number, search: string) => {
        try {
            const res = await fetch(`/backend/community/${category}?page=${page}&size=${size}&searchQuery=${search}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            setPosts(data.content || []);
            setPageInfo(data);
        } catch (error) {
            console.error("게시글 조회 실패:", error);
        }
    };

    // 탭 변경 및 검색어가 변경될 때마다 API 호출
    useEffect(() => {
        fetchPosts(selectedTab, page, searchQuery);
    }, [selectedTab, page, searchQuery]);

    // 탭 선택 함수
    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
        setPage(1);  // 탭 변경 시 페이지를 첫 페이지로 초기화
        router.push(`/community/${tab}`);
    };

    // 검색어 필터링
    const handleSearch = () => {
        setPage(1); // 검색어 변경 시 첫 페이지부터 시작
        fetchPosts(selectedTab, 1, searchQuery);
    };

    // 게시글 작성 페이지로 이동
    const goToCreatePost = () => {
        router.push(`/community`);
    };

    // 게시글 상세 페이지로 이동
    const goToPostDetail = (postId: number) => {
        router.push(`/community/${postId}`);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">커뮤니티 게시글</h1>

            {/* 탭 네비게이션 */}
            <div className="flex space-x-4 border-b pb-2">
                <button onClick={() => handleTabChange("free")} className={`px-4 py-2 ${selectedTab === "free" ? "font-bold border-b-2 border-black" : ""}`}>
                    자유
                </button>
                <button onClick={() => handleTabChange("review")} className={`px-4 py-2 ${selectedTab === "review" ? "font-bold border-b-2 border-black" : ""}`}>
                    후기
                </button>
                <button onClick={() => handleTabChange("coupon")} className={`px-4 py-2 ${selectedTab === "coupon" ? "font-bold border-b-2 border-black" : ""}`}>
                    쿠폰
                </button>
            </div>

            {/* 검색 및 작성 버튼 */}
            <div className="flex space-x-2 mt-4">
                <input type="text" placeholder="검색어를 입력하세요" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border rounded-md px-4 py-2 flex-grow" />
                <button onClick={handleSearch} className="border rounded-md px-4 py-2">🔍</button>
                <button onClick={goToCreatePost} className="border rounded-md px-4 py-2">✏️</button>
            </div>

            {/* 게시글 목록 */}
            <ul className="space-y-4">
                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <li 
                            key={post.id} 
                            onClick={() => goToPostDetail(post.id)}  // 게시글 클릭 시 상세 페이지로 이동
                            className="border-b pb-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">{post.title}</h2>
                                <p className="text-gray-500">{post.content}</p>
                                <p className="text-sm text-gray-400">
                                    {post.userId} | {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span>❤️ {post.likes}</span>
                                <span>💬 {post.viewCount}</span>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500">게시글이 없습니다.</p>
                )}
            </ul>

            {/* 페이지네이션 */}
            <div className="flex justify-center space-x-2 mt-4">
                {pageInfo &&
                    Array.from({ length: pageInfo.totalPages }, (_, i) => (
                        <button key={i + 1} onClick={() => setPage(i + 1)} className={`px-3 py-1 border rounded-md ${page === i + 1 ? "bg-black text-white" : ""}`}>
                            {i + 1}
                        </button>
                    ))}
            </div>
        </div>
    );
}

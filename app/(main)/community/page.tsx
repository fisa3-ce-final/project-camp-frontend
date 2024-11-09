// src/app/community/page.tsx
"use client";

import CommunityPostForm from "./components/CommunityPostForm";

export default function CommunityPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">게시글 작성</h1>
            <CommunityPostForm />
        </div>
    );
}
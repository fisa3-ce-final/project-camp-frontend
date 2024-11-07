// // /community/[id]/edit/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";

// export default function EditPostPage() {
//     const [title, setTitle] = useState("");
//     const [content, setContent] = useState("");
//     const [category, setCategory] = useState("");
//     const router = useRouter();
//     const { id: postId } = useParams();

//     // 게시글 정보 로드
//     useEffect(() => {
//         if (postId) {
//             fetch(`/backend/community/${postId}`, {
//                 method: "GET",
//                 headers: { "Content-Type": "application/json" },
//             })
//                 .then((res) => res.json())
//                 .then((data) => {
//                     setTitle(data.title);
//                     setContent(data.content);
//                     setCategory(data.category);
//                 })
//                 .catch((error) => console.error("게시글 불러오기 실패:", error));
//         }
//     }, [postId]);

//     // 게시글 수정 API 요청
//     const handleSave = async () => {
//         try {
//             const response = await fetch(`/backend/community/${postId}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ id: postId, title, content, category }),
//             });
//             if (response.ok) {
//                 router.push(`/community/${postId}`);
//             } else {
//                 console.error("게시글 수정 실패:", response.statusText);
//             }
//         } catch (error) {
//             console.error("저장 오류:", error);
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-6">
//             <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>
//             <div className="mb-4">
//                 <label className="block mb-1">제목</label>
//                 <input
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     className="w-full border p-2 rounded"
//                 />
//             </div>
//             <div className="mb-4">
//                 <label className="block mb-1">내용</label>
//                 <textarea
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     className="w-full border p-2 rounded"
//                 />
//             </div>
//             <div className="mb-4">
//                 <label className="block mb-1">카테고리</label>
//                 <input
//                     type="text"
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     className="w-full border p-2 rounded"
//                 />
//             </div>
//             <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">
//                 저장하기
//             </button>
//             <button onClick={() => router.back()} className="ml-4 p-2 bg-gray-500 text-white rounded">
//                 취소
//             </button>
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter, useParams } from "next/navigation";

export default function CommunityPostEditPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
    const router = useRouter();
    const { id: postId } = useParams();

    // 게시글과 기존 이미지 불러오기
    useEffect(() => {
        fetch(`/backend/community/${postId}`)
            .then((res) => res.json())
            .then((data) => {
                setTitle(data.title);
                setContent(data.content);
                setExistingImages(data.imagePaths || []);
            });
    }, [postId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setNewImages((prev) => [...prev, ...selectedFiles]);
    };

    const handleRemoveExistingImage = (imagePath: string) => {
        setExistingImages((prev) => prev.filter((path) => path !== imagePath));
        setImagesToDelete((prev) => [...prev, imagePath]);
    };

    const handleRemoveNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("userId", "1"); // 임시 사용자 ID
        formData.append("title", title);
        formData.append("content", content);
        newImages.forEach((image) => formData.append("newImages", image));
        imagesToDelete.forEach((imagePath) => formData.append("imagesToDelete", imagePath));

        const res = await fetch(`/backend/community/${postId}`, {
            method: "PUT",
            body: formData,
        });

        if (res.ok) {
            alert("게시글이 수정되었습니다.");
            router.push(`/community/${postId}`);
        } else {
            alert("수정에 실패했습니다.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-6 border rounded-md shadow-sm">
            <div>
                <Label htmlFor="title" className="block text-lg font-semibold">제목</Label>
                <Input
                    id="title"
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-2"
                />
            </div>

            <div>
                <Label htmlFor="content" className="block text-lg font-semibold">내용</Label>
                <Textarea
                    id="content"
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="mt-2 h-32"
                />
            </div>

            <div>
                <Label className="block text-lg font-semibold">기존 이미지</Label>
                <div className="flex space-x-2 mt-4">
                    {existingImages.map((url, index) => (
                        <div key={index} className="relative w-16 h-16">
                            <img src={`http://localhost:8080${url}`} alt={`기존 이미지 ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                            <button type="button" onClick={() => handleRemoveExistingImage(url)} className="absolute top-0 right-0">
                                <XCircleIcon className="w-5 h-5 text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <Label className="block text-lg font-semibold">새 이미지</Label>
                <div className="flex items-center space-x-4 mt-2">
                    <label htmlFor="newImages" className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer">
                        <PlusIcon className="h-6 w-6 text-gray-500" />
                        <span className="sr-only">이미지 추가</span>
                    </label>
                    <Input id="newImages" type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
                <div className="flex space-x-2 mt-4">
                    {newImages.map((file, index) => (
                        <div key={index} className="relative w-16 h-16">
                            <img src={URL.createObjectURL(file)} alt={`새 이미지 ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                            <button type="button" onClick={() => handleRemoveNewImage(index)} className="absolute top-0 right-0">
                                <XCircleIcon className="w-5 h-5 text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <Button type="submit" className="w-full">게시글 수정</Button>
        </form>
    );
}

// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";

// export default function CommunityPostForm() {
//     const [title, setTitle] = useState("");
//     const [content, setContent] = useState("");
//     const [category, setCategory] = useState("자유");
//     const [images, setImages] = useState<File[]>([]);
//     const [previewUrls, setPreviewUrls] = useState<string[]>([]);

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFiles = Array.from(e.target.files || []);

//         // 이미지 파일이 4개를 초과하지 않도록 제한
//         if (selectedFiles.length + images.length > 4) {
//             alert("최대 4장까지 이미지를 업로드할 수 있습니다.");
//             return;
//         }

//         // 이미지 파일을 상태에 저장하고 미리보기 URL 생성
//         setImages((prevImages) => [...prevImages, ...selectedFiles]);

//         // 미리보기 URL 설정
//         const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
//         setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
//     };

//     const handleRemoveImage = (index: number) => {
//         // images와 previewUrls에서 해당 인덱스의 항목 삭제
//         setImages((prevImages) => prevImages.filter((_, i) => i !== index));
//         setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append("userId", "1"); // 임시 userId 설정
//         formData.append("title", title);
//         formData.append("content", content);
//         formData.append("category", category);
//         images.forEach((image) => formData.append("images", image));

//         const res = await fetch("/backend/community", {
//             method: "POST",
//             body: formData,
//         });

//         if (res.ok) {
//             alert("게시글이 생성되었습니다.");
//             setTitle("");
//             setContent("");
//             setCategory("자유");
//             setImages([]);
//             setPreviewUrls([]);
//         } else {
//             alert("오류가 발생했습니다.");
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-6 border rounded-md shadow-sm">
//             <div>
//                 <Label htmlFor="title" className="block text-lg font-semibold">제목</Label>
//                 <Input
//                     id="title"
//                     type="text"
//                     placeholder="제목을 입력하세요"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     required
//                     className="mt-2"
//                 />
//             </div>

//             <div>
//                 <Label htmlFor="content" className="block text-lg font-semibold">내용</Label>
//                 <Textarea
//                     id="content"
//                     placeholder="내용을 입력하세요"
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     required
//                     className="mt-2 h-32"
//                 />
//             </div>

//             <div>
//                 <Label className="block text-lg font-semibold">이미지</Label>
//                 <div className="flex items-center space-x-4 mt-2">
//                     <label
//                         htmlFor="images"
//                         className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer"
//                     >
//                         <PlusIcon className="h-6 w-6 text-gray-500" />
//                         <span className="sr-only">이미지 추가</span>
//                     </label>
//                     <Input
//                         id="images"
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         onChange={handleFileChange}
//                         className="hidden"
//                     />
//                 </div>

//                 {/* 미리보기 섹션 */}
//                 <div className="flex space-x-2 mt-4">
//                     {previewUrls.map((url, index) => (
//                         <div key={index} className="relative w-16 h-16">
//                             <img
//                                 src={url}
//                                 alt={`미리보기 이미지 ${index + 1}`}
//                                 className="w-full h-full object-cover rounded-md"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => handleRemoveImage(index)}
//                                 className="absolute top-0 right-0"
//                             >
//                                 <XCircleIcon className="w-5 h-5 text-red-500" />
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//                 <p className="text-sm text-gray-500 mt-2">최대 4장까지 업로드 가능합니다.</p>
//             </div>

//             <Button type="submit" className="w-full">게시글 등록</Button>
//         </form>
//     );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function CommunityPostForm() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("FREE");
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);

        // 이미지 파일이 4개를 초과하지 않도록 제한
        if (selectedFiles.length + images.length > 4) {
            alert("최대 4장까지 이미지를 업로드할 수 있습니다.");
            return;
        }

        setImages((prevImages) => [...prevImages, ...selectedFiles]);

        const newPreviewUrls = selectedFiles.map((file) =>
            URL.createObjectURL(file)
        );
        setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);
    };

    const handleRemoveImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("userId", "1"); // 임시 userId 설정
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category", category);
        images.forEach((image) => formData.append("images", image));

        const res = await fetch("/backend/community", {
            method: "POST",
            body: formData,
            cache: "no-cache",
        });

        if (res.ok) {
            const data = await res.json();
            const postId = data.id; // 생성된 게시글 ID를 가져옵니다.
            alert("게시글이 생성되었습니다.");
            router.push(`/community/${postId}`); // 게시글 상세 페이지로 이동
        } else {
            alert("오류가 발생했습니다.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-4 space-y-6 border rounded-md shadow-sm"
        >
            <div>
                <Label htmlFor="title" className="block text-lg font-semibold">
                    제목
                </Label>
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
                <Label
                    htmlFor="content"
                    className="block text-lg font-semibold"
                >
                    내용
                </Label>
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
                <Label className="block text-lg font-semibold">이미지</Label>
                <div className="flex items-center space-x-4 mt-2">
                    <label
                        htmlFor="images"
                        className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer"
                    >
                        <PlusIcon className="h-6 w-6 text-gray-500" />
                        <span className="sr-only">이미지 추가</span>
                    </label>
                    <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {/* 미리보기 섹션 */}
                <div className="flex space-x-2 mt-4">
                    {previewUrls.map((url, index) => (
                        <div key={index} className="relative w-16 h-16">
                            <img
                                src={url}
                                alt={`미리보기 이미지 ${index + 1}`}
                                className="w-full h-full object-cover rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-0 right-0"
                            >
                                <XCircleIcon className="w-5 h-5 text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    최대 4장까지 업로드 가능합니다.
                </p>
            </div>

            <Button type="submit" className="w-full">
                게시글 등록
            </Button>
        </form>
    );
}
